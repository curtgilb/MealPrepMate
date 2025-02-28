"use client";
import { forwardRef, useImperativeHandle } from "react";

import {
  editRecipeIngredientMutation,
  recipeIngredientFragment,
} from "@/features/recipe/api/RecipeIngredient";
import { RecipeIngredientFields } from "@/features/recipe/components/edit/ingredients/ingredient/RecipeIngredientFields";
import { IngredientList } from "@/features/recipe/components/edit/ingredients/list/IngredientList";
import {
  EditRecipeProps,
  EditRecipeSubmit,
} from "@/features/recipe/components/edit/RecipeEditor";
import {
  DEFAULT_GROUP_KEY,
  IngredientsContext,
  useGroupedRecipeIngredients,
} from "@/features/recipe/hooks/useGroupedRecipeIngredients";
import { getFragmentData } from "@/gql";
import { useMutation } from "@urql/next";
import { EditRecipeIngredientsInput } from "@/gql/graphql";
export const RecipeIngredientsEditor = forwardRef<
  EditRecipeSubmit,
  EditRecipeProps
>(function RecipeIngredientsEditor(props, ref) {
  const ingredients = getFragmentData(
    recipeIngredientFragment,
    props.recipe?.ingredients
  );

  const groupedIngredients = useGroupedRecipeIngredients(
    ingredients,
    props.recipe?.ingredientGroups
  );

  const [{ fetching: editFetching }, editIngredient] = useMutation(
    editRecipeIngredientMutation
  );

  useImperativeHandle(ref, () => ({
    async submit(postSubmit) {
      const groups = groupedIngredients.groupedIngredients;
      const groupOrder = groupedIngredients.groupOrder;

      const variables = groupOrder
        .map((groupId) =>
          groups[groupId].items.map(
            (ingredient, index) =>
              ({
                id: ingredient.id,
                input: {
                  quantity: ingredient.quantity,
                  sentence: ingredient.sentence,
                  mealPrepIngredient: ingredient.mealPrepIngredient,
                  verified: ingredient.verified,
                  groupId: groupId === DEFAULT_GROUP_KEY ? undefined : groupId,
                  ingredientId: ingredient.baseIngredient?.id,
                  order: index,
                  unitId: ingredient.unit?.id,
                },
              } as EditRecipeIngredientsInput)
          )
        )
        .flat();

      await editIngredient({ input: variables }).then((result) => {
        if (!result.error) {
          postSubmit();
        }
      });
    },
  }));

  return (
    <>
      <IngredientsContext.Provider value={groupedIngredients}>
        {props.recipe?.id && (
          <div className="flex gap-20 justify-between">
            <IngredientList recipeId={props.recipe.id} />
            <div className="max-w-prose w-full shrink-0">
              <RecipeIngredientFields
                ingredient={groupedIngredients.selectedIngredient}
              />
            </div>
          </div>
        )}
      </IngredientsContext.Provider>
    </>
  );
});
