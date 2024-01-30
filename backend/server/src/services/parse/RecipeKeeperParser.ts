import { FileMetaData, RecipeKeeperRecipe } from "../../types/CustomTypes.js";
import { HTMLElement } from "node-html-parser";
import { parse as parseHTML } from "node-html-parser";
import { db } from "../../db.js";
import { Parser, ParsedOutput, ParsedRecord } from "../parsers/Parser.js";
import { RecipeInput } from "../../types/gql.js";
import { ImportType, PrismaClient } from "@prisma/client";
import { File as ZipFile } from "unzipper";
import { hash } from "../../util/utils.js";
import { z } from "zod";

type RecipeKeeperRecipe = {
  recipeId: string;
  recipeShareId: string;
  recipeIsFavourite: string;
  recipeRating: string;
  name: string;
  recipeSource: string;
  recipeYield: string;
  prepTime: string;
  cookTime: string;
  recipeIngredients: string;
  recipeDirections: string;
  recipeNotes: string;
  nutritionServingSize: string;
  nutrients: { name: string; value: string }[];
  recipeCourse: string[];
  photos: string[];
  recipeCollection: string[];
  recipeCategory: string[];
};

class RecipeKeeperRecord extends ParsedRecord<RecipeInput> {
  externalId: string | number | undefined;
  deserializedData: RecipeKeeperHtml;
  importType: ImportType = "RECIPE_KEEPER";

  constructor(input: string, parsedHtml: HTMLElement) {
    super(input);
    this.deserializedData = new RecipeKeeperHtml(parsedHtml);
  }

  toNutritionLabel<T extends z.ZodTypeAny>(
    schema: T,
    connectingId: string
  ): Promise<z.infer<T>> {
    this.matchNutrients();
    return {
      name: this.deserializedData.recipe.name,
      connectingId: connectingId,
      servings: this.deserializedData.recipe.recipeYield,
      servingSize: this.deserializedData.recipe.nutritionServingSize,
      nutrition: this.deserializedData.recipe.nutrients.map((nutrient) => ({
        value: nutrient.value,
        nutrientId: nutrient.name,
      })),
    } as z.infer<T>;
  }

  async toObject<T extends z.ZodTypeAny>(
    schema: T,
    imageMapping: Map<string, string>
  ): Promise<z.infer<T>> {
    const recipe = this.deserializedData.toObject();
    const courses = await Promise.all(
      recipe.recipeCourse.map(
        async (course) => (await db.course.findOrCreate(course))?.id
      )
    );
    const categories = await Promise.all(
      recipe.recipeCategory.map(
        async (category) => (await db.category.findOrCreate(category))?.id
      )
    );

    let cuisine =
      recipe.recipeCollection.length > 0
        ? recipe.recipeCollection[0]
        : undefined;
    cuisine = cuisine
      ? (await db.cuisine.findOrCreate(cuisine))?.id
      : undefined;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return schema.parse({
      title: recipe.name,
      source: recipe.recipeSource,
      prepTime: recipe.prepTime,
      cookTime: recipe.cookTime,
      directions: recipe.recipeDirections,
      notes: recipe.recipeNotes,
      photos: recipe.photos.map((photoPath) => imageMapping.get(photoPath)),
      isFavorite: recipe.recipeIsFavourite,
      courseIds: courses,
      categoryIds: categories,
      cuisineId: cuisine,
      ingredients: recipe.recipeIngredients,
    }) as z.infer<T>;
  }
}

class RecipeKeeperParser extends Parser<RecipeInput> {
  protected records: RecipeKeeperRecord[] = [];

  constructor(source: string | File) {
    super(source);
  }
  async parse(): Promise<ParsedOutput<RecipeInput>> {
    const directory = await this.unzipFile(this.source);
    await this.traverseDirectory(directory);
    return {
      records: this.records,
      recordHash: this.fileHash,
      imageMapping: this.imageMapping,
    };
  }

