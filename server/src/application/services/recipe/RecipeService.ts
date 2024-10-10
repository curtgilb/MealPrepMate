import { updateAggregateLabel } from "@/application/services/nutrition/AggregateLabelService.js";
import { CreateNutritionLabelInput } from "@/application/services/nutrition/NutritionLabelService.js";
import { CreateRecipeIngredientInput } from "@/application/services/recipe/RecipeIngredientService.js";
import { db } from "@/infrastructure/repository/db.js";
import { Prisma } from "@prisma/client";

type WebRecipeQuery = {
  include?: Prisma.WebScrapedRecipeInclude | undefined;
  select?: Prisma.WebScrapedRecipeSelect | undefined;
};

type RecipeQuery = {
  include?: Prisma.RecipeInclude | undefined;
  select?: Prisma.RecipeSelect | undefined;
};

export type AllowUndefinedOrNull<T> = {
  [K in keyof T]: T[K] | undefined | null;
};

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
  leftoverFridgeLife: number | undefined | null;
  leftoverFreezerLife: number | undefined | null;
  nutrition?: CreateNutritionLabelInput | undefined | null;
};

export type EditRecipeInput = Omit<
  AllowUndefinedOrNull<CreateRecipeInput>,
  "nutrition" | "ingredients"
>;

async function createRecipe(recipe: CreateRecipeInput, query?: RecipeQuery) {
  return await db.$transaction(async (tx) => {
    const createdRecipe = await db.recipe.create({
      include: {
        nutritionLabels: {
          include: { nutrients: true, servingSizeUnit: true },
        },
      },
      data: {
        name: recipe.title,
        source: recipe.source,
        preparationTime: recipe.prepTime,
        cookingTime: recipe.cookTime,
        marinadeTime: recipe.marinadeTime,
        directions: recipe.directions,
        notes: recipe.notes,
        photos: recipe.photoIds
          ? { connect: recipe.photoIds?.map((id) => ({ id })) }
          : undefined,
        course: recipe.courseIds
          ? {
              connect: recipe.courseIds.map((id) => ({
                id,
              })),
            }
          : undefined,
        category: recipe.categoryIds
          ? { connect: recipe.categoryIds.map((id) => ({ id })) }
          : undefined,
        cuisine: recipe.cuisineIds
          ? { connect: recipe.cuisineIds.map((id) => ({ id })) }
          : undefined,
        leftoverFridgeLife: recipe.leftoverFridgeLife,
        leftoverFreezerLife: recipe.leftoverFreezerLife,
        ingredients: recipe.ingredients
          ? {
              createMany: {
                data: recipe.ingredients.map((ingredient) => ({
                  sentence: ingredient.sentence,
                  quantity: ingredient.quantity,
                  order: ingredient.order,
                  unit: { connect: { id: ingredient.unitId } },
                  ingredient: { connect: { id: ingredient.ingredientId } },
                })),
              },
            }
          : undefined,
        nutritionLabels: recipe.nutrition
          ? {
              create: {
                servings: recipe.nutrition.servings,
                servingSize: recipe.nutrition.servingSize,
                servingSizeUnit: recipe.nutrition.servingSizeUnitId
                  ? { connect: { id: recipe.nutrition.servingSizeUnitId } }
                  : undefined,
                servingsUsed: recipe.nutrition.servingsUsed,
                isPrimary: true,
                nutrients: recipe.nutrition.nutrients
                  ? {
                      createMany: {
                        data: recipe.nutrition?.nutrients?.map((nutrient) => ({
                          value: nutrient.value,
                          nutrientId: nutrient.nutrientId,
                        })),
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
