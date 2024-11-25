"use client";
import { forwardRef, useImperativeHandle } from "react";

import { RichTextEditor } from "@/components/rich_text/RichTextEditor";
import { recipeIngredientFragment } from "@/features/recipe/api/RecipeIngredient";
import { EditRecipeIngredient } from "@/features/recipe/components/edit/ingredients/ingredient/EditRecipeIngredient";
import { IngredientList } from "@/features/recipe/components/edit/ingredients/list/IngredientList";
import {
  EditRecipeProps,
  EditRecipeSubmit,
} from "@/features/recipe/components/edit/RecipeEditor";
import {
  IngredientsContext,
  useGroupedRecipeIngredients,
} from "@/features/recipe/hooks/useGroupedRecipeIngredients";
import { getFragmentData } from "@/gql";

export const EditRecipeIngredients = forwardRef<
  EditRecipeSubmit,
  EditRecipeProps
>(function EditRecipeIngredients(props, ref) {
  const ingredients = getFragmentData(
    recipeIngredientFragment,
    props.recipe?.ingredients
  );

  const groupedIngredients = useGroupedRecipeIngredients(ingredients);

  useImperativeHandle(ref, () => ({
    submit(postSubmit) {
      postSubmit();
    },
  }));

  return (
    <>
      <IngredientsContext.Provider value={groupedIngredients}>
        {props.recipe?.id && (
          <div className="flex gap-6 justify-between">
            <IngredientList recipeId={props.recipe.id} />
            <div className="max-w-prose w-full">
              <EditRecipeIngredient
                ingredient={groupedIngredients.selectedIngredient}
              />
            </div>
          </div>
        )}
      </IngredientsContext.Provider>
    </>
  );
});

{
}
