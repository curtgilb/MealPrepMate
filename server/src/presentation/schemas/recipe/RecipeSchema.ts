import {
  createRecipe,
  CreateRecipeInput,
  deleteRecipes,
  editRecipe,
  EditRecipeInput,
  getIngredientFreshness,
} from "@/application/services/recipe/RecipeService.js";
import { builder } from "@/presentation/builder.js";
import { DeleteResult } from "@/presentation/schemas/common/MutationResult.js";
import { recipeIngredientInput } from "@/presentation/schemas/recipe/RecipeIngredientSchema.js";

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
    ingredientFreshness: t.int({
      nullable: true,
      resolve: async (recipe) => {
        return await getIngredientFreshness(recipe.id);
      },
    }),
  }),
});

// ============================================ Inputs ==================================
const createRecipeInput = builder
  .inputRef<CreateRecipeInput>("CreateRecipeInput")
  .implement({
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
      ingredientText: t.string(),
      leftoverFridgeLife: t.int(),
      leftoverFreezerLife: t.int(),
    }),
  });

const editRecipeInput = builder
  .inputRef<EditRecipeInput>("EditRecipeInput")
  .implement({
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
    resolve: async (query, root, args) => {
      return await createRecipe(args.recipe as CreateRecipeInput, query);
    },
  }),
  editRecipe: t.prismaField({
    type: "Recipe",
    args: {
      recipeId: t.arg.string({ required: true }),
      recipe: t.arg({
        type: editRecipeInput,
        required: true,
      }),
    },
    resolve: async (query, root, args) => {
      return await editRecipe(
        args.recipeId,
        args.recipe as EditRecipeInput,
        query
      );
    },
  }),
  deleteRecipes: t.field({
    type: DeleteResult,
    args: {
      recipeIds: t.arg.stringList({ required: true }),
    },
    resolve: async (root, args) => {
      try {
        await deleteRecipes(args.recipeIds);
        return { success: true };
      } catch (e) {
        return { success: false, message: e.message };
      }
    },
  }),
}));

export { recipe };
