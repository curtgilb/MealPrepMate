import { useState } from "react";

import {
  getMealPlanRecipes,
  mealPlanRecipeFragment,
} from "@/features/mealplan/api/MealPlanRecipe";
import { EditMealPlanRecipe } from "@/features/mealplan/components/sidebar/meals/EditMealPlanRecipe";
import { MealRecipeList } from "@/features/mealplan/components/sidebar/meals/MealRecipeList";
import { getFragmentData } from "@/gql";
import { MealPlanRecipeFieldsFragment } from "@/gql/graphql";
import { useIdParam } from "@/hooks/use-id";
import { useQuery } from "@urql/next";

export function MealPlanRecipes() {
  const mealPlanId = useIdParam();
  const [result] = useQuery({
    query: getMealPlanRecipes,
    variables: { mealPlanId },
  });

  const recipes = getFragmentData(
    mealPlanRecipeFragment,
    result.data?.mealPlanRecipes
  );

  const [recipe, setRecipe] = useState<MealPlanRecipeFieldsFragment | null>(
    null
  );

  if (!recipe) {
    return <MealRecipeList recipes={recipes} setRecipe={setRecipe} />;
  }

  return <EditMealPlanRecipe recipe={recipe} setRecipe={setRecipe} />;
}
