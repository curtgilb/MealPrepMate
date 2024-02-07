import { Prisma, Recipe } from "@prisma/client";
import { RecipeInput } from "../types/gql.js";
import { toTitleCase } from "../util/utils.js";
import { db } from "../db.js";
import { UnitSearch } from "../search/UnitSearch.js";
import { z } from "zod";
import { IngredientSearch } from "../search/IngredientSearch.js";
import fetch from "node-fetch";
import { coerceNumeric } from "../validations/utilValidations.js";

type RecipeQuery = {
  include?: Prisma.RecipeInclude | undefined;
  select?: Prisma.RecipeSelect | undefined;
};

type RecipeNlpResponse = {
  sentence: string;
  quantity: number;
  unit: string;
  name: string;
  comment: string;
  preparation: string;
  other: string;
};

async function tagIngredients(
  ingredients: string
): Promise<RecipeNlpResponse[]> {
  const ingredientsByLine = ingredients
    .split("\n")
    .filter((sentence) => sentence);
  const body = {
    ingredients: ingredientsByLine,
    confidence: false,
  };

  const response = await fetch("http://127.0.0.1/parse", {
    method: "post",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });

  return (await response.json()) as RecipeNlpResponse[];
}

async function createRecipeIngredientsStmt(
  ingredientTxt: string | undefined | null
): Promise<
  Prisma.RecipeIngredientCreateNestedManyWithoutRecipeInput | undefined
> {
  if (!ingredientTxt) {
    return undefined;
  }
  const taggedIngredients = await tagIngredients(ingredientTxt);
  const units = new UnitSearch(await db.measurementUnit.findMany({}));
  const ingredients = new IngredientSearch(await db.ingredient.findMany({}));

  const ingredientsToCreate = taggedIngredients.map((ingredient, index) => {
    const matchingIngredient = ingredients.search(ingredient.name);
    const matchedUnit = units.search(ingredient.unit);
    console.log(ingredient.quantity);
    return {
      order: index,
      sentence: z.coerce.string().parse(ingredient.sentence),
      name: z.coerce.string().parse(ingredient.name),
      quantity: z
        .preprocess(coerceNumeric, z.number().nullish())
        .parse(ingredient.quantity),
      comment: z.coerce.string().parse(ingredient.comment),
      other: z.coerce.string().parse(ingredient.other),
      ingredient: matchingIngredient
        ? { connect: { id: matchingIngredient.id } }
        : undefined,
      unit: matchedUnit ? { connect: { id: matchedUnit.id } } : undefined,
    };
  });
  return { create: ingredientsToCreate };
}

export const recipeExtensions = Prisma.defineExtension((client) => {
  return client.$extends({
    model: {
      recipe: {
        async createRecipe(
          recipe: RecipeInput,
          query?: RecipeQuery
        ): Promise<Recipe> {
          return await client.recipe.create({
            data: {
              title: recipe.title,
              source: recipe.source,
              preparationTime: recipe.prepTime,
              cookingTime: recipe.cookTime,
              marinadeTime: recipe.marinadeTime,
              directions: recipe.directions,
              notes: recipe.notes,
              photos: {
                connect: recipe.photoIds?.map((photoId) => ({ id: photoId })),
              },
              isFavorite: recipe.isFavorite || false,
              course: {
                connect: recipe.courseIds?.map((id) => ({ id })),
              },
              category: {
                connect: recipe.categoryIds?.map((id) => ({ id })),
              },
              cuisine: {
                connect: recipe.cuisineId
                  ? { id: recipe.cuisineId }
                  : undefined,
              },
              ingredients: await createRecipeIngredientsStmt(
                recipe.ingredients
              ),
              leftoverFreezerLife: recipe.leftoverFreezerLife,
              leftoverFridgeLife: recipe.leftoverFridgeLife,
            },
            ...query,
          });
        },

        async updateRecipe(
          recipeId: string,
          recipe: RecipeInput,
          query?: RecipeQuery
        ): Promise<Recipe> {
          return await client.recipe.update({
            where: {
              id: recipeId,
            },
            data: {
              title: recipe.title ? toTitleCase(recipe.title) : undefined,
              source: recipe.source,
              preparationTime: recipe.prepTime,
              cookingTime: recipe.cookTime,
              marinadeTime: recipe.marinadeTime,
              directions: recipe.directions,
              notes: recipe.notes,

              photos: {
                set: recipe.photoIds?.map((photoId) => ({ id: photoId })),
              },
              isFavorite: recipe.isFavorite || false,
              course: {
                set: recipe.courseIds?.map((id) => ({ id })),
              },
              category: {
                set: recipe.categoryIds?.map((id) => ({ id })),
              },
              cuisine: {
                connect: recipe.cuisineId
                  ? { id: recipe.cuisineId }
                  : undefined,
              },
              leftoverFreezerLife: recipe.leftoverFreezerLife,
              leftoverFridgeLife: recipe.leftoverFridgeLife,
            },
            ...query,
          });
        },
      },
    },
  });
});
