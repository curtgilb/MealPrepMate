"use client";
import { graphql } from "@/gql";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { useMutation, useQuery } from "@urql/next";

import { TagList } from "../ui/taglist";
import { Category } from "@/gql/graphql";
import { Label } from "../ui/label";
import { Picker } from "../picker";

const getCuisinesQuery = graphql(`
  query fetchCuisines($search: String) {
    cuisines(searchString: $search) {
      id
      name
    }
  }
`);

const createCuisineMutation = graphql(`
  mutation createCuisine($name: String!) {
    createCuisine(name: $name) {
      id
      name
    }
  }
`);

interface PickerProps {
  selectedItems: string[];
  setSelectedItems: Dispatch<SetStateAction<string[]>>;
}

export function CuisinePicker({
  selectedItems,
  setSelectedItems,
}: PickerProps) {
  const [search, setSearch] = useState<string>();
  const [result, reexecuteQuery] = useQuery({
    query: getCuisinesQuery,
    variables: { search: search },
  });
  const [cusineResult, createCuisine] = useMutation(createCuisineMutation);
  const { data, fetching, error } = result;
  const fullItems = useMemo(
    () =>
      data?.cuisines.filter((cuisine) => selectedItems.includes(cuisine.id)),
    [selectedItems, data?.cuisines]
  );

  function addItem(id: string) {
    setSelectedItems([...selectedItems, id]);
  }

  function removeItem(id: string) {
    setSelectedItems(selectedItems.filter((item) => item !== id));
  }

  return (
    <div className="grid gap-2 mb-4">
      <div className="grid gap-1.5">
        <Label>Cuisines</Label>
        {data?.cuisines && (
          <Picker<(typeof data.cuisines)[0]>
            options={data.cuisines}
            id="id"
            label="name"
            selectedItems={selectedItems}
            multiselect={true}
            autoFilter={true}
            onSearchUpdate={setSearch}
            addItem={addItem}
            removeItem={removeItem}
            placeholder="Select cuisines"
            createItem={(value: string) => {
              createCuisine({ name: value });
            }}
          />
        )}
      </div>

      {fullItems && (
        <TagList<(typeof fullItems)[0]>
          id="id"
          label="name"
          items={fullItems}
          editable={false}
          removeItem={removeItem}
        />
      )}
    </div>
  );
}
