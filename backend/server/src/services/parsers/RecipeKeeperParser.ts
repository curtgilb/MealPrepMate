import { RecipeKeeperRecipe } from "../../types/CustomTypes.js";
import { HTMLElement } from "node-html-parser";
import { parse as parseHTML } from "node-html-parser";
import { cast } from "../../util/Cast.js";
import { db } from "../../db.js";

export class RecipeKeeperParser {
  async parse(data: string): Promise<RecipeKeeperRecipe[]> {
    const parsedRecipes: RecipeKeeperRecipe[] = [];
    const html = parseHTML(data);
    const nutrients = await db.nutrient.findMany({
      where: { recipeKeeperMapping: { not: null } },
    });
    const mapping = nutrients.reduce((acc, curr) => {
      if (curr.recipeKeeperMapping) {
        acc.set(curr.recipeKeeperMapping, curr.id);
      }
      return acc;
    }, new Map<string, string>());

    const recipes = html.querySelectorAll(".recipe-details");
    for (const recipe of recipes) {
      const parsedRecipe = new Recipe(recipe, mapping);
      parsedRecipes.push(parsedRecipe.toObject());
    }
    return parsedRecipes;
  }
}

class Recipe {
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
    rawInput: "",
    recipeCourse: [],
    photos: [],
    recipeCollection: [],
    recipeCategory: [],
    nutrients: [],
  };
  existingNutrients: Map<string, string>;

  constructor(
    input: HTMLElement,
    // recipeKeeperColumnName: idInDB
    existingNutrients: Map<string, string>
  ) {
    this.recipe.rawInput = input.toString();
    this.existingNutrients = existingNutrients;
    const properties = input.querySelectorAll("*[itemProp]");
    properties.forEach((property) => {
      this.parseProperty(property);
    });
  }

  private parseProperty(prop: HTMLElement) {
    let key = prop.getAttribute("itemprop");
    if (!key) return;
    const value = this.getValue(key, prop);
    key = key.startsWith("photo") ? "photos" : key;
    this.addProperty(key, value);
  }

  private addProperty(prop: string, value: string): void {
    if (prop in this.recipe) {
      if (!Array.isArray(this.recipe[prop as keyof RecipeKeeperRecipe])) {
        (this.recipe[prop as keyof RecipeKeeperRecipe] as string) = value;
      } else {
        (this.recipe[prop as keyof RecipeKeeperRecipe] as string[]).push(value);
      }
    } else if (prop.includes("recipeNut")) {
      if (prop === "recipeNutServingSize") {
        this.recipe.nutritionServingSize = value;
      } else {
        const matchingId = this.existingNutrients.get(prop);
        if (matchingId) {
          this.recipe.nutrients.push({
            id: matchingId,
            amount: cast(value) as number,
          });
        }
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

// Test
// const htmlData = readFile("../../../data/RecipeKeeper/recipes.html");
// const parser = new RecipeKeeperParser();
// const recipes = await parser.parse(htmlData);
// console.log(recipes);
