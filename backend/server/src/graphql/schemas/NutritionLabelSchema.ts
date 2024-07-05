// import { NutritionLabel } from "@prisma/client";
import { z } from "zod";
import { db } from "../../db.js";
import {
  createNutritionLabelValidation,
  editNutritionLabelValidation,
} from "../../validations/NutritionValidation.js";
import { builder } from "../builder.js";

// ============================================ Types ===================================

const aggLabel = builder.prismaObject("AggregateLabel", {
  fields: (t) => ({
    id: t.exposeID("id"),
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

export const nutritionLabel = builder.prismaObject("NutritionLabel", {
  name: "NutritionLabel",
  fields: (t) => ({
    id: t.exposeID("id"),
    recipe: t.relation("recipe", { nullable: true }),
    ingredientGroup: t.relation("ingredientGroup"),
    servings: t.exposeFloat("servings", { nullable: true }),
    servingSize: t.exposeFloat("servingSize", { nullable: true }),
    servingSizeUnit: t.relation("servingSizeUnit", { nullable: true }),
    servingsUsed: t.exposeFloat("servingsUsed", { nullable: true }),
    isPrimary: t.exposeBoolean("isPrimary"),
  }),
});

builder.prismaObject("NutritionLabelNutrient", {
  fields: (t) => ({
    value: t.exposeFloat("value"),
    nutrient: t.relation("nutrient"),
  }),
});

// const nutritionLabelQuery = builder
//   .objectRef<{
//     nextOffset: number | null;
//     itemsRemaining: number;
//     items: NutritionLabel[];
//   }>("NutritionLabelQuery")
//   .implement({
//     fields: (t) => ({
//       nextOffset: t.exposeInt("nextOffset", { nullable: true }),
//       itemsRemaining: t.exposeInt("itemsRemaining"),
//       items: t.field({
//         type: [nutritionLabel],
//         resolve: (result) => result.items,
//       }),
//     }),
//   });

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
  // nutritionLabels: t.field({
  //   type: nutritionLabelQuery,
  //   args: {
  //     search: t.arg.string(),
  //     pagination: t.arg({
  //       type: offsetPagination,
  //       required: true,
  //     }),
  //   },
  //   validate: {
  //     schema: z.object({
  //       pagination: offsetPaginationValidation,
  //       search: z.string().optional(),
  //     }),
  //   },
  //   resolve: async (parent, args, context, info) => {
  //     const [data, count] = await db.$transaction([
  //       db.nutritionLabel.findMany({
  //         ...queryFromInfo({ context, info, path: ["items"] }),
  //         where: args.search
  //           ? { name: { contains: args.search, mode: "insensitive" } }
  //           : {},
  //         take: args.pagination.take,
  //         skip: args.pagination.offset,
  //         orderBy: { name: "asc" },
  //       }),
  //       db.import.count(),
  //     ]);

  //     const { itemsRemaining, nextOffset } = nextPageInfo(
  //       data.length,
  //       args.pagination.take,
  //       args.pagination.offset,
  //       count
  //     );
  //     return { items: data, nextOffset, itemsRemaining };
  //   },
  // }),
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
    validate: {
      schema: z.object({
        recipeId: z.string().cuid(),
        ingredientGroupId: z.string().cuid().optional(),
        nutritionLabel: createNutritionLabelValidation,
      }),
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

export { aggLabel as AggregateLabel };
