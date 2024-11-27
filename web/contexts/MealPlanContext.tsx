import { createContext } from "react";

import { MealRecipeFieldsFragment } from "@/gql/graphql";
import { RecipeNutrientLookup } from "@/hooks/usePlanRecipeLabels";

export type MealPlanContext = {
  id: string;
  labels: RecipeNutrientLookup;
  recipes: readonly MealRecipeFieldsFragment[] | undefined | null;
};

export const MealPlan = createContext<MealPlanContext | undefined>(undefined);
