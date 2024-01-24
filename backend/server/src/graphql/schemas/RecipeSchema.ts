import { db } from "../../db.js";
import { builder } from "../builder.js";
import { numericalComparison } from "./UtilitySchema.js";
import { recipeInputValidation } from "../validations/validations.js";

// ============================================ Types ===================================
builder.prismaObject("Recipe", {
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("title"),
    prepTime: t.exposeInt("preparationTime", { nullable: true }),
    cookTime: t.exposeInt("cookingTime", { nullable: true }),
    marinadeTime: t.exposeInt("marinadeTime", { nullable: true }),
    notes: t.exposeString("notes", { nullable: true }),
    stars: t.exposeInt("stars", { nullable: true }),
    isFavorite: t.exposeBoolean("isFavorite"),
    leftoverFridgeLife: t.exposeInt("leftoverFridgeLife", { nullable: true }),
    directions: t.exposeString("directions", { nullable: true }),
    isVerified: t.exposeBoolean("isVerified", { nullable: true }),
    cuisine: t.relation("cuisine"),
    category: t.relation("category"),
    course: t.relation("course"),
    ingredients: t.relation("ingredients"),
    photos: t.relation("photos"),
  }),
});

builder.prismaObject("RecipeIngredient", {
  name: "RecipeIngredients",
  fields: (t) => ({
    order: t.exposeInt("order"),
    sentence: t.exposeString("sentence"),
    minQuantity: t.exposeFloat("minQuantity", { nullable: true }),
    maxQuantity: t.exposeFloat("maxQuantity", { nullable: true }),
    quantity: t.exposeFloat("quantity", { nullable: true }),
    unit: t.relation("unit"),
    name: t.exposeString("name", { nullable: true }),
    comment: t.exposeString("comment", { nullable: true }),
    other: t.exposeString("other", { nullable: true }),
    recipes: t.relation("recipe"),
    baseIngredient: t.relation("ingredient", { nullable: true }),
  }),
});

builder.prismaObject("RecipeIngredientGroup", {
  name: "RecipeIngredientGroup",
  fields: (t) => ({
    name: t.exposeString("name"),
    servings: t.exposeInt("servings", { nullable: true }),
    servingsInRecipe: t.exposeInt("servingsInRecipe", { nullable: true }),
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
    cuisineId: t.string(),
    ingredients: t.string(),
    leftoverFridgeLife: t.int(),
    leftoverFreezerLife: t.int(),
  }),
});

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
    searchString: t.string(), // Searches recipe titles
    numOfServings: t.field({ type: numericalComparison }),
    courseIds: t.stringList(),
    cuisineId: t.stringList(),
    categoryIds: t.stringList(),
    prepTime: t.field({ type: numericalComparison }),
    cookTime: t.field({ type: numericalComparison }),
    marinadeTime: t.field({ type: numericalComparison }),
    // totalPrepTime: t.field({ type: numericalComparison }),
    isFavorite: t.boolean(),
    nutrientFilters: t.field({ type: [nutritionFilter] }),
    ingredientFilter: t.field({ type: [ingredientFilter] }),
  }),
});

// ============================================ Queries =================================
builder.queryFields((t) => ({
  recipe: t.prismaField({
    type: "Recipe",
    args: {
      recipeId: t.arg.string({ required: true }),
    },
    resolve: async (query, root, args) => {
      return await db.recipe.findUniqueOrThrow({
        where: { id: args.recipeId },
        ...query,
      });
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
        validate: {
          schema: recipeInputValidation,
        },
      }),
    },
    resolve: async (query, root, args) => {
      console.log(args.recipe);
      return await db.recipe.createRecipe(args.recipe, query);
    },
  }),
}));

// type: "Recipe",
// args: {
//   filter: t.arg({ type: recipeFilter, required: true }),
// },
