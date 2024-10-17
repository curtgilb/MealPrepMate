import {
  ALCOHOL_ID,
  CALORIE_ID,
  CARB_ID,
  FAT_ID,
  PROTIEN_ID,
} from "@/application/config.js";
import { round } from "@/application/util/utils.js";
import { DbTransactionClient } from "@/infrastructure/repository/db.js";
import { MeasurementUnit, Prisma } from "@prisma/client";

const nutritionLabelWithNutrients =
  Prisma.validator<Prisma.NutritionLabelDefaultArgs>()({
    include: {
      nutrients: true,
      servingSizeUnit: true,
    },
  });

export type LabelWithNutrients = Prisma.NutritionLabelGetPayload<
  typeof nutritionLabelWithNutrients
>;

export type NutrientSumOfLabels = Map<
  string,
  { total: number; perServing: number | undefined }
>;

export type ScalingArgs = {
  factor?: number;
  totalServings: number | null | undefined;
};

export type AggregateNutritionLabel = {
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  alcohol: number;
  servings?: number | null;
  servingUnit?: MeasurementUnit | null;
  servingSize?: number | null;
  nutrients: {
    nutrientId: string;
    total: number;
    perServing: number | undefined;
  }[];
};

// This class groups together nutrition labels and adds all the nutrients together accounting for any label specific scaling
export class LabelAggregator {
  //   Recipe ID/Standalone label id -> nutrient map
  private recipeId: string;
  private db: DbTransactionClient;
  private labels: LabelWithNutrients[] | undefined | null;
  // NutrientId -> total, perServing
  private aggregatedNutrients = new Map<
    string,
    { total: number; perServing: number | undefined }
  >();
  private primaryLabel: LabelWithNutrients | undefined | null;
  private servings: number = 1;

  constructor(
    recipeId: string,
    db: DbTransactionClient,
    labels?: LabelWithNutrients[]
  ) {
    this.recipeId = recipeId;
    this.db = db;
    this.labels = labels;
  }

  async upsertAggregateLabel(scale?: ScalingArgs) {
    await this.fetchLabels();
    this.identifyPrimaryLabel();
    const nutrients = await this.sumLabels();
    const label = this.calculateFinalValues(scale);
    const nutrientCreateInput: Prisma.AggLabelNutrientCreateManyAggLabelInput[] =
      [];

    nutrients?.forEach((sum, nutrientId) => {
      nutrientCreateInput.push({
        value: sum.total,
        valuePerServing: sum.perServing,
        nutrientId: nutrientId,
      });
    });

    return await this.db.aggregateLabel.upsert({
      where: { id: this.recipeId },
      update: {
        servings: label.servings,
        servingSize: label.servingSize,
        servingSizeUnit: label.servingUnit?.id
          ? { connect: { id: label.servingUnit?.id } }
          : undefined,
        protein: label.protein,
        carbs: label.carbs,
        fat: label.fat,
        alcohol: label.alcohol,
        totalCalories: label.calories,
        caloriesPerServing: label.calories / (label.servings ?? 1),
        nutrients: { createMany: { data: nutrientCreateInput } },
      },
      create: {
        recipe: { connect: { id: this.recipeId } },
        servings: label.servings,
        servingSize: label.servingSize,
        servingSizeUnit: label.servingUnit?.id
          ? { connect: { id: label.servingUnit?.id } }
          : undefined,
        protein: label.protein,
        carbs: label.carbs,
        fat: label.fat,
        alcohol: label.alcohol,
        totalCalories: label.calories,
        caloriesPerServing: label.calories / (label.servings ?? 1),
        nutrients: { createMany: { data: nutrientCreateInput } },
      },
    });
  }

  private async fetchLabels() {
    if (!this.labels) {
      this.labels = await this.db.nutritionLabel.findMany({
        where: {
          recipeId: this.recipeId,
        },
        include: { nutrients: true, servingSizeUnit: true },
      });
    }
  }

  private identifyPrimaryLabel() {
    this.primaryLabel = this.labels?.find((label) => label.isPrimary);
    this.servings = this.primaryLabel?.servings ?? this.servings;
  }

  // Adds labels to be aggregated
  private async sumLabels() {
    // Reset the aggregation
    this.aggregatedNutrients = new Map<
      string,
      { total: number; perServing: number | undefined }
    >();

    return this.labels?.reduce((group, label) => {
      const labelScaleFactor =
        label.servingsUsed && label.servings
          ? label.servingsUsed / label.servings
          : 1;

      label.nutrients.forEach((nutrient) => {
        const nutrientAmount = nutrient.value * labelScaleFactor;
        if (group.has(nutrient.nutrientId)) {
          const existingValue = group.get(nutrient.nutrientId)?.total as number;
          const newTotal = existingValue + nutrientAmount;
          group.set(nutrient.nutrientId, {
            total: newTotal,
            perServing: newTotal / this.servings,
          });
        } else {
          group.set(nutrient.nutrientId, {
            total: nutrientAmount,
            perServing: nutrientAmount / this.servings,
          });
        }
      });
      return group;
    }, this.aggregatedNutrients);
  }

  private calculateFinalValues(scale?: ScalingArgs) {
    const servings = scale?.totalServings ?? this.primaryLabel?.servings;
    const servingUnit = this.primaryLabel?.servingSizeUnit;
    let servingSize = this.primaryLabel?.servingSize;
    if (scale && servingSize) {
      const originalServings = this.primaryLabel?.servings ?? 1;
      servingSize = (originalServings * servingSize) / (servings ?? 1);
    }
    const macros = this.getMacroDistribution(this.aggregatedNutrients);

    return {
      servings: servings ?? 1,
      servingUnit,
      servingSize,
      ...macros,
    };
  }

  private getMacroDistribution(nutrients: NutrientSumOfLabels) {
    return {
      calories: round(nutrients.get(CALORIE_ID)?.total ?? 0),
      alcohol: round(nutrients.get(ALCOHOL_ID)?.total ?? 0),
      carbs: round(nutrients.get(CARB_ID)?.total ?? 0),
      protein: round(nutrients.get(PROTIEN_ID)?.total ?? 0),
      fat: round(nutrients.get(FAT_ID)?.total ?? 0),
    };
  }

  // private scaleNutrients(
  //   nutrients: NutrientSumOfLabels,
  //   servings: number,
  //   factor: number
  // ): NutrientSumOfLabels {
  //   const scaledNutrients = new Map<
  //     string,
  //     { total: number; perServing: number | undefined }
  //   >();
  //   for (const [nutrientId, nutrientValue] of nutrients.entries()) {
  //     const scaledAmount = nutrientValue.total * factor;
  //     scaledNutrients.set(nutrientId, {
  //       total: scaledAmount,
  //       perServing: scaledAmount / servings,
  //     });
  //   }
  //   return scaledNutrients;
  // }
}
