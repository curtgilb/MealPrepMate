import { queryFromInfo } from "@pothos/plugin-prisma";
import { z } from "zod";
import { db } from "../../db.js";
import { IngredientMatcher } from "../../models/IngredientMatcher.js";
import { createRecipeCreateStmt } from "../../models/RecipeExtension.js";
import { getIngredientMaxFreshness } from "../../services/ingredient/IngredientService.js";
import {
  RecipeFilterValidation,
  RecipeIngredientUpdateValidation,
  RecipeInputValidation,
} from "../../validations/RecipeValidation.js";
import { offsetPaginationValidation } from "../../validations/UtilityValidation.js";
import { builder } from "../builder.js";
import {
  nextPageInfo,
  numericalComparison,
  offsetPagination,
} from "./UtilitySchema.js";
import {
  parseResolveInfo,
  ResolveTree,
  simplifyParsedResolveInfoFragmentWithType,
} from "graphql-parse-resolve-info";
import {
  RecipeWithFreshness,
  searchRecipes,
} from "../../services/recipe/RecipeSearch.js";

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
    isFavorite: t.exposeBoolean("isFavorite"),
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
    ingredientFreshness: t.int({
      nullable: true,
      resolve: async (recipe) => {
        if (
          Object.prototype.hasOwnProperty.call(recipe, "ingredientFreshness")
        ) {
          return (recipe as RecipeWithFreshness).ingredientFreshness;
        }
        return (await getIngredientMaxFreshness(recipe.id)).maxLife;
      },
    }),
  }),
});

const recipeIngredient = builder.prismaObject("RecipeIngredient", {
  name: "RecipeIngredients",
  fields: (t) => ({
    id: t.exposeString("id"),
    order: t.exposeInt("order"),
    sentence: t.exposeString("sentence"),
    quantity: t.exposeFloat("quantity", { nullable: true }),
    unit: t.relation("unit", { nullable: true }),
    name: t.exposeString("name", { nullable: true }),
    recipe: t.relation("recipe"),
    baseIngredient: t.relation("ingredient", { nullable: true }),
    group: t.relation("group", { nullable: true }),
  }),
});

builder.prismaObject("RecipeIngredientGroup", {
  name: "RecipeIngredientGroup",
  fields: (t) => ({
    id: t.exposeString("id"),
    name: t.exposeString("name"),
    nutritionLabel: t.relation("nutritionLabel", { nullable: true }),
  }),
});

// ============================================ Inputs ==================================
const recipeInput = builder.inputType("RecipeInput", {
  fields: (t) => ({
    title: t.string({ required: true }),
    source: t.string(),
    prepTime: t.int(),
    cookTime: t.int(),
    marinadeTime: t.int({}),
    directions: t.string(),
    notes: t.string(),
    photoIds: t.stringList(),
    isFavorite: t.boolean(),
    courseIds: t.stringList(),
    categoryIds: t.stringList(),
    cuisineIds: t.stringList(),
    ingredients: t.string(),
    leftoverFridgeLife: t.int(),
    leftoverFreezerLife: t.int(),
  }),
});

const recipeIngredientInput = builder.inputType("RecipeIngredientInput", {
  fields: (t) => ({
    id: t.string(),
    order: t.int(),
    sentence: t.string(),
    quantity: t.int(),
    unitId: t.string(),
    name: t.string(),
    ingredientId: t.string(),
    groupName: t.string(),
    groupId: t.string(),
  }),
});

const recipeIngredientUpdateInput = builder.inputType(
  "RecipeIngredientUpdateInput",
  {
    fields: (t) => ({
      recipeId: t.string({ required: true }),
      ingredientsToAdd: t.field({ type: [recipeIngredientInput] }),
      ingredientsToDelete: t.stringList(),
      ingredientsToUpdate: t.field({ type: [recipeIngredientInput] }),
      groupsToAdd: t.stringList(),
      groupsToDelete: t.stringList(),
    }),
  }
);

const nutritionFilter = builder.inputType("NutritionFilter", {
  fields: (t) => ({
    nutrientId: t.string({ required: true }),
    perServing: t.boolean(),
    target: t.field({ type: numericalComparison, required: true }),
  }),
});

const ingredientFilter = builder.inputType("IngredientFilter", {
  fields: (t) => ({
    ingredientID: t.string({ required: true }),
    amount: t.field({ type: numericalComparison }),
    unitId: t.string(),
  }),
});