  async processFile(file: ZipFile, metaData: FileMetaData): Promise<void> {
    if (metaData.ext === "html") {
      const htmlData = (await file.buffer()).toString();
      this.fileHash = hash(htmlData);
      const html = parseHTML((await file.buffer()).toString());
      const recipes = html.querySelectorAll(".recipe-details");
      for (const recipe of recipes) {
        this.records.push(new RecipeKeeperRecord(recipe.toString(), recipe));
      }
    } else if (["jpg", "png", "tiff"].includes(metaData.ext)) {
      const photo = await db.photo.uploadPhoto(
        await file.buffer(),
        metaData.name,
        { select: { id: true } }
      );
      this.imageMapping.set(metaData.path, photo.id);
    }
  }
}

class RecipeKeeperHtml {
  recipe: RecipeKeeperRecipe = {
    recipeId: "",
    recipeShareId: "",
    recipeIsFavourite: "",
    recipeRating: "",
    name: "",
    recipeSource: "",
    recipeYield: "",
    prepTime: "",
    cookTime: "",
    recipeIngredients: "",
    recipeDirections: "",
    recipeNotes: "",
    nutritionServingSize: "",
    recipeCourse: [],
    photos: [],
    recipeCollection: [],
    recipeCategory: [],
    nutrients: [],
  };

  constructor(input: HTMLElement) {
    const properties = input.querySelectorAll("*[itemProp]");
    properties.forEach((property) => {
      this.parseProperty(property);
    });
  }

  private parseProperty(prop: HTMLElement) {
    let key = prop.getAttribute("itemprop");
    if (!key) return;
    let value = this.getValue(key, prop);
    if (key.startsWith("photo")) {
      key = "photos";
      value = value.split("/").pop() as string;
    }
    this.addProperty(key, value);
  }

  private addProperty(prop: string, value: string): void {
    if (prop in this.recipe) {
      // handle scalar values
      if (!Array.isArray(this.recipe[prop as keyof RecipeKeeperRecipe])) {
        (this.recipe[prop as keyof RecipeKeeperRecipe] as string) = value;
      }
      // handle arrays
      else {
        (this.recipe[prop as keyof RecipeKeeperRecipe] as string[]).push(value);
      }
    }
    // Handle nutrients
    else if (prop.includes("recipeNut")) {
      if (prop === "recipeNutServingSize") {
        this.recipe.nutritionServingSize = value;
      } else {
        this.recipe.nutrients.push({
          name: prop,
          value: value,
        });
      }
    }
  }

  private getValue(key: string, prop: HTMLElement): string {
    let value = key.startsWith("photo")
      ? prop.getAttribute("src")
      : prop.getAttribute("content");
    if (value) return value;

    value = this.sanitizeInput(prop.innerText);
    if (value) return value;

    return "";
  }

  private sanitizeInput(input: string): string {
    const workingCopy: string[] = input
      .split("\r\n")
      .filter((text) => text !== "")
      .map((text) => text.replace("•", "").trim());
    return workingCopy.join("\n");
  }

  private getTime(input: string): string {
    const match = Array.from(input.matchAll(/(?<time>\d+)(?<unit>.)/gm))[0];
    if (match.groups) {
      const time: number = parseInt(match.groups.time);
      const unit: string = match.groups.unit;
      if (unit === "S") {
        return (time / 60).toString();
      } else if (unit === "H") {
        return (time * 60).toString();
      } else {
        return time.toString();
      }
    }
    return "0";
  }

  private extractServingSize(input: string): string {
    if (input) {
      const numbers = input.match(/\d+\.\d+|\d+\b|\d+(?=\w)/g);
      if (numbers !== null && numbers.length > 0) {
        return numbers[0] === undefined ? "1" : numbers[0];
      }
    }
    return "1";
  }

  toObject(): RecipeKeeperRecipe {
    this.recipe.prepTime = this.getTime(this.recipe.prepTime);
    this.recipe.cookTime = this.getTime(this.recipe.cookTime);
    this.recipe.recipeYield = this.extractServingSize(this.recipe.recipeYield);
    this.recipe.nutritionServingSize = this.extractServingSize(
      this.recipe.nutritionServingSize
    );
    return this.recipe;
  }
}
