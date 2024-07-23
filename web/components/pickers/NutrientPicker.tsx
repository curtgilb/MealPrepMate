"use client";
import { SearchNutrientsQuery } from "@/gql/graphql";
import { getNutrientsForPicker } from "@/graphql/nutrition/queries";
import { useState } from "react";
import { useQuery } from "urql";
import { Picker } from "../ui/picker";
import { ItemPickerProps } from "./Picker";

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
  console.log(fetching);

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
