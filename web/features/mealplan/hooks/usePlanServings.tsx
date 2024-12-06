"use client";
import { getServingsQuery, mealServingsFragment } from '@/features/mealplan/api/MealPlanServings';
import { getFragmentData } from '@/gql';
import { Meal, MealPlanServingsFieldFragment } from '@/gql/graphql';
import { useQuery } from '@urql/next';

interface PlanServingsByDayProps {
  mealPlanId: string;
  day: number | { minDay: number; maxDay: number } | undefined;
}

export type PlanServingsByDayResultData = {
  groupedByCourse: Record<
    number,
    Record<Meal, MealPlanServingsFieldFragment[]>
  >;
  groupedByDay: Record<number, MealPlanServingsFieldFragment[]>;
};

export function usePlanServings({
  mealPlanId,
  day,
}: PlanServingsByDayProps): PlanServingsByDayResultData {
  const filter = day
    ? typeof day === "number"
      ? { day: day }
      : { ...day }
    : undefined;

  const [result] = useQuery({
    query: getServingsQuery,
    variables: {
      mealPlanId,
      filter,
    },
    requestPolicy: "cache-first",
  });

  const servings = getFragmentData(
    mealServingsFragment,
    result.data?.mealPlanServings
  );

  const groupedByCourse: PlanServingsByDayResultData["groupedByCourse"] = {};
  const groupedByDay: PlanServingsByDayResultData["groupedByDay"] = {};

  servings?.forEach((serving) => {
    // Add to course grouping (includes day also)
    if (!(serving.day in groupedByCourse)) {
      groupedByCourse[serving.day] = {
        BREAKFAST: [],
        LUNCH: [],
        DINNER: [],
        SNACK: [],
      };
    }
    groupedByCourse[serving.day][serving.meal].push(serving);

    // Add to just day grouping
    if (!(serving.day in groupedByDay)) {
      groupedByDay[serving.day] = [];
    }
    groupedByDay[serving.day].push(serving);
  });

  return { groupedByCourse, groupedByDay };
}
