"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import {
  ArrayPath,
  Control,
  FieldValues,
  Path,
  PathValue,
  useFieldArray,
  useFormContext,
} from "react-hook-form";
import { z } from "zod";

import {
  ComboboxItem,
  GenericCombobox,
} from "@/components/combobox/GenericCombox1";
import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { getNutrientsForPicker } from "@/features/nutrition/api/Nutrient";
import {
  NumericalFields,
  numericalFilterSchema,
} from "@/features/recipe/components/NumericalFilter";
import { FilterValidationType } from "@/features/recipe/components/RecipeFilter";
import { SearchNutrientsQuery } from "@/gql/graphql";

export const nutrientFilterValidation = z
  .object({
    id: z.string(),
    label: z.string(),
    target: numericalFilterSchema,
  })
  .array();

export type NutrientFilterType = z.infer<typeof nutrientFilterValidation>;

type NutrientFilterPath<FormType> = {
  [Key in keyof FormType]: FormType[Key] extends NutrientFilterType
    ? Key
    : never;
}[keyof FormType] &
  ArrayPath<FormType>;

interface NutritionFilterProps<FormType extends FieldValues> {
  id: NutrientFilterPath<FormType>;
  label?: string;
}

export function NutritionFilter<T extends FieldValues>({
  id,
}: NutritionFilterProps<T>) {
  const form = useFormContext<FilterValidationType>();
  const nutrientFilters = form.watch("nutrientFilters");

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "nutrientFilters",
  });

  return (
    <div>
      <GenericCombobox
        query={getNutrientsForPicker}
        variables={{}}
        renderItem={(item: SearchNutrientsQuery["nutrients"][number]) => {
          return {
            id: item.id,
            label: item.name,
            target: { gte: null, lte: null },
          };
        }}
        unwrapDataList={(list) => list?.nutrients ?? []}
        placeholder="Add nutrient"
        autoFilter={true}
        icon={Plus}
        multiSelect={true}
        selectedItems={nutrientFilters}
        onChange={(items) => {}}
        onItemAdded={(item) => {
          append({
            id: item.id,
            label: item.label ?? "",
            target: { lte: null, gte: null },
          });
        }}
        onItemRemoved={(item) => {
          const pos = fields.findIndex((oldItem) => oldItem.id === item.id);
          if (pos >= 0) remove(pos);
        }}
      />
      {fields.map((field, index) => {
        return (
          <FormField
            key={field.id}
            control={form.control}
            name={`nutrientFilters.${index}.target`}
            render={({ field: renderField }) => {
              return (
                <FormItem>
                  <FormLabel>{field.label}</FormLabel>
                  <NumericalFields<FilterValidationType> field={renderField} />
                </FormItem>
              );
            }}
          />
        );
      })}
    </div>
  );
}
