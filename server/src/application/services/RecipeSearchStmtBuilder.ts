import { Prisma } from "@prisma/client";
import { merge } from "lodash-es";
import { db } from "../infrastructure/db.js";
import {
  IngredientFilter,
  NutritionFilter,
  RecipeFilter,
} from "../types/gql.js";
import { RecipeQuery } from "./recipe/RecipeSearch.js";

const FRESHNESS_INCLUDE: Prisma.RecipeInclude = {
  ingredients: {
    include: { ingredient: { include: { expirationRule: true } } },
  },
};

const RecipeInclude = Prisma.validator<Prisma.RecipeDefaultArgs>()({
  include: {
    ingredients: {
      include: { ingredient: { include: { expirationRule: true } } },
    },
  },
});

export type RecipeWithRule = Prisma.RecipeGetPayload<typeof RecipeInclude>;

async function buildRecipeSearchStmt(
  filter: RecipeFilter,
  ingredientFreshness: boolean,
  query: RecipeQuery
): Promise<Prisma.RecipeFindManyArgs> {
  const aggLabelIds = await getLabelsWithNutrients(filter.nutrientFilters);
  const recipeIds = await filterRecipeIdsByIngredients(filter.ingredientFilter);
  if (ingredientFreshness) {
    query.include = merge(query.include, FRESHNESS_INCLUDE);
  }

  const stmt: Prisma.RecipeFindManyArgs = {
    ...query,
    where: {
      id: recipeIds ? { in: recipeIds } : undefined,
      // Search in source and name for search text
      // OR: [
      //   {
      //     name: {
      //       contains: filter.searchString ?? undefined,
      //       mode: "insensitive",
      //     },
      //   },
      //   {
      //     source: {
      //       contains: filter.searchString ?? undefined,
      //       mode: "insensitive",
      //     },
      //   },
      // ],
      // Only return recipes that have been verified
      verified: true,
      course: filter.courseIds
        ? {
            every: {
              id: {
                in: filter.courseIds,
              },
            },
          }
        : undefined,
      cuisine: filter.cuisineId
        ? {
            every: {
              id: {
                in: filter.cuisineId,
              },
            },
          }
        : undefined,
      category: filter.categoryIds
        ? {
            every: {
              id: {
                in: filter.categoryIds,
              },
            },
          }
        : undefined,
      preparationTime: filter.prepTime
        ? {
            lte: filter.prepTime.lte ?? undefined,
            gte: filter.prepTime.gte ?? undefined,
            equals: filter.prepTime.eq ?? undefined,
          }
        : undefined,
      cookingTime: filter.cookTime
        ? {
            lte: filter.cookTime.lte ?? undefined,
            gte: filter.cookTime.gte ?? undefined,
            equals: filter.cookTime.eq ?? undefined,
          }
        : undefined,
      marinadeTime: filter.marinadeTime
        ? {
            lte: filter.marinadeTime.lte ?? undefined,
            gte: filter.marinadeTime.gte ?? undefined,
            equals: filter.marinadeTime.eq ?? undefined,
          }
        : undefined,
      totalTime: filter.totalPrepTime
        ? {
            lte: filter.totalPrepTime?.lte ?? undefined,
            gte: filter.totalPrepTime?.gte ?? undefined,
            equals: filter.totalPrepTime?.eq ?? undefined,
          }
        : undefined,
      leftoverFridgeLife: filter?.leftoverFridgeLife
        ? {
            lte: filter.leftoverFridgeLife?.lte ?? undefined,
            gte: filter.leftoverFridgeLife?.gte ?? undefined,
            equals: filter.leftoverFridgeLife?.eq ?? undefined,
          }
        : undefined,
      leftoverFreezerLife: filter?.leftoverFreezerLife
        ? {
            lte: filter.leftoverFreezerLife?.lte ?? undefined,
            gte: filter.leftoverFreezerLife?.gte ?? undefined,
            equals: filter.leftoverFreezerLife?.eq ?? undefined,
          }
        : undefined,
      aggregateLabel: {
        id: aggLabelIds ? { in: aggLabelIds } : undefined,
        servings: filter.numOfServings
          ? {
              lte: filter.numOfServings?.lte ?? undefined,
              gte: filter.numOfServings?.gte ?? undefined,
              equals: filter.numOfServings?.eq ?? undefined,
            }
          : undefined,
        caloriesPerServing: filter.macroFilter?.caloriePerServing
          ? {
              lte: filter.macroFilter.caloriePerServing?.lte ?? undefined,
              gte: filter.macroFilter.caloriePerServing?.gte ?? undefined,
              equals: filter.macroFilter.caloriePerServing?.eq ?? undefined,
            }
          : undefined,
        carbs: filter.macroFilter?.carbPerServing
          ? {
              lte: filter.macroFilter.carbPerServing?.lte ?? undefined,
              gte: filter.macroFilter.carbPerServing?.gte ?? undefined,
              equals: filter.macroFilter.carbPerServing?.eq ?? undefined,
            }
          : undefined,
        fat: filter.macroFilter?.fatPerServing
          ? {
              lte: filter.macroFilter.fatPerServing?.lte ?? undefined,
              gte: filter.macroFilter.fatPerServing?.gte ?? undefined,
              equals: filter.macroFilter.fatPerServing?.eq ?? undefined,
            }
          : undefined,
        alcohol: filter.macroFilter?.alcoholPerServing
          ? {
              lte: filter.macroFilter.alcoholPerServing?.lte ?? undefined,
              gte: filter.macroFilter.alcoholPerServing?.gte ?? undefined,
              equals: filter.macroFilter.alcoholPerServing?.eq ?? undefined,
            }
          : undefined,
        protein: filter.macroFilter?.protienPerServing
          ? {
              lte: filter.macroFilter.protienPerServing?.lte ?? undefined,
              gte: filter.macroFilter.protienPerServing?.gte ?? undefined,
              equals: filter.macroFilter.protienPerServing?.eq ?? undefined,
            }
          : undefined,
      },
    },
    orderBy: {
      name: "desc",
    },
  };

  return stmt;
}

