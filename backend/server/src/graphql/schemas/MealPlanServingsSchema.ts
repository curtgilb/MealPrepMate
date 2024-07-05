import { z } from "zod";
import { db } from "../../db.js";
import {
  addRecipeServingValidation,
  editRecipeServingValidation,
} from "../../validations/MealPlanValidation.js";
import { builder } from "../builder.js";
import { meal } from "./EnumSchema.js";

// ============================================ Types ===================================
builder.prismaObject("MealPlanServing", {
  include: {
    recipe: true,
  },
  fields: (t) => ({
    id: t.exposeID("id"),
    day: t.exposeInt("day"),
    meal: t.exposeString("meal"),
    numberOfServings: t.exposeInt("numberOfServings"),
    mealPlanRecipeId: t.exposeString("mealPlanRecipeId"),
    mealRecipe: t.relation("recipe"),
  }),
});
// ============================================ Inputs ==================================
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
  mealPlanServings: t.prismaField({
    type: ["MealPlanServing"],
    args: {
      mealPlanId: t.arg.string({ required: true }),
      minDay: t.arg.int(),
      maxDay: t.arg.int(),
    },
    resolve: async (query, root, args) => {
      return await db.mealPlanServing.findMany({
        where: {
          mealPlan: { id: args.mealPlanId },
          day: { lte: args.maxDay ?? undefined, gte: args.minDay ?? undefined },
        },
        ...query,
      });
    },
  }),
}));

// ============================================ Mutations ===============================
builder.mutationFields((t) => ({
  addRecipeServing: t.prismaField({
    type: "MealPlanServing",
    args: {
      serving: t.arg({
        type: addRecipeServingInput,
        required: true,
      }),
    },
    validate: { schema: z.object({ serving: addRecipeServingValidation }) },
    resolve: async (query, root, args) => {
      return await db.mealPlanServing.create({
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
        ...query,
      });
    },
  }),
  deleteRecipeServing: t.boolean({
    args: {
      id: t.arg.string({ required: true }),
    },
    validate: { schema: z.object({ id: z.string().cuid() }) },
    resolve: async (root, args) => {
      try {
        await db.mealPlanServing.delete({
          where: { id: args.id },
        });
        return true;
      } catch {
        return false;
      }
    },
  }),
  editRecipeServing: t.prismaField({
    type: ["MealPlanServing"],
    args: {
      serving: t.arg({ type: editRecipeServingInput, required: true }),
    },
    validate: { schema: z.object({ serving: editRecipeServingValidation }) },
    resolve: async (query, root, args) => {
      if (args.serving.servings) {
        const mealRecipe = await db.mealPlanServing.findUniqueOrThrow({
          where: { id: args.serving.id },
          select: { mealPlanRecipeId: true },
        });
        await canChangeServings(
          mealRecipe.mealPlanRecipeId,
          args.serving.servings,
          args.serving.id
        );
      }
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
}));

async function canChangeServings(
  mealRecipeId: string,
  servingAmount: number,
  servingId?: string
) {
  const meal = await db.mealPlanRecipe.findUniqueOrThrow({
    where: { id: mealRecipeId },
    include: { servings: true },
  });
  let originalAmount = 0;
  const servingsAlreadyAdded =
    meal?.servings.reduce((total, serving) => {
      if (serving.id === servingId) {
        originalAmount = serving.numberOfServings;
      }
      return total + serving.numberOfServings;
    }, 0) ?? 0;

  const newServingTotal = servingsAlreadyAdded - originalAmount + servingAmount;
  if (newServingTotal > meal.totalServings) {
    throw new Error("Servings must not exceed the total available");
  }
}
