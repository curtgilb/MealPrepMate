"use client";
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
import { Label } from "@/components/ui/label";
import { EditRecipe } from "@/components/recipe/edit/EditRecipe";
import { graphql } from "@/gql";

const scrapeRecipe = graphql(`
mutation scrapeRecipe($url: String!) {
  
}
`);

const validationSchema = z.object({
  url: z.string().url({ message: "Invalid URL" }),
});

export default function CreateRecipeFromWeb() {
  const form = useForm<z.infer<typeof validationSchema>>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      url: "",
    },
  });

  function onSubmit(values: z.infer<typeof validationSchema>) {
    console.log(values);
  }

  return (
    <div>
      <Form {...form}>
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
      </Form>
      <iframe src={form?.getValues().url}></iframe>
      <EditRecipe id={}></EditRecipe>
    </div>
  );
