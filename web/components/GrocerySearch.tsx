"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { useQuery } from "@urql/next";
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
import { graphql } from "@/gql";
import { debounce } from "lodash";

const groceryStoreQuery = graphql(`
  query GroceryStores($search: String!) {
    stores(search: $search, pagination: { offset: 0, take: 10 }) {
      itemsRemaining
      nextOffset
      stores {
        name
        id
      }
    }
  }
`);

export function ComboboxDemo() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [search, setSearch] = React.useState("");
  const [result, reexecuteQuery] = useQuery({
    query: groceryStoreQuery,
    variables: { search: search },
  });
  const debouncedUpdate = debounce((value) => {
    setSearch(value);
  }, 500);

  const { data, fetching, error } = result;

  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? data?.stores.stores.find((framework) => framework.name === value)
                ?.name
            : "Select store..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Type a command or search..."
            onInput={(event: React.ChangeEvent<HTMLInputElement>) => {
              debouncedUpdate(event.target.value);
            }}
          />
          <CommandList>
            <CommandEmpty>
              <Button variant="ghost">Create {search}</Button>
            </CommandEmpty>
            <CommandGroup
              heading="Suggestions"
              className={
                data?.stores.stores && data.stores.stores.length === 0
                  ? "hidden"
                  : ""
              }
            >
              {data?.stores.stores.map((item) => {
                return (
                  <CommandItem
                    key={item.id}
                    value={item.name}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === item.name ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {item.name}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
