import { useMemo } from "react";

import { CalorieBalanceChart } from "@/features/mealplan/components/sidebar/nutrition/charts/CalorieBalanceChart";
import {
  AbbreviatedDay,
  WeekCalorieChart,
} from "@/features/mealplan/components/sidebar/nutrition/charts/CalorieDistributionChart";
import { NutrientLabel } from "@/features/mealplan/hooks/useMealPlanNutrition";
import { getDayName } from "@/features/mealplan/utils/getDayName";
import { NutrientTargetFieldsFragment } from "@/gql/graphql";

interface CalorieDistributionProps {
  numOfWeeks: number;
  nutrients: (NutrientLabel | undefined)[];
  calorieTarget: NutrientTargetFieldsFragment;
}

export function CalorieBalanceContainer({
  numOfWeeks,
  nutrients,
  calorieTarget,
}: CalorieDistributionProps) {
  const days = useMemo(() => {
    const target = calorieTarget.target?.nutrientTarget ?? 0;
    return nutrients.map((day, i) => ({
      day: getDayName(i + 1, "abbrev") as AbbreviatedDay,
      balance: Math.round(day ? day.calories - target : 0 - target),
    }));
  }, [nutrients, calorieTarget.target]);

  const averageBalance =
    days.reduce((total, day) => total + day.balance, 0) / (7 * numOfWeeks);

  return (
    <figure>
      <figcaption className="flex justify-between">
        <p className="font-bold text-lg font-serif ">Calorie Balance</p>
        <div className="min-w-20">
          <p className="font-bold text-right">
            {Math.round(averageBalance)} kcal
          </p>
          <p className="font-extralight text-xs text-right">Daily Avg</p>
        </div>
      </figcaption>

      <CalorieBalanceChart data={days} />
    </figure>
  );
}
