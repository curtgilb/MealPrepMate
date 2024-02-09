import { db } from "../../db.js";
import { builder } from "../builder.js";
import { meal } from "./EnumSchema.js";
// ============================================ Types ===================================
builder.prismaObject("MealPlan", {
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name", { nullable: true }),
    mealPrepInstructions: t.exposeString("mealPrepInstructions", {
      nullable: true,
    }),
    planRecipes: t.relation("planRecipes"),
    mealPlanServings: t.relation("mealPlanServings"),
  }),
});

builder.prismaObject("MealPlanServing", {
  fields: (t) => ({
    id: t.exposeID("id"),
    day: t.exposeInt("day"),
    meal: t.exposeString("meal"),
    week: t.exposeInt("week"),
    mealPlan: t.relation("mealPlan"),
    recipe: t.relation("recipe"),
    numberOfServings: t.exposeInt("numberOfServings"),
  }),
});

builder.prismaObject("MealPlanRecipe", {
  fields: (t) => ({
    id: t.exposeID("id"),
    recipe: t.relation("recipe"),
    factor: t.exposeFloat("factor"),
    mealPlanServings: t.relation("servings"),
    totalServings: t.exposeInt("totalServings"),
    mealPlan: t.relation("mealPlan"),
    nutrition: t.field({
      type: "String",
      args: {
        nutrientIds: t.arg.stringList(),
      },
      resolve: async (parent, args) => {
        parent.totalServings;
        parent.factor;
        parent.recipeId;
      },
    }),
    servingsUsed: t.relationCount("servings", {
      args: {
        mealId: t.arg.string({ required: true }),
      },
      where: (args) => ({
        mealPlanId: args.mealId,
      }),
    }),
  }),
});

// Change day of week to number 1-7
// Add aggregate nutrition label to MealRecipe
//  Add argument to filter by week
// Need to validate that num of servings doesn't exceed the total
// Mark as freezer saved
// Add shopping days
// Get all ingredients used in current meal plan

// Check for the nearest shopping day, ensure that the first recipe serving is eaten within the maxFreshnessTimeline
// Make sure leftovers are eaten or put in the freezer after expiration date
// Make sure all servings are used or put in the freezer
// Search for recipes that have similar ingredients

// Create new meal (or create new copy from existing)
// Get meal plan
// Update meal plan
// Delete meal plan

// Add recipe to meal plan
//  Remove Recipe from meal plan
// Update scale, totalServings

// Add servings(s) to plan
// Change num of servings
// Remove from day

// Add max freshness, aggregateNutritionLabel factoring in scale and servings, leftover freshness

// ============================================ Inputs ==================================

const editMealPlanInput = builder.inputType("EditMealPlanInput", {
  fields: (t) => ({
    id: t.string({ required: true }),
    name: t.string(),
    mealPrepInstructions: t.string(),
  }),
});

const editMealPlanRecipeInput = builder.inputType("EditMealPlanRecipeInput", {
  fields: (t) => ({
    factor: t.float(),
    servings: t.int(),
  }),
});

const addRecipeServingInput = builder.inputType("AddRecipeServingInput", {
  fields: (t) => ({
    day: t.int({ required: true }),
    week: t.int({ required: true }),
    mealPlanRecipeId: t.string({ required: true }),
    mealPlanId: t.string({ required: true }),
    servings: t.int({ required: true }),
    meal: t.field({ type: meal, required: true }),
  }),
});

const editRecipeServingInput = builder.inputType("EditRecipeServingInput", {
  fields: (t) => ({
    day: t.int({ required: true }),
    week: t.int({ required: true }),
    servings: t.int({ required: true }),
    meal: t.field({ type: meal, required: true }),
  }),
});
// ============================================ Queries =================================

// ============================================ Mutations ===============================
builder.mutationFields((t) => ({
  createMealPlan: t.prismaField({
    type: "MealPlan",
    args: {
      name: t.arg.string({ required: true }),
      id: t.arg.id(),
    },
    resolve: async (query, root, args) => {
      return await db.mealPlan.create({ data: { name: args.name }, ...query });
    },
  }),
  editMealPlan: t.prismaField({
    type: "MealPlan",
    args: {
      mealPlan: t.arg({
        type: editMealPlanInput,
        required: true,
      }),
    },
    resolve: async (query, root, args) => {
      return await db.mealPlan.update({
        where: { id: args.mealPlan.id },
        data: {
          name: args.mealPlan?.name,
          mealPrepInstructions: args.mealPlan.mealPrepInstructions,
        },
        ...query,
      });
    },
  }),
  deleteMealPlan: t.prismaField({
    type: ["MealPlan"],
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (query, root, args) => {
      await db.mealPlan.delete({
        where: { id: args.id },
      });
      return await db.mealPlan.findMany({ ...query });
    },
  }),
  addRecipeToMealPlan: t.prismaField({
    type: ["MealPlanRecipe"],
    args: {
      mealPlanId: t.arg.string({ required: true }),
      recipeId: t.arg.string({ required: true }),
      scaleFactor: t.arg.float({ required: true }),
    },
    resolve: async (query, root, args) => {
      const label = await db.nutritionLabel.findFirst({
        where: {
          recipe: { id: args.recipeId },
          verifed: true,
          ingredientGroupId: null,
        },
        select: {
          servings: true,
        },
      });
      const totalServings = label?.servings ?? 1;
      await db.mealPlan.update({
        where: { id: args.mealPlanId },
        data: {
          planRecipes: {
            create: {
              factor: args.scaleFactor,
              recipe: { connect: { id: args.recipeId } },
              totalServings: totalServings * args.scaleFactor,
            },
          },
        },
      });
      return await db.mealPlanRecipe.findMany({
        where: { mealPlanId: args.mealPlanId },
        ...query,
      });
    },
  }),
  removeMealPlanRecipe: t.prismaField({
    type: ["MealPlanRecipe"],
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (query, root, args) => {
      await db.mealPlanRecipe.delete({
        where: { id: args.id },
      });
      return await db.mealPlanRecipe.findMany({ ...query });
    },
  }),
  addRecipeServing: t.prismaField({
    type: ["MealPlanServing"],
    args: {
      serving: t.arg({
        type: addRecipeServingInput,
        required: true,
      }),
    },
    resolve: async (query, root, args) => {
      await db.mealPlanServing.create({
        data: {
          week: args.serving.week,
          day: args.serving.day,
          meal: args.serving.meal,
          numberOfServings: args.serving.servings,
          mealPlan: {
            connect: { id: args.serving.mealPlanId },
          },
          recipe: {
            connect: { id: args.serving.mealPlanRecipeId },
          },
        },
      });
      return await db.mealPlanServing.findMany({ ...query });
    },
  }),
  removeRecipeServing: t.prismaField({
    type: ["MealPlanServing"],
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (query, root, args) => {
      await db.mealPlanServing.delete({
        where: { id: args.id },
      });
      return await db.mealPlanServing.findMany({ ...query });
    },
  }),
  editRecipeServing: t.prismaField({
    type: ["MealPlanServing"],
    args: {
      id: t.arg.string({ required: true }),
      serving: t.arg({ type: editRecipeServingInput, required: true }),
    },
    resolve: async (query, root, args) => {
      await db.mealPlanServing.delete({
        where: { id: args.id },
      });
      return await db.mealPlanServing.findMany({ ...query });
    },
  }),
}));

// How to keep the servings for each recipe used updated?
