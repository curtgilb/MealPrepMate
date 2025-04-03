import { z } from "zod";

import { updateAggregateLabel } from "@/application/services/nutrition/AggregateLabelService.js";
import {
  NutritionLabelInput,
  nutritionLabelValidation,
} from "@/application/services/nutrition/NutritionLabelService.js";
import {
  RecipeIngredientInput,
  recipeIngredientValidation,
  tagIngredients,
} from "@/application/services/recipe/RecipeIngredientService.js";
import { toTitleCase } from "@/application/util/utils.js";
import { cleanString } from "@/application/validations/Formatters.js";
import { db } from "@/infrastructure/repository/db.js";
import { Prisma, RecipeIngredient } from "@prisma/client";

type WebRecipeQuery = {
  include?: Prisma.WebScrapedRecipeInclude | undefined;
  select?: Prisma.WebScrapedRecipeSelect | undefined;
};

type RecipeQuery = {
  include?: Prisma.RecipeInclude | undefined;
  select?: Prisma.RecipeSelect | undefined;
};

const recipeValidation = z.object({
  title: z.preprocess(cleanString, z.string()).transform(toTitleCase),
  source: z.preprocess(cleanString, z.string().nullish()),
  prepTime: z.number().nonnegative().nullish(),
  cookTime: z.number().nonnegative().nullish(),
  marinadeTime: z.number().nonnegative().nullish(),
  directions: z.preprocess(cleanString, z.string().nullish()),
  notes: z.preprocess(cleanString, z.string().nullish()),
  photoIds: z.string().uuid().array().nullish(),
  courseIds: z.string().uuid().array().nullish(),
  categoryIds: z.string().uuid().array().nullish(),
  cuisineIds: z.string().uuid().array().nullish(),
  ingredients: recipeIngredientValidation.array().nullish(),
  ingredientText: z.string().nullish(),
  leftoverFridgeLife: z.number().nonnegative().nullish(),
  leftoverFreezerLife: z.number().nonnegative().nullish(),
  nutrition: nutritionLabelValidation.nullish(),
});

type RecipeInput = {
  title: string;
  source?: string | undefined | null;
  prepTime?: number | undefined | null;
  cookTime?: number | undefined | null;
  marinadeTime?: number | undefined | null;
  directions?: string | undefined | null;
  notes?: string | undefined | null;
  photoIds?: string[] | undefined | null;
  courseIds?: string[] | undefined | null;
  categoryIds?: string[] | undefined | null;
  cuisineIds?: string[] | undefined | null;
  ingredients?: RecipeIngredientInput[] | undefined | null;
  ingredientText?: string | null | undefined;
  leftoverFridgeLife?: number | undefined | null;
  leftoverFreezerLife?: number | undefined | null;
  nutrition?: NutritionLabelInput | undefined | null;
};

async function createRecipe(recipe: RecipeInput, query?: RecipeQuery) {
  const cleanedRecipe = await recipeValidation.parseAsync(recipe);
  const ingredients = cleanedRecipe?.ingredientText
    ? await tagIngredients(cleanedRecipe.ingredientText, true)
    : cleanedRecipe?.ingredients;

  return await db.$transaction(async (tx) => {
    const createdRecipe = await db.recipe.create({
      include: {
        nutritionLabels: {
          include: { nutrients: true, servingSizeUnit: true },
        },
      },
      data: {
        name: cleanedRecipe.title,
        source: cleanedRecipe.source,
        preparationTime: cleanedRecipe.prepTime,
        cookingTime: cleanedRecipe.cookTime,
        marinadeTime: cleanedRecipe.marinadeTime,
        directions: cleanedRecipe.directions,
        notes: cleanedRecipe.notes,
        photos: cleanedRecipe.photoIds
          ? { connect: cleanedRecipe.photoIds?.map((id) => ({ id })) }
          : undefined,
        course: cleanedRecipe.courseIds
          ? {
              connect: cleanedRecipe.courseIds.map((id) => ({
                id,
              })),
            }
          : undefined,
        category: cleanedRecipe.categoryIds
          ? { connect: cleanedRecipe.categoryIds.map((id) => ({ id })) }
          : undefined,
        cuisine: cleanedRecipe.cuisineIds
          ? { connect: cleanedRecipe.cuisineIds.map((id) => ({ id })) }
          : undefined,
        leftoverFridgeLife: cleanedRecipe.leftoverFridgeLife,
        leftoverFreezerLife: cleanedRecipe.leftoverFreezerLife,
        ingredients: ingredients
          ? {
              createMany: {
                data: ingredients.map((ingredient) => ({
                  sentence: ingredient.sentence,
                  quantity: ingredient?.quantity,
                  order: ingredient.order,
                  measurementUnitId: ingredient?.unitId,
                  ingredientId: ingredient?.ingredientId,
                })),
              },
            }
          : undefined,
        nutritionLabels: cleanedRecipe.nutrition
          ? {
              create: {
                servings: cleanedRecipe.nutrition.servings,
                servingSize: cleanedRecipe.nutrition.servingSize,
                servingSizeUnit: cleanedRecipe.nutrition.servingSizeUnitId
                  ? {
                      connect: {
                        id: cleanedRecipe.nutrition.servingSizeUnitId,
                      },
                    }
                  : undefined,
                servingsUsed: cleanedRecipe.nutrition.servingsUsed,
                isPrimary: true,
                nutrients: cleanedRecipe.nutrition.nutrients
                  ? {
                      createMany: {
                        data: cleanedRecipe.nutrition?.nutrients?.map(
                          (nutrient) => ({
                            value: nutrient.value,
                            nutrientId: nutrient.nutrientId,
                          })
                        ),
                      },
                    }
                  : undefined,
              },
            }
          : undefined,
      },
    });
    await updateAggregateLabel(
      createdRecipe.id,
      createdRecipe.nutritionLabels,
      tx
    );
    // @ts-ignore
    return await db.recipe.findUniqueOrThrow({
      where: { id: createdRecipe.id },
      ...query,
    });
  });
}

