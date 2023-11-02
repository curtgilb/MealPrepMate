import { PrismaClient } from "@prisma/client";
import { uploadPhoto } from "./extensions/PhotoExtension.js";
import {
  createRecipe,
  createRecipeKeeperRecipe,
} from "./extensions/RecipeExtension.js";
export const db = new PrismaClient().$extends({
  model: {
    recipe: {
      createRecipe,
      createRecipeKeeperRecipe,
    },
    photo: {
      uploadPhoto,
    },
  },
});
