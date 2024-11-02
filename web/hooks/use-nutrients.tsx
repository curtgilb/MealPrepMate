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

export type NutrientWithChildren = NutrientFieldsFragment & {
  children?: NutrientFieldsFragment[];
};

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
    // Create a map of parent nutrients to their children
    const parentChildMap = new Map<string, NutrientWithChildren[]>();

    // First pass: organize parent-child relationships
    nutrients.forEach((nutrient) => {
      if (nutrient.parentNutrientId) {
        if (!parentChildMap.has(nutrient.parentNutrientId)) {
          parentChildMap.set(nutrient.parentNutrientId, []);
        }
        parentChildMap.get(nutrient.parentNutrientId)?.push({
          ...nutrient,
        });
      }
    });

    // Initialize the result object
    const result: GroupedNutrients = {};

    // Process nutrients and organize them by type
    nutrients.forEach((nutrient) => {
      // Skip nutrients that are children of other passing nutrients
      if (
        nutrient.parentNutrientId &&
        nutrients.some((n) => n.id === nutrient.parentNutrientId)
      ) {
        return;
      }

      const type = nutrient.type.toUpperCase();
      if (!result[type]) {
        result[type] = [];
      }

      // Create the nutrient object with children if they exist
      const nutrientWithChildren: NutrientWithChildren = {
        ...nutrient,
      };

      if (parentChildMap.has(nutrient.id)) {
        nutrientWithChildren.children = parentChildMap.get(nutrient.id);
      }

      result[type].push(nutrientWithChildren);
    });

    return result;
  }, [nutrients]);
}
