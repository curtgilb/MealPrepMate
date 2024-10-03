import { Prisma } from "@prisma/client";
import { db } from "../../db.js";
import { LabelWithNutrients } from "../../types/CustomTypes.js";
import { LabelMaker } from "./LabelMaker.js";

export type SummedNutrients = Map<
  string,
  { total: number; perServing: number | undefined }
>;

export type ScalingArgs = {
  factor?: number;
  totalServings: number | null | undefined;
};

// This class groups together nutrition labels and adds all the nutrients together accounting for any label specific scaling
export class LabelAggregator {
  //   Recipe ID/Standalone label id -> nutrient map
  private recipeId: string;
  private aggregatedNutrients = new Map<
    string,
    { total: number; perServing: number | undefined }
  >();
  private primaryLabel: LabelWithNutrients | undefined | null;
  private servings: number = 1;

  constructor(recipeId: string) {
    this.recipeId = recipeId;
  }

  private async getLabels() {
    const labels = await db.nutritionLabel.findMany({
      where: {
        recipeId: this.recipeId,
      },
      include: { nutrients: true, servingSizeUnit: true },
    });
    this.primaryLabel = labels.find((label) => label.isPrimary);
    this.servings = this.primaryLabel?.servings ?? this.servings;
    return labels;
  }

  async upsertAggregateLabel() {
    const nutrients = await this.sumNutrients();
    const agg = { nutrients: nutrients, label: this.createLabel(nutrients) };
    const nutrientCreateInput: Prisma.AggLabelNutrientCreateManyAggLabelInput[] =
      [];

    agg.nutrients.forEach((sum, nutrientId) => {
      nutrientCreateInput.push({
        value: sum.total,
        valuePerServing: sum.perServing,
        nutrientId: nutrientId,
      });
    });

    await db.aggregateLabel.upsert({
      where: { id: this.recipeId },
      update: {
        servings: agg.label.servings,
        servingSize: agg.label.servingSize,
        servingSizeUnit: agg.label.servingUnit?.id
          ? { connect: { id: agg.label.servingUnit?.id } }
          : undefined,
        protein: agg.label.protein,
        carbs: agg.label.carbs,
        fat: agg.label.fat,
        alcohol: agg.label.alcohol,
        totalCalories: agg.label.calories,
        caloriesPerServing: agg.label.calories / (agg.label.servings ?? 1),
        nutrients: { createMany: { data: nutrientCreateInput } },
      },
      create: {
        recipe: { connect: { id: this.recipeId } },
        servings: agg.label.servings,
        servingSize: agg.label.servingSize,
        servingSizeUnit: agg.label.servingUnit?.id
          ? { connect: { id: agg.label.servingUnit?.id } }
          : undefined,
        protein: agg.label.protein,
        carbs: agg.label.carbs,
        fat: agg.label.fat,
        alcohol: agg.label.alcohol,
        totalCalories: agg.label.calories,
        caloriesPerServing: agg.label.calories / (agg.label.servings ?? 1),
        nutrients: { createMany: { data: nutrientCreateInput } },
      },
    });
  }

  // Adds labels to be aggregated
  private async sumNutrients() {
    const labels = await this.getLabels();

    this.aggregatedNutrients = new Map<
      string,
      { total: number; perServing: number | undefined }
    >();

    return labels.reduce((group, label) => {
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

  private createLabel(nutrients: SummedNutrients, scale?: ScalingArgs) {
    const maker = new LabelMaker();
    const servings = scale?.totalServings ?? this.primaryLabel?.servings;
    const servingUnit = this.primaryLabel?.servingSizeUnit;
    let servingSize = this.primaryLabel?.servingSize;
    if (scale && servingSize) {
      const originalServings = this.primaryLabel?.servings ?? 1;
      servingSize = (originalServings * servingSize) / (servings ?? 1);
    }
    return maker.createLabel({
      nutrients,
      servings: servings ?? 1,
      servingUnit,
      servingSize,
    });
  }

  private scaleNutrients(
    nutrients: SummedNutrients,
    servings: number,
    factor: number
  ): SummedNutrients {
    const scaledNutrients = new Map<
      string,
      { total: number; perServing: number | undefined }
    >();
    for (const [nutrientId, nutrientValue] of nutrients.entries()) {
      const scaledAmount = nutrientValue.total * factor;
      scaledNutrients.set(nutrientId, {
        total: scaledAmount,
        perServing: scaledAmount / servings,
      });
    }
    return scaledNutrients;
  }
}
