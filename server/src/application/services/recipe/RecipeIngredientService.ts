import { z } from "zod";

import { cleanString } from "@/application/validations/Formatters.js";
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

const recipeIngredientValidation = z.object({
  order: z.number().nonnegative(),
  sentence: z.preprocess(cleanString, z.string()),
  quantity: z.number().nonnegative().nullish(),
  unitId: z.string().uuid().nullish(),
  ingredientId: z.string().uuid().nullish(),
  groupId: z.string().uuid().nullish(),
  mealPrepIngredient: z.boolean(),
  verified: z.boolean(),
});

type RecipeIngredientInput = {
  order: number;
  sentence: string;
  quantity?: number | undefined | null;
  unitId?: string | undefined | null;
  ingredientId?: string | undefined | null;
  groupId?: string | undefined | null;
  mealPrepIngredient: boolean;
  verified: boolean;
};

type RecipeIngredientQuery = {
  include?: Prisma.RecipeIngredientInclude<DefaultArgs> | undefined;
  select?: Prisma.RecipeIngredientSelect<DefaultArgs> | undefined;
};

// TODO: FIX the typescripting on this function
async function tagIngredients<T extends boolean = false>(
  ingredientList: string,
  onlyMatchingIds?: T
): Promise<T extends true ? RecipeIngredientInput[] : TaggedIngredient[]> {
  const taggedIngredients: TaggedIngredient[] = [];
  const createInputIngredients: RecipeIngredientInput[] = [];

  const parsedIngredients = await parseIngredients(ingredientList);

  for (const [index, ingredient] of parsedIngredients.entries()) {
    const bestIngredientMatch = ingredient?.name
      ? await db.ingredient.match(ingredient.name)
      : undefined;
    const bestUnitMatch = ingredient?.unit
      ? await db.measurementUnit.match(ingredient.unit)
      : undefined;
    if (!bestIngredientMatch) {
      console.log(
        `No ingredient found for ${ingredient.name} in sentence: ${ingredient.sentence}`
      );
    }

    if (!bestUnitMatch) {
      console.log(
        `No unit found for ${ingredient.unit} in sentence: ${ingredient.sentence}`
      );
    }

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
        optional: false,
      });
    }
  }

  return (
    onlyMatchingIds ? createInputIngredients : taggedIngredients
  ) as T extends true ? RecipeIngredientInput[] : TaggedIngredient[];
}

async function addRecipeIngredient(
  recipeId: string,
  ingredient: RecipeIngredientInput,
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
  ingredients: RecipeIngredientInput[],
  groupId: string | undefined,
  query?: RecipeIngredientQuery
) {
  // @ts-ignore
  return await db.recipeIngredient.createManyAndReturn({
    data: ingredients.map((ingredient) => ({
      sentence: ingredient.sentence,
      quantity: ingredient.quantity,
      order: ingredient.order,
      recipeId: recipeId,
      groupId: groupId,
      measurementUnitId: ingredient.unitId,
      ingredientId: ingredient.ingredientId,
    })),
    ...query,
  });
}

async function addRecipeIngredientsFromText({
  recipeId,
  text,
  groupId,
  query,
}: {
  recipeId: string;
  text: string;
  groupId?: string | undefined;
  query?: RecipeIngredientQuery;
}) {
  const taggedIngredients = await tagIngredients(text, true);
  return await addRecipeIngredients(
    recipeId,
    taggedIngredients,
    groupId,
    query
  );
}

type EditRecipeIngredientInput = {
  id: string;
  input: RecipeIngredientInput;
};

async function editRecipeIngredient(
  ingredient: EditRecipeIngredientInput[],
  query?: RecipeIngredientQuery
) {
  return await db.$transaction(
    ingredient.map((ing) =>
      db.recipeIngredient.update({
        where: { id: ing.id },
        data: {
          sentence: ing.input?.sentence ?? undefined,
          quantity: ing.input.quantity,
          order: ing.input.order ?? undefined,
          verified: ing.input.verified,
          mealPrepIngredient: ing.input.mealPrepIngredient,
          group: ing.input.groupId
            ? { connect: { id: ing.input.groupId } }
            : undefined,
          unit: ing.input?.unitId
            ? { connect: { id: ing.input.unitId } }
            : undefined,
          ingredient: ing.input.ingredientId
            ? { connect: { id: ing.input.ingredientId } }
            : undefined,
        },
        ...query,
      })
    )
  );
}

async function deleteRecipeIngredient(id: string) {
  await db.recipeIngredient.delete({ where: { id } });
}

async function deleteRecipeIngredients(ids: string[]) {
  await db.recipeIngredient.deleteMany({ where: { id: { in: ids } } });
}

export {
  RecipeIngredientInput,
  recipeIngredientValidation,
  addRecipeIngredient,
  addRecipeIngredients,
  deleteRecipeIngredient,
  editRecipeIngredient,
  addRecipeIngredientsFromText,
  tagIngredients,
};
