// import { builder } from "../builder.js";

import {
  getNutritionTargets,
  NutrientGoal,
  NutrientTargetInput,
  NutritionTargets,
  setNutrientTarget,
} from "@/application/services/nutrition/NutrientTargetService.js";
import { builder } from "@/presentation/builder.js";
import { dri } from "@/presentation/schemas/nutrition/NutrientSchema.js";
import { encodeGlobalID } from "@pothos/plugin-relay";
import { TargetPreference } from "@prisma/client";

// ============================================ Types ===================================
const nutrientTarget = builder.prismaNode("NutrientTarget", {
  id: { field: "id" },
  fields: (t) => ({
    nutrientTarget: t.exposeFloat("targetValue"),
    threshold: t.exposeFloat("threshold", { nullable: true }),
    nutrientId: t.field({
      type: "RefID",
      resolve: (parent) => parent.nutrientId,
    }),
    preference: t.field({
      type: nutrientTargetEnum,
      resolve: (parent) => parent.preference,
    }),
  }),
});

const nutrientGoal = builder.objectRef<NutrientGoal>("NutrientGoal").implement({
  fields: (t) => ({
    nutrientId: t.globalID({
      resolve: (parent) => encodeGlobalID("Nutrient", parent.nutrientId),
    }),
    dri: t.field({
      type: dri,
      nullable: true,
      resolve: (parent) => parent.dri,
    }),
    target: t.field({
      type: nutrientTarget,
      nullable: true,
      resolve: (parent) => parent.target,
    }),
  }),
});

const nutrientTargetEnum = builder.enumType(TargetPreference, {
  name: "TargetPreference",
});

const targets = builder
  .objectRef<NutritionTargets>("NutritionTargets")
  .implement({
    fields: (t) => ({
      calories: t.field({
        type: nutrientGoal,
        nullable: true,
        resolve: (parent) => parent.calories,
      }),
      fat: t.field({
        type: nutrientGoal,
        nullable: true,
        resolve: (parent) => parent.fat,
      }),
      carbs: t.field({
        type: nutrientGoal,
        nullable: true,
        resolve: (parent) => parent.carbs,
      }),
      protein: t.field({
        type: nutrientGoal,
        nullable: true,
        resolve: (parent) => parent.protein,
      }),
      alcohol: t.field({
        type: nutrientGoal,
        nullable: true,
        resolve: (parent) => parent.alcohol,
      }),
      nutrients: t.field({
        type: [nutrientGoal],
        resolve: (parent) => parent.nutrients,
      }),
    }),
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
builder.queryFields((t) => ({
  nutritionTargets: t.field({
    type: targets,
    resolve: async (root) => await getNutritionTargets(),
  }),
}));
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
