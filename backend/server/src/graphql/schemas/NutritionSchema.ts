import { builder } from "../builder.js";
import { db } from "../../db.js";

import { Gender, SpecialCondition } from "@prisma/client";

// ============================================ Types ===================================
builder.prismaObject("NutritionLabel", {
  name: "NutritionLabel",
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name", { nullable: true }),
    recipe: t.relation("recipe", { nullable: true }),
    ingredientGroup: t.relation("ingredientGroup"),
    nutrients: t.relation("nutrients"),
    servings: t.exposeFloat("servings", { nullable: true }),
    servingSize: t.exposeFloat("servingSize", { nullable: true }),
    servingsUsed: t.exposeFloat("servingsUsed", { nullable: true }),
    importRecord: t.relation("importRecord", { nullable: true }),
  }),
});

builder.prismaObject("NutritionLabelNutrient", {
  name: "NutritionLabelNutrient",
  fields: (t) => ({
    value: t.exposeFloat("value"),
    valuePerServing: t.exposeFloat("valuePerServing", { nullable: true }),
    nutrient: t.relation("nutrient"),
  }),
});

builder.prismaObject("Nutrient", {
  fields: (t) => ({
    id: t.exposeString("id"),
    name: t.exposeString("name"),
    otherNames: t.exposeStringList("alternateNames"),
    unit: t.relation("unit"),
    type: t.exposeString("type"),
    dailyReferenceIntakeValue: t.float({
      args: {
        age: t.arg({ type: "Int", required: true }),
        gender: t.arg({ type: Gender, required: true }),
        specialCondition: t.arg({ type: SpecialCondition, required: true }),
      },
      select: (args) => {
        return {
          dri: {
            take: 1,
            where: {
              ageMax: { lte: args.age },
              ageMin: { gte: args.age },
              gender: args.gender,
              specialCondition: args.specialCondition,
            },
          },
        };
      },
      resolve: (nutrient) => {
        return nutrient.dri[0].value;
      },
    }),
    customTarget: t.exposeFloat("customTarget", { nullable: true }),
  }),
});

builder.prismaObject("MeasurementUnit", {
  name: "Unit",
  fields: (t) => ({
    id: t.exposeString("id"),
    name: t.exposeString("name"),
    abbreviations: t.exposeStringList("abbreviations"),
    symbol: t.exposeString("symbol", { nullable: true }),
  }),
});

builder.prismaObject("DailyReferenceIntake", {
  fields: (t) => ({
    id: t.exposeString("id"),
    value: t.exposeFloat("value"),
    gender: t.field({ type: Gender, resolve: (dri) => dri.gender }),
    ageMin: t.exposeInt("ageMin"),
    ageMax: t.exposeInt("ageMax"),
    specialCondition: t.field({
      type: SpecialCondition,
      resolve: (dri) => dri.specialCondition,
    }),
    nutrient: t.relation("nutrient"),
  }),
});
// ============================================ Inputs ==================================
const createNutrient = builder.inputType("CreateNutrientInput", {
  fields: (t) => ({
    nutrientId: t.string({ required: true }),
    value: t.float({ required: true }),
  }),
});

const editNutrientInput = builder.inputType("EditNutrientInput", {
  fields: (t) => ({
    nutritionLabelId: t.string({ required: true }),
    nutrientId: t.string({ required: true }),
    value: t.float({ required: true }),
  }),
});

const createNutritionLabel = builder.inputType("CreateNutritionLabelInput", {
  fields: (t) => ({
    name: t.string(),
    connectingId: t.string(),
    servings: t.float(),
    servingSize: t.float(),
    servingSizeUnitId: t.string(),
    servingsUsed: t.float(),
    nutrients: t.field({
      type: [createNutrient],
    }),
  }),
});

const createNutritionLabels = builder.inputType("NutritionLabelsInput", {
  fields: (t) => ({
    baseLabel: t.field({ type: createNutritionLabel, required: true }),
    ingredientGroupLabels: t.field({ type: [createNutritionLabel] }),
  }),
});

