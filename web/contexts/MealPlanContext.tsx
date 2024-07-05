import { MealRecipeFieldsFragment } from "@/gql/graphql";
import { RecipeNutrientLookup } from "@/hooks/use-recipe-label-lookup";
import { createContext } from "react";

export type MealPlanContext = {
  id: string;
  labels: RecipeNutrientLookup;
  recipes: readonly MealRecipeFieldsFragment[] | undefined | null;
};

export const MealPlan = createContext<MealPlanContext | undefined>(undefined);
