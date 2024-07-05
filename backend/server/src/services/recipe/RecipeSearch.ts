import { Prisma, Recipe } from "@prisma/client";
import { NumericalComparison, RecipeFilter } from "../../types/gql.js";
import { db } from "../../db.js";
import { buildRecipeStmt } from "../../models/RecipeStmtBuilder.js";
import {
  buildRecipeSearchStmt,
  RecipeWithRule,
} from "../RecipeSearchStmtBuilder.js";
// import { db } from "../db.js";
// import {
//   NumericalComparison,
//   NutritionFilter,
//   RecipeFilter,
// } from "../types/gql.js";
// import { buildRecipeSearchStmt } from "./RecipeSearchStmtBuilder.js";

type RecipeQuery = {
  include?: Prisma.RecipeInclude | undefined;
  select?: Prisma.RecipeSelect | undefined;
};

type RecipeWithFreshness = Recipe & { ingredientFreshness?: number };

async function searchRecipes(
  filter: RecipeFilter | undefined | null,
  ingredientFreshness: boolean,
  query?: RecipeQuery
) {
  // No filter, return regular search stmt.
  if (!filter) {
    return await db.recipe.findMany({
      where: { verified: true },
      orderBy: { name: "desc" },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...(query as any),
    });
  } else {
    const recipes = (await db.recipe.findMany(
      await buildRecipeSearchStmt(filter, ingredientFreshness, query ?? {})
    )) as unknown as RecipeWithRule[];

    if (ingredientFreshness) {
      const filteredRecipes: RecipeWithFreshness[] = [];
      for (const recipe of recipes) {
        try {
          const days = filterMaxFreshness(recipe, filter.ingredientFreshDays);
          (recipe as RecipeWithFreshness).ingredientFreshness = days;
          filteredRecipes.push(recipe);
        } catch (e) {
          if (!(e instanceof FilterError)) {
            throw e;
          }
        }
      }
      return filteredRecipes;
    }

    return recipes;
  }
}

function filterMaxFreshness(
  recipe: RecipeWithRule,
  filter: NumericalComparison | null | undefined
): number {
  const maxIngredientLife = recipe.ingredients
    .map((ingredient) => {
      const tableLife = ingredient.ingredient?.expirationRule?.tableLife ?? 0;
      const fridgeLife = ingredient.ingredient?.expirationRule?.fridgeLife ?? 0;
      const freezerLife =
        ingredient.ingredient?.expirationRule?.freezerLife ?? 0;
      return Math.max(tableLife, fridgeLife, freezerLife);
    })
    .reduce((acc, cur) => {
      if (cur < acc) return cur;
      return acc;
    }, Infinity);

  if (filter) {
    passFilter(maxIngredientLife, filter);
  }
  return maxIngredientLife;
}

export function passFilter(
  value: number | undefined | null,
  filter: NumericalComparison | null | undefined
): void {
  if (!filter) {
    return;
  }

  const cleanedValue = value ?? 0;

  if (!Number.isNaN(filter.eq) && value !== filter.eq) {
    throw new FilterError(`${value} does not equal ${filter.eq}`);
  }

  if (filter.gte || filter.lte) {
    const gte = (!Number.isNaN(filter.gte) ? filter.gte : -Infinity) as number;
    const lte = (!Number.isNaN(filter.lte) ? filter.lte : Infinity) as number;

    if (cleanedValue < gte && cleanedValue > lte) {
      throw new FilterError(`${cleanedValue} is not between ${gte} and ${lte}`);
    }
  }
}

export class FilterError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FilterError";
  }
}

export { RecipeQuery, searchRecipes, RecipeWithFreshness };
