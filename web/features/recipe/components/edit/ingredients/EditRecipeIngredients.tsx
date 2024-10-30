"use client";
import { recipeIngredientFragment } from "@/features/recipe/api/RecipeIngredient";
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
import { forwardRef, useImperativeHandle } from "react";

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
          <div className="flex">
            <IngredientList recipeId={props.recipe.id} />
          </div>
        )}
      </IngredientsContext.Provider>
    </>
  );
});

{
  /* <div className="my-6">
<Progress className="h-2" value={percent} />
<p className="text-xs font-light text-right">
  Verified {completed.length} of {ingredients?.length ?? 0}
</p>
</div> */
}
