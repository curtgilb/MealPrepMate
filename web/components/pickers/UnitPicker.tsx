"use client";
import { graphql } from "@/gql";
import { FetchUnitsQuery } from "@/gql/graphql";
import { useMutation, useQuery } from "@urql/next";
import { useState } from "react";
import { Picker } from "../picker";
import { ItemPickerProps } from "./Picker";

const getUnitsQuery = graphql(`
  query fetchUnits {
    units {
      id
      name
      symbol
      abbreviations
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

type UnitItem = FetchUnitsQuery["units"][number];

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
  });
  const [unitMutation, createUnit] = useMutation(createUnitMutation);
  const { data, fetching, error } = result;

  return (
    <Picker<UnitItem>
      options={data?.units ?? []}
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
      createItem={
        create
          ? (newUnitName) => {
              createUnit({ unit: { name: newUnitName, abbreviations: [] } });
            }
          : undefined
      }
    />
  );
}
