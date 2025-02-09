import { MealPlanServingsFieldFragment } from "@/gql/graphql";
import { useMutation } from "@urql/next";
import {
  deleteServingMutation,
  editServingMutation,
} from "@/features/mealplan/api/MealPlanServings";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash } from "lucide-react";
import { useMealPlanRecipes } from "@/features/mealplan/hooks/useMealPlanRecipes";
import { useIdParam } from "@/hooks/use-id";

interface EditServingFormProps {
  serving: MealPlanServingsFieldFragment;
  setOpen: (value: boolean) => void;
}

export function EditServingForm({ serving, setOpen }: EditServingFormProps) {
  const mealPlanId = useIdParam();
  const [{ fetching: editFetching }, editServing] =
    useMutation(editServingMutation);
  const [{ fetching: deleteFetching }, deleteServing] = useMutation(
    deleteServingMutation
  );
  const fetching = editFetching || deleteFetching;
  const recipes = useMealPlanRecipes(mealPlanId);
  const maxServings =
    recipes &&
    recipes[serving.mealPlanRecipeId].totalServings -
      recipes[serving.mealPlanRecipeId].servingsOnPlan;

  const EditServingsSchema = z.object({
    servings: z.coerce
      .number()
      .positive()
      .max(maxServings ?? 1),
  });

  const form = useForm<z.infer<typeof EditServingsSchema>>({
    resolver: zodResolver(EditServingsSchema),
    defaultValues: {
      servings: serving.numberOfServings,
    },
  });

  function onSubmit(values: z.infer<typeof EditServingsSchema>) {
    editServing({
      id: serving.id,
      serving: {
        day: serving.day,
        servings: values.servings,
        meal: serving.meal,
      },
    }).then(() => {
      setOpen(false);
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="servings"
          disabled={fetching}
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

        <Button className="mt-4" type="submit" disabled={fetching}>
          Edit serving
        </Button>
        <Button className="mt-4" type="submit" disabled={fetching}>
          <Trash />
          Delete Serving
        </Button>
      </form>
    </Form>
  );
}
