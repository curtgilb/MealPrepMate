import {
  addRecipeIngredientsFromText,
  editRecipeIngredient,
  RecipeIngredientInput,
  TaggedIngredient,
  tagIngredients,
} from "@/application/services/recipe/RecipeIngredientService.js";
import { db } from "@/infrastructure/repository/db.js";
import { builder } from "@/presentation/builder.js";
import { measurementUnit } from "@/presentation/schemas/common/MeasurementUnitSchema.js";
import { DeleteResult } from "@/presentation/schemas/common/MutationResult.js";
import { ingredient } from "@/presentation/schemas/ingredient/IngredientSchema.js";
import { encodeGlobalID } from "@pothos/plugin-relay";

// ============================================ Types ===================================

const recipeIngredient = builder.prismaNode("RecipeIngredient", {
  id: { field: "id" },
  name: "RecipeIngredient",
  fields: (t) => ({
    order: t.exposeInt("order"),
    sentence: t.exposeString("sentence"),
    quantity: t.exposeFloat("quantity", { nullable: true }),
    unit: t.relation("unit", { nullable: true }),
    recipe: t.relation("recipe"),
    baseIngredient: t.relation("ingredient", { nullable: true }),
    group: t.relation("group", { nullable: true }),
    verified: t.exposeBoolean("verified"),
    mealPrepIngredient: t.exposeBoolean("mealPrepIngredient"),
    optional: t.exposeBoolean("optional"),
  }),
});

const taggedIngredient = builder
  .objectRef<TaggedIngredient>("TaggedIngredient")
  .implement({
    fields: (t) => ({
      sentence: t.exposeString("sentence"),
      quantity: t.exposeFloat("quantity", { nullable: true }),
      order: t.exposeInt("order"),
      verified: t.exposeBoolean("verified"),
      unit: t.field({
        type: measurementUnit,
        nullable: true,
        resolve: (parent) => parent.unit,
      }),
      ingredient: t.field({
        type: ingredient,
        nullable: true,
        resolve: (parent) => parent.ingredient,
      }),
    }),
  });

// ============================================ Inputs ==================================

export const recipeIngredientInput = builder
  .inputRef<RecipeIngredientInput>("RecipeIngredientInput")
  .implement({
    fields: (t) => ({
      order: t.int({ required: true }),
      sentence: t.string({ required: true }),
      quantity: t.float(),
      unitId: t.field({ type: "RefID", required: true }),
      ingredientId: t.field({ type: "RefID", required: true }),
      groupId: t.field({ type: "RefID" }),
      mealPrepIngredient: t.boolean({ required: true }),
      verified: t.boolean({ required: true }),
    }),
  });

export const editRecipeIngredientsInput = builder.inputType(
  "EditRecipeIngredientsInput",
  {
    fields: (t) => ({
      id: t.field({ type: "RefID", required: true }),
      input: t.field({ type: recipeIngredientInput, required: true }),
    }),
  }
);

// ============================================ Queries =================================
builder.queryFields((t) => ({
  tagIngredients: t.field({
    type: [taggedIngredient],
    args: {
      ingredientTxt: t.arg.string({ required: true }),
    },
    resolve: async (root, args) => {
      return await tagIngredients(args.ingredientTxt, false);
    },
  }),
}));

// ============================================ Mutations ===============================

builder.mutationFields((t) => ({
  addRecipeIngredientsFromTxt: t.prismaField({
    type: ["RecipeIngredient"],
    args: {
      recipeId: t.arg.globalID({ required: true }),
      text: t.arg.string({ required: true }),
      groupId: t.arg.globalID(),
    },
    resolve: async (query, root, args) => {
      return await addRecipeIngredientsFromText({
        recipeId: args.recipeId.id,
        text: args.text,
        groupId: args.groupId?.id,
        query,
      });
    },
  }),
  deleteRecipeIngredient: t.field({
    type: DeleteResult,
    args: {
      ingredientId: t.arg.globalID({ required: true }),
    },
    resolve: async (root, args) => {
      const guid = encodeGlobalID(
        args.ingredientId.typename,
        args.ingredientId.id
      );
      try {
        await db.recipeIngredient.delete({
          where: { id: args.ingredientId.id },
        });
        return {
          id: guid,
          success: true,
        };
      } catch (e) {
        return { id: guid, success: false, message: e.message };
      }
    },
  }),
  editRecipeIngredients: t.prismaField({
    type: ["RecipeIngredient"],
    args: {
      ingredients: t.arg({
        type: [editRecipeIngredientsInput],
        required: true,
      }),
    },
    resolve: async (query, root, args) => {
      return await editRecipeIngredient(args.ingredients, query);
    },
  }),
}));

export { recipeIngredient };
