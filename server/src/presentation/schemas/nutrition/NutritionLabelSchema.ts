// import { NutritionLabel } from "@prisma/client";
import { db } from "@/infrastructure/repository/db.js";
import { builder } from "@/presentation/builder.js";

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

builder.prismaObject("AggLabelNutrient", {
  fields: (t) => ({
    id: t.string({
      nullable: false,
      resolve: (label) => {
        return `${label.aggLabelId}_${label.nutrientId}`;
      },
    }),
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

const createNutritionLabel = builder.inputType("CreateNutritionLabelInput", {
  fields: (t) => ({
    servings: t.float({ required: true }),
    servingSize: t.float(),
    servingSizeUnitId: t.string(),
    servingsUsed: t.float(),
    isPrimary: t.boolean(),
    nutrients: t.field({
      type: [createNutrient],
    }),
  }),
});

const createNutrient = builder.inputType("CreateNutrientInput", {
  fields: (t) => ({
    nutrientId: t.string({ required: true }),
    value: t.float({ required: true }),
  }),
});

const editNutritionLabelInput = builder.inputType("EditNutritionLabelInput", {
  fields: (t) => ({
    id: t.string({ required: true }),
    servings: t.float(),
    servingSize: t.float(),
    servingSizeUnitId: t.string(),
    servingsUsed: t.float(),
    isPrimary: t.boolean(),
    ingredientGroupId: t.string(),
    nutrientsToDelete: t.stringList(),
    nutrientsToEdit: t.field({
      type: [createNutrient],
    }),
    nutrientsToAdd: t.field({
      type: [createNutrient],
    }),
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
  createNutritionLabels: t.prismaField({
    type: "NutritionLabel",
    args: {
      recipeId: t.arg.string({ required: true }),
      ingredientGroupId: t.arg.string(),
      nutritionLabel: t.arg({ type: createNutritionLabel, required: true }),
    },
    resolve: async (query, root, args) => {
      return await db.nutritionLabel.createNutritionLabel(
        args.nutritionLabel,
        args.recipeId,
        args.ingredientGroupId ?? null,
        true,
        query
      );
    },
  }),
  editNutritionLabel: t.prismaField({
    type: "NutritionLabel",
    args: {
      label: t.arg({ type: editNutritionLabelInput, required: true }),
    },
    resolve: async (query, root, args) => {
      return await db.nutritionLabel.editNutritionLabel(args.label, query);
    },
  }),
  deleteNutritionLabel: t.prismaField({
    type: ["NutritionLabel"],
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (query, root, args) => {
      await db.nutritionLabel.delete({ where: { id: args.id } });
      return db.nutritionLabel.findMany({ ...query });
    },
  }),
}));

export { aggLabel as AggregateLabel };
