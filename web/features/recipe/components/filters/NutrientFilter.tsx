"use client";
import { graphql } from "@/gql";
import {
  NutritionFilter as NFilter,
  SearchNutrientsQuery,
} from "@/gql/graphql";
import { useQuery } from "@urql/next";
import { Dispatch, SetStateAction, useState } from "react";
import { Picker } from "@/components/ui/picker";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import NumericalFilter from "@/components/recipe/NumericalFilter";
import { FilterChildProp } from "../RecipeFilter";
import { NutrientPicker } from "@/components/pickers/NutrientPicker";

export function NutritionFilter({
  filter,
  updateFilter,
}: FilterChildProp<"nutrientFilters">) {
  const [perServing, setPerServing] = useState<boolean>(false);

  return (
    <div className="grid gap-1.5">
      <NutrientPicker
        select={(item) => {
          updateFilter("nutrientFilters", [...filter, item]);
        }}
        create={false}
        deselect={(item) => {
          updateFilter(
            "nutrientFilters",
            filter.filter((selected) => selected.id !== item.id)
          );
        }}
        selectedIds={filter.map((nutrient) => nutrient.id)}
        placeholder={"Select nutrients..."}
        multiselect={true}
      />

      {filter.map((nutrient) => {
        return (
          <div key={nutrient.id}>
            <NumericalFilter
              id={nutrient.id}
              min={nutrient.comparison?.gte}
              max={nutrient.comparison?.lte}
              name={`${nutrient.name} (${nutrient.unit.symbol})`}
              onChange={(update) => {
                filter.map((old) => {
                  if (old.id === nutrient.id) {
                    return { ...old, comparison: update };
                  } else {
                    return old;
                  }
                });
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
