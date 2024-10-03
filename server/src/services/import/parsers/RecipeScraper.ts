import { Photo } from "@prisma/client";
import { db } from "../../../db.js";
import { RecipeInput } from "../../../types/gql.js";
import { RecipeParsedRecord } from "./base/ParsedRecord.js";
import { z } from "zod";

type RecipeScraperResponse = {
  author: string;
  host: string;
  description?: string;
  image: string;
  ingredients: string[];
  instructions: string;
  title: string;
  total_time: number;
  yields: string;
  // Inherited
  canonical_url: string;
  ingredient_groups: { ingredients: string[]; purpose: string | null }[];
  instructions_list: string[];
  language: string;
  site_name: string;
  // Optional
  category?: string;
  cookTime?: number;
  cuisine?: string;
  equipment?: string[];
  nutrients?: {
    calories?: string;
    carbohydrateContent?: string;
    proteinContent?: string;
    fatContent?: string;
    saturatedFatContent?: string;
    transFatContent?: string;
    cholesterolContent?: string;
    sodiumContent?: string;
    fiberContent?: string;
    sugarContent?: string;
    unsaturatedFatContent?: string;
    servingSize?: string;
  };
  prepTime?: number;
  ratings?: number;
};

class WebParsedRecord extends RecipeParsedRecord<RecipeInput> {
  private parsedRecipe: RecipeScraperResponse | undefined;

  constructor(input: string) {
    super(input, "WEB");
  }

  private async scrapeRecipe(url: string) {
    const body = {
      url,
    };
    const response = await fetch(`${process.env.NLP_URL}/scrape`, {
      method: "post",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    const data = (await response
      .json()
      .catch((err) => console.log(err))) as RecipeScraperResponse;

    return data;
  }

  private async downloadImage(url: string): Promise<Photo | undefined> {
    const response = await fetch(url);
    const imageBuffer = Buffer.from(await response.arrayBuffer());
    return await db.photo.uploadPhoto(imageBuffer, true);
  }

  async toNutritionLabel<T extends z.ZodTypeAny>(
    schema: T
  ): Promise<z.infer<T> | undefined> {
    if (!this.parsedRecipe)
      this.parsedRecipe = await this.scrapeRecipe(this.input);
    if (!this.parsedRecipe.nutrients) return;

    const nutrients = await Promise.all(
      Object.entries(this.parsedRecipe.nutrients).map(async ([name, value]) => {
        const nutrientAmount = this.extractFirstNumber(value);
        return {
          value: nutrientAmount,
          nutrientId: await WebParsedRecord.matchNutrient(
            name,
            this.importSource
          ),
        };
      })
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return schema.parse({
      name: this.parsedRecipe.title,
      isPrimary: true,
      servings: this.extractServingSize(this.parsedRecipe.yields),
      servingSize:
        this.parsedRecipe?.nutrients?.servingSize &&
        this.extractFirstNumber(this.parsedRecipe.nutrients.servingSize),
      nutrients: nutrients,
    }) as z.infer<T>;
  }

  async transform<T extends z.ZodTypeAny>(schema: T): Promise<z.infer<T>> {
    if (!this.parsedRecipe)
      this.parsedRecipe = await this.scrapeRecipe(this.input);
    const image = await this.downloadImage(this.parsedRecipe.image);
    const collections = await this.matchCollections({
      categories: this.parsedRecipe.category
        ? [this.parsedRecipe.category]
        : undefined,
      cuisines: this.parsedRecipe.cuisine
        ? [this.parsedRecipe.cuisine]
        : undefined,
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return schema.parse({
      title: this.parsedRecipe.title,
      photoIds: image ? [image.id] : undefined,
      cookTime: this.parsedRecipe.cookTime,
      categoryIds: collections.categoryIds,
      cuisineIds: collections.cuisineIds,
      directions: this.parsedRecipe.instructions,
      prepTime: this.parsedRecipe.prepTime,
      source: this.parsedRecipe.canonical_url,
      ingredients: this.parsedRecipe.ingredients.join("/n"),
    }) as z.infer<T>;
  }
}

export { WebParsedRecord };
