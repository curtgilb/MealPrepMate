import { GenericCombobox } from "@/components/GenericCombobox";
import { TagList } from "@/components/TagList";
import { AnyVariables, TypedDocumentNode } from "urql";

interface BasicMultiSelectProps<
  T extends { id: string; name: string },
  QType,
  QVariables extends AnyVariables
> {
  queryDocument: TypedDocumentNode<QType, QVariables>;
  listKey: keyof QType;
  value: T[];
  onChange: (value: T[]) => void;
  placeholder: string;
}

export function BasicMultiSelect<
  T extends { id: string; name: string },
  QType,
  QVariables extends AnyVariables
>({
  queryDocument,
  listKey,
  value,
  placeholder,
  onChange,
}: BasicMultiSelectProps<T, QType, QVariables>) {
  return (
    <div className="space-y-2">
      <GenericCombobox<T, QType, QVariables, true, true>
        queryDocument={queryDocument}
        listKey={listKey}
        formatLabel={(item) => item.name}
        placeholder={placeholder}
        createNewOption={(newValue) => {}}
        autoFilter
        multiSelect={true}
        onSelect={(rule) => {
          onChange(rule);
        }}
        value={value}
      />

      <TagList variant="light" list={value} />
    </div>
  );
}
