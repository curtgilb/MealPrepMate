"use client";
import { useMemo } from "react";

import {
  getNutrientsQuery,
  nutritionFieldsFragment,
} from "@/features/nutrition/api/Nutrient";
import { getFragmentData } from "@/gql";
import { NutrientFieldsFragment } from "@/gql/graphql";
import { useQuery } from "@urql/next";

export type NutrientMap = {
  [key: string]: NutrientFieldsFragment[];
};

export enum NutritionDisplayMode {
  Basic = "basic",
  Favorites = "favorites",
  All = "all",
}

export type NutrientWithChildren = NutrientFieldsFragment & {
  children?: NutrientFieldsFragment[];
};

// {
//   "VITAMIN": [/* array of nutrients with their children */],
//   "MINERAL": [/* array of nutrients with their children */],
//   "MACRONUTRIENT": [/* array of nutrients with their children */]
// }
interface GroupedNutrients {
  [key: string]: NutrientWithChildren[];
}

export function useNutrients(type: NutritionDisplayMode) {
  const advanced = type !== NutritionDisplayMode.Basic;
  const [result, executeQuery] = useQuery({
    query: getNutrientsQuery,
    variables: {
      advanced: advanced,
      favorites: type === NutritionDisplayMode.Favorites,
    },
  });
  const { data, fetching, error } = result;
  const nutrients = getFragmentData(nutritionFieldsFragment, data?.nutrients);

  return useMemo(() => {
    if (!nutrients) return {};

    // Initialize the result object
    const result: GroupedNutrients = {};

    // First pass: Create a map of all nutrients by type
    nutrients.forEach((nutrient) => {
      if (!result[nutrient.type]) {
        result[nutrient.type] = [];
      }
      result[nutrient.type].push({ ...nutrient });
    });

    // Second pass: Build parent-child relationships and track children
    const childrenIds = new Set<string>();
    Object.values(result).forEach((nutrientArray) => {
      nutrientArray.forEach((nutrient) => {
        if (nutrient.parentNutrientId) {
          childrenIds.add(nutrient.id);
          const parent = nutrientArray.find(
            (n) => n.id === nutrient.parentNutrientId
          );
          if (parent) {
            if (!parent.children) parent.children = [];
            parent.children.push(nutrient);
          }
        }
      });
    });

    // Final pass: Remove children from top level arrays using the Set
    Object.keys(result).forEach((type) => {
      result[type] = result[type].filter(
        (nutrient) => !childrenIds.has(nutrient.id)
      );
    });

    return result;
  }, [nutrients]);
}
