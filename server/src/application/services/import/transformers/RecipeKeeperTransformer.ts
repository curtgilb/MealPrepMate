import { TransformedRecord } from "@/application/services/import/transformers/TransformedRecord.js";
import {
  FileSource,
  PropertyMap,
  TargetType,
  Transformer,
  TransformerMap,
} from "@/application/services/import/transformers/Transformer.js";
import { CreateNutrientInput } from "@/application/services/nutrition/NutritionLabelService.js";
import { uploadPhoto } from "@/application/services/PhotoService.js";
import { toNumber } from "@/application/util/TypeCast.js";
import { getFileMetadata } from "@/infrastructure/file_io/common.js";
import { HTMLElement, parse as parseHTML } from "node-html-parser";

export class RecipeKeeperTransformer extends Transformer {
  recipeKeeperMapping: TransformerMap = {
    recipeId: {
      target: TargetType.ID,
    },
    recipeShareId: null,
    recipeIsFavourite: null,
    recipeRating: null,
    name: { target: TargetType.Recipe, prop: "title" },
    recipeCourse: {
      target: TargetType.Recipe,
      prop: "courseIds",
      isArray: true,
      processValue: Transformer.matchCourse,
    },
    recipeCategory: {
      target: TargetType.Recipe,
      prop: "cuisineIds",
      isArray: true,
      processValue: Transformer.matchCategory,
    },
    recipeCollection: {
      target: TargetType.Recipe,
      prop: "categoryIds",
      isArray: true,
      processValue: Transformer.matchCategory,
    },
    recipeSource: { target: TargetType.Recipe, prop: "source", isArray: true },
    recipeYield: {
      target: TargetType.Label,
      prop: "servings",
      processValue: this.extractServingSize.bind(this),
    },
    prepTime: {
      target: TargetType.Recipe,
      prop: "prepTime",
      processValue: this.getTime.bind(this),
    },
    cookTime: {
      target: TargetType.Recipe,
      prop: "cookTime",
      processValue: this.getTime.bind(this),
    },
    recipeIngredients: { target: TargetType.Recipe, prop: "ingredients" },
    recipeDirections: { target: TargetType.Recipe, prop: "directions" },
    recipeNotes: { target: TargetType.Recipe, prop: "notes" },
    recipeNutServingSize: {
      target: TargetType.Label,
      prop: "servingSize",
      processValue: this.extractServingSize.bind(this),
    },
    recipeNutCalories: {
      target: TargetType.Nutrient,
      processValue: this.getNutrientId.bind(this),
    },
    recipeNutTotalFat: {
      target: TargetType.Nutrient,
      processValue: this.getNutrientId.bind(this),
    },
    recipeNutSaturatedFat: {
      target: TargetType.Nutrient,
      processValue: this.getNutrientId.bind(this),
    },
    recipeNuteCholesterol: {
      target: TargetType.Nutrient,
      processValue: this.getNutrientId.bind(this),
    },
    recipeNutSodium: {
      target: TargetType.Nutrient,
      processValue: this.getNutrientId.bind(this),
    },
    recipeNutTotalCarbohydrate: {
      target: TargetType.Nutrient,
      processValue: this.getNutrientId.bind(this),
    },
    recipeNutDietaryFiber: {
      target: TargetType.Nutrient,
      processValue: this.getNutrientId.bind(this),
    },
    recipeNutSugars: {
      target: TargetType.Nutrient,
      processValue: this.getNutrientId.bind(this),
    },
    recipeNutProtein: {
      target: TargetType.Nutrient,
      processValue: this.getNutrientId.bind(this),
    },
    photo: { target: TargetType.Recipe, prop: "photoIds" },
  };

  nutrientMapping = {
    recipeNutCalories: "6e0fcef3-ec44-426c-9945-a53737e96c79",
    recipeNutTotalFat: "1970c0ef-fc55-49ee-8ee3-228f5e061acb",
    recipeNutSaturatedFat: "036b12f3-651f-443a-b716-af604998b9ae",
    recipeNutCholesterol: "71bf849f-dae3-45b2-9d61-41c76d540024",
    recipeNutSodium: "485b501a-0f5c-4a2e-8abb-b9f3dae79ada",
    recipeNutTotalCarbohydrate: "0e5a0c1b-0308-4d46-9f46-141e1829e202",
    recipeNutDietaryFiber: "737d014c-219e-45e8-b7a5-3b0b25829a34",
    recipeNutSugars: "3c356ec3-0b13-4ea1-a58e-83949ef0e2cc",
    recipeNutProtein: "bc012bd3-8792-40c1-a2eb-a890600f6677",
  };

