import { mealPlanQuery } from "@/graphql/mealplan/mealplan";
import { useQuery } from "@urql/next";
import { useRecipeLabelLookup } from "./use-recipe-label-lookup";
import { useFragment } from "@/gql";
import { mealRecipeFragment } from "@/graphql/mealplan/mealrecipes";
import { mealServingsFragment } from "@/graphql/mealplan/mealservings";
import { MealPlanServingsFieldFragment } from "@/gql/graphql";
import { useMemo } from "react";
import { getDisplayDayNumber, getWeekNumber } from "@/utils/weeks";

// {week: day: {course: servings[]}}
export type ServingsLookup = Map<
  number, // week
  Map<
    number, // Day
    Map<string, MealPlanServingsFieldFragment[]> //Course, servings
  >
>;

export function useMealPlan(id: string) {
  const [mealPlanResult, refetchMealPlan] = useQuery({
    query: mealPlanQuery,
    variables: { mealPlanId: id },
  });

  const { data, fetching, error } = mealPlanResult;
  const labels = useRecipeLabelLookup(data?.mealPlan.planRecipes);
  const recipes = useFragment(mealRecipeFragment, data?.mealPlan.planRecipes);
  const servings = useFragment(
    mealServingsFragment,
    data?.mealPlan.mealPlanServings
  );

  const servingsCategoriezed = useMemo(() => {
    return servings?.reduce((acc, cur) => {
      // Insert week
      const weekNumber = getWeekNumber(cur.day);
      const week = acc.get(weekNumber);
      if (!week) {
        acc.set(
          weekNumber,
          new Map<number, Map<string, MealPlanServingsFieldFragment[]>>()
        );
      }

      // Insert Day
      const displayDayNumber = getDisplayDayNumber(cur.day);
      const day = acc.get(weekNumber)?.get(displayDayNumber);
      if (!day) {
        acc
          .get(weekNumber)
          ?.set(
            displayDayNumber,
            new Map<string, MealPlanServingsFieldFragment[]>()
          );
      }

      //   Insert course
      const dayCourse = acc
        .get(weekNumber)
        ?.get(displayDayNumber)
        ?.get(cur.meal);
      if (!dayCourse) {
        acc.get(weekNumber)?.get(displayDayNumber)?.set(cur.meal, []);
      }
      //   Insert serving
      acc.get(weekNumber)?.get(displayDayNumber)?.get(cur.meal)?.push(cur);

      return acc;
    }, new Map<number, Map<number, Map<string, MealPlanServingsFieldFragment[]>>>());
  }, [servings]);

  return {
    labels,
    recipes,
    servings: servingsCategoriezed as ServingsLookup,
  };
}
