import { Plus } from "lucide-react";
import { Fragment } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { z } from "zod";

import { getUnitsQuery } from "@/api/Unit";
import { GenericCombobox } from "@/components/combobox/GenericCombox1";
import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { getIngredientsQuery } from "@/features/ingredient/api/Ingredient";
import {
  NumericalFields,
  numericalFilterSchema,
} from "@/features/recipe/components/NumericalFilter";
import { FilterValidationType } from "@/features/recipe/components/RecipeFilter";
import { FetchUnitsQuery, GetIngredientsQuery } from "@/gql/graphql";

export const ingredientFilterValidation = z
  .object({
    id: z.string(),
    label: z.string(),
    amount: numericalFilterSchema,
    unit: z
      .object({
        id: z.string(),
        label: z.string(),
      })
      .nullish(),
  })
  .array();

export function IngredientFilter() {
  const form = useFormContext<FilterValidationType>();
  const ingredientFilters = form.watch("ingredientFilters");
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "ingredientFilters",
  });

  return (
    <div>
      <GenericCombobox
        query={getIngredientsQuery}
        variables={{}}
        renderItem={(
          item: GetIngredientsQuery["ingredients"]["edges"][number]
        ) => {
          return {
            id: item.node.id,
            label: item.node.name,
            amount: { gte: null, lte: null },
            unit: undefined,
          };
        }}
        unwrapDataList={(list) => list?.ingredients.edges ?? []}
        placeholder="Add ingredient"
        autoFilter={false}
        icon={Plus}
        multiSelect={true}
        selectedItems={ingredientFilters}
        onChange={(items) => {}}
        onItemAdded={(item) => {
          append({
            id: item.id,
            label: item.label ?? "",
            amount: { lte: null, gte: null },
            unit: undefined,
          });
        }}
        onItemRemoved={(item) => {
          const pos = fields.findIndex((oldItem) => oldItem.id === item.id);
          if (pos >= 0) remove(pos);
        }}
      />
      {fields.map((field, index) => {
        return (
          <Fragment key={field.id}>
            <FormField
              control={form.control}
              name={`ingredientFilters.${index}.amount`}
              render={({ field: renderField }) => {
                return (
                  <FormItem>
                    <FormLabel>{field.label}</FormLabel>
                    <NumericalFields<FilterValidationType>
                      field={renderField}
                    />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name={`ingredientFilters.${index}.unit`}
              render={({ field: renderField }) => {
                return (
                  <FormItem>
                    <FormLabel>Unit</FormLabel>
                    <GenericCombobox
                      query={getUnitsQuery}
                      variables={{}}
                      renderItem={(item: FetchUnitsQuery["units"][number]) => {
                        return {
                          id: item.id,
                          label: item.name,
                        };
                      }}
                      unwrapDataList={(list) => list?.units ?? []}
                      placeholder="Pick unit"
                      autoFilter={false}
                      icon={Plus}
                      multiSelect={false}
                      onChange={(units) => {
                        const selectedUnit = units.length > 0 ? units[0] : null;
                        renderField.onChange(selectedUnit);
                      }}
                      selectedItems={
                        renderField.value ? [renderField.value] : []
                      }
                    />
                  </FormItem>
                );
              }}
            />
          </Fragment>
        );
      })}
    </div>
  );
}
