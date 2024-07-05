"use client";
import { useFragment } from "@/gql";
import { NutrientFieldsFragment } from "@/gql/graphql";
import {
  getNutrientsQuery,
  nutritionFieldsFragment,
} from "@/graphql/nutrition/nutrients";
import { useQuery } from "@urql/next";
import { useMemo } from "react";

export function useFeaturedNutrients(advanced: boolean) {
  const [result, executeQuery] = useQuery({
    query: getNutrientsQuery,
    variables: {
      advanced: advanced,
    },
  });
  const { data, fetching, error } = result;
  const nutrients = useFragment(nutritionFieldsFragment, data?.nutrients.items);

  return useMemo(() => {
    return nutrients?.filter((nutrient) => nutrient.important);
  }, [nutrients]);
}
