import { PrismaClient, Recipe as PrismaRecipe } from "@prisma/client";
import { Recipe } from "../gql.js";

class RecipeModel {
  constructor(private readonly prismaRecipe: PrismaClient["recipe"]) {}
  async createRecipe(recipe: Recipe): Promise<PrismaRecipe> {}
}
