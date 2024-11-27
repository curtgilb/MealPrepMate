import { Dispatch, SetStateAction, useState } from "react";

import { AddRecipe } from "@/features/mealplan/components/sidebar/recipe_search/AddRecipe";
import { RecipeSearch } from "@/features/mealplan/components/sidebar/recipe_search/RecipeSearch";

export function RecipeSideBar() {
  const [selectedRecipe, setSelectedRecipe] = useState<string | null>(null);

  return selectedRecipe ? (
    <AddRecipe recipeId={selectedRecipe} setRecipe={setSelectedRecipe} />
  ) : (
    <RecipeSearch setRecipe={setSelectedRecipe} />
  );
}
