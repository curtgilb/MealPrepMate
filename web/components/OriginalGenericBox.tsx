import { ComboboxContent } from "@/components/ComboboxContent";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { FormControl, FormField } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMediaQuery } from "@/hooks/use-media-query";
import { AnyVariables, TypedDocumentNode, useQuery } from "@urql/next";
import { ChevronsUpDownIcon, Plus } from "lucide-react";
import { useState } from "react";

type DeepKeyOf<T> = T extends object
  ? {
      [K in keyof T & (string | number)]: `${K}` | `${K}.${DeepKeyOf<T[K]>}`;
    }[keyof T & (string | number)]
  : never;

type ConditionalVariables<
  T extends AnyVariables,
  U extends boolean
> = U extends true ? T & { search: string } : T;

function getNestedProperty<T>(obj: T, listKey: DeepKeyOf<T>) {
  const keys = listKey.split(".") as (keyof T)[];
  let result: any = obj;

  for (const key of keys) {
    result = result[key];
    if (result === undefined) {
      return undefined;
    }
  }

  return result;
}

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
  listKey: DeepKeyOf<TData>;
  autoFilter: AutoFilter;
  placeholder?: string;
  multiSelect: MultiSelect;
} & (MultiSelect extends true
  ? { onSelect: (value: T[]) => void; value: T[] }
  : { onSelect: (value: T | null) => void; value: T | null });

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
  let triggerText = placeholder;
  if (value && !Array.isArray(value)) {
    triggerText = formatLabel(value);
  }
  const queryVariables = (
    !autoFilter
      ? { search: inputValue, pagination: { offset: 0, take: 10 } }
      : {}
  ) as ConditionalVariables<TVariables, AutoFilter>;

  const [result] = useQuery({
    query: queryDocument,
    variables: queryVariables,
  });

  const { data, fetching, error } = result;
  const items = getNestedProperty(data, listKey) as T[] | undefined;

  function handleSelect(selectedItem: T, alreadySelected: boolean) {
    // If an arary
    if (Array.isArray(value)) {
      // Remove from array
      if (alreadySelected) {
        (onSelect as (value: T[]) => void)(
          value.filter((item) => item.id !== selectedItem.id)
        );
      }
      //   Add to array
      else {
        (onSelect as (value: T[]) => void)([...value, selectedItem]);
      }
    } else {
      if (alreadySelected) {
        (onSelect as (value: T | null) => void)(null);
      } else {
        (onSelect as (value: T | null) => void)(selectedItem);
      }
      setOpen(false);
    }
  }

  return (
    <>
      {isMobile ? (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <FormControl>
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
            </FormControl>
          </DrawerTrigger>
          <DrawerContent>
            <div className="mt-4 border-t">
              <ComboboxContent
                items={items ?? []}
                loading={fetching}
                setSearch={setInputValue}
                formatLabel={formatLabel}
                autoFilter={true}
                selectedItems={value}
                handleSelect={handleSelect}
                onCreate={() => {
                  createNewOption(inputValue);
                }}
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
              items={items ?? []}
              loading={fetching}
              setSearch={setInputValue}
              formatLabel={formatLabel}
              autoFilter={true}
              selectedItems={value}
              handleSelect={handleSelect}
              onCreate={() => {
                createNewOption(inputValue);
              }}
            />
          </PopoverContent>
        </Popover>
      )}
    </>
  );
}
