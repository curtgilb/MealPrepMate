import { Nutrient } from "@prisma/client";
import { builder } from "../builder.js";
import { nextPageInfo, offsetPagination } from "./UtilitySchema.js";
import { offsetPaginationValidation } from "../../validations/UtilityValidation.js";
import { db } from "../../db.js";
import { z } from "zod";
import { queryFromInfo } from "@pothos/plugin-prisma";

// // ============================================ Types ===================================
const nutrient = builder.prismaObject("Nutrient", {
  fields: (t) => ({
    name: t.exposeString("name"),
    alternateNames: t.exposeStringList("alternateNames"),
    type: t.exposeString("type"),
    advancedView: t.exposeBoolean("advancedView"),
    customTarget: t.exposeFloat("customTarget", { nullable: true }),
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
// builder.inputType("", {});

// // ============================================ Queries =================================
builder.queryFields((t) => ({
  nutrients: t.field({
    type: nutrientsQuery,
    args: {
      search: t.arg.string(),
      pagination: t.arg({
        type: offsetPagination,
        required: true,
      }),
    },
    validate: {
      schema: z.object({
        search: z.string().optional(),
        pagination: offsetPaginationValidation,
      }),
    },
    resolve: async (parent, args, context, info) => {
      const [data, count] = await db.$transaction([
        db.nutrient.findMany({
          ...queryFromInfo({ context, info, path: ["items"] }),
          take: args.pagination.take,
          skip: args.pagination.offset,
          orderBy: { name: "asc" },
        }),
        db.nutrient.count(),
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
      nutrientId: t.arg.string({ required: true }),
      target: t.arg.float({ required: true }),
    },
    resolve: async (query, root, args) => {
      return await db.nutrient.update({
        where: { id: args.nutrientId },
        data: { customTarget: args.target },
        ...query,
      });
    },
  }),
}));
