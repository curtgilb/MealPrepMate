import { ChevronLeft, Save, Trash } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  deleteMealPlanRecipeMutation,
  editMealPlanRecipeMutation,
} from "@/features/mealplan/api/MealPlanRecipe";

import { MealPlanRecipeFieldsFragment } from "@/gql/graphql";
import { useMutation } from "@urql/next";
import { SidebarRecipe } from "@/features/mealplan/components/sidebar/planned_recipes/SidebarRecipe";

interface EditMealPlanRecipeProps {
  recipe: MealPlanRecipeFieldsFragment;
  setRecipe: (recipe: MealPlanRecipeFieldsFragment | null) => void;
}

export function EditMealPlanRecipe({
  recipe,
  setRecipe,
}: EditMealPlanRecipeProps) {
  const [servings, setServings] = useState<number>(recipe?.totalServings ?? 1);
  const [scale, setScale] = useState<number>(recipe?.factor ?? 1);
  const [editResult, editRecipe] = useMutation(editMealPlanRecipeMutation);
  const [deleteResult, deleteRecipe] = useMutation(
    deleteMealPlanRecipeMutation
  );
  const isChanged =
    scale !== recipe.factor || servings !== recipe.totalServings;
  const isSaving = editResult.fetching || deleteResult.fetching;

  async function handleEdit() {
    await editRecipe({
      id: recipe.id,
      recipe: { factor: scale, servings: servings },
    });
  }

  async function handleDelete() {
    await deleteRecipe({
      id: recipe.id,
    }).then(() => {
      setRecipe(null);
    });
  }

  return (
    <div className="flex flex-col gap-2 h-[calc(100%-3rem)]">
      <div className="shrink-0">
        <Button variant="link" onClick={() => setRecipe(null)}>
          Back
        </Button>
      </div>

      <div className="flex-1 min-h-0">
        <SidebarRecipe
          recipe={recipe.originalRecipe}
          scale={scale}
          servings={servings}
          setScale={setScale}
          setServings={setServings}
        />
      </div>

      <div className="shrink-0 flex flex-col gap-2">
        <Button
          className="w-full"
          onClick={handleEdit}
          disabled={!isChanged || isSaving}
        >
          <Save />
          Save changes
        </Button>
        <Button
          variant="destructive"
          className="w-full"
          onClick={handleDelete}
          disabled={isSaving}
        >
          <Trash />
          Remove
        </Button>
      </div>
    </div>
  );
}
