"use client";
import { ChevronLeft } from "lucide-react";
import { useParams } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { addRecipeToMealPlanMutation } from "@/features/mealplan/api/MealPlanRecipe";
import { SidebarRecipe } from "@/features/mealplan/components/sidebar/SidebarRecipe";
import { getRecipeBaiscInfo } from "@/features/recipe/api/Recipe";
import { useMutation, useQuery } from "@urql/next";

interface RecipeViewProps {
  recipeId: string | null;
  setRecipe: Dispatch<SetStateAction<string | null>>;
}

export function AddRecipe({ recipeId, setRecipe }: RecipeViewProps) {
  const params = useParams<{ id: string }>();
  const mealPlanId = decodeURIComponent(params.id);

  const [result] = useQuery({
    query: getRecipeBaiscInfo,
    pause: !recipeId,
    variables: { id: recipeId ?? "" },
  });

  const [addedRecipeResult, addRecipe] = useMutation(
    addRecipeToMealPlanMutation
  );

  const [servings, setServings] = useState(
    result?.data?.recipe?.aggregateLabel?.servings ?? 1
  );
  const [scale, setScale] = useState(1);
  const recipe = result.data?.recipe;

  async function handleSubmit() {
    await addRecipe({
      mealPlanId: mealPlanId,
      recipe: { recipeId: recipeId, scaleFactor: scale, servings: servings },
    }).then(() => {
      setRecipe(null);
      toast("Recipe added to meal plan");
    });
  }

  if (!recipe) {
    return <p>No recipe found</p>;
  }

  return (
    <div className="flex flex-col gap-2 h-[calc(100%-3rem)]">
      <div className="shrink-0">
        <Button variant="link" onClick={() => setRecipe(null)}>
          <ChevronLeft />
          Back to search results
        </Button>
      </div>

      <div className="flex-1 min-h-0">
        <SidebarRecipe
          recipe={recipe}
          scale={scale}
          servings={servings}
          setScale={setScale}
          setServings={setServings}
        />
      </div>

      <div className="shrink-0">
        <Button className="w-full" onClick={handleSubmit}>
          Add to meal plan
        </Button>
      </div>
    </div>
  );
}
