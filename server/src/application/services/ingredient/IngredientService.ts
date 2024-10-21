import { db } from "@/infrastructure/repository/db.js";
import { ExpirationRule, Prisma } from "@prisma/client";

type IngredientQuery = {
  include?: Prisma.IngredientInclude | undefined;
  select?: Prisma.IngredientSelect | undefined;
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

export { getIngredientMaxFreshness, connectIngredientToExpirationRule };
