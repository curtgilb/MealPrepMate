import { useMemo } from 'react';

import {
    basicPlanRecipeFragment, getBasicPlanRecipeInfo
} from '@/features/mealplan/api/MealPlanRecipe';
import { getFragmentData } from '@/gql';
import { BasicPlanRecipeFieldsFragment } from '@/gql/graphql';
import { useQuery } from '@urql/next';

export type UseMealPlanRecipesResult = Record<
  string,
  BasicPlanRecipeFieldsFragment
>;

export function useMealPlanRecipes(mealPlanId: string) {
  const [result] = useQuery({
    query: getBasicPlanRecipeInfo,
    variables: { mealPlanId },
    requestPolicy: "cache-first",
  });

  return useMemo(() => {
    const recipes = getFragmentData(
      basicPlanRecipeFragment,
      result?.data?.mealPlanRecipes
    );

    return recipes?.reduce((lookup, recipe) => {
      lookup[recipe.id] = recipe;
      return lookup;
    }, {} as UseMealPlanRecipesResult);
  }, [result?.data]);
}
