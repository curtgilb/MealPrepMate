"use client";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Dispatch, SetStateAction, useState } from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { debounce } from "lodash";

interface SearchListProps<T extends { id: string }> {
  options: T[];
  id: keyof T;
  label: keyof T;
  selectedIds: string[];
  multiselect: boolean;
  fetching: boolean;
  autoFilter: boolean;
  select: (selectedItem: T) => void;
  deselect: (deselectedItem: T) => void;
  createItem?: (value: string) => void;
  onSearchUpdate: (search: string) => void;
}

interface PickerProps<T extends { id: string }> extends SearchListProps<T> {
  placeholder: string;
}

export function Picker<T extends { id: string }>({
  options,
  id,
  label,
  autoFilter,
  multiselect,
  selectedIds,
  placeholder,
  fetching,
  onSearchUpdate,
  select,
  deselect,
  createItem,
}: PickerProps<T>) {
  const [open, setOpen] = useState(false);

  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full max-w-64 justify-between"
          >
            {placeholder}
            {multiselect ? (
              <Plus className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            ) : (
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full max-w-64 p-0">
          <SearchList<T>
            options={options}
            id={id}
            fetching={fetching}
            multiselect={multiselect}
            label={label}
            autoFilter={autoFilter}
            onSearchUpdate={onSearchUpdate}
            selectedIds={selectedIds}
            select={select}
            deselect={deselect}
            createItem={createItem}
            // setDisplayName={display}
            setOpen={setOpen}
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-[150px] justify-start">
          {placeholder}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <SearchList<T>
            selectedIds={selectedIds}
            options={options}
            multiselect={multiselect}
            fetching={fetching}
            id={id}
            label={label}
            autoFilter={autoFilter}
            onSearchUpdate={onSearchUpdate}
            select={select}
            deselect={deselect}
            createItem={createItem}
            // setDisplayName={display}
            setOpen={setOpen}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function SearchList<T extends { id: string }>({
  options,
  selectedIds,
  multiselect,
  id,
  label,
  autoFilter,
  fetching,
  onSearchUpdate,
  select,
  deselect,
  createItem,
  setOpen,
}: SearchListProps<T> & {
  setOpen: (value: boolean) => void;
}) {
  const [search, setSearch] = useState<string>("");
  const [useDefault, setUseDefault] = useState<boolean>(true);
  const debouncedUpdate = debounce((value) => {
    onSearchUpdate(value);
  }, 500);

  return (
    <Command shouldFilter={autoFilter}>
      <CommandInput
        placeholder="Search"
        onInput={(event: React.ChangeEvent<HTMLInputElement>) => {
          debouncedUpdate(event.target.value);
          setSearch(event.target.value);
        }}
      />
      <CommandList>
        <CommandEmpty>
          {{ fetching } ? (
            <Loader2 className="animate-spin" />
          ) : { createItem } ? (
            <Button variant="ghost" onClick={() => createItem(search)}>
              Create {search}
            </Button>
          ) : (
            <p>No results</p>
          )}
        </CommandEmpty>
        <CommandGroup
          heading="Suggestions"
          className={options.length === 0 ? "hidden" : ""}
        >
          {options.map((item) => {
            let isSelected = selectedIds?.includes(item[id] as string);

            return (
              <CommandItem
                key={item[id] as string}
                value={item[id] as string}
                onSelect={() => {
                  if (useDefault) setUseDefault(false);
                  if (isSelected) {
                    deselect(item);
                    // if (!multiselect) setDisplayName(undefined);
                  } else {
                    select(item);
                    // if (!multiselect) setDisplayName(item[label] as string);
                  }
                  if (!multiselect) {
                    setOpen(false);
                  }
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    isSelected ? "opacity-100" : "opacity-0"
                  )}
                />
                {item[label] as string}
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
