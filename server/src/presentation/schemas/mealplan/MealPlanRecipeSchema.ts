import {
  addRecipeToPlan,
  AddRecipeToPlanInput,
  EditMealPlanRecipeInput,
  editRecipeOnPlan,
  getMealPlanRecipes,
  getMealPlanRecipeServings,
  removeRecipeFromPlan,
} from "@/application/services/mealplan/MealPlanRecipeService.js";
import { builder } from "@/presentation/builder.js";
import { DeleteResult } from "@/presentation/schemas/common/MutationResult.js";

// ============================================ Types ===================================
builder.prismaObject("MealPlanRecipe", {
  fields: (t) => ({
    id: t.exposeID("id"),
    originalRecipe: t.relation("recipe"),
    mealPlan: t.relation("mealPlan"),
    factor: t.exposeFloat("factor"),
    mealPlanServings: t.relation("servings"),
    totalServings: t.exposeInt("totalServings"),
    cookDayOffset: t.exposeInt("cookDayOffset"),
    servingsOnPlan: t.int({
      resolve: async (recipe) => {
        return await getMealPlanRecipeServings(recipe);
      },
    }),
  }),
});

// ============================================ Inputs ==================================
const editMealPlanRecipeInput = builder
  .inputRef<EditMealPlanRecipeInput>("EditMealPlanRecipeInput")
  .implement({
    fields: (t) => ({
      factor: t.float({ required: true }),
      servings: t.int({ required: true }),
    }),
  });

const addRecipeToMealPlanInput = builder
  .inputRef<AddRecipeToPlanInput>("AddRecipeToPlanInput")
  .implement({
    fields: (t) => ({
      mealPlanId: t.string({ required: true }),
      recipeId: t.string({ required: true }),
      scaleFactor: t.float({ required: true }),
      servings: t.int({ required: true }),
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
      return getMealPlanRecipes(args.mealPlanId, query);
    },
  }),
}));

// ============================================ Mutations ===============================
builder.mutationFields((t) => ({
  addRecipeToMealPlan: t.prismaField({
    type: "MealPlanRecipe",
    args: {
      mealPlanId: t.arg.string({ required: true }),
      recipe: t.arg({
        type: addRecipeToMealPlanInput,
        required: true,
      }),
    },
    resolve: async (query, root, args) => {
      return await addRecipeToPlan(args.mealPlanId, args.recipe, query);
    },
  }),
  editMealPlanRecipe: t.prismaField({
    type: "MealPlanRecipe",
    args: {
      id: t.arg.string({ required: true }),
      recipe: t.arg({
        type: editMealPlanRecipeInput,
        required: true,
      }),
    },
    resolve: async (query, root, args) => {
      return await editRecipeOnPlan(args.id, args.recipe, query);
    },
  }),
  removeMealPlanRecipe: t.field({
    type: DeleteResult,
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (root, args) => {
      await removeRecipeFromPlan(args.id);
      return { success: true };
    },
  }),
}));
