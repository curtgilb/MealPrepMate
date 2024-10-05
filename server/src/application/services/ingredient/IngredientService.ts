import { ExpirationRule } from "@prisma/client";
import { db } from "../../infrastructure/db.js";

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

export { getIngredientMaxFreshness };
