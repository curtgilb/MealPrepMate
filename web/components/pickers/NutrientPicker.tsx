"use client";
import { SearchNutrientsQuery } from "@/gql/graphql";

import { useState } from "react";
import { useQuery } from "@urql/next";
import { Picker } from "../picker";
import { ItemPickerProps } from "./Picker";
import { getNutrientsForPicker } from "@/features/nutrition/api/Nutrient";

export type NutrientItem = SearchNutrientsQuery["nutrients"][number];

export function NutrientPicker({
  select,
  deselect,
  selectedIds,
  placeholder,
  multiselect,
}: ItemPickerProps<NutrientItem>) {
  const [search, setSearch] = useState<string>();
  const [result] = useQuery({
    query: getNutrientsForPicker,
  });

  const { data, fetching, error } = result;

  return (
    <Picker<NutrientItem>
      options={data?.nutrients ?? []}
      id="id"
      label="name"
      autoFilter={true}
      onSearchUpdate={setSearch}
      placeholder={placeholder}
      fetching={fetching}
      multiselect={multiselect}
      selectedIds={selectedIds}
      select={select}
      deselect={deselect}
    />
  );
}
