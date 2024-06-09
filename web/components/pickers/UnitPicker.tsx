"use client";
import { graphql } from "@/gql";
import { useMutation, useQuery } from "@urql/next";
import { Dispatch, SetStateAction, useState } from "react";
import { Label } from "../ui/label";
import { Picker } from "../ui/picker";
import { FetchUnitsQuery } from "@/gql/graphql";
import { ItemPickerProps } from "./Picker";

const getUnitsQuery = graphql(`
  query fetchUnits($search: String, $pagination: OffsetPagination!) {
    units(search: $search, pagination: $pagination) {
      items {
        id
        name
        symbol
        abbreviations
      }
      itemsRemaining
      nextOffset
    }
  }
`);

const createUnitMutation = graphql(`
  mutation createUnit($unit: CreateUnitInput!) {
    createUnit(input: $unit) {
      id
      name
      symbol
      abbreviations
    }
  }
`);

type UnitItem = FetchUnitsQuery["units"]["items"][0];

export function UnitPicker({
  select,
  deselect,
  selectedIds,
  create,
  placeholder,
  multiselect,
}: ItemPickerProps<UnitItem>) {
  const [search, setSearch] = useState<string>();
  const [result, reexecuteQuery] = useQuery({
    query: getUnitsQuery,
    variables: { search: search, pagination: { offset: 0, take: 10 } },
  });
  const [unitMutation, createUnit] = useMutation(createUnitMutation);
  const { data, fetching, error } = result;

  return (
    <Picker<UnitItem>
      options={data?.units.items ?? []}
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
    />
  );
}
