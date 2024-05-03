"use client";
import { graphql } from "@/gql";
import { useMutation, useQuery } from "@urql/next";
import { Dispatch, SetStateAction, useState } from "react";
import { Label } from "../ui/label";
import { Combobox } from "../ui/picker";
import { Separator } from "../ui/separator";

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

interface PickerProps {
  value: string | undefined;
  setValue: Dispatch<SetStateAction<string | undefined>>;
  defaultValue?: string;
}

export function IngredientPicker({
  value,
  setValue,
  defaultValue,
}: PickerProps) {
  const [search, setSearch] = useState<string>();
  const [result, reexecuteQuery] = useQuery({
    query: getIngredientList,
    variables: { search: search, pagination: { offset: 0, take: 10 } },
  });
  const [unitMutation, createIngredient] = useMutation(
    createIngredientMutation
  );
  const { data, fetching, error } = result;

  return (
    <div className="grid gap-1.5">
      <Label>Ingredient</Label>
      {data?.ingredients.ingredients && (
        <Combobox<(typeof data.ingredients.ingredients)[0]>
          items={data.ingredients.ingredients}
          id="id"
          label="name"
          value={value}
          autoFilter={false}
          onSearchUpdate={setSearch}
          defaultValue={defaultValue}
          placeholder="Select ingredient"
          createItem={(value: string) => {
            createIngredient({ ingredient: { name: value } });
          }}
          setValue={setValue}
        />
      )}
    </div>
  );
}
