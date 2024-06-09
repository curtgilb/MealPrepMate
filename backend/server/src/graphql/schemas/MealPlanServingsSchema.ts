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
          day: { lte: args.maxDay, gte: args.minDay },
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
      // await canChangeServings(
      //   {
      //     recipeId: args.serving.mealPlanRecipeId,
      //     mealPlanId: args.serving.mealPlanId,
      //   },
      //   args.serving.servings
      // );
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
