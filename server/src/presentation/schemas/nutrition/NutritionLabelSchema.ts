// import { NutritionLabel } from "@prisma/client";
import {
  createNutritionLabel,
  editNutritionLabel,
  NutrientInput,
  NutritionLabelInput,
} from "@/application/services/nutrition/NutritionLabelService.js";
import { db } from "@/infrastructure/repository/db.js";
import { builder } from "@/presentation/builder.js";
import { DeleteResult } from "@/presentation/schemas/common/MutationResult.js";
import { encodeGlobalID } from "@pothos/plugin-relay";

// ============================================ Types ===================================

const aggLabel = builder.prismaNode("AggregateLabel", {
  id: { field: "id" },
  fields: (t) => ({
    recipe: t.relation("recipe", { nullable: true }),
    servings: t.exposeFloat("servings", { nullable: true }),
    servingSize: t.exposeFloat("servingSize", { nullable: true }),
    servingSizeUnit: t.relation("servingSizeUnit", { nullable: true }),
    nutrients: t.relation("nutrients"),
    protein: t.exposeFloat("protein", { nullable: true }),
    carbs: t.exposeFloat("carbs", { nullable: true }),
    fat: t.exposeFloat("fat", { nullable: true }),
    alcohol: t.exposeFloat("alcohol", { nullable: true }),
    totalCalories: t.exposeFloat("totalCalories", { nullable: true }),
    caloriesPerServing: t.exposeFloat("caloriesPerServing", { nullable: true }),
  }),
});

builder.prismaNode("AggLabelNutrient", {
  id: { field: "compoundId" },
  fields: (t) => ({
    // id: t.string({
    //   nullable: false,
    //   resolve: (label) => {
    //     return `${label.aggLabelId}_${label.nutrientId}`;
    //   },
    // }),
    value: t.exposeFloat("value"),
    perServing: t.exposeFloat("valuePerServing", { nullable: true }),
    nutrient: t.relation("nutrient"),
  }),
});

export const nutritionLabel = builder.prismaNode("NutritionLabel", {
  id: { field: "id" },
  name: "NutritionLabel",
  fields: (t) => ({
    recipe: t.relation("recipe", { nullable: true }),
    ingredientGroup: t.relation("ingredientGroup", { nullable: true }),
    servings: t.exposeFloat("servings", { nullable: true }),
    servingSize: t.exposeFloat("servingSize", { nullable: true }),
    servingSizeUnit: t.relation("servingSizeUnit", { nullable: true }),
    servingsUsed: t.exposeFloat("servingsUsed", { nullable: true }),
    isPrimary: t.exposeBoolean("isPrimary"),
    nutrients: t.relation("nutrients"),
  }),
});

builder.prismaObject("NutritionLabelNutrient", {
  fields: (t) => ({
    value: t.exposeFloat("value"),
    nutrient: t.relation("nutrient"),
  }),
});

// ============================================ Inputs ==================================

const nutritionLabelInput = builder
  .inputRef<NutritionLabelInput>("NutritionLabelInput")
  .implement({
    fields: (t) => ({
      servings: t.float({ required: true }),
      servingSize: t.float(),
      servingSizeUnitId: t.field({ type: "RefID" }),
      recipeId: t.field({ type: "RefID" }),
      ingredientGroupId: t.field({ type: "RefID" }),
      servingsUsed: t.float(),
      isPrimary: t.boolean({ required: true }),
      nutrients: t.field({
        type: [nutrientInput],
      }),
    }),
  });

const nutrientInput = builder
  .inputRef<NutrientInput>("NutrientInput")
  .implement({
    fields: (t) => ({
      nutrientId: t.field({ type: "RefID", required: true }),
      value: t.float({ required: true }),
    }),
  });

// ============================================ Queries =================================

builder.queryFields((t) => ({
  nutritionLabel: t.prismaField({
    type: "NutritionLabel",
    args: {
      labelId: t.arg.string({ required: true }),
    },
    resolve: async (query, root, args) => {
      return await db.nutritionLabel.findUniqueOrThrow({
        where: { id: args.labelId },
        ...query,
      });
    },
  }),
}));

// ============================================ Mutations ===============================
builder.mutationFields((t) => ({
  createNutritionLabel: t.prismaField({
    type: "NutritionLabel",
    args: {
      nutritionLabel: t.arg({ type: nutritionLabelInput, required: true }),
    },
    resolve: async (query, root, args) => {
      return await createNutritionLabel(args.nutritionLabel, query);
    },
  }),
  editNutritionLabel: t.prismaField({
    type: "NutritionLabel",
    args: {
      id: t.arg.globalID({ required: true }),
      label: t.arg({ type: nutritionLabelInput, required: true }),
    },
    resolve: async (query, root, args) => {
      return await editNutritionLabel(args.id.id, args.label, query);
    },
  }),
  deleteNutritionLabel: t.field({
    type: DeleteResult,
    args: {
      id: t.arg.globalID({ required: true }),
    },
    resolve: async (root, args) => {
      const guid = encodeGlobalID(args.id.typename, args.id.id);

      await db.nutritionLabel.delete({
        where: { id: args.id.id },
      });
      return {
        id: guid,
        success: true,
      };
    },
  }),
}));

export { aggLabel as AggregateLabel };
