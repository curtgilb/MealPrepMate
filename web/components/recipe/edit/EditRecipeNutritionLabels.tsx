import { graphql } from "@/gql";
import { FragmentType, useFragment } from "@/gql/fragment-masking";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
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

export const RecipeNutritionLabelFields = graphql(`
  fragment NutritionLabelFields on NutritionLabel {
    id
    name
    servingSize
    servings
    servingsUsed
    servingSizeUnit {
      id
      name
      symbol
    }
  }
`);

export function EditRecipeNutritionLabels(props: {
  labels?: FragmentType<typeof RecipeNutritionLabelFields>[];
}) {
  const ingredients = useFragment(RecipeNutritionLabelFields, props.labels);
  // function onSubmit(values: z.infer<typeof validationSchema>) {
  //   console.log(values);
  // }

  return (
    <div>
      {/* <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Website URL" {...field} />
                </FormControl>
                <FormDescription>
                  This is the URL of the website with you recipe you want to
                  import.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Import</Button>
        </form>
      </Form> */}
    </div>
  );
}
