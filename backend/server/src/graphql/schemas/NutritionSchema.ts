import { builder } from "../builder.js";
import { db } from "../../db.js";
import {
  FullNutritionLabel,
  FullNutrient,
  NutrientTarget,
} from "../../services/nutrition/NutritionAggregator.js";
import { getAggregatedLabel } from "../../services/recipe/RecipeService.js";
import { UnitType } from "@prisma/client";

// ============================================ Types ===================================
const AggregateNutrient = builder.objectRef<FullNutrient>("AggregateNutrient");
const AggregateLabel = builder.objectRef<FullNutritionLabel>("AggregateLabel");
const nutrientTarget = builder.objectRef<NutrientTarget>("NutrientTarget");

nutrientTarget.implement({
  fields: (t) => ({
    dri: t.exposeFloat("dri", { nullable: true }),
    customTarget: t.exposeFloat("customTarget", { nullable: true }),
  }),
});

AggregateNutrient.implement({
  fields: (t) => ({
    id: t.exposeString("id"),
    name: t.exposeString("name"),
    value: t.exposeFloat("value"),
    perServing: t.exposeFloat("perServing", { nullable: true }),
    unit: t.field({ type: measurementUnit, resolve: (parent) => parent.unit }),
    target: t.field({
      type: nutrientTarget,
      nullable: true,
      resolve: (parent) => parent?.target,
    }),
    children: t.field({
      type: [AggregateNutrient],
      resolve: (parent) => parent.children,
    }),
  }),
});

AggregateLabel.implement({
  fields: (t) => ({
    calories: t.exposeFloat("calories"),
    caloriesPerServing: t.exposeFloat("caloriesPerServing", { nullable: true }),
    servings: t.exposeInt("servings", { nullable: true }),
    servingsUsed: t.exposeInt("servings", { nullable: true }),
    servingUnit: t.field({
      type: measurementUnit,
      nullable: true,
      resolve: (parent) => parent.servingUnit,
    }),
    servingSize: t.exposeFloat("servingSize", { nullable: true }),
    carbPercentage: t.exposeFloat("carbPercentage"),
    proteinPercentage: t.exposeFloat("proteinPercentage"),
    fatPercentage: t.exposeFloat("fatPercentage"),
    nutrients: t.field({
      type: [AggregateNutrient],
      resolve: (parent) => parent.nutrients,
    }),
  }),
});

const unitType = builder.enumType(UnitType, { name: "SpecialCondition" });

const measurementUnit = builder.prismaObject("MeasurementUnit", {
  name: "MeasurementUnit",
  fields: (t) => ({
    id: t.exposeString("id"),
    name: t.exposeString("name"),
    abbreviations: t.exposeStringList("abbreviations"),
    symbol: t.exposeString("symbol", { nullable: true }),
    type: t.field({
      type: unitType,
      nullable: true,
      resolve: (parent) => parent.type,
    }),
  }),
});

const nutritionLabel = builder.prismaObject("NutritionLabel", {
  name: "NutritionLabel",
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name", { nullable: true }),
    recipe: t.relation("recipe", { nullable: true }),
    ingredientGroup: t.relation("ingredientGroup"),
    servings: t.exposeFloat("servings", { nullable: true }),
    servingSize: t.exposeFloat("servingSize", { nullable: true }),
    servingsUsed: t.exposeFloat("servingsUsed", { nullable: true }),
    importRecord: t.relation("importRecord", { nullable: true }),
    aggregateLabel: t.field({
      type: AggregateLabel,
      nullable: true,
      args: {
        advanced: t.arg.boolean(),
      },
      resolve: async (parent, args) => {
        return await getAggregatedLabel(
          parent.id,
          args.advanced ?? false,
          true
        );
      },
    }),
  }),
});

builder.prismaObject("Nutrient", {
  fields: (t) => ({
    name: t.exposeString("name"),
    alternateNames: t.exposeStringList("alternateNames"),
    type: t.exposeString("type"),
    advancedView: t.exposeBoolean("advancedView"),
    customTarget: t.exposeFloat("customTarget", { nullable: true }),
    dri: t.relation("dri"),
    subNutrients: t.relation("subNutrients"),
    unit: t.relation("unit"),
  }),
});

builder.prismaObject("DailyReferenceIntake", {
  name: "DailyReferenceIntake",
  fields: (t) => ({
    id: t.exposeString("id"),
    value: t.exposeFloat("value"),
    nutrient: t.relation("nutrient"),
  }),
});

