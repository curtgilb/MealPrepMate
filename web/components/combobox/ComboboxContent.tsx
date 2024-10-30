import { ComboboxItem } from "@/components/combobox/GenericCombox1";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { debounce } from "lodash";
import { Check, Loader2 } from "lucide-react";

interface ComboboxContentProps {
  items: ComboboxItem[];
  loading: boolean;
  search: string;
  setSearch: (value: string) => void;
  autoFilter: boolean;
  selectedItems: ComboboxItem[] | null | undefined;
  handleSelect: (item: ComboboxItem, selected: boolean) => void;
  onCreate?: (name: string) => void;
}

export function ComboboxContent({
  items,
  loading,
  search,
  setSearch,
  autoFilter,
  selectedItems,
  handleSelect,
  onCreate,
}: ComboboxContentProps) {
  const debouncedUpdate = debounce((value) => {
    if (!autoFilter) {
      setSearch(value);
    }
  }, 500);

  return (
    <Command shouldFilter={autoFilter}>
      <CommandInput placeholder="Search..." onValueChange={debouncedUpdate} />
      <CommandEmpty>
        <p>No Results found</p>
        {onCreate && (
          <Button
            onClick={() => {
              //   onCreate();
            }}
          ></Button>
        )}
      </CommandEmpty>
      <CommandList>
        {loading && <Loader2 className="animate-spin" />}
        <CommandGroup className={items.length === 0 ? "hidden" : ""}>
          {items.map((item) => {
            let isSelected = false;
            if (selectedItems) {
              isSelected =
                selectedItems.find(
                  (selectedItem) => item.id === selectedItem.id
                ) !== undefined;
            }

            return (
              <CommandItem
                key={item.id}
                value={item.label}
                onSelect={() => {
                  handleSelect(item, isSelected);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    isSelected ? "opacity-100" : "opacity-0"
                  )}
                />
                {item.label}
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
