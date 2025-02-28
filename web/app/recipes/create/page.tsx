"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { Button } from "@/components/ui/button";

const RecipeInputValidation = z.object({
  title: z.string(),
  source: z.string().trim().optional(),
  prepTime: z.number(),
  //   cookTime: z.coerce.number().nullable().optional(),
  //   marinadeTime: z.coerce.number().nullable().optional(),
  //   directions: z.string().nullish(),
  //   notes: z.string().nullish(),
  //   isFavorite: z.coerce.boolean().optional(),
  //   leftoverFridgeLife: z.coerce.number().int().positive().nullable().optional(),
  //   leftoverFreezerLife: z.coerce.number().int().positive().nullable().optional(),
  //   ingredients: z.string().nullish(),
  //   cuisineIds: z.coerce.string().cuid().array().nullable().optional(),
  //   categoryIds: z.coerce.string().cuid().array().nullable().optional(),
  //   courseIds: z.coerce.string().cuid().array().nullable().optional(),
  //   photoIds: z.coerce.string().cuid().array().nullable().optional(),
});

export default function CreateRecipe() {
  const form = useForm<z.infer<typeof RecipeInputValidation>>({
    resolver: zodResolver(RecipeInputValidation),
    defaultValues: {},
  });
  function onSubmit(values: z.infer<typeof RecipeInputValidation>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
  }
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Name of Recipe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="prepTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preparation Time</FormLabel>
                <FormControl>
                  <Input placeholder="Time to prep ingredients" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="source"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recipe Source</FormLabel>
                <FormControl>
                  <Input placeholder="Name of Recipe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
