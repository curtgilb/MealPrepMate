interface EditRecipeIngredientProps {}
import { createUnitMutation, getUnitsQuery } from "@/api/Unit";
import { GenericCombobox } from "@/components/combobox/GenericCombox1";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getIngredientsQuery } from "@/features/ingredient/api/Ingredient";
import {
  editRecipeIngredientMutation,
  recipeIngredientFragment,
} from "@/features/recipe/api/RecipeIngredient";
import { basicItem } from "@/features/recipe/components/edit/info/EditRecipeInfo";
import { useGroupedIngredients } from "@/features/recipe/hooks/useGroupedIngredients";
import { useRecipeIngredientContext } from "@/features/recipe/hooks/useGroupedRecipeIngredients";
import { getFragmentData } from "@/gql";
import { FetchUnitsQuery, GetIngredientsQuery } from "@/gql/graphql";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "urql";
import { z } from "zod";

const ingredientSchema = z.object({
  sentence: z.string(),
  quantity: z.number().nonnegative(),
  mealPrepIngredient: z.boolean(),
  ingredient: basicItem.nullish(),
  unit: basicItem.nullish(),
});

export function EditRecipeIngredient() {
  const {
    groupOrder,
    setGroupOrder,
    groupedIngredients,
    setGroupedIngredients,
    selectedLocation,
  } = useRecipeIngredientContext();

  const { group, index } = selectedLocation;
  const ingredient = index >= 0 ? groupedIngredients[group][index] : undefined;

  const form = useForm<z.infer<typeof ingredientSchema>>({
    resolver: zodResolver(ingredientSchema),
  });

  useEffect(() => {
    const { group, index } = selectedLocation;
    const ingredient =
      index >= 0 ? groupedIngredients[group][index] : undefined;
    form.reset({
      sentence: ingredient?.sentence,
      quantity: ingredient?.quantity ?? undefined,
      mealPrepIngredient: ingredient?.mealPrepIngredient ?? false,
      ingredient: ingredient?.baseIngredient
        ? {
            id: ingredient.baseIngredient.id,
            name: ingredient?.baseIngredient.name,
          }
        : undefined,
      unit: ingredient?.unit,
    });
  }, [groupedIngredients, selectedLocation, form]);

  const [result, editIngredient] = useMutation(editRecipeIngredientMutation);

  async function handleSubmit(values: z.infer<typeof ingredientSchema>) {
    await editIngredient({
      ingredient: {
        id: ingredient?.id,
        order: ingredient?.order,
        sentence: values.sentence,
        quantity: values.quantity,
        unitId: values.unit?.id,
        ingredientId: values.ingredient?.id,
        verified: true,
      },
    }).then((result) => {
      const updateIngredient = getFragmentData(
        recipeIngredientFragment,
        result.data?.editRecipeIngredients
      );
      // Save into groupedIngredients
      if (updateIngredient) {
        const oldGroup = groupedIngredients[group];
        setGroupedIngredients({
          ...groupedIngredients,
          [group]: oldGroup.map((oldIngredient, idx) => {
            if (idx === index) {
              return updateIngredient;
            }
            return oldIngredient;
          }),
        });
      }
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-8 w-full"
      >
        <FormField
          control={form.control}
          name="sentence"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sentence</FormLabel>
              <FormControl>
                <Input className="w-full" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-6">
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input className="max-w-24" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit</FormLabel>
                <FormControl>
                  <GenericCombobox
                    query={getUnitsQuery}
                    variables={{}}
                    unwrapDataList={(query) => {
                      return query?.units;
                    }}
                    renderItem={(
                      item: NonNullable<FetchUnitsQuery["units"]>[number]
                    ) => {
                      return { id: item.id, label: item.name };
                    }}
                    selectedItems={field.value ? [field.value] : []}
                    onChange={(newValue) => {
                      form.setValue("unit", newValue[0]);
                    }}
                    multiSelect={false}
                    autoFilter={true}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ingredient"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ingredient</FormLabel>
                <FormControl>
                  <GenericCombobox
                    query={getIngredientsQuery}
                    variables={{ search: "" }}
                    unwrapDataList={(query) => {
                      return query?.ingredients.edges;
                    }}
                    renderItem={(
                      item: NonNullable<
                        GetIngredientsQuery["ingredients"]["edges"]
                      >[number]
                    ) => {
                      return { id: item.node.id, label: item.node.name };
                    }}
                    selectedItems={field.value ? [field.value] : []}
                    onChange={(newValue) => {
                      form.setValue("ingredient", newValue[0]);
                    }}
                    multiSelect={false}
                    autoFilter={false}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="mealPrepIngredient"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Meal prep ingredient</FormLabel>
                <FormDescription>
                  An ingredient you would use to make the meal in advance
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        <Button variant="secondary" type="submit" disabled={result.fetching}>
          Verify ingredient
        </Button>
      </form>
    </Form>
  );
}
