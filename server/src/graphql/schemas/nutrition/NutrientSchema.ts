import { z } from "zod";
import { db } from "@/infrastructure/repository/db.js";
import { builder } from "@/graphql/builder.js";
import { getDriValues } from "@/application/services/nutrition/NutrientService.js";

// ============================================ Types ===================================
const nutrient = builder.prismaObject("Nutrient", {
  include: {
    ranking: true,
  },
  fields: (t) => ({
    id: t.exposeString("id"),
    name: t.exposeString("name"),
    alternateNames: t.exposeStringList("alternateNames"),
    isMacro: t.exposeBoolean("isMacro"),
    type: t.exposeString("type"),
    important: t.exposeBoolean("important"),
    advancedView: t.exposeBoolean("advancedView"),
    target: t.relation("target", { nullable: true }),
    rank: t.int({ resolve: (parent) => parent.ranking?.rank, nullable: true }),
    dri: t.prismaField({
      type: "DailyReferenceIntake",
      nullable: true,
      resolve: async (query, root) => {
        return getDriValues(root.id, query);
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
    upperLimit: t.exposeFloat("upperLimit", { nullable: true }),
  }),
});

// ============================================ Inputs ==================================

// ============================================ Queries =================================
builder.queryFields((t) => ({
  nutrients: t.prismaField({
    type: ["Nutrient"],
    args: {
      search: t.arg.string(),
      advanced: t.arg.boolean({ required: true }),
    },
    validate: {
      schema: z.object({
        advanced: z.boolean(),
        search: z.string().optional(),
      }),
    },
    resolve: async (query, root, args) => {
      return await db.nutrient.findMany({
        where: {
          name: { contains: args.search ?? undefined, mode: "insensitive" },
          advancedView: args.advanced ? undefined : false,
        },
        orderBy: { order: "asc" },
        ...query,
      });
    },
  }),
}));

// ============================================ Mutations ===============================
