import { Prisma } from "@prisma/client";
import { RecipeFilter } from "../types/gql.js";
import { RecipeQuery } from "./RecipeSearch.js";
import { merge } from "lodash-es";

const ALWAYS_INCLUDE: Prisma.RecipeInclude = {
  ingredients: {
    include: { ingredient: { include: { expirationRule: true } } },
  },
  nutritionLabels: { include: { nutrients: true, servingSizeUnit: true } },
};

function buildRecipeSearchStmt(
  filter: RecipeFilter | undefined | null,
  query: RecipeQuery
): Prisma.RecipeFindManyArgs {
  const includeStmt = merge(query.include, ALWAYS_INCLUDE);
  if (!filter)
    return {
      where: { isVerified: true },
      orderBy: { name: "desc" },
      include: includeStmt,
      ...query.select,
    };

  const stmt: Prisma.RecipeFindManyArgs = {
    include: includeStmt,
    ...query.select,
    where: {
      OR: [
        {
          name: {
            contains: "curt",
            mode: "insensitive",
          },
        },
        {
          source: {
            contains: "curt",
            mode: "insensitive",
          },
        },
      ],
      isVerified: true,
      course: {
        every: {
          id: {
            in: undefined,
          },
        },
      },
      cuisine: {
        every: {
          id: {
            in: undefined,
          },
        },
      },
      category: {
        every: {
          id: {
            in: undefined,
          },
        },
      },
      preparationTime: {
        lte: undefined,
        gte: undefined,
        equals: undefined,
      },
      cookingTime: {
        lte: undefined,
        gte: 10,
        equals: undefined,
      },
      marinadeTime: {
        lte: undefined,
        gte: undefined,
        equals: undefined,
      },
      totalTime: {
        lte: undefined,
        gte: undefined,
        equals: undefined,
      },
      isFavorite: undefined,
    },
    orderBy: {
      name: "desc",
    },
  };
  if (!filter) return stmt;
  if (stmt.where) {
    stmt.where.nutritionLabels = buildNutritionStmt(filter);
    stmt.where.ingredients = buildIngredientStmt(filter);
  }
  return stmt;
}

function buildNutritionStmt(
  filter: RecipeFilter
): Prisma.NutritionLabelListRelationFilter | undefined {
  if (filter.numOfServings) {
    return {
      some: {
        isPrimary: true,
        servings: {
          lte: filter.numOfServings.lte ?? undefined,
          gte: filter.numOfServings.gte ?? undefined,
          equals: filter.numOfServings.eq ?? undefined,
        },
      },
    };
  }
}

function buildIngredientStmt(
  filter: RecipeFilter
): Prisma.RecipeIngredientListRelationFilter | undefined {
  if (filter.ingredientFilter) {
    const orStmt: Prisma.RecipeIngredientWhereInput[] = [];
    for (const ingredient of filter.ingredientFilter) {
      orStmt.push({
        ingredientId: ingredient.ingredientID,
        quantity: ingredient.amount
          ? {
              lte: ingredient.amount.lte ?? undefined,
              gte: ingredient.amount.gte ?? undefined,
              equals: ingredient.amount.eq ?? undefined,
            }
          : undefined,
        measurementUnitId: ingredient.unitId,
      });
    }
    return {
      some: {
        OR: orStmt,
      },
    };
  }
}

export { buildRecipeSearchStmt };
