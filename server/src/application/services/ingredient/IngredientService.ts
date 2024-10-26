import { AllOptionalPartiallyNullable } from "@/application/types/CustomTypes.js";
import { db } from "@/infrastructure/repository/db.js";
import { ExpirationRule, Prisma } from "@prisma/client";

type CreateIngredientInput = {
  name: string;
  variant?: string | null;
  alternateNames?: string[] | null;
  categoryId?: string | null;
  storageInstructions?: string | null;
  expirationRuleId?: string | null;
};

type EditIngredientInput = AllOptionalPartiallyNullable<
  CreateIngredientInput,
  "variant" | "categoryId" | "storageInstructions" | "expirationRuleId"
>;

type IngredientQuery = {
  include?: Prisma.IngredientInclude | undefined;
  select?: Prisma.IngredientSelect | undefined;
};

async function getIngredient(id: string, query?: IngredientQuery) {
  return await db.ingredient.findUniqueOrThrow({
    where: { id: id },
    ...query,
  });
}

async function getIngredients(
  search: string | undefined,
  query?: IngredientQuery
) {
  return await db.ingredient.findMany({
    where: {
      OR: search
        ? [
            {
              name: search
                ? { contains: search, mode: "insensitive" }
                : undefined,
            },
            { alternateNames: search ? { has: search } : undefined },
          ]
        : undefined,
    },
    orderBy: { name: "asc" },
    ...query,
  });
}

async function createIngredient(
  ingredient: CreateIngredientInput,
  query?: IngredientQuery
) {
  return await db.ingredient.create({
    data: {
      name: ingredient.name,
      storageInstructions: ingredient.storageInstructions,
      alternateNames: ingredient.alternateNames ?? undefined,
      category: { connect: { id: ingredient.categoryId } },
      expirationRule: ingredient.expirationRuleId
        ? { connect: { id: ingredient.expirationRuleId } }
        : undefined,
    },
    ...query,
  });
}

async function editIngredient(
  id: string,
  ingredient: EditIngredientInput,
  query?: IngredientQuery
) {
  return db.ingredient.update({
    where: { id: id },
    data: {
      name: ingredient.name ?? undefined,
      storageInstructions: ingredient.storageInstructions,
      alternateNames: ingredient.alternateNames
        ? { set: ingredient.alternateNames }
        : undefined,
      category: ingredient.categoryId
        ? { connect: { id: ingredient.categoryId } }
        : undefined,
      expirationRule: ingredient.expirationRuleId
        ? { connect: { id: ingredient.expirationRuleId } }
        : undefined,
    },
    ...query,
  });
}

async function deleteIngredient(id: string) {
  await db.ingredient.delete({
    where: { id: id },
  });
}

export {
  createIngredient,
  CreateIngredientInput,
  deleteIngredient,
  editIngredient,
  EditIngredientInput,
  getIngredient,
  getIngredients,
};

type RecipeMaxFreshness = {
  maxTableLife: number;
  maxFridgeLife: number;
  maxFreezerLife: number;
  maxLife: number;
};

async function getIngredientMaxFreshness(
  recipeIdOrRules: string | ExpirationRule[]
): Promise<RecipeMaxFreshness> {
  let rules;
  if (typeof recipeIdOrRules === "string") {
    rules = await db.expirationRule.findMany({
      where: {
        ingredients: {
          some: {
            recipeIngredient: {
              some: {
                recipeId: recipeIdOrRules,
              },
            },
          },
        },
      },
    });
  } else {
    rules = recipeIdOrRules;
  }

  const maxLife = {
    maxTableLife: Infinity,
    maxFridgeLife: Infinity,
    maxFreezerLife: Infinity,
    maxLife: Infinity,
  };
  rules.forEach((rule) => {
    const fridgeLife = rule.fridgeLife ?? 0;
    const tableLife = rule.tableLife ?? 0;
    const freezerLife = rule.freezerLife ?? 0;
    const overallMaxLife = Math.max(tableLife, fridgeLife, freezerLife);

    if (overallMaxLife < maxLife.maxLife) maxLife.maxLife = overallMaxLife;
    if (freezerLife < maxLife.maxFreezerLife)
      maxLife.maxFreezerLife = freezerLife;
    if (tableLife < maxLife.maxTableLife) maxLife.maxTableLife = tableLife;
    if (fridgeLife < maxLife.maxFridgeLife) maxLife.maxFridgeLife = fridgeLife;
  });
  return maxLife;
}

// Disconnect whatever an ingredient is linked to and reconnect to new expiration rule.
async function connectIngredientToExpirationRule(
  ruleId: string,
  ingredientId: string,
  query?: IngredientQuery
) {
  //@ts-ignore
  return await db.ingredient.update({
    where: {
      id: ingredientId,
    },
    data: {
      expirationRule: {
        connect: {
          id: ruleId,
        },
      },
    },
    ...query,
  });
}

export { connectIngredientToExpirationRule, getIngredientMaxFreshness };
