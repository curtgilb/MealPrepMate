"use client";
import { getUnitsQuery } from "@/api/Unit";
import { GenericCombobox } from "@/components/combobox/GenericCombox1";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { NutritionFormValues } from "@/features/recipe/hooks/useNutritionLabelForm";
import { FetchUnitsQuery } from "@/gql/graphql";
import { createContext } from "react";
import { useFormContext } from "react-hook-form";

export const NutritionContext = createContext<
  (nutrientId: string, value: number) => void
>(() => {});

interface EditNutritionLabelProps {
  isDefault: boolean;
}

export function EditNutritionLabel({ isDefault }: EditNutritionLabelProps) {
  const form = useFormContext<NutritionFormValues>();

  return (
    <fieldset className="space-y-4">
      <legend className="text-lg font-serif">Serving info</legend>
      {/* Servings */}
      <div className="flex gap-4">
        <FormField
          control={form.control}
          name="servings"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Servings</FormLabel>
              <FormControl>
                <Input
                  className="max-w-20"
                  type="number"
                  placeholder="4"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="servingsUsed"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={isDefault ? "text-muted-foreground" : ""}>
                Servings Used
              </FormLabel>
              <FormControl>
                <Input
                  className="max-w-20"
                  type="number"
                  {...field}
                  value={isDefault ? "" : field.value}
                  disabled={isDefault}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="flex gap-4 items-center">
        <FormField
          control={form.control}
          name="servingSize"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Serving Size</FormLabel>
              <FormControl>
                <Input type="number" placeholder="3" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="servingSizeUnit"
          render={({ field }) => (
            <FormItem className="grow">
              <FormLabel>Serving Size Unit</FormLabel>
              <FormControl className="min-w-48 w-full">
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
                  placeholder="Select unit"
                  autoFilter={true}
                  multiSelect={false}
                  onChange={(units) => {
                    const selectedUnit = units.length > 0 ? units[0] : null;
                    field.onChange(selectedUnit);
                  }}
                  selectedItems={field.value ? [field.value] : []}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </fieldset>
  );
}
