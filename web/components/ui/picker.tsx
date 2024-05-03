"use client";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Dispatch, SetStateAction, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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

interface SearchListProps<T> {
  items: T[];
  id: keyof T;
  label: keyof T;
  value: string | string[] | undefined;
  defaultValue?: string | string[];
  autoFilter: boolean;
  setValue:
    | Dispatch<SetStateAction<string | undefined>>
    | Dispatch<SetStateAction<string[] | undefined>>;
  createItem?: (value: string) => void;
  onSearchUpdate: (search: string) => void;
}

interface ComboxboxProps<T> extends SearchListProps<T> {
  placeholder: string;
}

export function Combobox<T>({
  items,
  id,
  label,
  defaultValue,
  autoFilter,
  value,
  placeholder,
  onSearchUpdate,
  setValue,
  createItem,
}: ComboxboxProps<T>) {
  const [open, setOpen] = useState(false);
  const [displayName, setDisplayName] = useState<string>();
  const isMultiselect = Array.isArray(value);
  let display = displayName && !isMultiselect ? displayName : placeholder;

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
            {display}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full max-w-64 p-0">
          <SearchList<T>
            items={items}
            value={value}
            id={id}
            label={label}
            defaultValue={defaultValue}
            autoFilter={autoFilter}
            onSearchUpdate={onSearchUpdate}
            setValue={setValue}
            createItem={createItem}
            setDisplayName={setDisplayName}
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
          {display}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <SearchList<T>
            items={items}
            value={value}
            id={id}
            label={label}
            defaultValue={defaultValue}
            autoFilter={autoFilter}
            onSearchUpdate={onSearchUpdate}
            setValue={setValue}
            createItem={createItem}
            setDisplayName={setDisplayName}
            setOpen={setOpen}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function SearchList<T>({
  items,
  value,
  defaultValue,
  id,
  label,
  autoFilter,
  onSearchUpdate,
  setValue,
  createItem,
  setDisplayName,
  setOpen,
}: SearchListProps<T> & {
  setDisplayName: (value: string | undefined) => void;
  setOpen: (value: boolean) => void;
}) {
  const [search, setSearch] = useState<string>("");
  const [useDefault, setUseDefault] = useState<boolean>(true);
  const isMultiselect = Array.isArray(value);
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
          {createItem ? (
            <Button variant="ghost" onClick={() => createItem(search)}>
              Create {search}
            </Button>
          ) : (
            <p>No results</p>
          )}
        </CommandEmpty>
        <CommandGroup
          heading="Suggestions"
          className={items.length === 0 ? "hidden" : ""}
        >
          {items.map((item) => {
            let isSelected = false;
            if (useDefault && defaultValue && item[id] === defaultValue) {
              isSelected = true;
            } else if (!isMultiselect && item[id] === value) {
              isSelected = true;
            } else if (
              isMultiselect &&
              value.find((selectedItem) => selectedItem === item[id])
            ) {
              isSelected = true;
            }

            return (
              <CommandItem
                key={item[id] as string}
                value={item[id] as string}
                onSelect={(id) => {
                  if (useDefault) setUseDefault(false);
                  if (isSelected) {
                    if (isMultiselect) {
                      (setValue as Dispatch<SetStateAction<string[]>>)(
                        value.filter((item) => item !== id)
                      );
                    } else {
                      (
                        setValue as Dispatch<SetStateAction<string | undefined>>
                      )(undefined);
                      setDisplayName(undefined);
                      setOpen(false);
                    }
                  } else {
                    if (isMultiselect) {
                      (setValue as Dispatch<SetStateAction<string[]>>)([
                        ...value,
                        id,
                      ]);
                    } else {
                      (setValue as Dispatch<SetStateAction<string>>)(id);
                      setDisplayName(item[label] as string);
                      setOpen(false);
                    }
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
