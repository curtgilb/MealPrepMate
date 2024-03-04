import { db } from "../db.js";
import { RecipeFilter } from "../types/gql.js";
import { EntityType, Photo, Prisma } from "@prisma/client";
import { filterIngredients } from "./IngredientSearch.js";
import { filterRecipesByNutrition } from "./nutrition/NutritionAggregator.js";
import { Recipe } from "@prisma/client";
import { FullNutritionLabel } from "./nutrition/NutritionAggregator.js";

type RecipeQuery = {
  include?: Prisma.RecipeInclude | undefined;
  select?: Prisma.RecipeSelect | undefined;
};

type ExtendedRecipe = Recipe & {
  ingredientFreshness?: number;
  aggregateLabel?: FullNutritionLabel;
};

type CombinedSearch = {
  name: string;
  type: EntityType;
  servings: number;
  caloriesPerServing: number;
  photo: Photo;
};

class RecipeSearch {
  searchRecipesAndLabels(query: RecipeQuery, filter: RecipeFilter) {}
  searchRecipes(query: RecipeQuery, filter: RecipeFilter) {}
  matchRecipe() {}
}

async function searchRecipes(query: RecipeQuery, filter: RecipeFilter) {
  const recipes = await db.recipe.findMany({
    include: {
      ...query.include,
    },
    select: {
      ...query.select,
      id: true,
    },
    where: {
      OR: [
        {
          title: {
            contains: filter.searchString ?? undefined,
            mode: "insensitive",
          },
        },
        {
          source: {
            contains: filter.searchString ?? undefined,
            mode: "insensitive",
          },
        },
      ],
      course: {
        every: {
          id: { in: filter.courseIds ?? undefined },
        },
      },
      cuisine: {
        id: { in: filter.cuisineIds ?? undefined },
      },
      category: {
        every: {
          id: { in: filter.categoryIds ?? undefined },
        },
      },
      preparationTime: {
        lte: filter.prepTime?.lte ?? undefined,
        gte: filter.prepTime?.gte ?? undefined,
        equals: filter.prepTime?.eq ?? undefined,
      },
      cookingTime: {
        lte: filter.cookTime?.lte ?? undefined,
        gte: filter.cookTime?.gte ?? undefined,
        equals: filter.cookTime?.eq ?? undefined,
      },
      marinadeTime: {
        lte: filter.marinadeTime?.lte ?? undefined,
        gte: filter.marinadeTime?.gte ?? undefined,
        equals: filter.marinadeTime?.eq ?? undefined,
      },
      totalTime: {
        lte: filter.totalPrepTime?.lte ?? undefined,
        gte: filter.totalPrepTime?.gte ?? undefined,
        equals: filter.totalPrepTime?.eq ?? undefined,
      },
      isFavorite: filter.isFavorite ?? undefined,
    },
  });

  // Filter by nutrient

  // const recipeIds = recipes.map((recipe) => recipe.id);

  // const filteredByIngredients = await filterIngredients(
  //   recipeIds,
  //   filter.ingredientFilter,
  //   filter.ingredientFreshDays
  // );

  // const filteredByNutrition = await filterRecipesByNutrition(
  //   filter.nutrientFilters,
  //   filter.numOfServings,
  //   recipeIds
  // );

  // return recipes.filter(
  //   (recipe) =>
  //     !filteredByIngredients ||
  //     (filteredByIngredients.has(recipe.id) && !filteredByNutrition) ||
  //     filteredByNutrition.has(recipe.id)
  // );
}

export { ExtendedRecipe };
