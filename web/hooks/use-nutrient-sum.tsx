import { MealPlanServingsFieldFragment } from "@/gql/graphql";
import { useMemo } from "react";
import { RecipeNutrientLookup } from "./use-recipe-label-lookup";
import { SummedNutrients, sumNutrients } from "@/utils/nutrients";

export function useNutrientSum(
  servings: MealPlanServingsFieldFragment[],
  lookup: RecipeNutrientLookup
): SummedNutrients {
  return useMemo(() => {
    return sumNutrients(servings, lookup);
  }, [servings, lookup]);
}
