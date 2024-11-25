import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  createRecipeIngredientMutation,
  editRecipeIngredientMutation,
} from "@/features/recipe/api/RecipeIngredient";
import { basicItem } from "@/features/recipe/hooks/useRecipeInfoForm";
import { RecipeIngredientFieldsFragment } from "@/gql/graphql";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@urql/next";

export function useRecipeIngredientForm(
  ingredient: RecipeIngredientFieldsFragment | undefined | null
) {
  const form = useForm<IngredientForm>({
    resolver: zodResolver(ingredientSchema),
  });

  const [{ fetching: editFetching }, editIngredient] = useMutation(
    editRecipeIngredientMutation
  );
  const [{ fetching: createFetching }, createIngredient] = useMutation(
    createRecipeIngredientMutation
  );
  const isFetching = editFetching || createFetching;

  const { reset } = form;

  useEffect(() => {
    reset(toDefaultValues(ingredient));
  }, [ingredient, reset]);

  async function handleSubmit(values: IngredientForm) {
    console.log(values);
  }

  return { form, handleSubmit, isFetching };
}

const ingredientSchema = z.object({
  sentence: z.string(),
  quantity: z.number().nonnegative(),
  mealPrepIngredient: z.boolean(),
  ingredient: basicItem.nullable(),
  unit: basicItem.nullable(),
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
      : null,
    unit: ingredient?.unit
      ? {
          id: ingredient.unit.id,
          label: ingredient.unit.name,
        }
      : null,
  };
}
