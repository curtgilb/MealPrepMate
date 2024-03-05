import { db } from "../../db.js";
import { builder } from "../builder.js";
import { numericalComparison } from "./UtilitySchema.js";

// ============================================ Types ===================================
const recipe = builder.prismaObject("Recipe", {
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("title"),
    prepTime: t.exposeInt("preparationTime", { nullable: true }),
    cookTime: t.exposeInt("cookingTime", { nullable: true }),
    marinadeTime: t.exposeInt("marinadeTime", { nullable: true }),
    notes: t.exposeString("notes", { nullable: true }),
    isFavorite: t.exposeBoolean("isFavorite"),
    leftoverFridgeLife: t.exposeInt("leftoverFridgeLife", { nullable: true }),
    directions: t.exposeString("directions", { nullable: true }),
    isVerified: t.exposeBoolean("isVerified", { nullable: true }),
    cuisine: t.relation("cuisine"),
    category: t.relation("category"),
    course: t.relation("course"),
    ingredients: t.relation("ingredients"),
    photos: t.relation("photos"),
    // aggregateLabel: t.field({
    //   type: LabelObject,
    //   resolve: async (parent, args, context, info) => {
    //     if (Object.prototype.hasOwnProperty.call(parent, "aggregateLabel")) {
    //       return (parent as ExtendedRecipe).aggregateLabel;
    //     }
    //     return await getAggregateLabel({
    //       recipes: [{ recipeId: parent.id }],
    //       advanced: false,
    //     });
    //   },
    // }),
    // ingredientFreshness: t.int({
    //   resolve: (recipe, args, context, info) => {
    //     if (
    //       Object.prototype.hasOwnProperty.call(recipe, "ingredientFreshness")
    //     ) {
    //       return (recipe as ExtendedRecipe).ingredientFreshness;
    //     }
    //     return 2;
    //   },
    // }),
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
    comment: t.exposeString("comment", { nullable: true }),
    other: t.exposeString("other", { nullable: true }),
    recipe: t.relation("recipe"),
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

const recipeIngredientInput = builder.inputType("RecipeIngredientInput", {
  fields: (t) => ({
    id: t.id(),
    order: t.int(),
    sentence: t.string(),
    quantity: t.int(),
    unitId: t.string(),
    name: t.string(),
    comment: t.string(),
    other: t.string(),
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
    resolve: async (query, root, args) => {
      return await db.recipeIngredient.findMany({ ...query });
    },
  }),
  // deleteRecipe: t.prismaField({
  //   type: ,
  //   args: {
  //     recipeId: t.id({ required: true }),
  //   },
  // }),
}));

export { recipe };
