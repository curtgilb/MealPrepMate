import {
  TransformedRecord,
  TransformMapping,
} from "@/application/services/import/transformers/TransformedRecord.js";
import {
  FileSource,
  Transformer,
} from "@/application/services/import/transformers/Transformer.js";
import { CreateNutrientInput } from "@/application/services/nutrition/NutritionLabelService.js";
import { uploadPhoto } from "@/application/services/PhotoService.js";
import { tagIngredients } from "@/application/services/recipe/RecipeIngredientService.js";
import { toNumber } from "@/application/util/TypeCast.js";
import { getFileMetadata } from "@/infrastructure/file_io/common.js";
import { HTMLElement, parse as parseHTML } from "node-html-parser";

export class RecipeKeeperTransformer extends Transformer {
  recipeKeeperMapping: { [key: string]: TransformMapping | null } = {
    recipeId: {
      type: "meta",
      key: "externalId",
    },
    recipeShareId: null,
    recipeIsFavourite: null,
    recipeRating: null,
    name: { type: "recipe", key: "title" },
    recipeCourse: {
      type: "recipe",
      key: "courseIds",
      isList: true,
      processValue: Transformer.matchCourse,
    },
    recipeCategory: {
      type: "recipe",
      key: "cuisineIds",
      isList: true,
      processValue: Transformer.matchCategory,
    },
    recipeCollection: {
      type: "recipe",
      key: "categoryIds",
      isList: true,
      processValue: Transformer.matchCategory,
    },
    recipeSource: { type: "recipe", key: "source" },
    recipeYield: {
      type: "label",
      key: "servings",
      processValue: this.extractServingSize.bind(this),
    },
    prepTime: {
      type: "recipe",
      key: "prepTime",
      processValue: this.getTime.bind(this),
    },
    cookTime: {
      type: "recipe",
      key: "cookTime",
      processValue: this.getTime.bind(this),
    },
    recipeIngredients: {
      type: "recipe",
      key: "ingredients",
      processValue: tagIngredients,
    },
    recipeDirections: { type: "recipe", key: "directions" },
    recipeNotes: { type: "recipe", key: "notes" },
    recipeNutServingSize: {
      type: "label",
      key: "servingSize",
      processValue: this.extractServingSize.bind(this),
    },
    recipeNutCalories: {
      type: "label",
      isList: true,
      key: "nutrients",
      processValue: this.getNutrientId.bind(this),
    },
    recipeNutTotalFat: {
      type: "label",
      isList: true,
      key: "nutrients",
      processValue: this.getNutrientId.bind(this),
    },
    recipeNutSaturatedFat: {
      type: "label",
      isList: true,
      key: "nutrients",
      processValue: this.getNutrientId.bind(this),
    },
    recipeNuteCholesterol: {
      type: "label",
      isList: true,
      key: "nutrients",
      processValue: this.getNutrientId.bind(this),
    },
    recipeNutSodium: {
      type: "label",
      isList: true,
      key: "nutrients",
      processValue: this.getNutrientId.bind(this),
    },
    recipeNutTotalCarbohydrate: {
      type: "label",
      isList: true,
      key: "nutrients",
      processValue: this.getNutrientId.bind(this),
    },
    recipeNutDietaryFiber: {
      type: "label",
      isList: true,
      key: "nutrients",
      processValue: this.getNutrientId.bind(this),
    },
    recipeNutSugars: {
      type: "label",
      isList: true,
      key: "nutrients",
      processValue: this.getNutrientId.bind(this),
    },
    recipeNutProtein: {
      type: "label",
      isList: true,
      key: "nutrients",
      processValue: this.getNutrientId.bind(this),
    },
    photo: { type: "recipe", isList: true, key: "photoIds" },
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
          records = await this.processHtmlFile(fileBuffer);
        } else if (
          ["jpg", "png", "bmp", "tif", "heic"].includes(
            metaData.auto?.ext ?? ""
          )
        ) {
          await this.processImage(file.path, fileBuffer, imageLookup);
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

  private async processHtmlFile(file: Buffer): Promise<TransformedRecord[]> {
    const parsedRecipes: TransformedRecord[] = [];

    const html = parseHTML(file.toString());
    const recipes = html.querySelectorAll(".recipe-details");
    for (const recipe of recipes) {
      const record = await this.parseRecipe(recipe);
      parsedRecipes.push(record);
    }
    return parsedRecipes;
  }

  private async parseRecipe(html: HTMLElement): Promise<TransformedRecord> {
    const record = new TransformedRecord();
    const tags = html.querySelectorAll("*[itemProp]");
    for (const tag of tags) {
      const property = this.getPropertyKeyValuePair(tag);

      if (property.key && property.value) {
        property.key = property.key.startsWith("photo")
          ? "photo"
          : property.key;

        const map = this.recipeKeeperMapping[property.key];
        if (map) {
          await record.addProperty(map, property.key, property.value);
        }
      }
    }

    return record;
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
