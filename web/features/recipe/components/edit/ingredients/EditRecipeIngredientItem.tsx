import {
  IngredientPicker,
  PickerIngredient,
} from "@/components/pickers/IngredientPicker";
import { PickerUnit, UnitPicker } from "@/components/pickers/UnitPicker";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { editRecipeIngredientMutation } from "@/features/recipe/api/RecipeIngredient";
import { RecipeIngredientFieldsFragment } from "@/gql/graphql";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@urql/next";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface EditRecipeIngredientItemProps {
  ingredient: RecipeIngredientFieldsFragment;
  advance: () => void;
  back: () => void;
}

const IngredientValidation = z.object({
  quantity: z.number().positive(),
  unit: z.custom<PickerUnit | null>(),
  ingredient: z.custom<PickerIngredient | null>(),
});

export function EditRecipeIngredientItem({
  ingredient,
  advance,
  back,
}: EditRecipeIngredientItemProps) {
  const form = useForm<z.infer<typeof IngredientValidation>>({
    resolver: zodResolver(IngredientValidation),
    defaultValues: {
      quantity: ingredient.quantity ?? undefined,
      unit: ingredient.unit ?? undefined,
      ingredient: ingredient.baseIngredient ?? undefined,
    },
  });
  const [result, editIngredient] = useMutation(editRecipeIngredientMutation);

  function handleSubmit(values: z.infer<typeof IngredientValidation>) {
    editIngredient({
      ingredients: {
        id: ingredient.id,
        quantity: values.quantity,
        unitId: values.unit?.id,
        ingredientId: values.ingredient?.id,
      },
    }).then(() => {
      advance();
    });
  }

  useEffect(() => {
    form.reset({
      quantity: ingredient.quantity ?? undefined,
      unit: ingredient.unit ?? undefined,
      ingredient: ingredient.baseIngredient ?? undefined,
    });
  }, [ingredient, form]);

  return (
    <div className="p-4 space-y-6 my-auto mx-auto">
      <p className="text-2xl font-medium mb-4">{ingredient.sentence}</p>
      <div className="flex gap-6">
        <Form {...form}>
          <form
            className="w-full min-w-lg"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem className="max-w-96">
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input
                        className="max-w-24"
                        type="number"
                        {...field}
                      ></Input>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem className="max-w-44 w-full">
                    <FormLabel>Unit</FormLabel>
                    <UnitPicker
                      value={field.value}
                      onChange={(unit) => {
                        console.log(unit);
                        form.setValue("unit", unit);
                      }}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ingredient"
                render={({ field }) => (
                  <FormItem className="max-w-60 w-full">
                    <FormLabel>Ingredient</FormLabel>
                    <IngredientPicker
                      multiSelect={false}
                      value={field.value}
                      onChange={(ingredient) => {
                        form.setValue("ingredient", ingredient);
                      }}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-x-2 justify-end mt-6">
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  back();
                }}
                variant="outline"
              >
                Back
              </Button>
              <Button type="submit" variant="secondary">
                Next
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
