"use client";
import {
  getNutrientsQuery,
  nutritionFieldsFragment,
} from "@/features/nutrition/api/Nutrient";
import { useFragment } from "@/gql";

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
  const nutrients = useFragment(nutritionFieldsFragment, data?.nutrients);

  return useMemo(() => {
    return nutrients?.filter((nutrient) => nutrient.important);
  }, [nutrients]);
}
