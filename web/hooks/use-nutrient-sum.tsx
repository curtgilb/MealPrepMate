import { useMemo } from "react";

import { MealPlanServingsFieldFragment } from "@/gql/graphql";
import { SummedNutrients, sumNutrients } from "@/utils/nutrients";

import { RecipeNutrientLookup } from "./usePlanRecipeLabels";

export function useNutrientSum(
  servings: MealPlanServingsFieldFragment[],
  lookup: RecipeNutrientLookup
): SummedNutrients {
  return useMemo(() => {
    return sumNutrients(servings, lookup);
  }, [servings, lookup]);
}