const macroFilter = builder.inputType("MacroFilter", {
  fields: (t) => ({
    caloriePerServing: t.field({ type: numericalComparison, required: false }),
    carbPerServing: t.field({ type: numericalComparison, required: false }),
    fatPerServing: t.field({ type: numericalComparison, required: false }),
    protienPerServing: t.field({ type: numericalComparison, required: false }),
    alcoholPerServing: t.field({ type: numericalComparison, required: false }),
  }),
});
// Filter by nutrient (calroies or any nutrient per serving or per recipe)
// Filter by ingredient
const recipeFilter = builder.inputType("RecipeFilter", {
  fields: (t) => ({
    searchString: t.string({ required: false }), // Searches recipe titles
    numOfServings: t.field({ type: numericalComparison }),
    courseIds: t.stringList({ required: false }),
    cuisineId: t.stringList({ required: false }),
    categoryIds: t.stringList({ required: false }),
    prepTime: t.field({ type: numericalComparison, required: false }),
    cookTime: t.field({ type: numericalComparison, required: false }),
    marinadeTime: t.field({ type: numericalComparison, required: false }),
    totalPrepTime: t.field({ type: numericalComparison, required: false }),
    leftoverFridgeLife: t.field({ type: numericalComparison, required: false }),
    leftoverFreezerLife: t.field({
      type: numericalComparison,
      required: false,
    }),
    isFavorite: t.boolean({ required: false }),
    macroFilter: t.field({ type: macroFilter, required: false }),
    nutrientFilters: t.field({ type: [nutritionFilter], required: false }),
    ingredientFilter: t.field({ type: [ingredientFilter], required: false }),
    ingredientFreshDays: t.field({
      type: numericalComparison,
      required: false,
    }),
  }),
});

const recipeQuery = builder
  .objectRef<{
    nextOffset: number | null;
    itemsRemaining: number;
    recipes: RecipeWithFreshness[];
  }>("RecipesQuery")
  .implement({
    fields: (t) => ({
      nextOffset: t.exposeInt("nextOffset", { nullable: true }),
      itemsRemaining: t.exposeInt("itemsRemaining"),
      recipes: t.field({
        type: [recipe],
        resolve: (result) => result.recipes,
      }),
    }),
  });

// ============================================ Queries =================================
builder.queryFields((t) => ({
  recipe: t.prismaField({
    type: "Recipe",
    args: {
      recipeId: t.arg.string({ required: true }),
    },
    validate: {
      schema: z.object({ recipeId: z.string().cuid() }),
    },
    resolve: async (query, root, args) => {
      return await db.recipe.findUniqueOrThrow({
        where: { id: args.recipeId },
        ...query,
      });
    },
  }),
  recipes: t.field({
    type: recipeQuery,
    args: {
      filter: t.arg({ type: recipeFilter }),
      pagination: t.arg({
        type: offsetPagination,
        required: true,
      }),
    },
    resolve: async (root, args, context, info) => {
      const query = queryFromInfo({ context, info, path: ["recipes"] });
      const parsedResolveInfoFragment = parseResolveInfo(info);
      const request = simplifyParsedResolveInfoFragmentWithType(
        parsedResolveInfoFragment as ResolveTree,
        info.returnType
      );
      const requestedFreshDays =
        (Object.prototype.hasOwnProperty.call(request.args, "filter") &&
          Object.prototype.hasOwnProperty.call(
            request.args.filter,
            "ingredientFreshDays"
          )) ||
        Object.prototype.hasOwnProperty.call(
          request.fields,
          "ingredientFreshness"
        );

      const results = await searchRecipes(
        args.filter,
        requestedFreshDays,
        query
      );
      const paginatedResult = results.slice(
        args.pagination.offset,
        args.pagination.offset + args.pagination.take
      );

      const { itemsRemaining, nextOffset } = nextPageInfo(
        paginatedResult.length,
        args.pagination.take,
        args.pagination.offset,
        results.length
      );
      return {
        nextOffset,
        itemsRemaining,
        recipes: paginatedResult,
      };
    },
  }),
}));

// ============================================ Mutations ===============================

builder.mutationFields((t) => ({
  createRecipe: t.prismaField({
    type: "Recipe",
    args: {
      recipe: t.arg({
        type: recipeInput,
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
  updateRecipe: t.prismaField({
    type: "Recipe",
    args: {
      recipeId: t.arg.string({ required: true }),
      recipe: t.arg({
        type: recipeInput,
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
  updateRecipeIngredients: t.prismaField({
    type: ["RecipeIngredient"],
    args: {
      ingredient: t.arg({
        type: recipeIngredientUpdateInput,
        required: true,
      }),
    },
    validate: {
      schema: z.object({
        ingredient: RecipeIngredientUpdateValidation,
      }),
    },
    resolve: async (query, root, args) => {
      return await db.recipe.updateRecipeIngredients(args.ingredient, query);
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

export { recipe, recipeIngredient };