async function editRecipe(
  recipeId: string,
  editedRecipe: RecipeInput,
  query?: RecipeQuery
) {
  console.log(recipeId);
  console.log(editedRecipe);
  return await db.recipe.update({
    where: { id: recipeId },
    data: {
      name: editedRecipe.title ?? undefined,
      source: editedRecipe.source,
      preparationTime: editedRecipe.prepTime,
      cookingTime: editedRecipe.cookTime,
      marinadeTime: editedRecipe.marinadeTime,
      notes: editedRecipe.notes,
      leftoverFridgeLife: editedRecipe.leftoverFridgeLife,
      leftoverFreezerLife: editedRecipe.leftoverFreezerLife,
      directions: editedRecipe.directions,
      cuisine:
        !editedRecipe.cuisineIds || editedRecipe.cuisineIds.length === 0
          ? undefined
          : {
              set: editedRecipe.cuisineIds.map((id) => ({ id })) ?? [],
            },
      category:
        !editedRecipe.categoryIds || editedRecipe.categoryIds.length === 0
          ? undefined
          : {
              set: editedRecipe.categoryIds.map((id) => ({ id })) ?? [],
            },
      course:
        !editedRecipe.courseIds || editedRecipe.courseIds.length === 0
          ? undefined
          : {
              set: editedRecipe.courseIds.map((id) => ({ id })) ?? [],
            },
      photos:
        !editedRecipe.photoIds || editedRecipe.photoIds.length === 0
          ? undefined
          : {
              set: editedRecipe.photoIds.map((id) => ({ id })) ?? [],
            },
    },
    ...query,
  });
}

async function getIngredientText(
  ingredients: RecipeIngredient[] | null | undefined
) {
  const ingredientList = ingredients
    ?.sort((i1, i2) => i1.order - i2.order)
    .reduce((agg, ingredient) => {
      agg.push(ingredient.sentence);
      return agg;
    }, [] as string[]);

  return ingredientList?.join("\n") ?? "";
}

async function deleteRecipe(recipeId: string) {
  await db.recipe.delete({
    where: { id: recipeId },
  });
}

async function getIngredientFreshness(
  recipeId: string
): Promise<number | null> {
  const expRules = await db.expirationRule.findMany({
    where: {
      ingredients: {
        some: { recipeIngredient: { some: { recipeId } } },
      },
    },
  });

  if (expRules.length === 0) return null;

  return expRules
    .map((rule) =>
      Math.max(
        rule?.tableLife ?? 0,
        rule?.fridgeLife ?? 0,
        rule?.freezerLife ?? 0
      )
    )
    .reduce((acc, cur) => {
      if (cur < acc) return cur;
      return acc;
    }, Infinity);
}

export {
  createRecipe,
  deleteRecipe,
  editRecipe,
  getIngredientFreshness,
  RecipeInput,
  getIngredientText,
};
