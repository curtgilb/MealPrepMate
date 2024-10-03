// import { builder } from "../builder.js";

import { TargetPreference } from "@prisma/client";
import { builder } from "../builder.js";
import { db } from "../../db.js";
import { editNutrientTargetValidation } from "../../validations/NutritionValidation.js";
import { z } from "zod";

// // ============================================ Types ===================================
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

const nutrientTargetEnum = builder.enumType(TargetPreference, {
  name: "TargetPreference",
});

// // ============================================ Inputs ==================================
// builder.inputType("", {});

const nutrientTargetInput = builder.inputType("NutrientTargetInput", {
  fields: (t) => ({
    nutrientId: t.string({ required: true }),
    target: t.float({ required: true }),
    threshold: t.float(),
    preference: t.field({ type: nutrientTargetEnum, required: true }),
  }),
});

// // ============================================ Queries =================================
// builder.queryFields((t) => ({}));

// // ============================================ Mutations ===============================
// builder.mutationFields((t) => ({}));

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
