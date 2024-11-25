import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  createRecipeMutation,
  editRecipeMutation,
} from "@/features/recipe/api/Recipe";
import { RecipeFieldsFragment, RecipeInput } from "@/gql/graphql";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@urql/next";

export function useRecipeInfoForm(
  recipe: RecipeFieldsFragment | undefined | null
) {
  const [{ fetching: editFetching }, editRecipe] =
    useMutation(editRecipeMutation);
  const [{ fetching: createFetching }, createRecipe] =
    useMutation(createRecipeMutation);

  const isFetching = editFetching || createFetching;

  const form = useForm<RecipeInfoForm>({
    resolver: zodResolver(recipeInputValidation),
    defaultValues: toDefaultValues(recipe),
  });

  const reset = form.reset;

  useEffect(() => {
    reset(toDefaultValues(recipe));
  }, [recipe, reset]);

  async function handleSubmit(values: RecipeInfoForm, postSubmit?: () => void) {
    console.log("cleaned Values: ", values);

    if (recipe?.id) {
      // Edit new recipe
      await editRecipe({ id: recipe.id, recipe: toApiValues(values) }).then(
        (result) => {
          console.log("result: ", result);
          if (!result.error) {
            postSubmit?.();
          }
        }
      );
    } else {
      // Create existing recipe
      await createRecipe({ input: toApiValues(values) }).then(() => {
        postSubmit?.();
      });
    }
  }

  return { isFetching, handleSubmit, form };
}

// ================================== Form Types ==================================
export const basicItem = z
  .object({
    id: z.string(),
    label: z.string(),
  })
  .passthrough();

const PhotoItem = z.object({
  id: z.string(),
  url: z.string(),
  isPrimary: z.boolean(),
});

const recipeInputValidation = z.object({
  title: z.string().trim(),
  source: z.string().trim().optional(),
  prepTime: z.coerce.number().nonnegative().optional(),
  cookTime: z.coerce.number().nonnegative().optional(),
  marinadeTime: z.coerce.number().nonnegative().optional(),
  directions: z.string().trim().optional(),
  notes: z.string().trim().optional(),
  leftoverFridgeLife: z.coerce.number().nonnegative().optional(),
  leftoverFreezerLife: z.coerce.number().nonnegative().optional(),
  ingredients: z.string().trim().optional(),
  cuisine: z.array(basicItem).nullable(),
  category: z.array(basicItem).nullable(),
  course: z.array(basicItem).nullable(),
  photos: z.array(PhotoItem).nullable(),
});

type RecipeInfoForm = z.infer<typeof recipeInputValidation>;

// ================================== Helper Functions ==================================
function toApiValues(values: RecipeInfoForm): RecipeInput {
  return {
    categoryIds: values.category?.map((c) => c.id) || null,
    cookTime: values.cookTime || null,
    courseIds: values.course?.map((c) => c.id) || null,
    cuisineIds: values.cuisine?.map((c) => c.id) || null,
    directions: values.directions || null,
    ingredientText: values.ingredients || null,
    leftoverFreezerLife: values.leftoverFreezerLife || null,
    leftoverFridgeLife: values.leftoverFridgeLife || null,
    marinadeTime: values.marinadeTime || null,
    notes: values.notes || null,
    photoIds: values.photos?.map((p) => p.id) || null,
    prepTime: values.prepTime || null,
    source: values.source || null,
    title: values.title,
  };
}

function toDefaultValues(
  recipe: RecipeFieldsFragment | null | undefined
): RecipeInfoForm {
  return {
    title: recipe?.name || "",
    source: recipe?.source || "",
    prepTime: recipe?.prepTime || 0,
    cookTime: recipe?.cookTime || 0,
    marinadeTime: recipe?.marinadeTime || 0,
    directions: recipe?.directions || undefined,
    notes: recipe?.notes || "",
    leftoverFridgeLife: recipe?.leftoverFridgeLife || 0,
    leftoverFreezerLife: recipe?.leftoverFreezerLife || 0,
    ingredients: recipe?.ingredientText || "",
    cuisine: toItemList(recipe?.cuisine),
    category: toItemList(recipe?.category),
    course: toItemList(recipe?.course),
    photos:
      recipe?.photos?.map((p) => ({
        id: p.id,
        url: p.url,
        isPrimary: p.isPrimary,
      })) || null,
  };
}

function toItemList(list: { id: string; name: string }[] | null | undefined) {
  return list?.map((item) => ({ id: item.id, label: item.name })) ?? null;
}
