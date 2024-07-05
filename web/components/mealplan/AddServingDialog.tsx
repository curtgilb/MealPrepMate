import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MealPlan } from "@/contexts/MealPlanContext";
import { graphql } from "@/gql";
import { Meal } from "@/gql/graphql";
import { useContext, useState } from "react";
import { ModalDrawer } from "../ModalDrawer";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toTitleCase } from "@/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "../ui/input";
import { useMutation } from "@urql/next";
import { toast } from "sonner";

const addServingMutation = graphql(`
  mutation addServingToPlan($serving: AddRecipeServingInput!) {
    addRecipeServing(serving: $serving) {
      day
      id
      meal
      mealPlanRecipeId
      numberOfServings
      mealRecipe {
        id
        servingsOnPlan
      }
    }
  }
`);

interface AddServingDialogProps {
  day: number;
}

export const meals: Meal[] = [
  Meal.Breakfast,
  Meal.Lunch,
  Meal.Dinner,
  Meal.Snack,
];

const FormSchema = z.object({
  mealPlanRecipeId: z.string().cuid(),
  meal: z.nativeEnum(Meal),
  servings: z.coerce.number().positive(),
});

export function AddServingDialog({ day }: AddServingDialogProps) {
  const [open, setOpen] = useState(false);
  const mealPlan = useContext(MealPlan);
  const [result, addServing] = useMutation(addServingMutation);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      servings: 1,
    },
  });

  const usableRecipes = mealPlan?.recipes?.filter(
    (recipe) => recipe.servingsOnPlan < recipe.totalServings
  );

  function onSubmit(data: z.infer<typeof FormSchema>) {
    addServing({
      serving: {
        mealPlanId: mealPlan?.id ?? "",
        day,
        meal: data.meal,
        mealPlanRecipeId: data.mealPlanRecipeId,
        servings: data.servings,
      },
    }).then((result) => {
      console.log(result);
      toast("Servings has been added to plan");
    });
  }

  return (
    <ModalDrawer
      open={open}
      setOpen={setOpen}
      title="Add serving"
      trigger={
        <Button
          variant="secondary"
          disabled={!usableRecipes || usableRecipes.length === 0}
        >
          Add serving
        </Button>
      }
      content={
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-2/3 space-y-6"
          >
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
                      {usableRecipes?.map((recipe) => {
                        const nutrients = mealPlan?.labels?.get(recipe.id);
                        return (
                          <SelectItem key={recipe.id} value={recipe.id}>
                            {`${recipe.originalRecipe.name} (${nutrients?.calories.perServing} calories per serving)`}
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
            <Button className="mt-4" type="submit">
              Add serving
            </Button>
          </form>
        </Form>
      }
    ></ModalDrawer>
  );
}
