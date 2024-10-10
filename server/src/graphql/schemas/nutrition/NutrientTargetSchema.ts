// import { builder } from "../builder.js";

import { TargetPreference } from "@prisma/client";
import { builder } from "@/graphql/builder.js";
import { db } from "@/infrastructure/repository/db.js";
import { editNutrientTargetValidation } from "@/validations/NutritionValidation.js";
import { z } from "zod";
import {
  NutrientTargetInput,
  setNutrientTarget,
} from "@/application/services/nutrition/NutrientService.js";

// ============================================ Types ===================================
builder.prismaObject("NutrientTarget", {
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

// ============================================ Inputs ==================================

const nutrientTargetInput = builder
  .inputRef<NutrientTargetInput>("NutrientTargetInput")
  .implement({
    fields: (t) => ({
      nutrientId: t.string({ required: true }),
      value: t.float({ required: true }),
      threshold: t.float(),
      preference: t.field({ type: nutrientTargetEnum, required: true }),
    }),
  });

// ============================================ Queries =================================

// ============================================ Mutations ===============================

builder.mutationFields((t) => ({
  setNutritionTarget: t.prismaField({
    type: "Nutrient",
    args: {
      target: t.arg({ type: nutrientTargetInput, required: true }),
    },
    resolve: async (query, root, args) => {
      return setNutrientTarget(args.target, query);
    },
  }),
}));
