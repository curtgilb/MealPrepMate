import { MeasurementUnit } from "@prisma/client";
import { SummedNutrients } from "./LabelAggregator.js";
import { round } from "../../../util/utils.js";
import {
  ALCOHOL_ID,
  CALORIE_ID,
  CARB_ID,
  FAT_ID,
  PROTIEN_ID,
} from "../../../config.js";

export type AggregateNutritionLabel = {
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  alcohol: number;
  servings?: number | null;
  servingUnit?: MeasurementUnit | null;
  servingSize?: number | null;
  nutrients: Nutrient[];
};

export type Nutrient = {
  id: string;
  total: number;
  perServing: number | undefined;
};

type CreateLabelArgs = {
  nutrients: SummedNutrients;
  servings: number;
  servingUnit: MeasurementUnit | null | undefined;
  servingSize: number | null | undefined;
};

export class LabelMaker {
  private getMacroDistribution(nutrients: SummedNutrients) {
    return {
      calories: round(nutrients.get(CALORIE_ID)?.total ?? 0),
      alcohol: round(nutrients.get(ALCOHOL_ID)?.total ?? 0),
      carbs: round(nutrients.get(CARB_ID)?.total ?? 0),
      protein: round(nutrients.get(PROTIEN_ID)?.total ?? 0),
      fat: round(nutrients.get(FAT_ID)?.total ?? 0),
    };
  }

  createLabel({
    nutrients,
    servings,
    servingUnit,
    servingSize,
  }: CreateLabelArgs): AggregateNutritionLabel {
    const macros = this.getMacroDistribution(nutrients);

    const nutrientObjects: Nutrient[] = [];
    for (const [nutrientId, nutrientValue] of nutrients.entries()) {
      nutrientObjects.push({
        id: nutrientId,
        total: round(nutrientValue.total),
        perServing: round(nutrientValue.perServing ?? 0),
      });
    }

    return {
      ...macros,
      servings,
      servingUnit,
      servingSize,
      nutrients: nutrientObjects,
    };
  }
}
