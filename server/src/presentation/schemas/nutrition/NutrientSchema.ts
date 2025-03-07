import { z } from "zod";

import { getDriValues } from "@/application/services/nutrition/NutrientService.js";
import { db } from "@/infrastructure/repository/db.js";
import { builder } from "@/presentation/builder.js";
import { encodeGlobalID } from "@pothos/plugin-relay";

// ============================================ Types ===================================
const nutrient = builder.prismaNode("Nutrient", {
  id: { field: "id" },
  include: {
    ranking: true,
  },
  fields: (t) => ({
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
    parentNutrientId: t.globalID({
      nullable: true,
      resolve: (nutrient) => {
        if (!nutrient.parentNutrientId) return null;
        return encodeGlobalID("Nutrient", nutrient.parentNutrientId);
      },
    }),
    unit: t.relation("unit"),
  }),
});

export const dri = builder.prismaNode("DailyReferenceIntake", {
  id: { field: "id" },
  name: "DailyReferenceIntake",
  fields: (t) => ({
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
      favorites: t.arg.boolean(),
    },
    resolve: async (query, root, args) => {
      const nutrients = await db.nutrient.findMany({
        where: {
          name: args.search
            ? { contains: args.search ?? undefined, mode: "insensitive" }
            : undefined,
          advancedView: args.advanced ? undefined : false,
          important: args.favorites ? true : undefined,
        },
        orderBy: { order: "asc" },
        ...query,
      });

      return nutrients;
    },
  }),
}));

// ============================================ Mutations ===============================
