import { db } from "../../db.js";
import { builder } from "../builder.js";
import {
  checkIfFieldRequested,
  nextPageInfo,
  numericalComparison,
  offsetPagination,
} from "./UtilitySchema.js";
import { AggregateLabel } from "./NutritionSchema.js";
import { ExtendedRecipe, searchRecipes } from "../../services/RecipeSearch.js";
import { getIngredientMaxFreshness } from "../../services/ingredient/IngredientService.js";
import { getAggregatedLabel } from "../../services/recipe/RecipeService.js";
import {
  RecipeFilterValidation,
  RecipeIngredientUpdateValidation,
  RecipeInputValidation,
} from "../../validations/graphql/RecipeValidation.js";
import { z } from "zod";
import { queryFromInfo } from "@pothos/plugin-prisma";
import { OffsetPaginationValidation } from "../../validations/graphql/UtilityValidation.js";

// ============================================ Types ===================================
const recipe = builder.prismaObject("Recipe", {
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name"),
    prepTime: t.exposeInt("preparationTime", { nullable: true }),
    cookTime: t.exposeInt("cookingTime", { nullable: true }),
    marinadeTime: t.exposeInt("marinadeTime", { nullable: true }),
    notes: t.exposeString("notes", { nullable: true }),
    isFavorite: t.exposeBoolean("isFavorite"),
    leftoverFridgeLife: t.exposeInt("leftoverFridgeLife", { nullable: true }),
    directions: t.exposeString("directions", { nullable: true }),
    cuisine: t.relation("cuisine"),
    category: t.relation("category"),
    course: t.relation("course"),
    ingredients: t.relation("ingredients"),
    photos: t.relation("photos"),
    aggregateLabel: t.field({
      type: AggregateLabel,
      nullable: true,
      args: {
        advanced: t.arg.boolean(),
      },
      resolve: async (parent, args) => {
        if (Object.prototype.hasOwnProperty.call(parent, "nutrientMap")) {
          return (parent as ExtendedRecipe).aggregateLabel;
        } else {
          return await getAggregatedLabel(
            parent.id,
            args.advanced ?? false,
            false
          );
        }
      },
    }),
    ingredientFreshness: t.int({
      nullable: true,
      resolve: async (recipe) => {
        if (
          Object.prototype.hasOwnProperty.call(recipe, "ingredientFreshness")
        ) {
          return (recipe as ExtendedRecipe).ingredientFreshness;
        }
        return await getIngredientMaxFreshness(recipe.id);
      },
    }),
  }),
});

builder.prismaObject("RecipeIngredient", {
  name: "RecipeIngredients",
  fields: (t) => ({
    order: t.exposeInt("order"),
    sentence: t.exposeString("sentence"),
    quantity: t.exposeFloat("quantity", { nullable: true }),
    unit: t.relation("unit"),
    name: t.exposeString("name", { nullable: true }),
    recipe: t.relation("recipe"),
    baseIngredient: t.relation("ingredient", { nullable: true }),
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
    id: t.id(),
    order: t.int(),
    sentence: t.string(),
    quantity: t.int(),
    unitId: t.string(),
    name: t.string(),
    ingredientId: t.string(),
    groupName: t.string(),
    groupId: t.id(),
  }),
});

const recipeIngredientUpdateInput = builder.inputType(
  "RecipeIngredientUpdateInput",
  {
    fields: (t) => ({
      recipeId: t.id({ required: true }),
      ingredientsToAdd: t.field({ type: [recipeIngredientInput] }),
      ingredientsToDelete: t.idList(),
      ingredientsToUpdate: t.field({ type: [recipeIngredientInput] }),
      groupsToAdd: t.stringList(),
      groupsToDelete: t.idList(),
    }),
  }
);

const nutritionFilter = builder.inputType("NutritionFilter", {
  fields: (t) => ({
    nutrientID: t.string({ required: true }),
    perServing: t.boolean(),
    target: t.field({ type: numericalComparison }),
  }),
});

const ingredientFilter = builder.inputType("IngredientFilter", {
  fields: (t) => ({
    ingredientID: t.string({ required: true }),
    amount: t.field({ type: numericalComparison }),
    unitId: t.string(),
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
    nutrientFilters: t.field({ type: [nutritionFilter], required: false }),
    ingredientFilter: t.field({ type: [ingredientFilter], required: false }),
    ingredientFreshDays: t.field({
      type: numericalComparison,
      required: false,
    }),
  }),
});

const RecipesQuery = builder
  .objectRef<{
    nextOffset: number | null;
    itemsRemaining: number;
    recipes: ExtendedRecipe[];
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
    type: RecipesQuery,
    args: {
      filter: t.arg({ type: recipeFilter }),
      pagination: t.arg({
        type: offsetPagination,
        required: true,
      }),
    },
    validate: {
      schema: z.object({
        filter: RecipeFilterValidation.optional(),
        pagination: OffsetPaginationValidation,
      }),
    },
    resolve: async (root, args, context, info) => {
      const query = queryFromInfo({ context, info, path: ["recipes"] });

      const result = await searchRecipes({
        query,
        filter: args?.filter,
        take: args.pagination.take,
        offset: args.pagination.offset,
        aggregatedLabel: true,
      });
      const { itemsRemaining, nextOffset } = nextPageInfo(
        result.recipes.length,
        args.pagination.offset,
        result.totalCount
      );
      return {
        nextOffset,
        itemsRemaining,
        recipes: result.recipes,
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
      return await db.recipe.createRecipe(args.recipe, query);
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
      return await db.recipeIngredient.findMany({ ...query });
    },
  }),
  deleteRecipe: t.prismaField({
    type: "Recipe",
    args: {
      recipeId: t.arg.string({ required: true }),
    },
    validate: {
      schema: z.object({
        recipeId: z.string().cuid(),
      }),
    },
    resolve: async (query, root, args) => {
      return await db.recipe.delete({
        where: { id: args.recipeId },
        ...query,
      });
    },
  }),
}));

export { recipe };
