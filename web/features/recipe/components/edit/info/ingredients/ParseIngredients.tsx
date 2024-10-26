"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { tagIngredientsQuery } from "@/features/recipe/api/RecipeIngredient";
import { FormContext } from "@/features/recipe/components/edit/info/EditRecipeInfo";
import { ParseIngredientsQuery } from "@/gql/graphql";
import { useQuery } from "@urql/next";
import { useContext } from "react";

interface ParseIngredientsProps {
  updateIngredients: (
    ingredients: ParseIngredientsQuery["tagIngredients"]
  ) => void;
}

export function ParseIngredients({ updateIngredients }: ParseIngredientsProps) {
  const form = useContext(FormContext);
  const [result, executeQuery] = useQuery({
    query: tagIngredientsQuery,
    variables: { lines: "" },
    pause: true,
  });

  function handleSubmit() {
    const ingredients = form?.getValues("ingredients");
    executeQuery({ variables: { lines: ingredients } });
  }

  return (
    <div className="space-y-4">
      <FormField
        control={form?.control}
        name="ingredients"
        render={({ field }) => (
          <FormItem className="max-w-96 w-full ">
            <FormLabel>Ingredients</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Ingredient list"
                className="resize-none min-h-[30rem]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button
        onClick={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        variant="secondary"
      >
        Match ingredients
      </Button>
    </div>
  );
}
