import { CreateRecipeInput } from "@/application/services/recipe/RecipeService.js";
import { CentralDirectory, Open, File as ZipFile } from "unzipper";

import { downloadFile } from "@/infrastructure/object_storage/storage.js";
import { TransformedRecord } from "@/application/services/import/transformers/TransformedRecord.js";
import {
  CreateNutrientInput,
  CreateNutritionLabelInput,
} from "@/application/services/nutrition/NutritionLabelService.js";
import { Category, Course, Cuisine } from "@prisma/client";
import { db } from "@/infrastructure/repository/db.js";

export type FileSource =
  | { type: "local"; filePath: string }
  | { type: "remote"; bucketPath: string }
  | { type: "upload"; file: File };

export enum TargetType {
  Recipe,
  Label,
  Nutrient,
  ID,
}

type RecipeProperty<
  K extends keyof CreateRecipeInput = keyof CreateRecipeInput,
> = {
  target: TargetType.Recipe;
  isArray?: boolean;
  prop: K;
  processValue?: (value: string, key?: string) => CreateRecipeInput[K];
};

type LabelProperty<
  K extends keyof CreateNutritionLabelInput = keyof CreateNutritionLabelInput,
> = {
  target: TargetType.Label;
  prop: K;
  processValue?: (value: string, key?: string) => CreateNutritionLabelInput[K];
};

type NutrientProperty = {
  target: TargetType.Nutrient;
  processValue?: (value: string, key?: string) => CreateNutrientInput;
};

type IDProperty = {
  target: TargetType.ID;
  processValue?: (value: string, key?: string) => string;
};

export type PropertyMap =
  | RecipeProperty
  | LabelProperty
  | NutrientProperty
  | IDProperty;

export type TransformerMap = {
  [key: string]: PropertyMap | null;
};

export abstract class Transformer {
  static cuisines: Cuisine[] | undefined;
  static courses: Course[] | undefined;
  static categories: Category[] | undefined;

  abstract transform(source: FileSource): Promise<TransformedRecord[]>;

  // Retrieves the contents from
  protected readFile(source: FileSource) {
    // switch (source.type) {
    //   case "local":
    //     return await Open.file(source.filePath);
    //   case "remote":
    //     const file = await downloadFile(source.bucketPath);
    //     return await Open.buffer(Buffer.from(await file.arrayBuffer()));
    //   case "upload":
    //     return await Open.buffer(Buffer.from(await source.file.arrayBuffer()));
    //   default:
    //     throw Error(`Invalid object passed to unzipFile`);
    // }
  }

  protected static async loadCuisines() {
    if (!Transformer.cuisines) {
      Transformer.cuisines = await db.cuisine.findMany({});
    }
  }
  protected static async loadCourses() {
    if (!Transformer.courses) {
      Transformer.courses = await db.course.findMany({});
    }
  }
  protected static async loadCategories() {
    if (!Transformer.categories) {
      Transformer.categories = await db.category.findMany({});
    }
  }

  protected async unzipFile(source: FileSource): Promise<CentralDirectory> {
    switch (source.type) {
      case "local":
        return await Open.file(source.filePath);
      case "remote":
        const file = await downloadFile(source.bucketPath);
        return await Open.buffer(Buffer.from(await file.arrayBuffer()));
      case "upload":
        return await Open.buffer(Buffer.from(await source.file.arrayBuffer()));
      default:
        throw Error(`Invalid object passed to unzipFile`);
    }
  }

  protected static matchCuisine(search: string) {
    if (Transformer.cuisines) {
      for (const cuisine of Transformer.cuisines) {
        if (cuisine.name.toLowerCase().includes(search.toLowerCase())) {
          return cuisine.id;
        }
      }
    }

    return undefined;
  }

  protected static matchCategory(search: string) {
    if (Transformer.categories) {
      for (const category of Transformer.categories) {
        if (category.name.toLowerCase().includes(search.toLowerCase())) {
          return category.id;
        }
      }
    }

    return undefined;
  }

  protected static matchCourse(search: string) {
    if (Transformer.courses) {
      for (const course of Transformer.courses) {
        if (course.name.toLowerCase().includes(search.toLowerCase())) {
          return course.id;
        }
      }
    }

    return undefined;
  }
}
