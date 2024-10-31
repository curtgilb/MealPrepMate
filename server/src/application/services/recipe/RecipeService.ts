import { updateAggregateLabel } from "@/application/services/nutrition/AggregateLabelService.js";
import {
  CreateNutritionLabelInput,
  nutritionLabelValidation,
} from "@/application/services/nutrition/NutritionLabelService.js";
import {
  CreateRecipeIngredientInput,
  recipeIngredientValidation,
  tagIngredients,
} from "@/application/services/recipe/RecipeIngredientService.js";
import { AllowUndefinedOrNull } from "@/application/types/CustomTypes.js";
import { toTitleCase } from "@/application/util/utils.js";
import { cleanString } from "@/application/validations/Formatters.js";
import { db } from "@/infrastructure/repository/db.js";
import { Prisma } from "@prisma/client";
import { z } from "zod";

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

export type CreateRecipeInput = {
  title: string;
  source: string | undefined | null;
  prepTime: number | undefined | null;
  cookTime: number | undefined | null;
  marinadeTime: number | undefined | null;
  directions: string | undefined | null;
  notes: string | undefined | null;
  photoIds: string[] | undefined | null;
  courseIds: string[] | undefined | null;
  categoryIds: string[] | undefined | null;
  cuisineIds: string[] | undefined | null;
  ingredients: CreateRecipeIngredientInput[] | undefined | null;
  ingredientText?: string;
  leftoverFridgeLife: number | undefined | null;
  leftoverFreezerLife: number | undefined | null;
  nutrition?: CreateNutritionLabelInput | undefined | null;
};

export type EditRecipeInput = Omit<
  AllowUndefinedOrNull<CreateRecipeInput>,
  "nutrition" | "ingredients"
>;

async function createRecipe(recipe: CreateRecipeInput, query?: RecipeQuery) {
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
  editedRecipe: EditRecipeInput,
  query?: RecipeQuery
) {
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
        editedRecipe.cuisineIds === undefined
          ? undefined
          : {
              set: editedRecipe.cuisineIds?.map((id) => ({ id })) ?? [],
            },
      category:
        editedRecipe.categoryIds === undefined
          ? undefined
          : {
              set: editedRecipe.categoryIds?.map((id) => ({ id })) ?? [],
            },
      course:
        editedRecipe.courseIds === undefined
          ? undefined
          : {
              set: editedRecipe.courseIds?.map((id) => ({ id })) ?? [],
            },
      photos:
        editedRecipe.photoIds === undefined
          ? undefined
          : {
              set: editedRecipe.photoIds?.map((id) => ({ id })) ?? [],
            },
    },
    ...query,
  });
}

async function deleteRecipes(recipeIds: string[]) {
  await db.recipe.deleteMany({
    where: { id: { in: recipeIds } },
  });
}

async function getIngredientFreshness(recipeId: string): Promise<number> {
  const expRules = await db.expirationRule.findMany({
    where: {
      ingredients: {
        some: { recipeIngredient: { some: { recipeId } } },
      },
    },
  });

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

export { createRecipe, editRecipe, deleteRecipes, getIngredientFreshness };

// async function scrapeRecipeFromWeb(
//   url: string,
//   isBookmark: boolean,
//   query?: WebRecipeQuery
// ): Promise<WebScrapedRecipe> {
//   const bookmark = await db.webScrapedRecipe.create({
//     data: { url, isBookmark },
//     ...query,
//   });
//   await RecipeScrapingQueue.add(bookmark.id, { url: url });
//   return bookmark;
// }

// export { scrapeRecipeFromWeb };
