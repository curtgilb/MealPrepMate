"use client";
import { FragmentType, graphql, useFragment } from "@/gql";
import { NutrientFieldsFragment } from "@/gql/graphql";
import { useQuery } from "@urql/next";
import { useMemo } from "react";
import {
  getNutrientsQuery,
  nutritionFieldsFragment,
} from "@/graphql/nutrition/nutrients";

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
  const nutrients = useFragment(nutritionFieldsFragment, data?.nutrients.items);

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
      categorized: categories,
      childNutrients: childLookup,
      all: allNutrients,
    };
  }, [nutrients]);
}
