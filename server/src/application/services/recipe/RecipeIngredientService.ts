import { parseIngredients } from "@/infrastructure/IngredientParserClient.js";
import { db } from "@/infrastructure/repository/db.js";
import {
  Ingredient,
  MeasurementUnit,
  Prisma,
  RecipeIngredient,
} from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";

export type TaggedIngredient = Omit<
  RecipeIngredient,
  "id" | "groupId" | "recipeId" | "measurementUnitId" | "ingredientId"
> & {
  unit: MeasurementUnit | null | undefined;
  ingredient: Ingredient | null | undefined;
};

export type CreateRecipeIngredientInput = {
  order: number;
  sentence: string;
  quantity: number | undefined | null;
  unitId: string | undefined | null;
  ingredientId: string | undefined | null;
  groupId: string | undefined | null;
  mealPrepIngredient: boolean;
  verified: boolean;
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

// TODO: FIX the typescripting on this function
async function tagIngredients<T extends boolean = false>(
  ingredientList: string,
  onlyMatchingIds?: T
): Promise<
  T extends true ? CreateRecipeIngredientInput[] : TaggedIngredient[]
> {
  const taggedIngredients: TaggedIngredient[] = [];
  const createInputIngredients: CreateRecipeIngredientInput[] = [];

  const parsedIngredients = await parseIngredients(ingredientList);

  for (const [index, ingredient] of parsedIngredients.entries()) {
    const bestIngredientMatch = ingredient?.name
      ? await db.ingredient.match(ingredient.name)
      : undefined;
    const bestUnitMatch = ingredient?.unit
      ? await db.measurementUnit.match(ingredient.unit)
      : undefined;

    if (onlyMatchingIds) {
      createInputIngredients.push({
        sentence: ingredient.sentence,
        quantity: ingredient?.quantity ? ingredient.quantity : 1,
        order: index,
        verified: false,
        unitId: bestUnitMatch?.id,
        ingredientId: bestIngredientMatch?.id,
        mealPrepIngredient: false,
        groupId: undefined,
      });
    } else {
      taggedIngredients.push({
        sentence: ingredient.sentence,
        quantity: ingredient?.quantity ? ingredient.quantity : 1,
        order: index,
        verified: false,
        unit: bestUnitMatch,
        ingredient: bestIngredientMatch,
        mealPrepIngredient: false,
        name: ingredient.name ?? null,
      });
    }
  }

  return (
    onlyMatchingIds ? createInputIngredients : taggedIngredients
  ) as T extends true ? CreateRecipeIngredientInput[] : TaggedIngredient[];
}

async function addRecipeIngredient(
  recipeId: string,
  ingredient: CreateRecipeIngredientInput,
  query?: RecipeIngredientQuery
) {
  return await db.recipeIngredient.create({
    data: {
      sentence: ingredient.sentence,
      quantity: ingredient?.quantity ? ingredient.quantity : 1,
      order: ingredient.order,
      recipe: { connect: { id: recipeId } },
      unit: ingredient.unitId
        ? { connect: { id: ingredient.unitId } }
        : undefined,
      ingredient: ingredient.ingredientId
        ? { connect: { id: ingredient.ingredientId } }
        : undefined,
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
  addRecipeIngredient,
  addRecipeIngredients,
  deleteRecipeIngredient,
  editRecipeIngredient,
  tagIngredients,
};
