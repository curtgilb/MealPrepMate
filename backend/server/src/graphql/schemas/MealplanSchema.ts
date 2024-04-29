import { z } from "zod";
import { db } from "../../db.js";
import { scheduleMealPlan } from "../../services/mealplan/MealPlanService.js";
import { getAggregatedLabel } from "../../services/recipe/RecipeService.js";
import { builder } from "../builder.js";
import { meal } from "./EnumSchema.js";
import { AggregateLabel } from "./NutritionLabelSchema.js";
import { cleanedStringSchema } from "../../validations/utilValidations.js";
import { toTitleCase } from "../../util/utils.js";
import {
  addRecipeServingValidation,
  addRecipeToMealPlanValidation,
  editMealPlanValidation,
  editRecipeServingValidation,
} from "../../validations/MealPlanValidation.js";
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
    shopppingDays: t.exposeIntList("shoppingDays"),
    schedules: t.relation("schedules"),
  }),
});

builder.prismaObject("ScheduledPlan", {
  fields: (t) => ({
    id: t.exposeString("id"),
    startDate: t.field({
      type: "DateTime",
      resolve: (parent) => parent.startDate,
    }),
    duration: t.exposeInt("duration"),
    mealPlan: t.relation("mealPlan"),
  }),
});

builder.prismaObject("MealPlanServing", {
  include: {
    recipe: true,
  },
  fields: (t) => ({
    id: t.exposeID("id"),
    day: t.exposeInt("day"),
    meal: t.exposeString("meal"),
    mealPlan: t.relation("mealPlan"),
    recipe: t.relation("recipe"),
    numberOfServings: t.exposeInt("numberOfServings"),
    nutritionLabel: t.field({
      type: AggregateLabel,
      nullable: true,
      args: {
        advanced: t.arg.boolean(),
      },
      resolve: async (parent, args) => {
        return await getAggregatedLabel(
          [
            {
              id: parent.recipe.recipeId,
              scale: {
                factor: parent.recipe.factor,
                servings: parent.recipe.totalServings,
                servingsUsed: parent.numberOfServings,
              },
            },
          ],
          args.advanced ?? false,
          false
        );
      },
    }),
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
    servingsUsed: t.relationCount("servings", {
      args: {
        mealId: t.arg.string({ required: true }),
      },
      where: (args) => ({
        mealPlanId: args.mealId,
      }),
    }),
    nutritionLabel: t.field({
      type: AggregateLabel,
      nullable: true,
      args: {
        advanced: t.arg.boolean(),
      },
      resolve: async (parent, args) => {
        return await getAggregatedLabel(
          [
            {
              id: parent.recipeId,
              scale: { factor: parent.factor, servings: parent.totalServings },
            },
          ],
          args.advanced ?? false,
          false
        );
      },
    }),
  }),
});

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

const addRecipeToMealPlanInput = builder.inputType("AddRecipeInput", {
  fields: (t) => ({
    mealPlanId: t.string({ required: true }),
    recipeId: t.string({ required: true }),
    scaleFactor: t.float({ required: true }),
    servings: t.int({ required: true }),
    cookDay: t.int(),
  }),
});

const addRecipeServingInput = builder.inputType("AddRecipeServingInput", {
  fields: (t) => ({
    day: t.int({ required: true }),
    mealPlanRecipeId: t.string({ required: true }),
    mealPlanId: t.string({ required: true }),
    servings: t.int({ required: true }),
    meal: t.field({ type: meal, required: true }),
  }),
});

