import { PrismaClient } from "@prisma/client";
import { nutritionExtension } from "./models/NutritionExtension.js";
import { recipeExtensions } from "./models/RecipeExtension.js";

export const db = new PrismaClient()
  .$extends(recipeExtensions)
  .$extends(nutritionExtension);
