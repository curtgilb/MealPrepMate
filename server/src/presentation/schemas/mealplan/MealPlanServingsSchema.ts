import {
    AddRecipeServingInput, addServingToPlan, deleteMealPlanServing, editMealPlanServing,
    EditRecipeServingInput, getMealPlanServings, ServingsFilterInput
} from '@/application/services/mealplan/MealPlanServingsService.js';
import { builder } from '@/presentation/builder.js';
import { DeleteResult } from '@/presentation/schemas/common/MutationResult.js';
import { encodeGlobalID } from '@pothos/plugin-relay';
import { Meal } from '@prisma/client';

const meal = builder.enumType(Meal, { name: "Meal" });

// ============================================ Types ===================================
builder.prismaNode("MealPlanServing", {
  id: { field: "id" },
  include: {
    recipe: true,
  },
  fields: (t) => ({
    day: t.exposeInt("day"),
    meal: t.field({ type: meal, resolve: (parent) => parent.meal }),
    numberOfServings: t.exposeInt("numberOfServings"),
    mealPlanRecipeId: t.exposeString("mealPlanRecipeId"),
    mealRecipe: t.relation("recipe"),
  }),
});
// ============================================ Inputs ==================================
const addRecipeServingInput = builder
  .inputRef<AddRecipeServingInput>("AddRecipeServingInput")
  .implement({
    fields: (t) => ({
      day: t.int({ required: true }),
      mealPlanRecipeId: t.string({ required: true }),
      mealPlanId: t.string({ required: true }),
      servings: t.int({ required: true }),
      meal: t.field({ type: meal, required: true }),
    }),
  });

const editRecipeServingInput = builder
  .inputRef<EditRecipeServingInput>("EditRecipeServingInput")
  .implement({
    fields: (t) => ({
      day: t.int({ required: true }),
      servings: t.int({ required: true }),
      meal: t.field({ type: meal, required: true }),
    }),
  });

const servingsDayInput = builder
  .inputRef<ServingsFilterInput>("ServingsFilterInput")
  .implement({
    fields: (t) => ({
      day: t.int(),
      minDay: t.int(),
      maxDay: t.int(),
    }),
  });

// ============================================ Queries =================================
builder.queryFields((t) => ({
  mealPlanServings: t.prismaField({
    type: ["MealPlanServing"],
    args: {
      mealPlanId: t.arg.globalID({ required: true }),
      filter: t.arg({ type: servingsDayInput }),
    },
    resolve: async (query, root, args) => {
      return await getMealPlanServings(args.mealPlanId.id, args.filter, query);
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
    resolve: async (query, root, args) => {
      return addServingToPlan(args.serving, query);
    },
  }),
  deleteRecipeServing: t.field({
    type: DeleteResult,
    args: {
      id: t.arg.globalID({ required: true }),
    },
    resolve: async (root, args) => {
      const guid = encodeGlobalID(args.id.typename, args.id.id);
      await deleteMealPlanServing(args.id.id);
      return { id: guid, success: true };
    },
  }),
  editRecipeServing: t.prismaField({
    type: ["MealPlanServing"],
    args: {
      id: t.arg.globalID({ required: true }),
      serving: t.arg({ type: editRecipeServingInput, required: true }),
    },
    resolve: async (query, root, args) => {
      return await editMealPlanServing(args.id.id, args.serving, query);
    },
  }),
}));
