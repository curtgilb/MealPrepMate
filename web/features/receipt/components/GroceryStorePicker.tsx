"use client";

import { graphql } from "@/gql";
import { ItemPickerProps } from "../../../components/pickers/Picker";
import { useMutation, useQuery } from "@urql/next";
import { useState } from "react";
import { GetGroceryStoresQuery } from "@/gql/graphql";
import { Picker } from "../../../components/picker";
import {
  createStoreMutation,
  getGroceryStoresQuery,
} from "@/features/ingredient/api/GroceryStore";

export type Store = GetGroceryStoresQuery["stores"][number];

export function GroceryStorePicker({
  select,
  deselect,
  selectedIds,
  placeholder,
  create,
}: ItemPickerProps<Store>) {
  const [search, setSearch] = useState<string>();
  const [result] = useQuery({
    query: getGroceryStoresQuery,
  });
  const { data, fetching } = result;

  const [createdGroceryStore, createStore] = useMutation(createStoreMutation);

  return (
    <Picker<Store>
      options={data?.stores ?? []}
      id="id"
      label="name"
      autoFilter={true}
      onSearchUpdate={setSearch}
      placeholder={placeholder}
      fetching={fetching}
      multiselect={false}
      selectedIds={selectedIds}
      select={select}
      deselect={deselect}
      createItem={
        create
          ? (name) => {
              createStore({ name });
            }
          : undefined
      }
    />
  );
}
