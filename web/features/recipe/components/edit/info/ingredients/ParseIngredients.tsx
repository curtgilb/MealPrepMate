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
import { FormContext } from "@/features/recipe/components/edit/info/EditRecipeInfo";
import { useContext } from "react";

interface ParseIngredientsProps {}

export function ParseIngredients() {
  const form = useContext(FormContext);

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
        }}
        variant="secondary"
      >
        Match ingredients
      </Button>
    </div>
  );
}
