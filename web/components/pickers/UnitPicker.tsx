"use client";
import { graphql } from "@/gql";
import { useMutation, useQuery } from "@urql/next";
import { Dispatch, SetStateAction, useState } from "react";
import { Label } from "../ui/label";
import { Combobox } from "../ui/picker";

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

interface PickerProps {
  value: string | undefined;
  setValue: Dispatch<SetStateAction<string | undefined>>;
  defaultValue?: string;
}

export function UnitPicker({ value, setValue, defaultValue }: PickerProps) {
  const [search, setSearch] = useState<string>();
  const [result, reexecuteQuery] = useQuery({
    query: getUnitsQuery,
    variables: { search: search, pagination: { offset: 0, take: 10 } },
  });
  const [unitMutation, createUnit] = useMutation(createUnitMutation);
  const { data, fetching, error } = result;

  return (
    <div className="grid gap-1.5">
      <Label>Unit</Label>
      {data?.units.items && (
        <Combobox<(typeof data.units.items)[0]>
          items={data.units.items}
          id="id"
          label="name"
          value={value}
          autoFilter={false}
          onSearchUpdate={setSearch}
          defaultValue={defaultValue}
          placeholder="Select unit"
          createItem={(value: string) => {
            createUnit({ unit: { name: value, abbreviations: [] } });
          }}
          setValue={setValue}
        />
      )}
    </div>
  );
}
