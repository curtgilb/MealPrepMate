import { NutritionLabel } from "@prisma/client";
import { db } from "../../db.js";
import { LabelMaker } from "./LabelMaker.js";
import { LabelWithNutrients } from "../../types/CustomTypes.js";

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
        verifed: true,
        recipeId: this.recipeId,
      },
      include: { nutrients: true, servingSizeUnit: true },
    });
    this.primaryLabel = labels.find((label) => label.isPrimary);
    this.servings = this.primaryLabel?.servings ?? this.servings;
    return labels;
  }

  private async retrieveSavedData() {
    this.primaryLabel = await db.nutritionLabel.findFirst({
      where: { verifed: true, recipeId: this.recipeId, isPrimary: true },
      include: { nutrients: true, servingSizeUnit: true },
    });
    this.servings = this.primaryLabel?.servings ?? this.servings;
    const agg = await db.aggregateLabel.findUniqueOrThrow({
      where: { recipeId: this.recipeId },
    });
    return agg.nutrients;
  }

  async createNutrientTotals() {
    const nutrients = await this.sumNutrients();
    return { nutrients: nutrients, label: this.createLabel(nutrients) };
  }

  async scaleLabel(scale: ScalingArgs) {
    const summedNutrients = await this.retrieveSavedData();

    const scaledNutrients = this.scaleNutrients(
      summedNutrients,
      scale.totalServings ?? this.servings,
      scale.factor ?? 1
    );

    return this.createLabel(scaledNutrients, scale);
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
