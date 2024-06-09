import {
  GetMealPlanQuery,
  MealPlanServingsFieldFragment,
  MealRecipeFieldsFragment,
} from "@/gql/graphql";
import { FragmentType, useFragment } from "@/gql/fragment-masking";
import { useMemo } from "react";
import { mealRecipeFragment } from "@/app/mealplans/[id]/page";

type NutrientValue = {
  total: number;
  perServing: number;
};

export type Nutrients = {
  calories: NutrientValue;
  protein: NutrientValue;
  fat: NutrientValue;
  carbs: NutrientValue;
  alcohol: NutrientValue;
  servings: number;
  nutrients: Map<string, NutrientValue>;
};

export type RecipeNutrientLookup = Map<string, Nutrients>;

function scaleNutrient(
  amount: number,
  scale: number,
  servings: number
): NutrientValue {
  const totalAmount = amount * scale;
  return {
    total: totalAmount,
    perServing: totalAmount / servings,
  };
}

// This function scales and divides nutrient amount for an individual recipe
export function useRecipeLabelLookup(
  recipes: FragmentType<typeof mealRecipeFragment>[] | undefined
): RecipeNutrientLookup {
  const planRecipes = useFragment(mealRecipeFragment, recipes);
  return useMemo(() => {
    if (planRecipes) {
      return planRecipes.reduce((lookup, recipe) => {
        let nutrients;
        if (recipe.originalRecipe.aggregateLabel) {
          nutrients = recipe.originalRecipe.aggregateLabel.nutrients.reduce(
            (agg, cur) => {
              agg.set(
                cur.nutrient.id,
                scaleNutrient(cur.value, recipe.factor, recipe.totalServings)
              );
              return agg;
            },
            new Map<string, NutrientValue>()
          );
        }

        lookup.set(recipe.id, {
          calories: scaleNutrient(
            recipe.originalRecipe.aggregateLabel?.totalCalories ?? 0,
            recipe.factor,
            recipe.totalServings
          ),
          protein: scaleNutrient(
            recipe.originalRecipe.aggregateLabel?.protein ?? 0,
            recipe.factor,
            recipe.totalServings
          ),
          fat: scaleNutrient(
            recipe.originalRecipe.aggregateLabel?.fat ?? 0,
            recipe.factor,
            recipe.totalServings
          ),
          alcohol: scaleNutrient(
            recipe.originalRecipe.aggregateLabel?.alcohol ?? 0,
            recipe.factor,
            recipe.totalServings
          ),
          carbs: scaleNutrient(
            recipe.originalRecipe.aggregateLabel?.carbs ?? 0,
            recipe.factor,
            recipe.totalServings
          ),
          servings: recipe.totalServings,
          nutrients: nutrients ?? new Map<string, NutrientValue>(),
        });
        return lookup as RecipeNutrientLookup;
      }, new Map<string, Nutrients>());
    }
    return new Map<string, Nutrients>();
  }, [planRecipes]);
}

type MealPlanServings = MealPlanServingsFieldFragment[];

type SummedNutrients = {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  alcohol: number;
  servings: number;
  nutrients: Map<string, number>;
};

export function useNutrientSum(
  servings: MealPlanServings,
  lookup: RecipeNutrientLookup
): SummedNutrients {
  return useMemo(() => {
    return servings.reduce(
      (acc, serving) => {
        const recipeNutrients = lookup.get(serving.mealPlanRecipeId);
        if (recipeNutrients !== undefined) {
          acc.calories =
            acc.calories +
            recipeNutrients.calories.perServing * serving.numberOfServings;

          acc.protein =
            acc.protein +
            recipeNutrients.protein.perServing * serving.numberOfServings;

          acc.fat =
            acc.fat + recipeNutrients.fat.perServing * serving.numberOfServings;

          acc.carbs =
            acc.carbs +
            recipeNutrients.carbs.perServing * serving.numberOfServings;

          acc.alcohol =
            acc.alcohol +
            recipeNutrients.alcohol.perServing * serving.numberOfServings;

          acc.servings = acc.servings + serving.numberOfServings;

          for (const [
            nutrientId,
            value,
          ] of recipeNutrients.nutrients.entries()) {
            const prevValue = acc.nutrients.get(nutrientId) ?? 0;
            acc.nutrients.set(
              "nutrientId",
              prevValue + value.perServing * serving.numberOfServings
            );
          }
        }

        return acc;
      },
      {
        calories: 0,
        protein: 0,
        fat: 0,
        carbs: 0,
        alcohol: 0,
        servings: 0,
        nutrients: new Map<string, number>(),
      }
    );
  }, [servings, lookup]);
}
