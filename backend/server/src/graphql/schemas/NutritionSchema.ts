import { builder } from "../builder.js";
import { db } from "../../db.js";
import {
  FullNutritionLabel,
  FullNutrient,
  NutrientTarget,
} from "../../services/nutrition/NutritionAggregator.js";

// ============================================ Types ===================================
const AggregateNutrient = builder.objectRef<FullNutrient>("AggregateNutrient");
const AggregateLabel = builder.objectRef<FullNutritionLabel>("AggregateLabel");
const nutrientTarget = builder.objectRef<NutrientTarget>("NutrientTarget");

const unit = builder.prismaObject("MeasurementUnit", {
  name: "Unit",
  fields: (t) => ({
    id: t.exposeString("id"),
    name: t.exposeString("name"),
    abbreviations: t.exposeStringList("abbreviations"),
    symbol: t.exposeString("symbol", { nullable: true }),
  }),
});

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
    unit: t.field({ type: unit, resolve: (parent) => parent.unit }),
    target: t.field({
      type: nutrientTarget,
      nullable: true,
      resolve: (parent) => parent.target,
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
    servingUnit: t.exposeString("servingUnit", { nullable: true }),
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

builder.prismaObject("NutritionLabel", {
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
    nutrientsToAdd: t.field({ type: [createNutrient] }),
    nutrientsToEdit: t.field({ type: [editNutrientInput] }),
    nutrientsToDeleteIds: t.stringList(),
  }),
});

// ============================================ Queries =================================

builder.queryFields((t) => ({
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
  // createNutritionLabels: t.field({
  //   type: AggregateLabel,
  //   args: {
  //     recipeId: t.arg.string(),
  //     recipeIngredientGroupId: t.arg.string(),
  //     nutritionLabel: t.arg({ type: createNutritionLabel, required: true }),
  //   },
  //   resolve: async (root, args) => {
  //     const label = await db.nutritionLabel.create({
  //       data: {
  //         recipe: { connect: { id: args.recipeId ?? undefined } },
  //         ingredientGroup: {
  //           connect: { id: args.recipeIngredientGroupId ?? undefined },
  //         },
  //         name: args.nutritionLabel?.name,
  //         verifed: true,
  //         servings: args.nutritionLabel?.servings,
  //         servingSize: args.nutritionLabel.servingSize,
  //         servingsUsed: args.nutritionLabel?.servingsUsed,
  //         isPrimary: args.nutritionLabel?.isPrimary ?? false,
  //         servingSizeUnit: {
  //           connect: { id: args.nutritionLabel.servingSizeUnitId ?? undefined },
  //         },
  //         nutrients: {
  //           create: args.nutritionLabel.nutrients?.map((nutrient) => ({
  //             nutrient: { connect: { id: nutrient.nutrientId } },
  //             value: nutrient.value,
  //           })),
  //         },
  //       },
  //       include: {
  //         nutrients: true,
  //         servingSizeUnit: true,
  //       },
  //     });
  //     return (await convertToLabel([label]))[0];
  //   },
  // }),
  // editNutritionLabel: t.field({
  //   type: LabelObject,
  //   args: {
  //     label: t.arg({ type: editNutritionLabelInput, required: true }),
  //   },
  //   resolve: async (query, root, args) => {
  //     await db.nutritionLabel.update({
  //       where: {id: args.label}
  //     });
  //   },
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

export { AggregateLabel, AggregateNutrient };
