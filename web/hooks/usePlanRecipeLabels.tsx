import { useMemo } from "react";

import {
  getMealPlanRecipeNutrition,
  planNutritionFragment,
} from "@/features/mealplan/api/MealPlanRecipe";
import { getFragmentData } from "@/gql";
import { PlanNutritionFieldsFragment } from "@/gql/graphql";
import { useQuery } from "@urql/next";

type NutrientLabel = {
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

type SummedNutrientLabelArgs = {
  mealPlanRecipeId: string;
  servings: number;
};

export type RecipeNutrientLookup = Map<string, ScaledNutrients>;

// Return type for the hook
interface UseRecipeNutrientLookupResult {
  getSummedNutrientLabel: (
    recipes?: SummedNutrientLabelArgs[]
  ) => NutrientLabel;
}

export function useRecipeNutrientLookup(
  id: string
): UseRecipeNutrientLookupResult {
  const [result] = useQuery({
    query: getMealPlanRecipeNutrition,
    variables: { mealPlanRecipeId: id },
  });

  const { data, error, fetching } = result;
  const recipes = getFragmentData(planNutritionFragment, data?.mealPlanRecipes);

  // Separate function to calculate nutrients for a single recipe
  function scaleRecipeNutrients(
    recipe: PlanNutritionFieldsFragment
  ): ScaledNutrients {
    const scaleFactor = recipe.factor;
    const { aggregateLabel } = recipe.originalRecipe;

    const nutrients =
      aggregateLabel?.nutrients.reduce((agg, cur) => {
        agg.set(cur.nutrient.id, cur.value * recipe.factor);
        return agg;
      }, new Map<string, number>()) ?? new Map<string, number>();

    return {
      calories: (aggregateLabel?.totalCalories ?? 0) * scaleFactor,
      protein: (aggregateLabel?.protein ?? 0) * scaleFactor,
      fat: (aggregateLabel?.fat ?? 0) * scaleFactor,
      alcohol: (aggregateLabel?.alcohol ?? 0) * scaleFactor,
      carbs: (aggregateLabel?.carbs ?? 0) * scaleFactor,
      servings: recipe.totalServings,
      nutrients,
    };
  }

  const recipeLookup = useMemo(() => {
    if (!recipes) return undefined;
    return recipes.reduce((lookup, recipe) => {
      lookup.set(recipe.id, scaleRecipeNutrients(recipe));
      return lookup;
    }, new Map<string, ScaledNutrients>());
  }, [recipes]);

  function getSummedNutrientLabel(
    recipes?: SummedNutrientLabelArgs[]
  ): NutrientLabel {
    // If no recipes specified, sum all recipes in lookup
    const recipesToSum =
      recipes ??
      Array.from(recipeLookup?.keys() ?? []).map((id) => ({
        mealPlanRecipeId: id,
        servings: recipeLookup?.get(id)?.servings ?? 1,
      }));

    // Initialize empty nutrient label
    const total: NutrientLabel = {
      calories: 0,
      protein: 0,
      fat: 0,
      carbs: 0,
      alcohol: 0,
      nutrients: new Map<string, number>(),
    };

    // Sum up nutrients for all specified recipes
    recipesToSum.forEach(({ mealPlanRecipeId, servings }) => {
      const recipe = recipeLookup?.get(mealPlanRecipeId);
      if (!recipe) return;

      const servingRatio = servings / recipe.servings;

      // Sum main nutrients
      total.calories += recipe.calories * servingRatio;
      total.protein += recipe.protein * servingRatio;
      total.fat += recipe.fat * servingRatio;
      total.carbs += recipe.carbs * servingRatio;
      total.alcohol += recipe.alcohol * servingRatio;

      // Sum detailed nutrients
      recipe.nutrients.forEach((value, nutrientId) => {
        const currentTotal = total.nutrients.get(nutrientId) ?? 0;
        total.nutrients.set(nutrientId, currentTotal + value * servingRatio);
      });
    });

    return total;
  }

  return {
    getSummedNutrientLabel,
  };
}
