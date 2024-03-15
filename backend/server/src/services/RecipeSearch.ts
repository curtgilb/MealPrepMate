import { db } from "../db.js";
import {
  RecipeFilter,
  NumericalComparison,
  NutritionFilter,
} from "../types/gql.js";
import { Prisma } from "@prisma/client";
import {
  LabelMaker,
  NutrientAggregator,
  NutrientMap,
} from "./nutrition/NutritionAggregator.js";

import { FullNutritionLabel } from "./nutrition/NutritionAggregator.js";
import { buildRecipeSearchStmt } from "./RecipeSearchStmtBuilder.js";

type RecipeQuery = {
  include?: Prisma.RecipeInclude | undefined;
  select?: Prisma.RecipeSelect | undefined;
};

const RecipeInclude = Prisma.validator<Prisma.RecipeDefaultArgs>()({
  include: {
    ingredients: {
      include: { ingredient: { include: { expirationRule: true } } },
    },
    nutritionLabels: { include: { nutrients: true, servingSizeUnit: true } },
  },
});

type RecipeWithRule = Prisma.RecipeGetPayload<typeof RecipeInclude>;

type ExtendedRecipe = RecipeWithRule & {
  ingredientFreshness?: number;
  aggregateLabel?: FullNutritionLabel;
};

type RecipeSearchArgs = {
  query: RecipeQuery;
  filter?: RecipeFilter | null;
  take: number;
  offset: number;
  aggregatedLabel: boolean;
};

async function searchRecipes(args: RecipeSearchArgs) {
  const searchStmt = buildRecipeSearchStmt(args.filter, args.query);
  const recipes = (await db.recipe.findMany(
    searchStmt
  )) as unknown as RecipeWithRule[];

  const filteredRecipes: ExtendedRecipe[] = [];
  const totalLength = args.take + args.offset;
  let i = 0;
  const nutrientAggregator = new NutrientAggregator();
  while (filteredRecipes.length < totalLength && i < recipes.length) {
    const recipe = recipes[i];
    try {
      // Ingredient Freshness
      const maxFreshness = filterMaxFreshness(
        recipe,
        args.filter?.ingredientFreshDays
      );
      // Nutrient filters
      await nutrientAggregator.addLabels(recipe.nutritionLabels, false);
      filterNutrients(
        nutrientAggregator.getNutrientMap([{ id: recipe.id }]),
        args.filter?.nutrientFilters
      );
      filteredRecipes.push({
        ...recipe,
        ingredientFreshness: maxFreshness,
      });
    } catch (err) {
      if (err instanceof FilterError) {
        console.log(err);
      } else {
        throw err;
      }
    } finally {
      i++;
    }
  }
  const totalCount = filteredRecipes.length;
  const labelMaker = new LabelMaker();
  let recipePage = filteredRecipes.slice(
    args.offset,
    args.take + args.offset - 1
  );

  if (args.aggregatedLabel) {
    recipePage = await Promise.all(
      recipePage.map(async (recipe) => {
        const nutrients = nutrientAggregator.getNutrientMap([
          { id: recipe.id },
        ]);
        const servings = nutrientAggregator.getServingInfo(recipe.id);
        recipe.aggregateLabel = await labelMaker.createLabel({
          nutrients,
          servings,
          advanced: true,
        });
        return recipe;
      })
    );
  }
  return { recipes: recipePage, totalCount };
}

function filterNutrients(
  nutrients: NutrientMap,
  filters: NutritionFilter[] | undefined | null
): NutrientMap {
  if (filters && filters.length > 0) {
    for (const nutrientFilter of filters) {
      const nutrient = nutrients.get(nutrientFilter.nutrientID);
      const valueToTest = nutrientFilter.perServing
        ? nutrient?.valuePerServing
        : nutrient?.value;
      passFilter(valueToTest, nutrientFilter.target);
    }
  }
  return nutrients;
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

function passFilter(
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

// Define a custom error class
class FilterError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FilterError";
  }
}

export { ExtendedRecipe, searchRecipes, FilterError, passFilter, RecipeQuery };
