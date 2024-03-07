import { ExpirationRule } from "@prisma/client";
import { db } from "../../db.js";

async function getIngredientMaxFreshness(
  recipeIdOrRules: string | ExpirationRule[]
): Promise<number | null> {
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
  return rules
    .map((rule) =>
      Math.max(rule.tableLife ?? 0, rule.freezerLife ?? 0, rule.fridgeLife ?? 0)
    )
    .reduce((min, cur) => {
      if (cur < min) {
        return cur;
      } else {
        return min;
      }
    }, Infinity);
}

export { getIngredientMaxFreshness };
