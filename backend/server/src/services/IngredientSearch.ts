import { db } from "../db.js";
import { Prisma } from "@prisma/client";
import { IngredientFilter, NumericalComparison } from "../types/gql.js";
import { FilterError, passFilter } from "./nutrition/NutritionAggregator.js";

const ingredientsWithExpirationRules =
  Prisma.validator<Prisma.RecipeIngredientDefaultArgs>()({
    include: { ingredient: { include: { expirationRule: true } } },
  });
type RecipeIngredientWithExpirationRule = Prisma.RecipeIngredientGetPayload<
  typeof ingredientsWithExpirationRules
>;

type IngredientMapping = Map<
  string,
  Map<string, RecipeIngredientWithExpirationRule>
>;

async function filterIngredients(
  recipeIds?: string[],
  ingredientFilter?: IngredientFilter[] | null | undefined,
  maxFreshness?: NumericalComparison | null | undefined
) {
  if (maxFreshness || ingredientFilter) {
    return undefined;
  }
  const recipeIngredients = await db.recipeIngredient.findMany({
    where: {
      recipeId: { in: recipeIds },
    },
    include: {
      ingredient: {
        include: {
          expirationRule: true,
        },
      },
    },
  });
  const ingredientsByRecipe = createIngredientMapping(recipeIngredients);

  for (const [recipeId, ingredientMapping] of ingredientsByRecipe) {
    try {
      validateMaxFreshness(
        Array.from(ingredientMapping.values()),
        maxFreshness
      );
      validateIngredients(ingredientMapping, ingredientFilter);
    } catch (error) {
      if (error instanceof FilterError) {
        ingredientsByRecipe.delete(recipeId);
        console.log(error);
      } else {
        throw error;
      }
    }
  }

  return ingredientsByRecipe;
}

function validateMaxFreshness(
  ingredients: RecipeIngredientWithExpirationRule[],
  filter: NumericalComparison | undefined | null
) {
  const maxFreshness = getMaxFreshDays(ingredients);
  if (filter && !passFilter(maxFreshness, filter)) {
    throw new FilterError("Did not pass max freshness filter");
  }
}

function validateIngredients(
  ingredients: Map<string, RecipeIngredientWithExpirationRule>,
  filters: IngredientFilter[] | null | undefined
) {
  if (filters) {
    for (const filter of filters) {
      const matchingIngredient = ingredients.get(filter.ingredientID);
      if (!matchingIngredient) {
        throw new FilterError("Doesn't pass ingredient filter");
      } else {
        if (
          filter.amount &&
          !passFilter(matchingIngredient.quantity ?? 1, filter.amount)
        )
          throw new FilterError("Did not pass ingredient qty filter");
        if (
          filter.unitId &&
          filter.unitId !== matchingIngredient.measurementUnitId
        )
          throw new FilterError("Doesn't match ingredient unit");
      }
    }
  }
}

function createIngredientMapping(
  ingredients: RecipeIngredientWithExpirationRule[]
): IngredientMapping {
  return ingredients.reduce((agg, recipeIngredient) => {
    if (!agg.has(recipeIngredient.recipeId)) {
      agg.set(
        recipeIngredient.recipeId,
        new Map<string, RecipeIngredientWithExpirationRule>()
      );
    }
    const recipeGrouping = agg.get(recipeIngredient.recipeId);
    recipeGrouping?.set(recipeIngredient.id, recipeIngredient);
    return agg;
  }, new Map<string, Map<string, RecipeIngredientWithExpirationRule>>());
}

function getMaxFreshDays(
  ingredients: RecipeIngredientWithExpirationRule[]
): number {
  let maxFreshness = Infinity;
  for (const ingredient of ingredients) {
    if (ingredient.ingredient?.expirationRule) {
      const { tableLife, fridgeLife, freezerLife } =
        ingredient.ingredient.expirationRule;
      [tableLife, fridgeLife, freezerLife].forEach((exp) => {
        if (exp && exp < maxFreshness) {
          maxFreshness = exp;
        }
      });
    }
  }
  return maxFreshness;
}

export { filterIngredients };
