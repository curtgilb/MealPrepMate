"use client";
import { FragmentType, graphql, useFragment } from "@/gql";
import { NutrientFieldsFragment } from "@/gql/graphql";
import { useQuery } from "@urql/next";
import { useMemo } from "react";

const nutritionFields = graphql(`
  fragment NutrientFields on Nutrient {
    id
    alternateNames
    customTarget
    dri {
      value
    }
    name
    parentNutrientId
    type
    unit {
      id
      name
      symbol
      abbreviations
    }
  }
`);

export type NutrientMap = {
  [key: string]: NutrientFieldsFragment[];
};

const getNutrientsQuery = graphql(`
  query getNutrients($advanced: Boolean!) {
    nutrients(pagination: { take: 400, offset: 0 }, advanced: $advanced) {
      items {
        ...NutrientFields
      }
    }
  }
`);

export function useNutrients(advanced: boolean) {
  const [result, executeQuery] = useQuery({
    query: getNutrientsQuery,
    variables: {
      advanced: advanced,
    },
  });
  const { data, fetching, error } = result;
  const nutrients = useFragment(nutritionFields, data?.nutrients.items);

  const childLookup = useMemo(() => {
    if (!nutrients) return {};
    return nutrients.reduce((acc, nutrient) => {
      if (nutrient.parentNutrientId) {
        if (!(nutrient.parentNutrientId in acc)) {
          acc[nutrient.parentNutrientId] = [];
        }
        acc[nutrient.parentNutrientId].push(nutrient);
      }
      return acc;
    }, {} as NutrientMap);
  }, [nutrients]);

  const groupCategory = useMemo(() => {
    if (!nutrients) return {};
    return nutrients
      .filter((nutrient) => !nutrient.parentNutrientId)
      .reduce((acc, nutrient) => {
        if (!(nutrient.type in acc)) {
          acc[nutrient.type] = [];
        }
        acc[nutrient.type].push(nutrient);
        return acc;
      }, {} as NutrientMap);
  }, [nutrients]);

  return [groupCategory, childLookup];
}
