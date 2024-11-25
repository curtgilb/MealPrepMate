import {
    createRecipe, deleteRecipe, editRecipe, getIngredientFreshness, getIngredientText, RecipeInput
} from '@/application/services/recipe/RecipeService.js';
import { builder } from '@/presentation/builder.js';
import { DeleteResult } from '@/presentation/schemas/common/MutationResult.js';
import { recipeIngredientInput } from '@/presentation/schemas/recipe/RecipeIngredientSchema.js';
import { encodeGlobalID } from '@pothos/plugin-relay';

// ============================================ Types ===================================
const recipe = builder.prismaNode("Recipe", {
  id: { field: "id" },
  fields: (t) => ({
    name: t.exposeString("name"),
    source: t.exposeString("source", { nullable: true }),
    prepTime: t.exposeInt("preparationTime", { nullable: true }),
    cookTime: t.exposeInt("cookingTime", { nullable: true }),
    marinadeTime: t.exposeInt("marinadeTime", { nullable: true }),
    notes: t.exposeString("notes", { nullable: true }),
    verified: t.exposeBoolean("verified"),
    leftoverFridgeLife: t.exposeInt("leftoverFridgeLife", { nullable: true }),
    leftoverFreezerLife: t.exposeInt("leftoverFreezerLife", { nullable: true }),
    directions: t.exposeString("directions", { nullable: true }),
    cuisine: t.relation("cuisine"),
    category: t.relation("category"),
    course: t.relation("course"),
    ingredients: t.relation("ingredients"),
    photos: t.relation("photos"),
    nutritionLabels: t.relation("nutritionLabels", { nullable: true }),
    aggregateLabel: t.relation("aggregateLabel", { nullable: true }),
    ingredientText: t.field({
      type: "String",
      resolve: async (recipe) => {
        return await getIngredientText(recipe.ingredients);
      },
    }),
    ingredientFreshness: t.int({
      nullable: true,
      resolve: async (recipe) => {
        return await getIngredientFreshness(recipe.id);
      },
    }),
  }),
  include: {
    ingredients: true,
  },
});

// ============================================ Inputs ==================================
const recipeInput = builder.inputRef<RecipeInput>("RecipeInput").implement({
  fields: (t) => ({
    title: t.string({ required: true }),
    source: t.string(),
    prepTime: t.int(),
    cookTime: t.int(),
    marinadeTime: t.int(),
    directions: t.string(),
    notes: t.string(),
    photoIds: t.field({ type: ["RefID"] }),
    courseIds: t.field({ type: ["RefID"] }),
    categoryIds: t.field({ type: ["RefID"] }),
    cuisineIds: t.field({ type: ["RefID"] }),
    ingredients: t.field({ type: [recipeIngredientInput] }),
    ingredientText: t.string(),
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
        type: recipeInput,
        required: true,
      }),
    },
    resolve: async (query, root, args) => {
      return await createRecipe(args.recipe, query);
    },
  }),
  editRecipe: t.prismaField({
    type: "Recipe",
    args: {
      recipeId: t.arg.globalID({ required: true }),
      recipe: t.arg({
        type: recipeInput,
        required: true,
      }),
    },
    resolve: async (query, root, args) => {
      return await editRecipe(args.recipeId.id, args.recipe, query);
    },
  }),
  deleteRecipe: t.field({
    type: DeleteResult,
    args: {
      recipeId: t.arg.globalID({ required: true }),
    },
    resolve: async (root, args) => {
      const guid = encodeGlobalID(args.recipeId.typename, args.recipeId.id);
      await deleteRecipe(args.recipeId.id);
      return { id: guid, success: true };
    },
  }),
}));

export { recipe };
