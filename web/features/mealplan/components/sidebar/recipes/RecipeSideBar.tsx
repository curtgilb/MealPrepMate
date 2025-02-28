import { useState } from "react";

import { AddRecipe } from "@/features/mealplan/components/sidebar/recipes/AddRecipe";
import { RecipeSearch } from "@/features/mealplan/components/sidebar/recipes/RecipeSearch";

export function RecipeSideBar() {
  const [selectedRecipe, setSelectedRecipe] = useState<string | null>(null);

  return selectedRecipe ? (
    <AddRecipe recipeId={selectedRecipe} setRecipe={setSelectedRecipe} />
  ) : (
    <RecipeSearch setRecipe={setSelectedRecipe} />
  );
}
