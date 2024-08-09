"use client";
import { useState } from "react";
import { NutrientPicker } from "@/components/pickers/NutrientPicker";
import { FilterChildProp } from "../RecipeFilter";
import NumericalFilter from "@/features/recipe/components/NumericalFilter";

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
