import { PrismaClient } from "@prisma/client";
import { nutritionExtension } from "./extensions/NutritionExtension.js";
import { recipeExtensions } from "./extensions/RecipeExtension.js";

export const db = new PrismaClient()
  .$extends(recipeExtensions)
  .$extends(nutritionExtension);
