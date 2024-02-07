import { Ingredient } from "@prisma/client";
import { db } from "../db.js";
import Fuse from "fuse.js";

export class IngredientSearch {
  ingredients: Fuse<Ingredient> | undefined;
  options = {
    isCaseSensitive: false,
    keys: ["name", "alternateNames"],
  };

  constructor(ingredients?: Ingredient[]) {
    if (ingredients) {
      this.ingredients = new Fuse(ingredients, this.options);
    }
  }

  async init() {
    const ingredients = await db.ingredient.findMany({});
    this.ingredients = new Fuse(ingredients, this.options);
  }

  search(query: string): Ingredient | undefined {
    if (!query) return undefined;
    if (!this.ingredients) throw Error("IngredientSearch not initialized");
    const results = this.ingredients.search(query);
    return results.length > 0 ? results[0].item : undefined;
  }
}
