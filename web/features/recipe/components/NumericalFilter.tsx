"use client";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";
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

type NumericalFilter = z.infer<typeof numericalFilterSchema>;

type NumericalFilterPath<FormType> = Path<FormType> &
  {
    [Key in keyof FormType]: FormType[Key] extends NumericalFilter
      ? Key
      : never;
  }[keyof FormType];

interface NumericalFilterProps<FormType extends FieldValues> {
  form: UseFormReturn<FormType>;
  id: NumericalFilterPath<FormType>;
  label: string;
}

export default function NumericalFilter<FormType extends FieldValues>({
  form,
  id,
  label,
}: NumericalFilterProps<FormType>) {
  return (
    <FormField
      control={form.control}
      name={id}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <div className="flex items-center gap-2">
            <FormItem className="flex-1">
              <FormControl>
                <Input
                  type="number"
                  placeholder="Min"
                  value={field.value?.min ?? ""}
                  onChange={(e) => {
                    field.onChange({
                      ...field.value,
                      min: e.target.value,
                    });
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            <span className="text-muted-foreground">to</span>

            <FormItem className="flex-1">
              <FormControl>
                <Input
                  type="number"
                  placeholder="Max"
                  value={field.value?.max ?? ""}
                  onChange={(e) => {
                    field.onChange({
                      ...field.value,
                      max: e.target.value,
                    });
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </div>
        </FormItem>
      )}
    />
  );
}

// const lte =
// lteField && lteField.current
//   ? parseInt(lteField.current.value)
//   : undefined;
// const gte =
// gteField && gteField.current
//   ? parseInt(gteField.current.value)
//   : undefined;
