import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toTitleCase } from "@/utils/utils";
import { cn } from "@/lib/utils";

type EnumType = { [s: number]: string };

interface EnumSelectProps<T extends EnumType> {
  enum: T;
  value: T[keyof T];
  onChange: (value: T[keyof T]) => void;
  placeholder?: string;
  className?: string;
}

export function EnumSelect<T extends EnumType>({
  enum: enumObject,
  value,
  onChange,
  placeholder = "Select an option",
  className,
}: EnumSelectProps<T>) {
  const enumValues = Object.values(enumObject);

  return (
    <Select
      value={value as string}
      onValueChange={(v) => onChange(v as T[keyof T])}
    >
      <SelectTrigger className={cn("min-w-max h-8 text-sm", className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {enumValues.map((enumValue) => (
          <SelectItem key={enumValue} value={enumValue}>
            {toTitleCase(enumValue)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
