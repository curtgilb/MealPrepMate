import { GenericCombobox } from "@/components/GenericCombobox";
import { TagList } from "@/components/TagList";
import { useState } from "react";
import { AnyVariables, TypedDocumentNode } from "urql";

interface BasicMultiSelectProps<
  T extends { id: string; name: string },
  QType,
  QVariables extends AnyVariables
> {
  queryDocument: TypedDocumentNode<QType, QVariables>;
  listKey: keyof QType;
  defaultValue: T[];
  onChange: (value: T[]) => void;
}

export function BasicMultiSelect<
  T extends { id: string; name: string },
  QType,
  QVariables extends AnyVariables
>({
  queryDocument,
  listKey,
  defaultValue,
  onChange,
}: BasicMultiSelectProps<T, QType, QVariables>) {
  const [selected, setSelected] = useState<T[]>(defaultValue);
  return (
    <div>
      <GenericCombobox<T, QType, QVariables, true, true>
        queryDocument={queryDocument}
        listKey={listKey}
        formatLabel={(item) => item.name}
        placeholder="Select..."
        createNewOption={(newValue) => {
          console.log(newValue);
        }}
        autoFilter
        multiSelect={true}
        onSelect={(rule) => {
          setSelected(rule);
          onChange(rule);
        }}
        value={selected}
      />

      <TagList list={selected} />
    </div>
  );
}
