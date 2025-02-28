import { useMemo } from "react";

import {
  getMealPlanRecipeNutrition,
  planNutritionFragment,
} from "@/features/mealplan/api/MealPlanRecipe";
import { getFragmentData } from "@/gql";
import { PlanNutritionFieldsFragment } from "@/gql/graphql";
import { useQuery } from "@urql/next";

export type NutrientLabel = {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  alcohol: number;
  nutrients: Map<string, number>;
};

export type ScaledNutrients = NutrientLabel & {
  servings: number;
};

type NutrientLabelArgs = {
  macrosOnly: boolean;
  recipes?: SummedNutrientLabelArgs[];
};

export type SummedNutrientLabelArgs = {
  mealPlanRecipeId: string;
  servings: number;
};

export type CalcNutritionFunc = (args: NutrientLabelArgs) => NutrientLabel;

export type RecipeNutrientLookup = Map<string, ScaledNutrients>;

// Return type for the hook
export interface UseRecipeNutrientLookupResult {
  calculateNutrition: CalcNutritionFunc;
}

function calculateServingRatio(
  requestedServings: number,
  recipeServings: number
): number {
  if (requestedServings > recipeServings)
    throw Error(
      "Requested servings cannot be greater than total recipe servings"
    );
  return requestedServings / recipeServings;
}

function sumNutrientMaps(
  baseMap: Map<string, number>,
  additionalMap: Map<string, number>,
  ratio: number
): Map<string, number> {
  const newMap = new Map(baseMap);
  additionalMap.forEach((value, nutrientId) => {
    const currentTotal = newMap.get(nutrientId) ?? 0;
    newMap.set(nutrientId, currentTotal + value * ratio);
  });
  return newMap;
}

export function useMealPlanNutrition(
  id: string
): UseRecipeNutrientLookupResult {
  const [result] = useQuery({
    query: getMealPlanRecipeNutrition,
    variables: { mealPlanRecipeId: id },
  });

  const { data } = result;

  const recipeLookup = useMemo(() => {
    const recipes = getFragmentData(
      planNutritionFragment,
      data?.mealPlanRecipes
    );

    return recipes?.reduce((lookup, recipe) => {
      lookup.set(recipe.id, scaleRecipeNutrients(recipe));
      return lookup;
    }, new Map<string, ScaledNutrients>());
  }, [data?.mealPlanRecipes]);

  function scaleRecipeNutrients(
    recipe: PlanNutritionFieldsFragment
  ): ScaledNutrients {
    const { factor, totalServings } = recipe;
    const { aggregateLabel } = recipe.originalRecipe;

    if (!aggregateLabel) {
      return {
        calories: 0,
        protein: 0,
        fat: 0,
        alcohol: 0,
        carbs: 0,
        servings: totalServings,
        nutrients: new Map<string, number>(),
      };
    }

    return {
      calories: (aggregateLabel.totalCalories ?? 0) * factor,
      protein: (aggregateLabel.protein ?? 0) * factor,
      fat: (aggregateLabel.fat ?? 0) * factor,
      alcohol: (aggregateLabel.alcohol ?? 0) * factor,
      carbs: (aggregateLabel.carbs ?? 0) * factor,
      servings: totalServings,
      nutrients: aggregateLabel.nutrients.reduce((agg, cur) => {
        agg.set(cur.nutrient.id, cur.value * factor);
        return agg;
      }, new Map<string, number>()),
    };
  }

  function getSummedNutrientLabel({
    macrosOnly,
    recipes,
  }: NutrientLabelArgs): NutrientLabel {
    if (!recipeLookup) {
      return {
        calories: 0,
        protein: 0,
        fat: 0,
        carbs: 0,
        alcohol: 0,
        nutrients: new Map<string, number>(),
      };
    }

    const recipesToSum =
      recipes ??
      Array.from(recipeLookup.keys()).map((id) => ({
        mealPlanRecipeId: id,
        servings: recipeLookup.get(id)?.servings ?? 1,
      }));

    return recipesToSum.reduce(
      (total, { mealPlanRecipeId, servings }) => {
        const recipe = recipeLookup.get(mealPlanRecipeId);
        if (!recipe) return total;

        const servingRatio = calculateServingRatio(servings, recipe.servings);

        return {
          calories: total.calories + recipe.calories * servingRatio,
          protein: total.protein + recipe.protein * servingRatio,
          fat: total.fat + recipe.fat * servingRatio,
          carbs: total.carbs + recipe.carbs * servingRatio,
          alcohol: total.alcohol + recipe.alcohol * servingRatio,
          nutrients: macrosOnly
            ? total.nutrients
            : sumNutrientMaps(total.nutrients, recipe.nutrients, servingRatio),
        };
      },
      {
        calories: 0,
        protein: 0,
        fat: 0,
        carbs: 0,
        alcohol: 0,
        nutrients: new Map<string, number>(),
      }
    );
  }

  return { calculateNutrition: getSummedNutrientLabel };
}
