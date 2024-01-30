import { PrismaClient } from "@prisma/client";
import { nutritionExtension } from "./models/NutritionExtension.js";
import { recipeExtensions } from "./models/RecipeExtension.js";
import { photoExtension } from "./models/PhotoExtension.js";
import { RecipeMetaExtension } from "./models/RecipeMetaExtension.js";

export const db = new PrismaClient()
  .$extends(recipeExtensions)
  .$extends(nutritionExtension)
  .$extends(photoExtension)
  .$extends(RecipeMetaExtension);
