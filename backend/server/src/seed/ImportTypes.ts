import { Gender, SpecialCondition } from "@prisma/client";
import { HTMLElement } from "node-html-parser";
type Ingredient = {
  name: string;
  storageInstructions: string;
  alternativeNames?: string[];
  perishable: boolean;
  fridgeLife: number;
  freezerLife: number;
  defrostTime: number;
  category: string;
};

type Nutrient = {
  nutrient: string;
  symbol: string;
  unit: string;
  notes: string;
  alternateNames: string[];
  type: string;
  parentNutrient: string;
  cronometer: string;
  recipeKeeper: string;
  myFitnessPal: string;
  dri: string;
};

type NutritionLabel = {
  name: string;
  alcohol?: number;
  amount?: string;
  nutrients: NutritionFact[];
};

type NutritionFact = {
  nutrient: string;
  amount: number;
};

type DriLookup = { [key: string]: DailyRecommendedIntake[] };

type DailyRecommendedIntake = {
  gender: Gender;
  ageMin: number;
  ageMax: number;
  specialCondition: SpecialCondition;
  value: number;
};

type Mappings = { [key: string]: { [key: string]: string } };

type Recipe = {
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
};

export class RecipeKeeperRecipe {
  scalarProps: { [key: string]: string } = {};
  arrayProps: { [key: string]: string[] } = {};

  addProperty(prop: string, value: string, scalar = true): void {
    if (scalar) {
      this.scalarProps[prop] = value;
    } else {
      if (!(prop in this.arrayProps)) {
        this.arrayProps[prop] = [];
      }
      this.arrayProps[prop].push(value);
    }
  }
  parseHtmlElement(prop: HTMLElement) {
    const key = prop.getAttribute("itemprop");
    if (key === undefined || key === null) return;
    let value = key.startsWith("photo")
      ? prop.getAttribute("src")
      : prop.getAttribute("content");
    if (value === undefined || value === null) return;
    if (key.startsWith("photo")) {
      this.addProperty(key, value);
    } else if (
      key.includes("Category") ||
      key.includes("Collection") ||
      key.includes("Course")
    ) {
      this.addProperty(key, value, false);
    } else {
      if (!("content" in prop.attributes)) {
        value = this.sanitizeInput(prop.innerText);
      }
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

  getRecipe(): Recipe {
    return {
      ...this.scalarProps,
      ...this.arrayProps,
    } as Recipe;
  }
}
export type {
  Ingredient,
  Nutrient,
  NutritionFact,
  Mappings,
  NutritionLabel,
  DailyRecommendedIntake,
  DriLookup,
  Recipe,
};
