import { searchRecipes } from "@/application/services/recipe/RecipeSearch.js";
import { builder } from "@/graphql/builder.js";
import {
  nextPageInfo,
  offsetPagination,
} from "@/graphql/schemas/common/UtilitySchema.js";
import { recipeIngredientInput } from "@/graphql/schemas/recipe/RecipeIngredientSchema.js";
import { db } from "@/infrastructure/repository/db.js";
import { RecipeInputValidation } from "@/validations/RecipeValidation.js";
import { queryFromInfo } from "@pothos/plugin-prisma";
import {
  parseResolveInfo,
  ResolveTree,
  simplifyParsedResolveInfoFragmentWithType,
} from "graphql-parse-resolve-info";
import { z } from "zod";

// ============================================ Types ===================================
const recipe = builder.prismaObject("Recipe", {
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name"),
    source: t.exposeString("source", { nullable: true }),
    prepTime: t.exposeInt("preparationTime", { nullable: true }),
    cookTime: t.exposeInt("cookingTime", { nullable: true }),
    marinadeTime: t.exposeInt("marinadeTime", { nullable: true }),
    notes: t.exposeString("notes", { nullable: true }),
    verified: t.exposeBoolean("verified"),
    leftoverFridgeLife: t.exposeInt("leftoverFridgeLife", { nullable: true }),
    totalTime: t.exposeInt("totalTime", { nullable: true }),
    leftoverFreezerLife: t.exposeInt("leftoverFreezerLife", { nullable: true }),
    directions: t.exposeString("directions", { nullable: true }),
    cuisine: t.relation("cuisine"),
    category: t.relation("category"),
    course: t.relation("course"),
    ingredients: t.relation("ingredients"),
    photos: t.relation("photos"),
    nutritionLabels: t.relation("nutritionLabels", { nullable: true }),
    aggregateLabel: t.relation("aggregateLabel", { nullable: true }),
    ingredientFreshness: t.exposeInt("maxFreshness"),
  }),
});

// ============================================ Inputs ==================================
const createRecipeInput = builder.inputType("CreateRecipeInput", {
  fields: (t) => ({
    title: t.string({ required: true }),
    source: t.string(),
    prepTime: t.int(),
    cookTime: t.int(),
    marinadeTime: t.int(),
    directions: t.string(),
    notes: t.string(),
    photoIds: t.stringList(),
    courseIds: t.stringList(),
    categoryIds: t.stringList(),
    cuisineIds: t.stringList(),
    ingredients: t.field({ type: [recipeIngredientInput] }),
    leftoverFridgeLife: t.int(),
    leftoverFreezerLife: t.int(),
  }),
});

// ============================================ Queries =================================

// ============================================ Mutations ===============================

builder.mutationFields((t) => ({
  createRecipe: t.prismaField({
    type: "Recipe",
    args: {
      recipe: t.arg({
        type: createRecipeInput,
        required: true,
      }),
    },
    validate: {
      schema: z.object({
        recipe: RecipeInputValidation,
      }),
    },
    resolve: async (query, root, args) => {
      const matcher = new IngredientMatcher();
      const stmt = await createRecipeCreateStmt({
        recipe: args.recipe,
        verified: true,
        ingredientMatcher: matcher,
        update: false,
      });
      return await db.recipe.create({
        data: stmt,
        ...query,
      });
    },
  }),
  editRecipe: t.prismaField({
    type: "Recipe",
    args: {
      recipeId: t.arg.string({ required: true }),
      recipe: t.arg({
        type: createRecipeInput,
        required: true,
      }),
    },
    validate: {
      schema: z.object({
        recipe: RecipeInputValidation,
        recipeId: z.string().cuid(),
      }),
    },
    resolve: async (query, root, args) => {
      return await db.recipe.updateRecipe(args.recipeId, args.recipe, query);
    },
  }),
  deleteRecipes: t.prismaField({
    type: ["Recipe"],
    args: {
      recipeIds: t.arg.stringList({ required: true }),
    },
    validate: {
      schema: z.object({
        recipeIds: z.string().cuid().array(),
      }),
    },
    resolve: async (query, root, args) => {
      await db.recipe.deleteMany({
        where: { id: { in: args.recipeIds } },
      });
      return db.recipe.findMany({});
    },
  }),
}));

export { recipe };
