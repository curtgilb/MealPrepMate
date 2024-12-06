import { useMemo } from "react";

import { MealPlanServingsFieldFragment } from "@/gql/graphql";
import { SummedNutrients, sumNutrients } from "@/utils/nutrients";

import { RecipeNutrientLookup } from "../features/mealplan/hooks/useMealPlanNutrition";

export function useNutrientSum(
  servings: MealPlanServingsFieldFragment[],
  lookup: RecipeNutrientLookup
): SummedNutrients {
  return useMemo(() => {
    return sumNutrients(servings, lookup);
  }, [servings, lookup]);
}