// ============================================ Inputs ==================================

const createNutritionLabel = builder.inputType("CreateNutritionLabelInput", {
  fields: (t) => ({
    name: t.string(),
    ingredientGroupId: t.string(),
    servings: t.float(),
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
    name: t.string(),
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
  dailyReferenceIntake: t.prismaField({
    type: ["Nutrient"],
    resolve: async (query, root, args) => {
      const profile = await db.healthProfile.findFirstOrThrow({});
      const age = new Date().getFullYear() - profile.yearBorn;
      return await db.nutrient.findMany({
        ...query,
        include: {
          unit: true,
          dri: {
            where: {
              gender: profile.gender,
              ageMin: { lte: age },
              ageMax: { gte: age },
              specialCondition: profile.specialCondition,
            },
          },
        },
        orderBy: { order: "asc" },
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
      nutritionLabel: t.arg({ type: createNutritionLabel, required: true }),
    },
    resolve: async (query, root, args) => {
      return await db.nutritionLabel.createNutritionLabel(
        args.nutritionLabel,
        args.recipeId,
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
      return await db.nutritionLabel.editNutritionLabel(args, query);
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
  // disconnectNutritionLabelFromRecipe: t.prismaField({
  //   type: "Recipe",
  //   args: {
  //     recipeId: t.arg.string({ required: true }),
  //     labelId: t.arg.string({ required: true }),
  //   },
  //   resolve: async (query, root, args) => {
  //     return await db.recipe.update({
  //       where: { id: args.recipeId },
  //       data: {
  //         nutritionLabel: {
  //           disconnect: { id: args.labelId },
  //         },
  //       },
  //       ...query,
  //     });
  //   },
  // }),
  // connectNutritionLabeltoRecipe: t.prismaField({
  //   type: "Recipe",
  //   args: {
  //     recipeId: t.arg.string({ required: true }),
  //     labelId: t.arg.string({ required: true }),
  //   },
  //   resolve: async (query, root, args) => {
  //     return await db.recipe.update({
  //       ...query,
  //       where: { id: args.recipeId },
  //       data: {
  //         nutritionLabel: {
  //           connect: { id: args.labelId },
  //         },
  //       },
  //     });
  //   },
  // }),
  // connectNutritionLabelToIngredientGroup: t.prismaField({
  //   type: "RecipeIngredientGroup",
  //   args: {
  //     recipeId: t.arg.string({ required: true }),
  //     groupId: t.arg.string({ required: true }),
  //     labelId: t.arg.string({ required: true }),
  //   },
  //   resolve: async (query, root, args) => {
  //     await db.nutritionLabel.update({
  //       where: { id: args.labelId },
  //       data: {
  //         recipe: { connect: { id: args.recipeId } },
  //         ingredientGroup: { connect: { id: args.groupId } },
  //       },
  //     });
  //     return await db.recipeIngredientGroup.findUniqueOrThrow({
  //       where: { id: args.groupId },
  //       ...query,
  //     });
  //   },
  // }),
  // disconnectNutritionLabelFromIngredientGroup: t.prismaField({
  //   type: "RecipeIngredientGroup",
  //   args: {
  //     recipeId: t.arg.string({ required: true }),
  //     groupId: t.arg.string({ required: true }),
  //     labelId: t.arg.string({ required: true }),
  //     deleteLabel: t.arg.boolean({ required: true }),
  //   },
  //   resolve: async (query, root, args) => {
  //     if (args.deleteLabel) {
  //       return await db.recipeIngredientGroup.update({
  //         where: { id: args.groupId },
  //         data: {
  //           nutritionLabel: {
  //             delete: true,
  //           },
  //         },
  //         ...query,
  //       });
  //     } else {
  //       const [recipe, recipeGroup] = await db.$transaction([
  //         db.recipe.update({
  //           where: { id: args.recipeId },
  //           data: { nutritionLabel: { disconnect: { id: args.labelId } } },
  //         }),
  //         db.recipeIngredientGroup.update({
  //           where: { id: args.groupId },
  //           data: { nutritionLabel: { disconnect: { id: args.labelId } } },
  //         }),
  //       ]);
  //       return recipeGroup;
  //     }
  //   },
  // }),
}));

export { AggregateLabel, AggregateNutrient, nutritionLabel };
