import {
  AddRecipeServingInput,
  addServingToPlan,
  deleteMealPlanServing,
  editMealPlanServing,
  EditRecipeServingInput,
  getMealPlanServings,
} from "@/application/services/mealplan/MealPlanServingsService.js";
import { builder } from "@/graphql/builder.js";
import { DeleteResult } from "@/graphql/schemas/common/MutationResult.js";
import { meal } from "../common/EnumSchema.js";

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
      return await getMealPlanServings(
        args.mealPlanId,
        args.minDay ?? undefined,
        args.maxDay ?? undefined,
        query
      );
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
      id: t.arg.string({ required: true }),
    },
    resolve: async (root, args) => {
      try {
        await deleteMealPlanServing(args.id);
        return { success: true };
      } catch {
        return { success: false };
      }
    },
  }),
  editRecipeServing: t.prismaField({
    type: ["MealPlanServing"],
    args: {
      id: t.arg.string({ required: true }),
      serving: t.arg({ type: editRecipeServingInput, required: true }),
    },
    resolve: async (query, root, args) => {
      return await editMealPlanServing(args.id, args.serving, query);
    },
  }),
}));
