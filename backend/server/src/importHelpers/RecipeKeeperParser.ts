import { ScalarLeafsRule } from "graphql";
import { HTMLElement } from "node-html-parser";
import { Photo, RecordStatus } from "@prisma/client";

export type RecipeKeeperRecipe = {
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
  recipeNutServingSize: string;
  recipeNutCalories: string;
  recipeNutTotalFat: string;
  recipeNutSaturatedFat: string;
  recipeNutSodium: string;
  recipeNutTotalCarbohydrate: string;
  recipeNutSugars: string;
  recipeNutProtein: string;
  recipeNutCholesterol: string;
  recipeNutDietaryFiber: string;
  recipeCourse: string[];
  photos: string[];
  recipeCollection: string[];
  recipeCategory: string[];
  rawInput: string;
  matchId: string;
  status: RecordStatus;
};

export class RecipeKeeperParser {
  scalarProps: { [key: string]: string } = {
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
    recipeNutServingSize: "",
    recipeNutCalories: "",
    recipeNutTotalFat: "",
    recipeNutSaturatedFat: "",
    recipeNutSodium: "",
    recipeNutTotalCarbohydrate: "",
    recipeNutSugars: "",
    recipeNutProtein: "",
    recipeNutCholesterol: "",
    recipeNutDietaryFiber: "",
    rawInput: "",
    matchId: "",
    status: "PENDING",
  };
  arrayProps: { [key: string]: string[] } = {
    recipeCourse: [],
    photos: [],
    recipeCollection: [],
    recipeCategory: [],
  };

  constructor(rawInput: string) {
    this.scalarProps.rawInput = rawInput;
  }

  addProperty(prop: string, value: string): void {
    if (prop in this.scalarProps) {
      this.scalarProps[prop] = value;
    } else if (prop in this.arrayProps) {
      if (value !== "" && value !== undefined && value !== null)
        this.arrayProps[prop].push(value);
    }
  }

  getValue(key: string, prop: HTMLElement): string {
    let value = key.startsWith("photo")
      ? prop.getAttribute("src")
      : prop.getAttribute("content");
    if (value !== "" && value !== undefined && value !== null) return value;

    value = this.sanitizeInput(prop.innerText);
    if (value !== "" && value !== undefined && value !== null) return value;

    return "";
  }

  parseHtmlElement(prop: HTMLElement) {
    const key = prop.getAttribute("itemprop");
    if (key === undefined || key === null) return;
    const value = this.getValue(key, prop);

    if (key.startsWith("photo")) {
      this.addProperty("photos", value);
    } else {
      this.addProperty(key, value);
    }
  }

  sanitizeInput(input: string): string {
    const workingCopy: string[] = input
      .split("\r\n")
      .filter((text) => text !== "")
      .map((text) => text.replace("•", "").trim());
    return workingCopy.join("\n");
  }

  toObject(): RecipeKeeperRecipe {
    return {
      ...this.scalarProps,
      ...this.arrayProps,
    } as RecipeKeeperRecipe;
  }
}
