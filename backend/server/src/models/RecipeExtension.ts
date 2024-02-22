import {
  Ingredient,
  MeasurementUnit,
  Prisma,
  Recipe,
  RecipeIngredient,
} from "@prisma/client";
import { CreateNutritionLabelInput, RecipeInput } from "../types/gql.js";
import { toTitleCase } from "../util/utils.js";
import { db } from "../db.js";
import { UnitSearch } from "../search/UnitSearch.js";
import { z } from "zod";
import { IngredientSearch } from "../search/IngredientSearch.js";
import fetch from "node-fetch";
import { coerceNumeric } from "../validations/utilValidations.js";
import { createNutritionLabelStmt } from "./NutritionExtension.js";

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

async function createRecipeCreateStmt(
  input: {
    recipe: RecipeInput;
    nutritionLabel?: CreateNutritionLabelInput;
    matchingRecipeId?: string;
  },
  units: MeasurementUnit[],
  ingredients: Ingredient[],
  verifed: boolean = false
) {
  const { recipe, nutritionLabel, matchingRecipeId } = input;
  return {
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
    cuisine: recipe.cuisineId
      ? {
          connect: { id: recipe.cuisineId },
        }
      : {},
    ingredients: await createRecipeIngredientsStmt({
      ingredientTxt: recipe.ingredients,
      matchingRecipeId,
      units,
      ingredients,
    }),
    nutritionLabel: {
      create: nutritionLabel
        ? (createNutritionLabelStmt(
            nutritionLabel,
            true
          ) as Prisma.NutritionLabelCreateWithoutRecipeInput)
        : undefined,
    },
    leftoverFreezerLife: recipe.leftoverFreezerLife,
    leftoverFridgeLife: recipe.leftoverFridgeLife,
    isVerified: verifed,
  };
}

async function getMatchingRecipeIngredients(existingRecipeId: string) {
  const ingredients = await db.recipeIngredient.findMany({
    where: { recipeId: existingRecipeId },
  });
  return ingredients.reduce((agg, ingredient) => {
    agg.set(ingredient.sentence, ingredient);
    return agg;
  }, new Map<string, RecipeIngredient>());
}

type RecipeIngredientInput = {
  ingredientTxt: string | undefined | null;
  units?: MeasurementUnit[];
  ingredients?: Ingredient[];
  matchingRecipeId?: string;
};

async function createRecipeIngredientsStmt(
  input: RecipeIngredientInput | undefined
): Promise<
  Prisma.RecipeIngredientCreateNestedManyWithoutRecipeInput | undefined
> {
  if (!input || !input.ingredientTxt) {
    return undefined;
  }

  const taggedIngredients = await tagIngredients(input.ingredientTxt);
  const unitSearch = input.units
    ? new UnitSearch(input.units)
    : new UnitSearch(await db.measurementUnit.findMany({}));

  const ingredientSearch = input.ingredients
    ? new IngredientSearch(input.ingredients)
    : new IngredientSearch(await db.ingredient.findMany({}));

  const matchingRecipe = input.matchingRecipeId
    ? await getMatchingRecipeIngredients(input.matchingRecipeId)
    : undefined;

  const stmt: Prisma.RecipeIngredientCreateWithoutRecipeInput[] = [];
  taggedIngredients.forEach((ingredient, index) => {
    const matchingRecipeIngredient = matchingRecipe?.get(ingredient.sentence);

    const matchingIngredient = matchingRecipeIngredient
      ? matchingRecipeIngredient.ingredientId
      : ingredientSearch.search(ingredient.name)?.id;

    const matchedUnit = matchingRecipeIngredient
      ? matchingRecipeIngredient.measurementUnitId
      : unitSearch.search(ingredient.unit)?.id;

    const matchedGroup = matchingRecipeIngredient?.groupId;

    stmt.push({
      order: index,
      sentence: z.coerce.string().parse(ingredient.sentence),
      name: z.coerce.string().parse(ingredient.name),
      quantity: z
        .preprocess(coerceNumeric, z.number().nullish())
        .parse(ingredient.quantity),
      comment: z.coerce.string().parse(ingredient.comment),
      other: z.coerce.string().parse(ingredient.other),
      ingredient: matchingIngredient
        ? { connect: { id: matchingIngredient } }
        : {},
      unit: matchedUnit ? { connect: { id: matchedUnit } } : {},
      group: matchedGroup ? { connect: { id: matchedGroup ?? undefined } } : {},
    });
  });
  return { create: stmt };
}

export const recipeExtensions = Prisma.defineExtension((client) => {
  return client.$extends({
    model: {
      recipe: {
        async createRecipe(recipe: RecipeInput, query?: RecipeQuery) {
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
              ingredients: await createRecipeIngredientsStmt({
                ingredientTxt: recipe.ingredients,
              }),
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
              cuisine: recipe.cuisineId
                ? { connect: { id: recipe.cuisineId } }
                : {},
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

export { createRecipeCreateStmt };
