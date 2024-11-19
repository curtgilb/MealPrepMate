"use client";
import {
  ControllerRenderProps,
  FieldValues,
  Path,
  useFormContext,
} from "react-hook-form";
import { z } from "zod";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export const numericalFilterSchema = z
  .object({
    gte: z.number().nullable().optional(),
    lte: z.number().nullable().optional(),
  })
  .refine(
    (data) => {
      // If either value is null/undefined, validation passes
      if (data.gte == null || data.lte == null) return true;
      // Ensure min is not greater than max
      return data.gte <= data.lte;
    },
    {
      message: "Minimum value cannot be greater than maximum value",
      path: ["gte"], // This will show the error on the min field
    }
  );

// Type definitions
export type NumericalFilter = z.infer<typeof numericalFilterSchema>;

type NumericalFilterPath<FormType> = {
  [Key in keyof FormType]: FormType[Key] extends NumericalFilter ? Key : never;
}[keyof FormType] &
  Path<FormType>;

interface NumericalFilterProps<FormType extends FieldValues> {
  id: NumericalFilterPath<FormType>;
  label?: string;
}

export default function NumericalFilter<FormType extends FieldValues>({
  id,
  label,
}: NumericalFilterProps<FormType>) {
  const form = useFormContext<FormType>();

  return (
    <FormField
      control={form.control}
      name={id}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <NumericalFields field={field} />
        </FormItem>
      )}
    />
  );
}

interface NumericalFieldsProps<FormType extends FieldValues> {
  field: ControllerRenderProps<FormType, Path<FormType>>;
}

export function NumericalFields<FormType extends FieldValues>({
  field,
}: NumericalFieldsProps<FormType>) {
  return (
    <div className="flex items-center gap-2">
      <FormItem className="flex-1">
        <FormControl>
          <Input
            type="number"
            placeholder="min"
            value={field.value?.gte ?? ""}
            onChange={(e) => {
              const value =
                e.target.value === "" ? undefined : Number(e.target.value);
              field.onChange({
                ...field.value,
                gte: value,
              });
            }}
            onBlur={field.onBlur}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
      <span className="text-muted-foreground">to</span>
      <FormItem className="flex-1">
        <FormControl>
          <Input
            type="number"
            placeholder="max"
            value={field.value?.lte ?? ""}
            onChange={(e) => {
              const value =
                e.target.value === "" ? null : Number(e.target.value);
              field.onChange({
                ...field.value,
                lte: value,
              });
            }}
            onBlur={field.onBlur}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </div>
  );
}
