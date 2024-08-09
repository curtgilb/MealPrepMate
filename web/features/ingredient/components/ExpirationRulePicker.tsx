"use client";
import { Picker } from "@/components/picker";
import { ItemPickerProps } from "@/components/pickers/Picker";
import {
  expirationRuleFragment,
  getExpirationRulesQuery,
} from "@/features/ingredient/api/ExpirationRule";
import { useFragment } from "@/gql";
import {
  ExpirationRuleFieldsFragment,
  GetExpirationRulesQuery,
} from "@/gql/graphql";
import { useQuery } from "@urql/next";
import { useState } from "react";

export type ExpirationRule = GetExpirationRulesQuery["expirationRules"][number];

export function ExpirationRulePicker({
  select,
  deselect,
  selectedIds,
  placeholder,
  multiselect,
}: ItemPickerProps<ExpirationRuleFieldsFragment>) {
  const [search, setSearch] = useState<string>();
  const [result] = useQuery({
    query: getExpirationRulesQuery,
  });

  const { data, fetching, error } = result;
  const rules = useFragment(expirationRuleFragment, data?.expirationRules);

  return (
    <Picker<ExpirationRuleFieldsFragment>
      options={rules ?? []}
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
    />
  );
}
