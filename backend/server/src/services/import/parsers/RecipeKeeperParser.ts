import { FileMetaData, Match } from "../../../types/CustomTypes.js";
import { HTMLElement } from "node-html-parser";
import { parse as parseHTML } from "node-html-parser";
import { db } from "../../../db.js";
import { Parser, ParsedOutput, ParsedRecord } from "./Parser.js";
import { RecipeInput } from "../../../types/gql.js";
import { ImportType } from "@prisma/client";
import { File as ZipFile } from "unzipper";
import { hash } from "../../../util/utils.js";
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
  externalId: string | undefined;
  parsedData: RecipeKeeperHtml;
  importType: ImportType = "RECIPE_KEEPER";

  constructor(input: string, parsedHtml: HTMLElement | RecipeKeeperRecipe) {
    super(input);
    this.parsedData = new RecipeKeeperHtml(parsedHtml);
    this.externalId = this.parsedData.recipe.recipeId;
  }

  getTitle(): string {
    return this.parsedData.recipe.name;
  }

  getIngredients(): string {
    return this.parsedData.recipe.recipeIngredients;
  }

  getParsedObject(): RecipeKeeperRecipe {
    return this.parsedData.toObject();
  }

  toNutritionLabel<T extends z.ZodTypeAny>(
    schema: T,
    connectingId?: string
  ): Promise<z.infer<T>> {
    const nutrients = this.parsedData.recipe.nutrients
      .filter((nutrient) => {
        const result = z.coerce.number().positive().safeParse(nutrient.value);
        return result.success;
      })
      .map(async (nutrient) => ({
        value: nutrient.value,
        nutrientId: await ParsedRecord.matchNutrient(
          nutrient.name,
          this.importType
        ),
      }));

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return schema.parse({
      name: this.parsedData.recipe.name,
      connectingId: connectingId,
      servings: this.parsedData.recipe.recipeYield,
      servingSize: this.parsedData.recipe.nutritionServingSize,
      nutrition: nutrients,
    }) as z.infer<T>;
  }

  async transform<T extends z.ZodTypeAny>(
    schema: T,
    imageMapping?: Map<string, string>
  ): Promise<z.infer<T>> {
    const recipe = this.parsedData.toObject();
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
    console.log(recipe.recipeIsFavourite);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return schema.parse({
      title: recipe.name,
      source: recipe.recipeSource,
      prepTime: recipe.prepTime,
      cookTime: recipe.cookTime,
      directions: recipe.recipeDirections,
      notes: recipe.recipeNotes,
      photos: recipe.photos.map((photoPath) => imageMapping?.get(photoPath)),
      isFavorite: recipe.recipeIsFavourite,
      courseIds: courses,
      categoryIds: categories,
      cuisineId: cuisine,
      ingredients: recipe.recipeIngredients,
    }) as z.infer<T>;
  }
}

class RecipeKeeperParser extends Parser<RecipeInput, RecipeKeeperRecord> {
  protected records: RecipeKeeperRecord[] = [];
  protected fileHash: string | undefined = undefined;
  protected fileName: string | undefined = undefined;

  constructor(source: string | File) {
    super(source);
  }
  async parse(): Promise<ParsedOutput<RecipeInput, RecipeKeeperRecord>> {
    const directory = await this.unzipFile(this.source);
    this.fileName =
      this.source instanceof File ? this.source.name : this.source;
    await this.traverseDirectory(directory);
    return {
      records: this.records,
      recordHash: this.fileHash,
      imageMapping: this.imageMapping,
      fileName: this.fileName,
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

      this.imageMapping.set(`images/${metaData.name}`, photo.id);
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

  constructor(input: HTMLElement | RecipeKeeperRecipe) {
    if (input instanceof HTMLElement) {
      const properties = input.querySelectorAll("*[itemProp]");
      properties.forEach((property) => {
        this.parseProperty(property);
      });
    } else {
      this.recipe = input;
    }
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
        if (value)
          (this.recipe[prop as keyof RecipeKeeperRecipe] as string[]).push(
            value
          );
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
    if (match && match.groups) {
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

export { RecipeKeeperParser, RecipeKeeperRecord, RecipeKeeperHtml };

// const rkParser = new RecipeKeeperParser("../../../data/recipekeeper.zip");
// const result = await rkParser.parse();
// console.log("finish");
