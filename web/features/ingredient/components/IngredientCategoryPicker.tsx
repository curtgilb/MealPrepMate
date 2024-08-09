"use client";
import { Picker } from "@/components/picker";
import { ItemPickerProps } from "@/components/pickers/Picker";
import { getIngredientCategoryQuery } from "@/features/ingredient/api/IngredientCategory";
import { GetIngredientCategoriesQuery } from "@/gql/graphql";
import { useQuery } from "@urql/next";
import { useState } from "react";

export type IngredientCategory =
  GetIngredientCategoriesQuery["ingredientCategories"][number];

export function IngredientCategoryPicker({
  select,
  deselect,
  selectedIds,
  placeholder,
  multiselect,
}: ItemPickerProps<IngredientCategory>) {
  const [search, setSearch] = useState<string>();
  const [result] = useQuery({
    query: getIngredientCategoryQuery,
  });

  const { data, fetching, error } = result;

  return (
    <Picker<IngredientCategory>
      options={data?.ingredientCategories ?? []}
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
