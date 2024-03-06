import { db } from "../db.js";
import { RecipeFilter, NumericalComparison } from "../types/gql.js";
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

const RecipeInclude =
  Prisma.validator<Prisma.RecipeDefaultArgs>()({
    include: {
      ingredients: {
        include: { ingredient: { include: { expirationRule: true } } },
      },
    }

  });

type RecipeWithRule = Prisma.RecipeGetPayload<
  typeof RecipeInclude
>;

class RecipeSearch {
  searchRecipesAndLabels(query: RecipeQuery, filter: RecipeFilter) {}
  searchRecipes(query: RecipeQuery, filter: RecipeFilter) {}
  matchRecipe() {}
}

async function searchRecipes(query: RecipeQuery, filter: RecipeFilter) {
  const recipes = await db.recipe.findMany({
    include: {
      ...query.include,
      ingredients: {
        include: { ingredient: { include: { expirationRule: true } } },
      },
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
      nutritionLabel: {
        some: {
          isPrimary: true,
          servings: {
            lte: filter.numOfServings?.lte ?? undefined,
            gte: filter.numOfServings?.lte ?? undefined,
            equals: filter.numOfServings?.lte ?? undefined,
          },
        },
      },
      course: {
        every: {
          id: { in: filter.courseIds ?? undefined },
        },
      },
      cuisine: {
        id: { in: filter.cuisineId ?? [] },
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

  recipes.filter((recipe) => {
    try {
      // Ingredient Freshness
      for (const ingredient of recipe.ingredients) {
        ingredient.
      }


      // Nutrient filters
      if (filter.nutrientFilters && filter.nutrientFilters.length > 0) {
        for (const nutrientFilter of filter.nutrientFilters) {
          passFilter(1, nutrientFilter.target);
        }
      }
    } catch (err) {
      if (err instanceof FilterError) {
        return false;
      }
    }
    return true;
  });
  // Check for nutrient filters and filter if needed

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

function passFilter(
  value: number,
  filter: NumericalComparison | null | undefined
): void {
  if (!filter) {
    return;
  }

  if (!Number.isNaN(filter.eq) && value !== filter.eq) {
    throw new FilterError(`${value} does not equal ${filter.eq}`);
  }

  if (filter.gte || filter.lte) {
    const gte = (!Number.isNaN(filter.gte) ? filter.gte : -Infinity) as number;
    const lte = (!Number.isNaN(filter.lte) ? filter.lte : Infinity) as number;

    if (value < gte && value > lte) {
      throw new FilterError(`${value} is not between ${gte} and ${lte}`);
    }
  }
}

// Define a custom error class
class FilterError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FilterError";
  }
}

export { ExtendedRecipe };
