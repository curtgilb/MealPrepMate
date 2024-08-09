"use client";
import {
  getNutrientsQuery,
  nutritionFieldsFragment,
} from "@/features/nutrition/api/Nutrient";
import { useFragment } from "@/gql";
import { NutrientFieldsFragment } from "@/gql/graphql";
import { useQuery } from "@urql/next";
import { useMemo } from "react";

export type NutrientMap = {
  [key: string]: NutrientFieldsFragment[];
};

export function useCategorizedNutrients(advanced: boolean) {
  const [result, executeQuery] = useQuery({
    query: getNutrientsQuery,
    variables: {
      advanced: advanced,
    },
  });
  const { data, fetching, error } = result;
  const nutrients = useFragment(nutritionFieldsFragment, data?.nutrients);

  return useMemo(() => {
    if (!nutrients) return {};
    const childLookup = nutrients.reduce((acc, nutrient) => {
      if (nutrient.parentNutrientId) {
        if (!(nutrient.parentNutrientId in acc)) {
          acc[nutrient.parentNutrientId] = [];
        }
        acc[nutrient.parentNutrientId].push(nutrient);
      }
      return acc;
    }, {} as NutrientMap);

    const categories = nutrients
      .filter((nutrient) => !nutrient.parentNutrientId)
      .reduce((acc, nutrient) => {
        if (!(nutrient.type in acc)) {
          acc[nutrient.type] = [];
        }
        acc[nutrient.type].push(nutrient);
        return acc;
      }, {} as NutrientMap);

    const allNutrients = nutrients.reduce((acc, cur) => {
      acc.set(cur.id, cur);
      return acc;
    }, new Map<string, NutrientFieldsFragment>());

    return {
      // A map of nutrients with no parent id
      categorized: categories,
      // parentId -> list of nutrients with that id
      childNutrients: childLookup,
      // nutritionId -> nutrient
      all: allNutrients,
    };
  }, [nutrients]);
}
