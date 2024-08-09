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
import { Check } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

interface ComboboxContentProps<T extends { id: string }> {
  items: T[];
  loading: boolean;
  setSearch: Dispatch<SetStateAction<string>>;
  formatLabel: (item: T) => string;
  autoFilter: boolean;
  selectedItems: T | T[] | undefined;
  handleSelect: (item: T, selected: boolean) => void;
}

export function ComboboxContent<T extends { id: string }>({
  items,
  loading,
  setSearch,
  formatLabel,
  autoFilter,
  selectedItems,
  handleSelect,
}: ComboboxContentProps<T>) {
  const debouncedUpdate = debounce((value) => {
    setSearch(value);
  }, 500);

  return (
    <Command shouldFilter={autoFilter}>
      <CommandInput placeholder="Search..." onValueChange={debouncedUpdate} />
      <CommandEmpty>
        <p>No Results found</p>
      </CommandEmpty>
      <CommandList>
        <CommandGroup className={items.length === 0 ? "hidden" : ""}>
          {items.map((item: T) => {
            let isSelected = false;
            if (selectedItems && Array.isArray(selectedItems)) {
              isSelected = selectedItems.find((item) => item.id) !== undefined;
            } else {
              isSelected = item.id === selectedItems?.id;
            }

            return (
              <CommandItem
                key={item.id}
                value={item.id}
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
                {formatLabel(item)}
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
