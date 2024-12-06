import { useMemo } from "react";

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
  calorieTarget: NutrientTargetFieldsFragment["target"] | null | undefined;
}

export function CalorieDistibution({
  numOfWeeks,
  nutrients,
  calorieTarget,
}: CalorieDistributionProps) {
  const totalCalories = useMemo(() => {
    return nutrients.reduce((total, day) => total + (day?.calories ?? 0), 0);
  }, [nutrients]);

  const days = useMemo(() => {
    return nutrients.map((day, i) => ({
      day: getDayName(i + 1, "abbrev") as AbbreviatedDay,
      fat: (day?.fat ?? 0) * 9,
      carbs: (day?.carbs ?? 0) * 4,
      protein: (day?.protein ?? 0) * 4,
      alcohol: (day?.alcohol ?? 0) * 7,
      calories: day?.calories ?? 0,
    }));
  }, [nutrients]);

  return (
    <figure>
      <figcaption className="flex justify-between">
        <p>Calorie Intake</p>
        <p>{Math.round(totalCalories / (7 * numOfWeeks))} kcal</p>
      </figcaption>
      <WeekCalorieChart data={days} target={calorieTarget} />
    </figure>
  );
}
