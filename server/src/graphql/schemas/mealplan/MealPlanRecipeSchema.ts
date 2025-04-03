import {
  addRecipeToPlan,
  AddRecipeToPlanInput,
  EditMealPlanRecipeInput,
  editRecipeOnPlan,
  getMealPlanRecipes,
  getMealPlanRecipeServings,
  removeRecipeFromPlan,
} from "@/application/services/mealplan/MealPlanRecipeService.js";
import { builder } from "@/graphql/builder.js";
import { DeleteResult } from "@/graphql/schemas/common/MutationResult.js";
import { encodeGlobalID } from "@pothos/plugin-relay";

// ============================================ Types ===================================
builder.prismaNode("MealPlanRecipe", {
  id: { field: "id" },
  fields: (t) => ({
    originalRecipe: t.relation("recipe"),
    mealPlan: t.relation("mealPlan"),
    factor: t.exposeFloat("factor"),
    mealPlanServings: t.relation("servings"),
    totalServings: t.exposeInt("totalServings"),
    cookDayOffset: t.exposeInt("cookDayOffset"),
    servingsOnPlan: t.field({
      type: "Int",
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
      recipeId: t.field({ type: "RefID", required: true }),
      scaleFactor: t.float({ required: true }),
      servings: t.int({ required: true }),
    }),
  });

// ============================================ Queries =================================
builder.queryFields((t) => ({
  mealPlanRecipes: t.prismaField({
    type: ["MealPlanRecipe"],
    args: {
      mealPlanId: t.arg.globalID({ required: true }),
    },
    resolve: async (query, root, args) => {
      return getMealPlanRecipes(args.mealPlanId.id, query);
    },
  }),
}));

// ============================================ Mutations ===============================
builder.mutationFields((t) => ({
  addRecipeToMealPlan: t.prismaField({
    type: "MealPlanRecipe",
    args: {
      mealPlanId: t.arg.globalID({ required: true }),
      recipe: t.arg({
        type: addRecipeToMealPlanInput,
        required: true,
      }),
    },
    resolve: async (query, root, args) => {
      console.log(args);
      return await addRecipeToPlan(args.mealPlanId.id, args.recipe, query);
    },
  }),
  editMealPlanRecipe: t.prismaField({
    type: "MealPlanRecipe",
    args: {
      id: t.arg.globalID({ required: true }),
      recipe: t.arg({
        type: editMealPlanRecipeInput,
        required: true,
      }),
    },
    resolve: async (query, root, args) => {
      return await editRecipeOnPlan(args.id.id, args.recipe, query);
    },
  }),
  removeMealPlanRecipe: t.field({
    type: DeleteResult,
    args: {
      id: t.arg.globalID({ required: true }),
    },
    resolve: async (root, args) => {
      const guid = encodeGlobalID(args.id.typename, args.id.id);

      await removeRecipeFromPlan(args.id.id);
      return { id: guid, success: true };
    },
  }),
}));
