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

type ConditionalVariables<
  T extends AnyVariables,
  U extends boolean
> = U extends true ? T & { search: string } : T;

export type GenericComboboxProps<
  T extends { id: string },
  TData,
  TVariables extends AnyVariables,
  MultiSelect extends boolean,
  AutoFilter extends boolean
> = {
  queryDocument: TypedDocumentNode<
    TData,
    ConditionalVariables<TVariables, AutoFilter>
  >;
  formatLabel: (item: T) => string;
  createNewOption: (input: string) => void;
  listKey: keyof TData;
  autoFilter: AutoFilter;
  placeholder?: string;
  multiSelect: MultiSelect;
} & (MultiSelect extends true
  ? { onSelect: (value: T[]) => void; value: T[] }
  : { onSelect: (value: T | undefined) => void; value: T | undefined });

export function GenericCombobox<
  T extends { id: string },
  TData,
  TVariables extends AnyVariables,
  MultiSelect extends boolean,
  AutoFilter extends boolean
>({
  queryDocument,
  listKey,
  formatLabel,
  createNewOption,
  placeholder = "Select an item...",
  autoFilter,
  onSelect,
  multiSelect,
  value,
}: GenericComboboxProps<T, TData, TVariables, MultiSelect, AutoFilter>) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const isMobile = useMediaQuery("(max-width: 640px)");

  const itemsSelected =
    (Array.isArray(value) && value.length > 0) || value !== undefined;
  const triggerText = itemsSelected
    ? Array.isArray(value)
      ? placeholder
      : formatLabel(value)
    : placeholder;

  const queryVariables = (
    autoFilter ? { search: inputValue } : {}
  ) as ConditionalVariables<TVariables, AutoFilter>;

  const [result] = useQuery({
    query: queryDocument,
    variables: queryVariables,
  });

  const { data, fetching, error } = result;

  function handleSelect(selectedItem: T, alreadySelected: boolean) {
    // If an arary
    if (Array.isArray(value)) {
      // Remove from array
      if (alreadySelected) {
        (onSelect as (value: T[]) => void)(
          value.filter((item) => item.id === selectedItem.id)
        );
      }
      //   Add to array
      else {
        (onSelect as (value: T[]) => void)([...value, selectedItem]);
      }
    } else {
      if (alreadySelected) {
        (onSelect as (value: T | undefined) => void)(undefined);
      } else {
        (onSelect as (value: T | undefined) => void)(selectedItem);
      }
    }
  }

  return (
    <>
      {isMobile ? (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="justify-between"
            >
              {triggerText}
              {multiSelect ? (
                <Plus className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              ) : (
                <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              )}
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="mt-4 border-t">
              <ComboboxContent
                items={data ? (data[listKey] as T[]) : []}
                loading={fetching}
                setSearch={setInputValue}
                formatLabel={formatLabel}
                autoFilter={true}
                selectedItems={value}
                handleSelect={handleSelect}
              />
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="max-w-56 w-full justify-between"
            >
              {triggerText}
              {multiSelect ? (
                <Plus className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              ) : (
                <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full max-w-64 p-0">
            <ComboboxContent
              items={data ? (data[listKey] as T[]) : []}
              loading={fetching}
              setSearch={setInputValue}
              formatLabel={formatLabel}
              autoFilter={true}
              selectedItems={value}
              handleSelect={handleSelect}
            />
          </PopoverContent>
        </Popover>
      )}
    </>
  );
}
