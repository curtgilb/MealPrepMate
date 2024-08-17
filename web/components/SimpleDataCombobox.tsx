import { ComboboxContent } from "@/components/ComboboxContent";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMediaQuery } from "@/hooks/use-media-query";
import { AnyVariables, TypedDocumentNode, useQuery } from "@urql/next";
import { ChevronsUpDownIcon, Plus } from "lucide-react";
import { useState } from "react";

export type GenericComboboxProps<
  T extends { id: string; name: string },
  TData,
  MultiSelect extends boolean
> = {
  queryDocument: TypedDocumentNode<TData>;
  formatLabel: (item: T) => string;
  createNewOption: (input: string) => void;
  listKey: keyof TData;
  placeholder?: string;
  multiSelect: MultiSelect;
} & (MultiSelect extends true
  ? { onSelect: (value: T[]) => void; value: T[] }
  : { onSelect: (value: T | undefined) => void; value: T | undefined });

export function GenericCombobox<
  T extends { id: string; name: string },
  TData,
  MultiSelect extends boolean,
  AutoFilter extends boolean
>({
  queryDocument,
  listKey,
  formatLabel,
  createNewOption,
  placeholder = "Select an item...",
  onSelect,
  multiSelect,
  value,
}: GenericComboboxProps<T, TData, MultiSelect>) {
  const [selected, setSelected] = useState<T>();
  const [result] = useQuery({
    query: queryDocument,
    variables: {},
  });

  const { data, fetching, error } = result;

  return <></>;
}
