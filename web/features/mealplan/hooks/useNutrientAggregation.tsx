import { useMemo } from 'react';

import { CalcNutritionFunc } from '@/features/mealplan/hooks/useMealPlanNutrition';
import { PlanServingsByDayResultData } from '@/features/mealplan/hooks/usePlanServings';
import { MealPlanServingsFieldFragment } from '@/gql/graphql';

interface NutrientAggregationProps {
  servingsByDay: PlanServingsByDayResultData["groupedByDay"];

  calculateNutrition: CalcNutritionFunc;
}

export function useNutrientAggregation({
  servingsByDay,
  calculateNutrition,
}: NutrientAggregationProps) {
  return useMemo(() => {
    const allDays = Object.keys(servingsByDay).map(Number);
    const minDay = Math.min(...allDays);
    const maxDay = Math.max(...allDays);

    //   Group servings by day
    const days: MealPlanServingsFieldFragment[][] = Array(7)
      .fill(null)
      .map(() => []);
    const combined: MealPlanServingsFieldFragment[] = [];

    for (let i = minDay; i <= maxDay; i++) {
      if (i in servingsByDay) {
        const weekdayIndex = (i - 1) % 7;
        days[weekdayIndex].push(...servingsByDay[i]);
        combined.push(...servingsByDay[i]);
      }
    }
    //   Calculate nutrition values
    const aggregate = (servings: MealPlanServingsFieldFragment[]) => {
      return servings.length > 0
        ? calculateNutrition({
            macrosOnly: false,
            recipes: servings.map((serving) => ({
              mealPlanRecipeId: serving.mealPlanRecipeId,
              servings: serving.numberOfServings,
            })),
          })
        : undefined;
    };

    return {
      grouped: days.map(aggregate),
      combined: aggregate(combined),
    };
  }, [servingsByDay, calculateNutrition]);
}
