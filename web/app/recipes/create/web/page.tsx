"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { graphql } from "@/gql";
import { useState } from "react";
import { z } from "zod";

// const scrapeRecipe = graphql(`
// mutation scrapeRecipe($url: String!) {

// }
// `);

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
    </div>
  );
}
