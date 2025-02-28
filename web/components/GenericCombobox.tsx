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

export type GenericComboboxProps<T extends { id: string }, MultiSelect> = {
  options: T[];
  formatLabel: (item: T) => string;
  createNewOption: () => void;
  autoFilter: boolean;
  placeholder?: string;
  multiSelect: MultiSelect;
  fetching: boolean;
  setSearch: (value: string) => void;
} & (MultiSelect extends true
  ? { onSelect: (value: T[]) => void; value: T[] }
  : { onSelect: (value: T | undefined) => void; value: T | undefined });

export function GenericCombobox<T extends { id: string }, MultiSelect>({
  formatLabel,
  options,
  createNewOption,
  placeholder = "Select an item...",
  autoFilter,
  onSelect,
  fetching,
  multiSelect,
  value,
  setSearch,
}: GenericComboboxProps<T, MultiSelect>) {
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 640px)");

  const itemsSelected =
    (Array.isArray(value) && value.length > 0) || value !== undefined;
  const triggerText = itemsSelected
    ? Array.isArray(value)
      ? placeholder
      : formatLabel(value)
    : placeholder;

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
        (onSelect as (value: T | undefined) => void)(undefined);
      } else {
        (onSelect as (value: T | undefined) => void)(selectedItem);
      }
      setOpen(false);
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
                items={options}
                loading={fetching}
                setSearch={setSearch}
                formatLabel={formatLabel}
                autoFilter={autoFilter}
                selectedItems={value}
                handleSelect={handleSelect}
                onCreate={createNewOption}
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
              items={options}
              loading={fetching}
              setSearch={setSearch}
              formatLabel={formatLabel}
              autoFilter={autoFilter}
              selectedItems={value}
              handleSelect={handleSelect}
              onCreate={createNewOption}
            />
          </PopoverContent>
        </Popover>
      )}
    </>
  );
}
