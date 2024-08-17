"use client";
import { RecipeIngredientFragment } from "@/features/recipe/api/RecipeIngredient";
import {
  EditRecipeProps,
  EditRecipeSubmit,
} from "@/features/recipe/components/edit/RecipeEditor";
import { useFragment } from "@/gql";
import {
  RecipeFieldsFragment,
  RecipeIngredientFieldsFragment,
} from "@/gql/graphql";
import { forwardRef, useImperativeHandle, useMemo, useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PickerIngredient } from "@/components/pickers/IngredientPicker";
import { PickerUnit, UnitPicker } from "@/components/pickers/UnitPicker";

const NutrientLabelValidation = z.object({
  nutrientId: z.string(),
  value: z.number(),
});

const NutritionLabelValidation = z.object({
  servings: z.number(),
  servingSize: z.number(),
  servingSizeUnit: z.custom<PickerUnit | null>(),
  servingsUsed: z.number(),
  nutrients: z.array(NutrientLabelValidation),
});

export const EditRecipeNutritionLabels = forwardRef<
  EditRecipeSubmit,
  EditRecipeProps
>(function EditLabels(props, ref) {
  const [selectedGroup, setSelectedGroup] = useState<string>("default");

  const groupLabels = useMemo(() => {
    const groupLookup = new Map<
      string,
      | NonNullable<RecipeFieldsFragment["nutritionLabels"]>[number]
      | undefined
      | null
    >();
    props.recipe?.nutritionLabels?.reduce((agg, label) => {
      if (label?.ingredientGroup && !agg.has(label.ingredientGroup.id)) {
        agg.set(label.ingredientGroup.id, label);
      }
      return agg;
    }, groupLookup);

    groupLookup?.set(
      "default",
      props.recipe?.nutritionLabels?.find((label) => label.isPrimary)
    );
    return groupLookup;
  }, [props.recipe?.nutritionLabels]);
  const selectedLabel = groupLabels?.get(selectedGroup);

  const form = useForm<z.infer<typeof NutritionLabelValidation>>({
    resolver: zodResolver(NutritionLabelValidation),
    defaultValues: {
      servings: selectedLabel?.servings ?? 1,
      servingSize: selectedLabel?.servingSize ?? undefined,
      servingSizeUnit: selectedLabel?.servingSizeUnit ?? null,
      servingsUsed: selectedLabel?.servingsUsed ?? 1,
      nutrients: selectedLabel?.nutrients ?? [],
    },
  });

  useImperativeHandle(ref, () => ({
    async submit(postSubmit) {
      postSubmit();
    },
  }));
  const ingredients = useFragment(
    RecipeIngredientFragment,
    props.recipe?.ingredients
  );

  const groups = ingredients?.reduce((agg, ingredient) => {
    if (ingredient.group && !agg.has(ingredient.group?.id)) {
      agg.set(ingredient.group.id, ingredient.group);
    }
    return agg;
  }, new Map<string, RecipeIngredientFieldsFragment["group"]>());

  return (
    <div>
      <p>Edit Nutrition Labels</p>
      <Select
        onValueChange={setSelectedGroup}
        defaultValue={selectedGroup ?? "default"}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Ingredient Group" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default">Default</SelectItem>
          {groups &&
            Array.from(groups.entries()).map(([id, group]) => {
              return (
                <SelectItem key={id} value={id}>
                  {group?.name}
                </SelectItem>
              );
            })}
        </SelectContent>
      </Select>
      <Form {...form}>
        <form>
          <FormField
            control={form.control}
            name="servings"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Servings</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="4" {...field} />
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
                <FormLabel>Servings Used</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="2" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center">
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
                <FormItem className="max-w-96 flex flex-col">
                  <FormLabel>Unit</FormLabel>
                  <UnitPicker
                    value={field.value}
                    onChange={(unit) => {
                      form.setValue("servingSizeUnit", unit);
                    }}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </div>
  );
});
