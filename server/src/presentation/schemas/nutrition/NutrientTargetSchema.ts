// import { builder } from "../builder.js";

import {
  NutrientTargetInput,
  setNutrientTarget,
} from "@/application/services/nutrition/NutrientService.js";
import { builder } from "@/presentation/builder.js";
import { TargetPreference } from "@prisma/client";

// ============================================ Types ===================================
builder.prismaNode("NutrientTarget", {
  id: { field: "id" },
  fields: (t) => ({
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
      nutrientId: t.arg.globalID({ required: true }),
      target: t.arg({ type: nutrientTargetInput, required: true }),
    },
    resolve: async (query, root, args) => {
      return setNutrientTarget(args.nutrientId.id, args.target, query);
    },
  }),
}));
