"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
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
import { RecipeEditor } from "@/components/recipe/edit/RecipeEditor";
import { graphql } from "@/gql";
import { InputWithLabel } from "@/components/ui/InputWithLabel";
import { CategoryPicker } from "@/components/pickers/CategoryPicker";
import { useState } from "react";
import { TimeNumberInput } from "@/components/ui/time-number-input";
import { Fieldset } from "@/components/ui/fieldset";
import { ImagePicker } from "@/components/ImagePicker";
import { CuisinePicker } from "@/components/pickers/CuisinePicker";
import { CoursePicker } from "@/components/pickers/CoursePicker";

const scrapeRecipe = graphql(`
mutation scrapeRecipe($url: String!) {
  
}
`);

const validationSchema = z.object({
  url: z.string().url({ message: "Invalid URL" }),
});

export default function CreateRecipeFromWeb() {
  const [scraping, setScraping] = useState<boolean>(false);

  return (
    <div>
      <Label htmlFor="url">Website URL</Label>
      <div className="flex w-full items-center space-x-2 mb-6">
        <Input type="url" placeholder="Website URL" />
        <Button type="submit">Import</Button>
      </div>
      <RecipeEditor />
    </div>
  );
}
