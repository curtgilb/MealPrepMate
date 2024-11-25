import { ChevronsDown, ChevronsDownIcon, LucideIcon } from "lucide-react";
import { useState } from "react";

import { ComboboxContent } from "@/components/combobox/ComboboxContent";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMediaQuery } from "@/hooks/use-media-query";
import { TypedDocumentNode, useQuery } from "@urql/next";

export type ComboboxItem = { id: string; label: string; name?: string };

export interface QueryVariables {
  search?: string;
  first?: number;
  [prop: string]: any;
}

function getNames(items: ComboboxItem[]) {
  return items.reduce((acc, item, index) => {
    const name = item?.name ? item.name : item.label;
    if (index === 0) {
      return name;
    } else {
      return acc.concat(`, ${name}`);
    }
  }, "");
}

export interface GenericComboboxProps<
  TQuery,
  TVariables extends QueryVariables,
  TData,
  TItem extends ComboboxItem
> {
  query: TypedDocumentNode<TQuery, TVariables>; // URQL query type
  variables: TVariables;
  renderItem: (item: TData) => TItem;
  unwrapDataList: (data: TQuery | undefined) => TData[] | undefined | null;
  selectedItems: TItem[] | undefined | null;
  onChange: (update: TItem[]) => void;
  onItemAdded?: (item: TItem) => void;
  onItemRemoved?: (item: TItem) => void;
  multiSelect: boolean;
  createNewOption?: (name: string) => void;
  autoFilter: boolean;
  placeholder?: string;
  icon?: LucideIcon;
}

export function GenericCombobox<
  TQuery,
  TVariables extends QueryVariables,
  TNode,
  TItem extends ComboboxItem
>({
  query,
  variables,
  renderItem,
  unwrapDataList,
  selectedItems,
  onChange,
  multiSelect,
  autoFilter,
  onItemAdded,
  onItemRemoved,
  createNewOption,
  icon,
  placeholder,
}: GenericComboboxProps<TQuery, TVariables, TNode, TItem>) {
  const [search, setSearch] = useState<string>("");
  const [results] = useQuery({
    variables: { ...variables, search },
    query: query,
  });
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 640px)");
  const triggerText =
    selectedItems && selectedItems.length > 0
      ? getNames(selectedItems)
      : placeholder;
  const data =
    unwrapDataList(results?.data)?.map((item) => renderItem(item)) ?? [];

  function handleSelect(item: TItem, selected: boolean) {
    // console.log("status:", selected);
    // console.log("selected:", selectedItems);
    // Removing an item
    if (selected && selectedItems) {
      // console.log("removing item:", item);
      onChange(selectedItems.filter((curr) => curr.id !== item.id));
      if (onItemRemoved) onItemRemoved(item);
    }
    // Adding an item
    else {
      if (multiSelect && selectedItems) {
        onChange([...selectedItems, item]);
      } else {
        onChange([item]);
      }

      if (onItemAdded) onItemAdded(item);
    }
  }

  function handleOpenClose(value: boolean) {
    if (!value) {
      setSearch("");
    }
    setOpen(value);
  }

  const ComboboxIcon = icon ? icon : ChevronsDownIcon;

  return (
    <>
      {isMobile ? (
        <Drawer open={open} onOpenChange={handleOpenClose}>
          <DrawerTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="justify-between font-normal"
            >
              {triggerText}
              <ComboboxIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="mt-4 border-t">
              <ComboboxContent
                items={data}
                loading={results.fetching}
                search={search}
                setSearch={setSearch}
                autoFilter={autoFilter}
                selectedItems={selectedItems}
                handleSelect={handleSelect}
                onCreate={createNewOption}
              />
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        <Popover open={open} onOpenChange={handleOpenClose}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between font-normal"
            >
              <span className="overflow-hidden">{triggerText}</span>
              <ComboboxIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <ComboboxContent
              items={data}
              loading={results.fetching}
              search={search}
              setSearch={setSearch}
              autoFilter={autoFilter}
              selectedItems={selectedItems}
              handleSelect={handleSelect}
              onCreate={createNewOption}
            />
          </PopoverContent>
        </Popover>
      )}
    </>
  );
}
