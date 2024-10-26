"use client";
import {
  getNutrientsQuery,
  nutritionFieldsFragment,
} from "@/features/nutrition/api/Nutrient";
import { getFragmentData } from "@/gql";
import { NutrientFieldsFragment } from "@/gql/graphql";
import { useQuery } from "@urql/next";
import { useMemo } from "react";

export type NutrientMap = {
  [key: string]: NutrientFieldsFragment[];
};

export enum NutritionDisplayMode {
  Basic = "basic",
  Favorites = "favorites",
  All = "all",
}

export function useNutrients(type: NutritionDisplayMode) {
  const advanced = type !== NutritionDisplayMode.Basic;
  const [result, executeQuery] = useQuery({
    query: getNutrientsQuery,
    variables: {
      advanced: advanced,
    },
  });
  const { data, fetching, error } = result;
  const nutrients = getFragmentData(nutritionFieldsFragment, data?.nutrients);

  console.log(nutrients);

  return useMemo(() => {
    if (!nutrients) return {};
    const filteredNutrients =
      type === NutritionDisplayMode.Favorites
        ? nutrients?.filter((nutrient) => nutrient.important)
        : nutrients;

    const childLookup = filteredNutrients.reduce((acc, nutrient) => {
      if (nutrient.parentNutrientId) {
        if (!(nutrient.parentNutrientId in acc)) {
          acc[nutrient.parentNutrientId] = [];
        }
        acc[nutrient.parentNutrientId].push(nutrient);
      }
      return acc;
    }, {} as NutrientMap);

    const categories = filteredNutrients
      .filter((nutrient) => !nutrient.parentNutrientId)
      .reduce((acc, nutrient) => {
        if (!(nutrient.type in acc)) {
          acc[nutrient.type] = [];
        }
        acc[nutrient.type].push(nutrient);
        return acc;
      }, {} as NutrientMap);

    const allNutrients = filteredNutrients.reduce((acc, cur) => {
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
  }, [nutrients, type]);
}
