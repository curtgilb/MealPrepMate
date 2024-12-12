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
  children?: NutrientWithChildren[];
  depth: number;
};

interface GroupedNutrients {
  [key: string]: NutrientWithChildren[];
}

export interface UseNutrientResult {
  grouped: GroupedNutrients;
  flattened: NutrientWithChildren[];
  nutrientMap: Record<string, NutrientWithChildren>;
}

export function useNutrients(type: NutritionDisplayMode): UseNutrientResult {
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
    console.log("use nutrients use memo");
    if (!nutrients) return { grouped: {}, flattened: [], nutrientMap: {} };

    const childrenIds = new Set<string>();
    const nutrientMap: Record<string, NutrientWithChildren> = {};
    const grouped: GroupedNutrients = {};
    const flattened: NutrientWithChildren[] = [];
    const processedForFlattened = new Set<string>();

    // First pass: Create nutrient map and initialize grouped structure
    nutrients.forEach((nutrient) => {
      const nutrientWithDepth = {
        ...nutrient,
        depth: 0,
      } as NutrientWithChildren;
      nutrientMap[nutrient.id] = nutrientWithDepth;

      if (!grouped[nutrient.type]) {
        grouped[nutrient.type] = [];
      }
      grouped[nutrient.type].push(nutrientWithDepth);
    });

    // Helper function to recursively add a nutrient and its children to flattened array
    const addToFlattenedWithAncestors = (nutrientId: string) => {
      if (processedForFlattened.has(nutrientId)) return;

      const nutrient = nutrientMap[nutrientId];
      const parentId = nutrient.parentNutrientId;

      // First process parent if it exists and hasn't been processed
      if (parentId && !processedForFlattened.has(parentId)) {
        addToFlattenedWithAncestors(parentId);
      }

      // Add this nutrient if it hasn't been processed
      if (!processedForFlattened.has(nutrientId)) {
        flattened.push(nutrient);
        processedForFlattened.add(nutrientId);

        // Process children
        nutrient.children?.forEach((child) => {
          if (!processedForFlattened.has(child.id)) {
            addToFlattenedWithAncestors(child.id);
          }
        });
      }
    };

    // Second pass: Build relationships and update depths
    nutrients.forEach((nutrient) => {
      if (nutrient.parentNutrientId) {
        const parent = nutrientMap[nutrient.parentNutrientId];
        if (parent) {
          childrenIds.add(nutrient.id);
          if (!parent.children) parent.children = [];
          const child = nutrientMap[nutrient.id];
          child.depth = parent.depth + 1;
          parent.children.push(child);
        }
      }
    });

    // Build flattened array by processing all nutrients
    nutrients.forEach((nutrient) => {
      addToFlattenedWithAncestors(nutrient.id);
    });

    // Filter grouped structure
    Object.keys(grouped).forEach((type) => {
      grouped[type] = grouped[type].filter(
        (nutrient) => !childrenIds.has(nutrient.id)
      );
    });

    return {
      grouped,
      flattened,
      nutrientMap,
    };
  }, [nutrients]);
}
