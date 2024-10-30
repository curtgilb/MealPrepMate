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
import { ChevronsDown, ChevronsDownIcon } from "lucide-react";
import { useState } from "react";

export type ComboboxItem = { id: string; label: string; name?: string };

export interface QueryVariables {
  search: string;
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
  TData
> {
  query: TypedDocumentNode<TQuery, TVariables>; // URQL query type
  variables: TVariables;
  renderItem: (item: TData) => { id: string; label: string; name?: string };
  unwrapDataList: (data: TQuery | undefined) => TData[] | undefined | null;
  selectedItems: ComboboxItem[] | undefined | null;
  onChange: (update: ComboboxItem[]) => void;
  multiSelect: boolean;
  createNewOption?: (name: string) => void;
  autoFilter: boolean;
  placeholder?: string;
}

export function GenericCombobox<
  TQuery,
  TVariables extends QueryVariables,
  TNode
>({
  query,
  variables,
  renderItem,
  unwrapDataList,
  selectedItems,
  onChange,
  multiSelect,
  autoFilter,
  createNewOption,
  placeholder,
}: GenericComboboxProps<TQuery, TVariables, TNode>) {
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

  function handleSelect(item: ComboboxItem, selected: boolean) {
    console.log(selected);
    // Removing an item
    if (selected && selectedItems) {
      onChange(selectedItems.filter((curr) => curr.id !== item.id));
    }
    // Adding an item
    else {
      if (multiSelect && selectedItems) {
        onChange([...selectedItems, item]);
      } else {
        onChange([item]);
      }
    }
  }

  function handleOpenClose(value: boolean) {
    if (!value) {
      setSearch("");
    }
    setOpen(value);
  }
  console.log(triggerText);

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
              <ChevronsDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
              <ChevronsDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
