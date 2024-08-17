"use client";
import { GenericCombobox } from "@/components/OriginalGenericBox";
import {
  FetchIngredientsListDocument,
  FetchIngredientsListQuery,
  FetchIngredientsListQueryVariables,
  FetchUnitsDocument,
  FetchUnitsQuery,
  FetchUnitsQueryVariables,
} from "@/gql/graphql";
import { useState } from "react";

export type PickerIngredient =
  FetchIngredientsListQuery["ingredients"]["ingredients"][number];

type IngredientPickerProps<MultiSelect extends boolean> = {
  multiSelect: MultiSelect;
} & (MultiSelect extends true
  ? { onChange: (value: PickerIngredient[]) => void; value: PickerIngredient[] }
  : {
      onChange: (value: PickerIngredient | null) => void;
      value: PickerIngredient | null;
    });

export function IngredientPicker<MultiSelect extends boolean>({
  multiSelect,
  onChange,
  value,
}: IngredientPickerProps<MultiSelect>) {
  return (
    <GenericCombobox<
      PickerIngredient,
      FetchIngredientsListQuery,
      FetchIngredientsListQueryVariables,
      false,
      false
    >
      queryDocument={FetchIngredientsListDocument}
      listKey="ingredients.ingredients"
      formatLabel={(item) => item.name}
      placeholder={"Select ingredient..."}
      createNewOption={(newValue) => {}}
      autoFilter={false}
      multiSelect={false}
      onSelect={(ingredient) => {
        if (multiSelect) {
          (onChange as (value: PickerIngredient[]) => void)(
            ingredient as unknown as PickerIngredient[]
          );
        } else {
          (onChange as (value: PickerIngredient | null) => void)(
            ingredient as PickerIngredient | null
          );
        }
      }}
      value={
        multiSelect
          ? (value as PickerIngredient[])
          : (value as PickerIngredient | null)
      }
    />
  );
}
