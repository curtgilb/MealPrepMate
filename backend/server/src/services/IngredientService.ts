import { db } from "../db.js";
import { Prisma } from "@prisma/client";
import { IngredientFilter, NumericalComparison } from "../types/gql.js";

const ingredientsWithExpirationRules =
  Prisma.validator<Prisma.RecipeIngredientDefaultArgs>()({
    include: { ingredient: { include: { expirationRule: true } } },
  });
type RecipeIngredientWithExpirationRule = Prisma.RecipeIngredientGetPayload<
  typeof ingredientsWithExpirationRules
>;

async function filterIngredients(
  recipeIds?: string[],
  ingredientFilter?: IngredientFilter,
  maxFreshness?: NumericalComparison
) {
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

  const ingredientsByRecipe = recipeIngredients.reduce(
    (prev, recipeIngredient) => {
      if (!prev.has(recipeIngredient.recipeId)) {
        prev.set(recipeIngredient.recipeId, {
          ingredients: [],
          mapping: new Map<string, RecipeIngredientWithExpirationRule>(),
        });
      }
      const recipeGrouping = prev.get(recipeIngredient.recipeId);
      recipeGrouping?.ingredients.push(recipeIngredient);
      recipeGrouping?.mapping.set(recipeIngredient.id, recipeIngredient);
      return prev;
    },
    new Map<
      string, // Recipe ID
      {
        ingredients: RecipeIngredientWithExpirationRule[];
        mapping: Map<string, RecipeIngredientWithExpirationRule>; // IngredientID -> ingredient
      }
    >()
  );

  const recipeId = [];
  for (const [recipeId, ingredients] of ingredientsByRecipe) {
    if (ingredientFilter) {
      if (ingredients.mapping.has(ingredientFilter.ingredientID)) {
        const matchingIngredient = ingredients.mapping.get(
          ingredientFilter.ingredientID
        );
        const matchingUnit =
          ingredientFilter.unitId &&
          ingredientFilter.unitId === matchingIngredient?.measurementUnitId;
        const qty = matchingIngredient?.quantity ?? 1;
        const acceptableValue = compareValues(qty, ingredientFilter.amount);
      }
    }
  }
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
