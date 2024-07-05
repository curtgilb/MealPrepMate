import { graphql } from "@/gql";
import { SearchNutrientsQuery } from "@/gql/graphql";
import { Picker } from "../ui/picker";
import { useState } from "react";
import { useQuery } from "urql";
import { ItemPickerProps } from "./Picker";

const getNutrients = graphql(`
  query searchNutrients {
    nutrients(advanced: true, pagination: { offset: 0, take: 200 }) {
      items {
        id
        name
        unit {
          id
          symbol
        }
        alternateNames
      }
    }
  }
`);

export type NutrientItem = SearchNutrientsQuery["nutrients"]["items"][number];

export function NutrientPicker({
  select,
  deselect,
  selectedIds,
  placeholder,
  multiselect,
}: ItemPickerProps<NutrientItem>) {
  const [search, setSearch] = useState<string>();
  const [result, reexecuteQuery] = useQuery({
    query: getNutrients,
  });

  const { data, fetching, error } = result;
  console.log(error);

  return (
    <Picker<NutrientItem>
      options={data?.nutrients.items ?? []}
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
