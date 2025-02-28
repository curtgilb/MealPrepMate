import { useMemo } from "react";

import {
  getNutrientTargets,
  nutrientTargetFieldsFragment,
} from "@/features/mealplan/api/NutrientTarget";
import { getFragmentData } from "@/gql/fragment-masking";
import { NutrientTargetFieldsFragment } from "@/gql/graphql";
import { useQuery } from "@urql/next";

export type NutrientTargetsResult = {
  calories: NutrientTargetFieldsFragment | undefined | null;
  fat: NutrientTargetFieldsFragment | undefined | null;
  protein: NutrientTargetFieldsFragment | undefined | null;
  alcohol: NutrientTargetFieldsFragment | undefined | null;
  carbs: NutrientTargetFieldsFragment | undefined | null;
  nutrients: Record<string, NutrientTargetFieldsFragment> | undefined;
};

export function useNutrientTargets(): NutrientTargetsResult | undefined {
  const [result] = useQuery({ query: getNutrientTargets });
  const targets = result?.data?.nutritionTargets;

  const nutrientLookup = useMemo(() => {
    return targets?.nutrients.reduce((acc, item) => {
      const nutrient = getFragmentData(nutrientTargetFieldsFragment, item);
      acc[nutrient.nutrientId] = nutrient;
      return acc;
    }, {} as Record<string, NutrientTargetFieldsFragment>);
  }, [targets]);

  if (!targets) return undefined;

  return {
    calories: getFragmentData(nutrientTargetFieldsFragment, targets.calories),
    fat: getFragmentData(nutrientTargetFieldsFragment, targets.fat),
    protein: getFragmentData(nutrientTargetFieldsFragment, targets.protein),
    alcohol: getFragmentData(nutrientTargetFieldsFragment, targets.alcohol),
    carbs: getFragmentData(nutrientTargetFieldsFragment, targets.carbs),
    nutrients: nutrientLookup,
  };
}
