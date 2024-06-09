import { z } from "zod";
import { db } from "../../db.js";
import { addRecipeToMealPlanValidation } from "../../validations/MealPlanValidation.js";
import { builder } from "../builder.js";

// ============================================ Types ===================================
builder.prismaObject("MealPlanRecipe", {
  fields: (t) => ({
    id: t.exposeID("id"),
    originalRecipe: t.relation("recipe"),
    mealPlan: t.relation("mealPlan"),
    factor: t.exposeFloat("factor"),
    mealPlanServings: t.relation("servings"),
    totalServings: t.exposeInt("totalServings"),
    servingsOnPlan: t.int({
      resolve: async (recipe) => {
        const result = await db.mealPlanServing.aggregate({
          where: { mealPlanId: recipe.mealPlanId, mealPlanRecipeId: recipe.id },
          _sum: {
            numberOfServings: true,
          },
        });
        return result._sum.numberOfServings ?? 0;
      },
    }),
  }),
});

// ============================================ Inputs ==================================
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

// ============================================ Queries =================================
builder.queryFields((t) => ({
  mealPlanRecipes: t.prismaField({
    type: ["MealPlanRecipe"],
    args: {
      mealPlanId: t.arg.string({ required: true }),
    },
    resolve: async (query, root, args) => {
      return await db.mealPlanRecipe.findMany({
        where: { mealPlanId: args.mealPlanId },
        ...query,
      });
    },
  }),
}));

// ============================================ Mutations ===============================
builder.mutationFields((t) => ({
  addRecipeToMealPlan: t.prismaField({
    type: "MealPlanRecipe",
    args: {
      recipe: t.arg({
        type: addRecipeToMealPlanInput,
        required: true,
      }),
    },
    validate: { schema: z.object({ recipe: addRecipeToMealPlanValidation }) },
    resolve: async (query, root, args) => {
      return await db.mealPlanRecipe.create({
        data: {
          mealPlan: { connect: { id: args.recipe.mealPlanId } },
          recipe: { connect: { id: args.recipe.recipeId } },
          factor: args.recipe.scaleFactor,
          totalServings: args.recipe.servings,
          cookDay: args.recipe.cookDay,
        },
        ...query,
      });
    },
  }),
  editMealPlanRecipe: t.prismaField({
    type: ["MealPlanRecipe"],
    args: {
      id: t.arg.string({ required: true }),
      recipe: t.arg({
        type: editMealPlanRecipeInput,
        required: true,
      }),
    },
    resolve: async (query, root, args) => {
      const updated = await db.mealPlanRecipe.update({
        where: { id: args.id },
        data: {
          totalServings: args.recipe.servings ?? undefined,
          factor: args.recipe.factor ?? undefined,
        },
        ...query,
      });
      return await db.mealPlanRecipe.findMany({
        where: { mealPlanId: updated.mealPlanId },
      });
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
}));