  async transform(source: FileSource): Promise<TransformedRecord[]> {
    let records: TransformedRecord[] = [];
    const imageLookup: { [key: string]: string } = {};
    const directory = await super.unzipFile(source);

    for (const file of directory.files) {
      if (file.type === "File") {
        const fileBuffer = await file.buffer();
        const metaData = await getFileMetadata(fileBuffer, file.path);

        if (metaData.path.ext === "html") {
          records = this.processHtmlFile(fileBuffer);
        } else if (
          ["jpg", "png", "bmp", "tif", "heic"].includes(
            metaData.auto?.ext ?? ""
          )
        ) {
          this.processImage(file.path, fileBuffer, imageLookup);
        }
      }
    }

    // Update each recipe with photoIds
    records.forEach((record) => {
      record.updatePhotos(imageLookup);
      record.multiplyNutrientsByServings();
    });

    return records;
  }

  private async processImage(
    path: string,
    file: Buffer,
    imageLookup: { [key: string]: string }
  ) {
    const photo = await uploadPhoto(file);
    imageLookup[path] = photo.id;
  }

  private processHtmlFile(file: Buffer): TransformedRecord[] {
    const parsedRecipes: TransformedRecord[] = [];

    const html = parseHTML(file.toString());
    const recipes = html.querySelectorAll(".recipe-details");
    for (const recipe of recipes) {
      const record = this.parseRecipe(recipe);
      parsedRecipes.push(record);
    }
    return parsedRecipes;
  }

  private parseRecipe(html: HTMLElement): TransformedRecord {
    const record = new TransformedRecord();
    const tags = html.querySelectorAll("*[itemProp]");
    for (const tag of tags) {
      const property = this.getPropertyKeyValuePair(tag);

      if (property.key && property.value) {
        property.key = property.key.startsWith("photo")
          ? "photo"
          : property.key;
        if (
          property.key in this.recipeKeeperMapping &&
          this.recipeKeeperMapping[property.key]
        ) {
          const map = this.recipeKeeperMapping[property.key] as PropertyMap;
          const newValue = this.processValue(map, property.key, property.value);
          if (newValue) {
            record.addProperty(map, newValue);
          }
        }
      }
    }

    return record;
  }

  private processValue(map: PropertyMap, key: string, value: string) {
    return map.processValue
      ? map.target === TargetType.Nutrient
        ? map.processValue(value, key)
        : map.processValue(value)
      : value;
  }

  private getPropertyKeyValuePair(prop: HTMLElement): {
    key: string | undefined;
    value: string | undefined;
  } {
    const key = prop.getAttribute("itemprop");
    let value = key?.startsWith("photo")
      ? prop.getAttribute("src")
      : prop.getAttribute("content");
    if (key && value) {
      return {
        key,
        value,
      };
    }

    value = prop.innerText;
    return { key, value };
  }

  private getNutrientId(value: string, key: string): CreateNutrientInput {
    return { nutrientId: this.nutrientMapping[key], value: toNumber(value) };
  }

  private getTime(input: string) {
    const match = Array.from(input.matchAll(/(?<time>\d+)(?<unit>.)/gm))[0];
    if (match && match.groups) {
      const time: number = parseInt(match.groups.time);
      const unit: string = match.groups.unit;
      if (unit === "S") {
        return time / 60;
      } else if (unit === "H") {
        return time * 60;
      } else {
        return time;
      }
    }
    return undefined;
  }

  private extractServingSize(input: string): number {
    if (input) {
      const numbers = input.match(/\d+\.\d+|\d+\b|\d+(?=\w)/g);
      if (numbers !== null && numbers.length > 0) {
        return numbers[0] === undefined ? 1 : toNumber(numbers[0]);
      }
    }
    return 1;
  }
}
