import { NutrientLabel } from "@/features/mealplan/hooks/useMealPlanNutrition";
import { NutrientTargetsResult } from "@/features/mealplan/hooks/useNutrientTargets";
import {
  MacroChart,
  MacroTypes,
} from "@/features/nutrition/components/target/MacroChart";
import { NutrientTargetFieldsFragment } from "@/gql/graphql";

interface MacroChartContainerProps {
  numOfWeeks: number;
  nutrients: NutrientLabel | undefined;
  targets: NutrientTargetsResult;
}

const macros: Record<
  MacroTypes & keyof NutrientLabel & keyof NutrientTargetsResult,
  number
> = {
  protein: 4,
  carbs: 4,
  fat: 9,
  alcohol: 7,
};

type MacroNutrientLabel = Omit<NutrientLabel, "nutrients">;

export function MacroChartContainer({
  numOfWeeks,
  nutrients,
  targets,
}: MacroChartContainerProps) {
  const data = Object.entries(macros).map(([macro, multiplier]) => {
    const totalValue = nutrients
      ? nutrients[macro as keyof MacroNutrientLabel]
      : 0;
    const finalValue = Math.round(totalValue / (7 * numOfWeeks));
    return {
      type: macro as MacroTypes,
      value: finalValue,
      calories: finalValue * multiplier,
      target:
        targets[macro as keyof MacroNutrientLabel]?.target?.nutrientTarget,
    };
  });

  return (
    <figure>
      <figcaption>
        <p className="font-bold text-lg font-serif">Macronutrients</p>
      </figcaption>

      <MacroChart data={data} />
    </figure>
  );
}
