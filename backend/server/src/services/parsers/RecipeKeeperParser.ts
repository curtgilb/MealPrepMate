import { RecipeKeeperRecipe } from "../../types/CustomTypes.js";
import { HTMLElement } from "node-html-parser";
import { parse as parseHTML } from "node-html-parser";

export class RecipeKeeperParser {
  data: string;
  parsedRecipes: RecipeKeeperRecipe[] = [];

  constructor(data: string) {
    this.data = data;
  }

  parse(): RecipeKeeperRecipe[] {
    const html = parseHTML(this.data);
    const recipes = html.querySelectorAll(".recipe-details");
    for (const recipe of recipes) {
      // Grab all elements that are properties of each recipe
      const properties = recipe.querySelectorAll("*[itemProp]");
      const parsedRecipe = new Recipe(recipe.toString());

      properties.forEach((property) => {
        parsedRecipe.parseProperty(property);
      });
      this.parsedRecipes.push(parsedRecipe.toObject());
    }
    return this.parsedRecipes;
  }
}

class Recipe {
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

  private addProperty(prop: string, value: string): void {
    if (prop in this.scalarProps) {
      this.scalarProps[prop] = value;
    } else if (prop in this.arrayProps) {
      if (value !== "" && value !== undefined && value !== null)
        this.arrayProps[prop].push(value);
    }
  }

  private getValue(key: string, prop: HTMLElement): string {
    let value = key.startsWith("photo")
      ? prop.getAttribute("src")
      : prop.getAttribute("content");
    if (value !== "" && value !== undefined && value !== null) return value;

    value = this.sanitizeInput(prop.innerText);
    if (value !== "" && value !== undefined && value !== null) return value;

    return "";
  }

  parseProperty(prop: HTMLElement) {
    const key = prop.getAttribute("itemprop");
    if (key === undefined || key === null) return;
    const value = this.getValue(key, prop);

    if (key.startsWith("photo")) {
      this.addProperty("photos", value);
    } else {
      this.addProperty(key, value);
    }
  }

  private sanitizeInput(input: string): string {
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
