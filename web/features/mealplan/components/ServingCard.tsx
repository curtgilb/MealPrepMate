import React, { useState } from "react";
import { Card } from "../generics/Card";
import { ModalDrawer } from "../ModalDrawer";
import { graphql } from "@/gql";
import { useMutation } from "urql";
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
import { Button } from "../ui/button";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { toTitleCase } from "@/utils/utils";
import { meals } from "./AddServingDialog";
import { Input } from "../ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Meal } from "@/gql/graphql";
import { toast } from "sonner";

interface MealPlanServingCardProps {
  id: string;
  dayNumber: number;
  meal: Meal;
  servings: number;
  calories: number;
  name: string;
  photoUrl: string;
}

const deleteServingMutation = graphql(`
  mutation removeServing($id: String!) {
    deleteRecipeServing(id: $id)
  }
`);

const editServingMutation = graphql(`
  mutation editServing($serving: EditRecipeServingInput!) {
    editRecipeServing(serving: $serving) {
      id
      day
      meal
      numberOfServings
      mealRecipe {
        id
        servingsOnPlan
      }
    }
  }
`);

export const MealPlanServingCard = React.forwardRef<
  HTMLDivElement,
  MealPlanServingCardProps
>(function MealPlanServingCard(props, ref) {
  const [open, setOpen] = useState(false);
  const { id, servings, calories, meal, name, photoUrl, dayNumber, ...rest } =
    props;
  const [deleteResult, deleteServing] = useMutation(deleteServingMutation);
  const [editResult, editServing] = useMutation(editServingMutation);

  const FormSchema = z.object({
    meal: z.nativeEnum(Meal),
    servings: z.coerce.number().positive(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      meal,
      servings,
    },
  });

  function submitServingEdit(data: z.infer<typeof FormSchema>) {
    console.log("Submit called");
    editServing({
      serving: {
        meal: data.meal,
        servings: data.servings,
        id: id,
        day: dayNumber,
      },
    }).then((result) => {
      setOpen(false);
    });
  }

  return (
    <ModalDrawer
      open={open}
      setOpen={setOpen}
      title={`Edit ${name} serving`}
      trigger={
        <Card
          ref={ref}
          tabIndex={0}
          className="group hover:cursor-pointer focus:ring ring-black"
          image={{ images: [], placeholder: "/pot.jpg", grid: false }}
          vertical={false}
          {...rest}
        >
          <p className="line-clamp-1 text-sm font-medium group-hover:underline">
            {name}
          </p>
          <p className="font-light text-sm text-left">{`${servings} servings`}</p>
          <p className="font-light text-sm text-left">{`${calories} calories`}</p>
        </Card>
      }
      content={
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(submitServingEdit)}
            className="w-2/3 space-y-6"
          >
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
            <div className="flex gap-2 items-center content-end">
              <Button
                variant="destructive"
                onClick={(e) => {
                  e.preventDefault();
                  deleteServing({ id }).then((result) => {
                    if (result) {
                      toast("Serving has been deleted");
                    }
                    setOpen(false);
                  });
                }}
              >
                Remove serving
              </Button>
              <Button type="submit">Edit serving</Button>
            </div>
          </form>
        </Form>
      }
    ></ModalDrawer>
  );
});
