"use client";
import { GenericCombobox } from "@/components/OriginalGenericBox";
import {
  FetchUnitsDocument,
  FetchUnitsQuery,
  FetchUnitsQueryVariables,
} from "@/gql/graphql";
import { useState } from "react";

export type PickerUnit = FetchUnitsQuery["units"][number];

interface UnitPickerProps {
  value: PickerUnit | null;
  onChange: (unit: PickerUnit | null) => void;
}

export function UnitPicker({ value, onChange }: UnitPickerProps) {
  return (
    <GenericCombobox<
      PickerUnit,
      FetchUnitsQuery,
      FetchUnitsQueryVariables,
      false,
      true
    >
      queryDocument={FetchUnitsDocument}
      listKey="units"
      formatLabel={(item) => item.name}
      placeholder={"Select unit..."}
      createNewOption={(newValue) => {}}
      autoFilter={true}
      multiSelect={false}
      onSelect={(unit) => {
        onChange(unit);
      }}
      value={value}
    />
  );
}
