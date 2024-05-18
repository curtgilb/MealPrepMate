import { MeasurementUnit } from "@prisma/client";
import { SummedNutrients } from "./LabelAggregator.js";
import { round } from "../../util/utils.js";

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
    const CALORIE_ID = "clt6dqtz90000awv9anfb343o";
    const CARB_ID = "clt6dqtzc0007awv9h1mv5pbi";
    const PROTIEN_ID = "clt6dqtzg000uawv918m4fxsm";
    const FAT_ID = "clt6dqtze000lawv9b3w34hxe";
    const ALCOHOL_ID = "clt6dqtza0001awv954je0dq5";

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
