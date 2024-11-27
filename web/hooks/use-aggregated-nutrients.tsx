import { useMemo } from "react";

import { WeekNumber } from "@/features/mealplan/components/summary/WeekSelect";
import { MealPlanServingsFieldFragment } from "@/gql/graphql";
import {
  averageNutrients,
  SummedNutrients,
  sumNutrients,
} from "@/utils/nutrients";

import { ServingsLookup } from "./use-meal-plan";
import { RecipeNutrientLookup } from "./usePlanRecipeLabels";

export function useAggregateNutrients(
  week: WeekNumber,
  servings: ServingsLookup,
  maxWeek: number,
  labels: RecipeNutrientLookup
) {
  return useMemo(() => {
    const isAverageMode = week === "Average";
    let nutrientValues: (SummedNutrients | undefined)[];
    if (isAverageMode) {
      // Return a list that represents the total for each week
      const allPlanServings: MealPlanServingsFieldFragment[] = [];
      const weekAverages = Array.from({ length: maxWeek }).map((_, index) => {
        const weekServings = servings.get(index + 1);
        if (weekServings) {
          const allWeekServings: MealPlanServingsFieldFragment[] = [];
          [...weekServings.values()].forEach((dayServings) => {
            for (const courseServings of dayServings.values()) {
              allWeekServings.push(...courseServings);
              allPlanServings.push(...courseServings);
            }
          });
          const sum = sumNutrients(allWeekServings, labels);
          return averageNutrients(sum, 7);
        }
        return undefined;
      });
      const grandTotal = sumNutrients(allPlanServings, labels);
      const grandAverage = averageNutrients(grandTotal, maxWeek * 7);
      nutrientValues = [...weekAverages, grandAverage];
    } else {
      // return a list that represents the total for each day in the provided week
      const weekTotal: MealPlanServingsFieldFragment[] = [];
      const weekServings = servings.get(week);
      const weekDailyTotals = Array.from({ length: 7 }).map((_, index) => {
        const dayServings = weekServings?.get(index + 1);
        if (dayServings) {
          const dayServingsforTotal: MealPlanServingsFieldFragment[] = [];
          for (const courseServing of dayServings.values()) {
            weekTotal.push(...courseServing);
            dayServingsforTotal.push(...courseServing);
          }
          return sumNutrients(dayServingsforTotal, labels);
        }
        return undefined;
      });
      nutrientValues = [
        ...weekDailyTotals,
        averageNutrients(sumNutrients(weekTotal, labels), 7),
      ];
    }
    return nutrientValues;
  }, [week, servings, maxWeek, labels]);
}
