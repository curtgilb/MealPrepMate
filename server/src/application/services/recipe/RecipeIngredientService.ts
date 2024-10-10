import { parseIngredients } from "@/infrastructure/IngredientParserClient.js";
import { db, DbTransactionClient } from "@/infrastructure/repository/db.js";
import {
  Ingredient,
  MeasurementUnit,
  Prisma,
  Recipe,
  RecipeIngredient,
} from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { z } from "zod";

export type TaggedIngredient = Omit<
  RecipeIngredient,
  "id" | "groupId" | "recipeId" | "measurementUnitId" | "ingredientId"
> & { unit: MeasurementUnit | null; ingredient: Ingredient | null };

export type CreateRecipeIngredientInput = {
  order: number;
  sentence: string;
  quantity: number;
  unitId: string;
  ingredientId: string;
  groupId: string;
};

export type EditRecipeIngredientInput = {
  id: string;
  order: number | null | undefined;
  sentence: string | null | undefined;
  quantity: number | null | undefined;
  unitId: string | null | undefined;
  ingredientId: string | null | undefined;
  groupId: string | null | undefined;
};

type RecipeIngredientQuery = {
  include?: Prisma.RecipeIngredientInclude<DefaultArgs> | undefined;
  select?: Prisma.RecipeIngredientSelect<DefaultArgs> | undefined;
};

async function tagIngredients(ingredientList: string) {
  const matchedIngredients: TaggedIngredient[] = [];
  const parsedIngredients = await parseIngredients(ingredientList);

  for (const [index, ingredient] of parsedIngredients.entries()) {
    const cleanedSentence = z.coerce.string().parse(ingredient.sentence);
    const bestIngredientMatch = await db.ingredient.match(ingredient.name);
    const bestUnitMatch = await db.measurementUnit.match(ingredient.unit);

    matchedIngredients.push({
      name: ingredient.name,
      sentence: cleanedSentence,
      quantity: ingredient.quantity ?? null,
      order: index,
      verified: false,
      unit: bestUnitMatch,
      ingredient: bestIngredientMatch,
    });
  }

  return matchedIngredients;
}

async function addRecipeIngredient(
  recipeId: string,
  ingredient: CreateRecipeIngredientInput,
  query?: RecipeIngredientQuery
) {
  return await db.recipeIngredient.create({
    data: {
      sentence: ingredient.sentence,
      quantity: ingredient.quantity,
      order: ingredient.order,
      recipe: { connect: { id: recipeId } },
      unit: { connect: { id: ingredient.unitId } },
      ingredient: { connect: { id: ingredient.ingredientId } },
    },
    ...query,
  });
}

async function addRecipeIngredients(
  recipeId: string,
  ingredients: CreateRecipeIngredientInput[],
  query?: RecipeIngredientQuery
) {
  return await db.recipeIngredient.createManyAndReturn({
    data: ingredients.map((ingredient) => ({
      sentence: ingredient.sentence,
      quantity: ingredient.quantity,
      order: ingredient.order,
      recipeId: recipeId,
      unit: { connect: { id: ingredient.unitId } },
      ingredient: { connect: { id: ingredient.ingredientId } },
    })),
    ...query,
  });
}

async function editRecipeIngredient(
  ingredient: EditRecipeIngredientInput,
  query?: RecipeIngredientQuery
) {
  return await db.recipeIngredient.update({
    where: { id: ingredient.id },
    data: {
      sentence: ingredient?.sentence ?? undefined,
      quantity: ingredient.quantity,
      order: ingredient.order ?? undefined,
      unit: ingredient?.unitId
        ? { connect: { id: ingredient.unitId } }
        : undefined,
      ingredient: ingredient.ingredientId
        ? { connect: { id: ingredient.ingredientId } }
        : undefined,
    },
    ...query,
  });
}

async function deleteRecipeIngredient(id: string) {
  await db.recipeIngredient.delete({ where: { id } });
}

export {
  tagIngredients,
  addRecipeIngredient,
  addRecipeIngredients,
  editRecipeIngredient,
  deleteRecipeIngredient,
};
