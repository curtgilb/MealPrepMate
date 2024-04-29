import { z } from "zod";
import { db } from "../../db.js";
import {
  FullNutrient,
  FullNutritionLabel,
  NutrientTarget,
} from "../../services/nutrition/NutritionAggregator.js";
import { getAggregatedLabel } from "../../services/recipe/RecipeService.js";

import { builder } from "../builder.js";
import { measurementUnit } from "./MeasurementUnitSchema.js";
import {
  createNutritionLabelValidation,
  editNutritionLabelValidation,
} from "../../validations/NutritionValidation.js";
import { NutritionLabel } from "@prisma/client";
import { nextPageInfo, offsetPagination } from "./UtilitySchema.js";
import { offsetPaginationValidation } from "../../validations/UtilityValidation.js";
import { queryFromInfo } from "@pothos/plugin-prisma";

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

// Flatened, aggregated nutrition field
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
  }),
});

// Flattened, aggregated nutrition label
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

const nutritionLabel = builder.prismaObject("NutritionLabel", {
  name: "NutritionLabel",
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name", { nullable: true }),
    recipe: t.relation("recipe", { nullable: true }),
    ingredientGroup: t.relation("ingredientGroup"),
    servings: t.exposeFloat("servings", { nullable: true }),
    servingSize: t.exposeFloat("servingSize", { nullable: true }),
    servingSizeUnit: t.relation("servingSizeUnit", { nullable: true }),
    servingsUsed: t.exposeFloat("servingsUsed", { nullable: true }),
    isPrimary: t.exposeBoolean("isPrimary"),
    aggregateLabel: t.field({
      type: AggregateLabel,
      nullable: true,
      args: {
        advanced: t.arg.boolean(),
      },
      resolve: async (parent, args) => {
        return await getAggregatedLabel(
          [{ id: parent.id }],
          args.advanced ?? false,
          true
        );
      },
    }),
  }),
});

const nutritionLabelQuery = builder
  .objectRef<{
    nextOffset: number | null;
    itemsRemaining: number;
    items: NutritionLabel[];
  }>("NutritionLabelQuery")
  .implement({
    fields: (t) => ({
      nextOffset: t.exposeInt("nextOffset", { nullable: true }),
      itemsRemaining: t.exposeInt("itemsRemaining"),
      items: t.field({
        type: [nutritionLabel],
        resolve: (result) => result.items,
      }),
    }),
  });

// ============================================ Inputs ==================================

const createNutritionLabel = builder.inputType("CreateNutritionLabelInput", {
  fields: (t) => ({
    name: t.string(),
    ingredientGroupId: t.string(),
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
    validate: {
      schema: z.object({ labelId: z.string().cuid() }),
    },
    resolve: async (query, root, args) => {
      return await db.nutritionLabel.findUniqueOrThrow({
        where: { id: args.labelId },
        ...query,
      });
    },
  }),
  nutritionLabels: t.field({
    type: nutritionLabelQuery,
    args: {
      search: t.arg.string(),
      pagination: t.arg({
        type: offsetPagination,
        required: true,
      }),
    },
    validate: {
      schema: z.object({
        pagination: offsetPaginationValidation,
        search: z.string().optional(),
      }),
    },
    resolve: async (parent, args, context, info) => {
      const [data, count] = await db.$transaction([
        db.nutritionLabel.findMany({
          ...queryFromInfo({ context, info, path: ["items"] }),
          where: args.search
            ? { name: { contains: args.search, mode: "insensitive" } }
            : {},
          take: args.pagination.take,
          skip: args.pagination.offset,
          orderBy: { name: "asc" },
        }),
        db.import.count(),
      ]);

      const { itemsRemaining, nextOffset } = nextPageInfo(
        data.length,
        args.pagination.take,
        args.pagination.offset,
        count
      );
      return { items: data, nextOffset, itemsRemaining };
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
    validate: {
      schema: z.object({
        recipeId: z.string().cuid(),
        nutritionLabel: createNutritionLabelValidation,
      }),
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
    validate: {
      schema: z.object({ label: editNutritionLabelValidation }),
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
    validate: { schema: z.object({ id: z.string().cuid() }) },
    resolve: async (query, root, args) => {
      await db.nutritionLabel.delete({ where: { id: args.id } });
      return db.nutritionLabel.findMany({ ...query });
    },
  }),
}));

export { AggregateLabel, AggregateNutrient, nutritionLabel };
