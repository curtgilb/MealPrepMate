import { builder } from "../builder.js";
import { db } from "../db.js";
import { RecipeInput } from "../gql.js";
import { processRecipeKeeperImport } from "../services/ImportService/RecipeKeeper.js";
import { RecipeModel } from "../ModelExtensions/Recipe.js";

const recipeInput = builder.inputType("RecipeInput", {
  fields: (t) => ({
    title: t.string({ required: true }),
    servings: t.int({ required: true }),
    source: t.string(),
    prepTime: t.int(),
    cookTime: t.int(),
    marinadeTime: t.int(),
    directions: t.string(),
    notes: t.string(),
    stars: t.int(),
    photos: t.idList(),
    isFavorite: t.boolean(),
    courses: t.idList(),
    category: t.idList(),
    cuisine: t.id(),
    ingredients: t.string(),
    leftoverFridgeLife: t.int(),
    leftoverFreezerLife: t.int(),
  }),
});

builder.mutationType({
  fields: (t) => ({
    createRecipe: t.prismaField({
      type: "Recipe",
      args: {
        recipe: t.arg({ type: recipeInput, required: true }),
      },
      resolve: async (query, root, args, ctx, info) => {
        const recipe = new RecipeModel(db);
        return recipe.createRecipe(args.recipe as RecipeInput, query);
      },
    }),
    import: t.prismaField({
      type: "Import",
      args: {
        file: t.arg({
          type: "File",
          required: true,
        }),
      },
      resolve: async (query, root, args, ctx, info) => {
        return await processRecipeKeeperImport(args.file);
      },
    }),
  }),
});

builder.queryType({
  fields: (t) => ({
    recipes: t.prismaField({
      type: ["Recipe"],
      resolve: async (query, root, args, ctx, info) => {
        console.log({ ...query });
        return await db.recipe.findMany({ ...query });
      },
    }),
    cuisines: t.prismaField({
      type: ["Cuisine"],
      resolve: async (query, root, args, ctx, info) =>
        await db.cuisine.findMany({ ...query }),
    }),
  }),
});
