import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  createRecipeIngredientMutation,
  editRecipeIngredientMutation,
  recipeIngredientFragment,
} from "@/features/recipe/api/RecipeIngredient";
import { basicItem } from "@/features/recipe/hooks/useRecipeInfoForm";
import { RecipeIngredientFieldsFragment } from "@/gql/graphql";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@urql/next";
import {
  IngredientsContext,
  useRecipeIngredientContext,
} from "@/features/recipe/hooks/useGroupedRecipeIngredients";
import { getFragmentData } from "@/gql";

export function useRecipeIngredientForm(
  ingredient: RecipeIngredientFieldsFragment | undefined | null
) {
  const form = useForm<IngredientForm>({
    resolver: zodResolver(ingredientSchema),
    defaultValues: toDefaultValues(ingredient),
  });

  const [{ fetching: editFetching }, editIngredient] = useMutation(
    editRecipeIngredientMutation
  );
  // const [{ fetching: createFetching }, createIngredient] = useMutation(
  //   createRecipeIngredientMutation
  // );
  const isFetching = editFetching;

  const { reset } = form;

  useEffect(() => {
    reset(toDefaultValues(ingredient));
  }, [ingredient, reset]);

  const context = useRecipeIngredientContext();

  async function handleSubmit(values: IngredientForm) {
    if (ingredient) {
      await editIngredient({
        input: [
          {
            id: ingredient.id,
            input: {
              order: ingredient.order,
              sentence: values.sentence,
              quantity: values.quantity,
              unitId: values.unit?.id,
              ingredientId: values.ingredient?.id,
              groupId: ingredient.group?.id,
              mealPrepIngredient: values.mealPrepIngredient,
              verified: true,
            },
          },
        ],
      }).then((result) => {
        if (context && result.data?.editRecipeIngredients) {
          const { updateSelected, advanceSelected } = context;

          const ingredient = getFragmentData(
            recipeIngredientFragment,
            result.data?.editRecipeIngredients[0]
          );
          updateSelected(ingredient);
          advanceSelected();
        }
      });
    }
  }

  return { form, handleSubmit, isFetching };
}

const ingredientSchema = z.object({
  sentence: z.string(),
  quantity: z.coerce.number().nonnegative(),
  mealPrepIngredient: z.boolean(),
  ingredient: basicItem,
  unit: basicItem,
});

type IngredientForm = z.infer<typeof ingredientSchema>;

function toDefaultValues(
  ingredient: RecipeIngredientFieldsFragment | undefined | null
) {
  return {
    sentence: ingredient?.sentence || "",
    quantity: ingredient?.quantity ?? 1,
    mealPrepIngredient: ingredient?.mealPrepIngredient ?? false,
    ingredient: ingredient?.baseIngredient
      ? {
          id: ingredient.baseIngredient.id,
          label: ingredient?.baseIngredient.name,
        }
      : undefined,
    unit: ingredient?.unit
      ? {
          id: ingredient.unit.id,
          label: ingredient.unit.name,
        }
      : undefined,
  };
}
