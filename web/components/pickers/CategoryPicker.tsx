"use client";
import { graphql } from "@/gql";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { useMutation, useQuery } from "@urql/next";

import { TagList } from "../ui/taglist";
import { Category } from "@/gql/graphql";
import { Label } from "../ui/label";
import { Picker } from "../ui/picker";

const getCategoriesQuery = graphql(`
  query fetchCategories($search: String) {
    categories(searchString: $search) {
      id
      name
    }
  }
`);

const createCategoryMutation = graphql(`
  mutation createCategory($name: String!) {
    createCategory(name: $name) {
      id
      name
    }
  }
`);

interface PickerProps {
  selectedItems: string[];
  setSelectedItems: Dispatch<SetStateAction<string[]>>;
}

export function CategoryPicker({
  selectedItems,
  setSelectedItems,
}: PickerProps) {
  const [search, setSearch] = useState<string>();
  const [result, reexecuteQuery] = useQuery({
    query: getCategoriesQuery,
    variables: { search: search },
  });
  const [categoryResult, createCategory] = useMutation(createCategoryMutation);
  const { data, fetching, error } = result;
  const fullItems = useMemo(
    () =>
      data?.categories.filter((category) =>
        selectedItems.includes(category.id)
      ),
    [selectedItems, data?.categories]
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
        <Label>Categories</Label>
        {data?.categories && (
          <Picker<(typeof data.categories)[0]>
            options={data.categories}
            id="id"
            label="name"
            selectedItems={selectedItems}
            multiselect={true}
            autoFilter={true}
            onSearchUpdate={setSearch}
            addItem={addItem}
            removeItem={removeItem}
            placeholder="Select categories"
            createItem={(value: string) => {
              createCategory({ name: value });
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
