import { getUnitsQuery } from "@/api/Unit";
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
import { useRecipeIngredientForm } from "@/features/recipe/hooks/useRecipeIngredientForm";
import {
  FetchUnitsQuery,
  GetIngredientsQuery,
  RecipeIngredientFieldsFragment,
} from "@/gql/graphql";
import { BadgeCheck, Trash2 } from "lucide-react";
import { useMutation } from "@urql/next";
import { deleteRecipeIngredientMutation } from "@/features/recipe/api/RecipeIngredient";
import { useRecipeIngredientContext } from "@/features/recipe/hooks/useGroupedRecipeIngredients";

interface RecipeIngredientFieldsProps {
  ingredient: RecipeIngredientFieldsFragment | undefined | null;
}

export function RecipeIngredientFields({
  ingredient,
}: RecipeIngredientFieldsProps) {
  const { form, handleSubmit, isFetching } =
    useRecipeIngredientForm(ingredient);

  const { removeSelected } = useRecipeIngredientContext();

  const [{ fetching }, deleteIngredient] = useMutation(
    deleteRecipeIngredientMutation
  );

  const disableForm = isFetching || fetching;

  async function handleDelete() {
    if (ingredient) {
      await deleteIngredient({ id: ingredient.id }).then((result) => {
        if (!result.error) {
          removeSelected();
        }
      });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className=" w-full sticky top-20"
      >
        <fieldset className="space-y-8 mb-10">
          <legend className="font-serif text-lg font-bold">
            Edit ingredient
          </legend>
          <FormField
            control={form.control}
            name="sentence"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sentence</FormLabel>
                <FormControl>
                  <Input className="w-full" disabled={disableForm} {...field} />
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
                <FormItem className="w-32">
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input type="number" disabled={disableForm} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem className="w-72">
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
                <FormItem className="w-full">
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
                      placeholder="Search ingredients"
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
                    disabled={disableForm}
                    checked={field.value}
                    onCheckedChange={(value) => {
                      field.onChange(
                        !value || value === "indeterminate" ? false : true
                      );
                    }}
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
        </fieldset>

        <Button
          className="mr-4"
          variant="secondary"
          type="submit"
          disabled={disableForm}
        >
          <BadgeCheck />
          Verify ingredient
        </Button>
        <Button
          variant="destructive"
          disabled={disableForm}
          onClick={async (e) => {
            e.preventDefault();
            e.stopPropagation();
            await handleDelete();
          }}
        >
          <Trash2 />
          Delete Ingredient
        </Button>
      </form>
    </Form>
  );
}
