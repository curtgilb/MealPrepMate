import {
  addRecipeIngredient,
  addRecipeIngredients,
  CreateRecipeIngredientInput,
  editRecipeIngredient,
  EditRecipeIngredientInput,
  TaggedIngredient,
  tagIngredients,
} from "@/application/services/recipe/RecipeIngredientService.js";
import { builder } from "@/presentation/builder.js";
import { DeleteResult } from "@/presentation/schemas/common/MutationResult.js";
import { db } from "@/infrastructure/repository/db.js";
import { measurementUnit } from "@/presentation/schemas/common/MeasurementUnitSchema.js";
import { ingredient } from "@/presentation/schemas/ingredient/IngredientSchema.js";

// ============================================ Types ===================================

const recipeIngredient = builder.prismaObject("RecipeIngredient", {
  name: "RecipeIngredient",
  fields: (t) => ({
    id: t.exposeString("id"),
    order: t.exposeInt("order"),
    sentence: t.exposeString("sentence"),
    quantity: t.exposeFloat("quantity", { nullable: true }),
    unit: t.relation("unit", { nullable: true }),
    recipe: t.relation("recipe"),
    baseIngredient: t.relation("ingredient", { nullable: true }),
    group: t.relation("group", { nullable: true }),
  }),
});

const taggedIngredient = builder
  .objectRef<TaggedIngredient>("TaggedIngredient")
  .implement({
    fields: (t) => ({
      sentence: t.exposeString("sentence"),
      quantity: t.exposeFloat("quantity"),
      order: t.exposeInt("order"),
      verified: t.exposeBoolean("verified"),
      unit: t.field({
        type: measurementUnit,
        resolve: (parent) => parent.unit,
      }),
      ingredient: t.field({
        type: ingredient,
        resolve: (parent) => parent.ingredient,
      }),
    }),
  });

// ============================================ Inputs ==================================

export const recipeIngredientInput = builder
  .inputRef<CreateRecipeIngredientInput>("CreateRecipeIngredientInput")
  .implement({
    fields: (t) => ({
      order: t.int({ required: true }),
      sentence: t.string({ required: true }),
      quantity: t.int({ required: true }),
      unitId: t.string({ required: true }),
      ingredientId: t.string({ required: true }),
      groupId: t.string({ required: true }),
    }),
  });

export const editRecipeInput = builder
  .inputRef<EditRecipeIngredientInput>("EditRecipeIngredientInput")
  .implement({
    fields: (t) => ({
      id: t.string({ required: true }),
      order: t.int(),
      sentence: t.string(),
      quantity: t.int(),
      unitId: t.string(),
      ingredientId: t.string(),
      groupId: t.string(),
    }),
  });

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
  addRecipeIngredient: t.prismaField({
    type: "RecipeIngredient",
    args: {
      recipeId: t.arg.globalID({ required: true }),
      ingredient: t.arg({ type: recipeIngredientInput, required: true }),
    },
    resolve: async (query, root, args) => {
      return await addRecipeIngredient(args.recipeId.id, args.ingredient);
    },
  }),
  addRecipeIngredients: t.prismaField({
    type: ["RecipeIngredient"],
    args: {
      recipeId: t.arg.globalID({ required: true }),
      ingredients: t.arg({ type: [recipeIngredientInput], required: true }),
    },
    resolve: async (query, root, args) => {
      return await addRecipeIngredients(
        args.recipeId.id,
        args.ingredients,
        query
      );
    },
  }),
  deleteRecipeIngredients: t.field({
    type: DeleteResult,
    args: {
      ingredientId: t.arg.globalID({ required: true }),
    },
    resolve: async (root, args) => {
      try {
        await db.recipeIngredient.delete({
          where: { id: args.ingredientId.id },
        });
        return {
          success: true,
        };
      } catch (e) {
        return { success: false, message: e.message };
      }
    },
  }),
  editRecipeIngredients: t.prismaField({
    type: "RecipeIngredient",
    args: {
      ingredient: t.arg({ type: editRecipeInput, required: true }),
    },
    resolve: async (query, root, args) => {
      return await editRecipeIngredient(
        args.ingredient as EditRecipeIngredientInput,
        query
      );
    },
  }),
}));

export { recipeIngredient };