const editRecipeServingInput = builder.inputType("EditRecipeServingInput", {
  fields: (t) => ({
    id: t.string({ required: true }),
    day: t.int({ required: true }),
    servings: t.int({ required: true }),
    meal: t.field({ type: meal, required: true }),
  }),
});
// ============================================ Queries =================================
builder.queryFields((t) => ({
  mealPlan: t.prismaField({
    type: "MealPlan",
    args: {
      id: t.arg.string({ required: true }),
    },
    validate: {
      schema: z.object({ id: z.string().cuid() }),
    },
    resolve: async (query, root, args) => {
      return await db.mealPlan.findUniqueOrThrow({
        where: { id: args.id },
        ...query,
      });
    },
  }),
  mealPlans: t.prismaField({
    type: ["MealPlan"],
    resolve: async (query) => {
      return await db.mealPlan.findMany({ ...query });
    },
  }),
}));
// ============================================ Mutations ===============================
builder.mutationFields((t) => ({
  createMealPlan: t.prismaField({
    type: "MealPlan",
    args: {
      name: t.arg.string({ required: true }),
    },
    validate: {
      schema: z.object({ name: cleanedStringSchema(20, toTitleCase) }),
    },
    resolve: async (query, root, args) => {
      return await db.mealPlan.create({ data: { name: args.name } });
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
    validate: {
      schema: z.object({ mealPlan: editMealPlanValidation }),
    },
    resolve: async (query, root, args) => {
      return await db.mealPlan.update({
        where: { id: args.mealPlan.id },
        data: {
          name: args.mealPlan.name ?? undefined,
          mealPrepInstructions: args.mealPlan.mealPrepInstructions,
        },
      });
    },
  }),
  deleteMealPlan: t.prismaField({
    type: ["MealPlan"],
    args: {
      id: t.arg.string({ required: true }),
    },
    validate: { schema: z.object({ id: z.string().cuid() }) },
    resolve: async (query, root, args) => {
      await db.mealPlan.delete({
        where: { id: args.id },
      });
      return await db.mealPlan.findMany({});
    },
  }),
  addRecipeToMealPlan: t.prismaField({
    type: ["MealPlanRecipe"],
    args: {
      recipe: t.arg({
        type: addRecipeToMealPlanInput,
        required: true,
      }),
    },
    validate: { schema: z.object({ recipe: addRecipeToMealPlanValidation }) },
    resolve: async (query, root, args) => {
      await db.mealPlanRecipe.create({
        data: {
          mealPlan: { connect: { id: args.recipe.mealPlanId } },
          recipe: { connect: { id: args.recipe.recipeId } },
          factor: args.recipe.scaleFactor,
          totalServings: args.recipe.servings,
          cookDay: args.recipe.cookDay,
        },
      });
      return await db.mealPlanRecipe.findMany({});
    },
  }),
  removeMealPlanRecipe: t.prismaField({
    type: ["MealPlanRecipe"],
    args: {
      id: t.arg.string({ required: true }),
    },
    validate: { schema: z.object({ id: z.string().cuid() }) },
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
    validate: { schema: z.object({ serving: addRecipeServingValidation }) },
    resolve: async (query, root, args) => {
      await canChangeServings(
        {
          recipeId: args.serving.mealPlanRecipeId,
          mealPlanId: args.serving.mealPlanId,
        },
        args.serving.servings
      );
      await db.mealPlanServing.create({
        data: {
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
  deleteRecipeServing: t.prismaField({
    type: ["MealPlanServing"],
    args: {
      id: t.arg.string({ required: true }),
    },
    validate: { schema: z.object({ id: z.string().cuid() }) },
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
      serving: t.arg({ type: editRecipeServingInput, required: true }),
    },
    validate: { schema: z.object({ serving: editRecipeServingValidation }) },
    resolve: async (query, root, args) => {
      await canChangeServings(args.serving.id, args.serving.servings);
      await db.mealPlanServing.update({
        where: { id: args.serving.id },
        data: {
          day: args.serving.day,
          meal: args.serving.meal,
          numberOfServings: args.serving.servings ?? undefined,
        },
      });
      return await db.mealPlanServing.findMany({ ...query });
    },
  }),
  updateShoppingDays: t.field({
    type: ["Int"],
    args: {
      mealPlanId: t.arg.string({ required: true }),
      days: t.arg.intList({ required: true }),
    },
    validate: {
      schema: z.object({
        mealPlanId: z.string().cuid(),
        days: z.number().gte(1).array(),
      }),
    },
    resolve: async (root, args) => {
      const updatedMealPlan = await db.mealPlan.update({
        where: { id: args.mealPlanId },
        data: { shoppingDays: args.days },
      });
      return updatedMealPlan.shoppingDays;
    },
  }),
  scheduleMealPlan: t.prismaField({
    type: "ScheduledPlan",
    args: {
      mealPlanId: t.arg.string({ required: true }),
      startDate: t.arg({ type: "DateTime", required: true }),
    },
    validate: {
      schema: z.object({ mealPlanId: z.string().cuid(), startDate: z.date() }),
    },
    resolve: async (query, root, args) => {
      return await scheduleMealPlan(args.mealPlanId, args.startDate, query);
    },
  }),
}));

type MealPlanAndRecipeIds = {
  mealPlanId: string;
  recipeId: string;
};

async function canChangeServings(
  servingInput: string | MealPlanAndRecipeIds,
  newServingsAmount: number | null | undefined
) {
  if (newServingsAmount) {
    let totalServings;
    let originalServings;
    let mealPlanId;
    let recipeId;
    if (typeof servingInput === "string") {
      const serving = await db.mealPlanServing.findUniqueOrThrow({
        where: { id: servingInput },
        include: { recipe: true, mealPlan: true },
      });

      totalServings = serving.recipe.totalServings;
      originalServings = serving.numberOfServings;
      mealPlanId = serving.mealPlanId;
      recipeId = serving.mealPlanRecipeId;
    } else {
      const mealPlanRecipe = await db.mealPlanRecipe.findUniqueOrThrow({
        where: { id: servingInput.recipeId },
      });
      totalServings = mealPlanRecipe.totalServings;
      originalServings = 0;
      mealPlanId = servingInput.mealPlanId;
      recipeId = servingInput.recipeId;
    }

    const aggregation = await db.mealPlanServing.aggregate({
      _sum: { numberOfServings: true },
      where: {
        recipe: { id: recipeId },
        mealPlan: { id: mealPlanId },
      },
    });
    const totalUsed = aggregation._sum.numberOfServings ?? 0;

    const updatedTotal = totalUsed - originalServings + newServingsAmount;
    if (updatedTotal > totalServings) {
      throw new Error("Cannot add more servings than available");
    }
  }
}
