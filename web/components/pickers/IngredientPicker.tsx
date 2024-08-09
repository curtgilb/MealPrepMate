"use client";
import { graphql } from "@/gql";
import { useMutation, useQuery } from "@urql/next";
import { Dispatch, SetStateAction, useState } from "react";
import { Label } from "../ui/label";
import { Picker } from "../picker";
import { Separator } from "../ui/separator";
import { FetchIngredientsListQuery } from "@/gql/graphql";
import { ItemPickerProps } from "./Picker";

const getIngredientList = graphql(`
  query fetchIngredientsList($search: String, $pagination: OffsetPagination!) {
    ingredients(search: $search, pagination: $pagination) {
      ingredients {
        id
        name
      }
      itemsRemaining
      nextOffset
    }
  }
`);

const createIngredientMutation = graphql(`
  mutation createIngredientInList($ingredient: CreateIngredientInput!) {
    createIngredient(ingredient: $ingredient) {
      id
      name
    }
  }
`);

export type IngredientItem =
  FetchIngredientsListQuery["ingredients"]["ingredients"][0];

export function IngredientPicker({
  select,
  deselect,
  selectedIds,
  placeholder,
  create,
  multiselect,
}: ItemPickerProps<IngredientItem>) {
  const [search, setSearch] = useState<string>();
  const [result] = useQuery({
    query: getIngredientList,
    variables: { search: search, pagination: { offset: 0, take: 10 } },
  });

  const [unitMutation, createIngredient] = useMutation(
    createIngredientMutation
  );
  const { data, fetching, error } = result;

  return (
    <Picker<IngredientItem>
      options={data?.ingredients.ingredients ?? []}
      id="id"
      label="name"
      autoFilter={false}
      onSearchUpdate={setSearch}
      placeholder={placeholder}
      fetching={fetching}
      multiselect={multiselect}
      selectedIds={selectedIds}
      select={select}
      deselect={deselect}
      createItem={
        create
          ? (name) => {
              createIngredient({ ingredient: { name } });
            }
          : undefined
      }
    />
  );
}