const editNutritionLabelInput = builder.inputType("EditNutritionLabelInput", {
  fields: (t) => ({
    id: t.string({ required: true }),
    name: t.string(),
    servings: t.float(),
    servingSize: t.float(),
    servingSizeUnitId: t.string(),
    servingsUsed: t.float(),
    nutrientsToAdd: t.field({ type: [createNutrient] }),
    nutrientsToEdit: t.field({ type: [editNutrientInput] }),
    nutrientsToDeleteIds: t.stringList(),
  }),
});

// ============================================ Queries =================================

// builder.queryFields((t) => ({
//   nutrients: t.Prisma,
// }));

// await db.nutrient.groupBy({
//   by: "parentNutrientId",
// });

// ============================================ Mutations ===============================
builder.mutationFields((t) => ({
  // createNutritionLabels: t.prismaField({
  //   type: ["NutritionLabel"],
  //   args: {
  //     nutritionLabels: t.arg({ type: createNutritionLabels, required: true }),
  //   },
  //   resolve: async (query, root, args) => {},
  // }),
  // editNutritionLabel: t.prismaField({
  //   type: "NutritionLabel",
  //   args: {
  //     label: t.arg({ type: editNutritionLabelInput, required: true }),
  //   },
  //   resolve: async (query, root, args) => {},
  // }),
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
  disconnectNutritionLabelFromRecipe: t.prismaField({
    type: "Recipe",
    args: {
      recipeId: t.arg.string({ required: true }),
      labelId: t.arg.string({ required: true }),
    },
    resolve: async (query, root, args) => {
      return await db.recipe.update({
        where: { id: args.recipeId },
        data: {
          nutritionLabel: {
            disconnect: { id: args.labelId },
          },
        },
        ...query,
      });
    },
  }),
  connectNutritionLabeltoRecipe: t.prismaField({
    type: "Recipe",
    args: {
      recipeId: t.arg.string({ required: true }),
      labelId: t.arg.string({ required: true }),
    },
    resolve: async (query, root, args) => {
      return await db.recipe.update({
        ...query,
        where: { id: args.recipeId },
        data: {
          nutritionLabel: {
            connect: { id: args.labelId },
          },
        },
      });
    },
  }),
  connectNutritionLabelToIngredientGroup: t.prismaField({
    type: "RecipeIngredientGroup",
    args: {
      recipeId: t.arg.string({ required: true }),
      groupId: t.arg.string({ required: true }),
      labelId: t.arg.string({ required: true }),
    },
    resolve: async (query, root, args) => {
      await db.nutritionLabel.update({
        where: { id: args.labelId },
        data: {
          recipe: { connect: { id: args.recipeId } },
          ingredientGroup: { connect: { id: args.groupId } },
        },
      });
      return await db.recipeIngredientGroup.findUniqueOrThrow({
        where: { id: args.groupId },
        ...query,
      });
    },
  }),
  disconnectNutritionLabelFromIngredientGroup: t.prismaField({
    type: "RecipeIngredientGroup",
    args: {
      recipeId: t.arg.string({ required: true }),
      groupId: t.arg.string({ required: true }),
      labelId: t.arg.string({ required: true }),
      deleteLabel: t.arg.boolean({ required: true }),
    },
    resolve: async (query, root, args) => {
      if (args.deleteLabel) {
        return await db.recipeIngredientGroup.update({
          where: { id: args.groupId },
          data: {
            nutritionLabel: {
              delete: true,
            },
          },
          ...query,
        });
      } else {
        const [recipe, recipeGroup] = await db.$transaction([
          db.recipe.update({
            where: { id: args.recipeId },
            data: { nutritionLabel: { disconnect: { id: args.labelId } } },
          }),
          db.recipeIngredientGroup.update({
            where: { id: args.groupId },
            data: { nutritionLabel: { disconnect: { id: args.labelId } } },
          }),
        ]);
        return recipeGroup;
      }
    },
  }),
}));