async function getLabelsWithNutrients(
  filter: NutritionFilter[] | undefined | null
) {
  if (filter) {
    const result = await db.aggLabelNutrient.groupBy({
      by: ["aggLabelId"],
      where: {
        OR: filter.map((filter) => {
          const condition: Prisma.AggLabelNutrientWhereInput = {
            nutrientId: filter.nutrientId,
          };
          const num: Prisma.FloatFilter<"AggLabelNutrient"> = {
            lte: filter.target.lte ?? undefined,
            gte: filter.target.gte ?? undefined,
            equals: filter.target.eq ?? undefined,
          };
          if (filter.perServing) {
            condition.valuePerServing = num;
          } else {
            condition.value = num;
          }
          return condition;
        }),
      },
      having: {
        nutrientId: {
          _count: { gte: filter.length },
        },
      },
    });
    return result.map((label) => label.aggLabelId);
  }
  return undefined;
}

async function filterRecipeIdsByIngredients(
  filters: IngredientFilter[] | undefined | null
) {
  if (filters) {
    const results = await db.recipeIngredient.groupBy({
      by: "recipeId",
      where: {
        OR: filters.map((filter) => {
          return {
            ingredientId: filter.ingredientID,
            quantity: filter.amount
              ? {
                  gte: filter.amount.gte ?? undefined,
                  lte: filter.amount.lte ?? undefined,
                  equals: filter.amount.eq ?? undefined,
                }
              : undefined,
            measurementUnitId: filter.unitId ? filter.unitId : undefined,
          };
        }),
      },
      having: {
        ingredientId: {
          _count: { gte: filters.length },
        },
      },
    });

    return results.map((ingredient) => ingredient.recipeId);
  }
  return undefined;
}

export { buildRecipeSearchStmt };

// const result = await buildNutritionStmt([
//   {
//     nutrientId: "clt6dqtz90000awv9anfb343o",
//     perServing: false,
//     target: { gte: 200 },
//   },
// ]);
// console.log(result);
