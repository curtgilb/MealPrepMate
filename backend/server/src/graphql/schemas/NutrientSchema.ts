import { Nutrient, TargetPreference } from "@prisma/client";
import { builder } from "../builder.js";
import { nextPageInfo, offsetPagination } from "./UtilitySchema.js";
import { offsetPaginationValidation } from "../../validations/UtilityValidation.js";
import { db } from "../../db.js";
import { z } from "zod";
import { queryFromInfo } from "@pothos/plugin-prisma";
import { editNutrientTargetValidation } from "../../validations/NutritionValidation.js";

// // ============================================ Types ===================================
const nutrient = builder.prismaObject("Nutrient", {
  fields: (t) => ({
    id: t.exposeString("id"),
    name: t.exposeString("name"),
    alternateNames: t.exposeStringList("alternateNames"),
    type: t.exposeString("type"),
    important: t.exposeBoolean("important"),
    advancedView: t.exposeBoolean("advancedView"),
    target: t.relation("target", { nullable: true }),
    dri: t.prismaField({
      type: "DailyReferenceIntake",
      nullable: true,
      resolve: async (query, root) => {
        const profile = await db.healthProfile.findFirstOrThrow({});
        const age = new Date().getFullYear() - profile.yearBorn;
        return await db.dailyReferenceIntake.findFirst({
          where: {
            nutrientId: root.id,
            gender: profile.gender,
            ageMin: { lte: age },
            ageMax: { gte: age },
            specialCondition: profile.specialCondition,
          },
          ...query,
        });
      },
    }),
    parentNutrientId: t.exposeString("parentNutrientId", { nullable: true }),
    unit: t.relation("unit"),
  }),
});

const nutrientTargetEnum = builder.enumType(TargetPreference, {
  name: "TargetPreference",
});

const nutrientTarget = builder.prismaObject("NutrientTarget", {
  fields: (t) => ({
    id: t.exposeString("id"),
    nutrientTarget: t.exposeFloat("targetValue"),
    threshold: t.exposeFloat("threshold", { nullable: true }),
    preference: t.field({
      type: nutrientTargetEnum,
      resolve: (parent) => parent.preference,
    }),
  }),
});

builder.prismaObject("DailyReferenceIntake", {
  name: "DailyReferenceIntake",
  fields: (t) => ({
    id: t.exposeString("id"),
    value: t.exposeFloat("value"),
  }),
});

const nutrientsQuery = builder
  .objectRef<{
    nextOffset: number | null;
    itemsRemaining: number;
    items: Nutrient[];
  }>("NutrientsQuery")
  .implement({
    fields: (t) => ({
      nextOffset: t.exposeInt("nextOffset", { nullable: true }),
      itemsRemaining: t.exposeInt("itemsRemaining"),
      items: t.field({
        type: [nutrient],
        resolve: (result) => result.items,
      }),
    }),
  });

// // ============================================ Inputs ==================================
const nutrientTargetInput = builder.inputType("NutrientTargetInput", {
  fields: (t) => ({
    nutrientId: t.string({ required: true }),
    target: t.float({ required: true }),
    threshold: t.float(),
    preference: t.field({ type: nutrientTargetEnum, required: true }),
  }),
});

// // ============================================ Queries =================================
builder.queryFields((t) => ({
  nutrients: t.field({
    type: nutrientsQuery,
    args: {
      search: t.arg.string(),
      advanced: t.arg.boolean({ required: true }),
      pagination: t.arg({
        type: offsetPagination,
        required: true,
      }),
    },
    validate: {
      schema: z.object({
        advanced: z.boolean(),
        search: z.string().optional(),
        pagination: offsetPaginationValidation,
      }),
    },
    resolve: async (parent, args, context, info) => {
      const [data, count] = await db.$transaction([
        db.nutrient.findMany({
          ...queryFromInfo({ context, info, path: ["items"] }),
          where: { advancedView: args.advanced ? undefined : false },
          take: args.pagination.take,
          skip: args.pagination.offset,
          orderBy: { order: "asc" },
        }),
        db.nutrient.count({ where: { advancedView: args.advanced } }),
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

// // ============================================ Mutations ===============================
builder.mutationFields((t) => ({
  setNutritionTarget: t.prismaField({
    type: "Nutrient",
    args: {
      target: t.arg({ type: nutrientTargetInput, required: true }),
    },
    validate: {
      schema: z.object({
        target: editNutrientTargetValidation,
      }),
    },
    resolve: async (query, root, args) => {
      await db.nutrientTarget.upsert({
        where: { id: args.target.nutrientId },
        update: {
          targetValue: args.target.target,
          preference: args.target.preference,
          threshold: args.target.threshold,
        },
        create: {
          targetValue: args.target.target,
          preference: args.target.preference,
          threshold: args.target.threshold,
          nutrient: { connect: { id: args.target.nutrientId } },
        },
      });
      return await db.nutrient.findUniqueOrThrow({
        where: { id: args.target.nutrientId },
        ...query,
      });
    },
  }),
}));
