"use client";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  addServingMutation,
  editServingMutation,
} from "@/features/mealplan/api/MealPlanServings";
import { useMealPlanContext } from "@/features/mealplan/hooks/useMealPlanContext";
import { useServingsContext } from "@/features/mealplan/hooks/useServingsContext";
import { Meal, MealPlanServingsFieldFragment } from "@/gql/graphql";
import { useIdParam } from "@/hooks/use-id";
import { toTitleCase } from "@/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@urql/next";

interface AddServingDialogProps {
  setOpen: (value: boolean) => void;
}

export const meals: Meal[] = [
  Meal.Breakfast,
  Meal.Lunch,
  Meal.Dinner,
  Meal.Snack,
];

const MealPlanServingsSchema = z.object({
  mealPlanRecipeId: z.string(),
  meal: z.nativeEnum(Meal),
  servings: z.coerce.number().positive(),
});

export function AddServingForm({ setOpen }: AddServingDialogProps) {
  const mealPlanId = useIdParam();
  const { calculateNutrition } = useMealPlanContext();
  const { selectedDay, allRecipes } = useServingsContext();

  // Mutations
  const [{ fetching }, addServing] = useMutation(addServingMutation);

  const form = useForm<z.infer<typeof MealPlanServingsSchema>>({
    resolver: zodResolver(MealPlanServingsSchema),
    defaultValues: {
      servings: 1,
    },
  });

  const selectedRecipe = form.watch("mealPlanRecipeId");
  const servings = form.watch("servings");

  const nutrientValues = calculateNutrition({
    macrosOnly: true,
    recipes: [{ mealPlanRecipeId: selectedRecipe, servings }],
  });

  function onSubmit(values: z.infer<typeof MealPlanServingsSchema>) {
    // Add new serving
    addServing({
      serving: {
        mealPlanId: mealPlanId,
        day: selectedDay,
        meal: values.meal,
        mealPlanRecipeId: values.mealPlanRecipeId,
        servings: values.servings,
      },
    }).then(() => {
      toast("Servings has been added to plan");
      setOpen(false);
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="mealPlanRecipeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recipe</FormLabel>
              <Select onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a recipe" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {allRecipes.map((recipe) => {
                    const hasMoreServings =
                      recipe.servingsOnPlan === recipe.totalServings;
                    return (
                      <SelectItem
                        key={recipe.id}
                        value={recipe.id}
                        disabled={hasMoreServings}
                      >
                        {`${recipe.originalRecipe.name} (${
                          recipe.totalServings - recipe.servingsOnPlan
                        }/${recipe.totalServings} servings remaining)`}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="servings"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Servings</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="meal"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Course</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  {meals.map((meal) => {
                    return (
                      <FormItem
                        key={meal}
                        className="flex items-center space-x-3 space-y-0"
                      >
                        <FormControl>
                          <RadioGroupItem value={meal} />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {toTitleCase(String(meal))}
                        </FormLabel>
                      </FormItem>
                    );
                  })}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="mt-4" type="submit" disabled={fetching}>
          Add serving
        </Button>
      </form>
    </Form>
  );
}
