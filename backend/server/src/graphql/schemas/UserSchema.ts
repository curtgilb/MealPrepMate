import { Gender } from "@prisma/client";
import { builder } from "../builder.js";
import { db } from "../../db.js";
// ============================================ Types ===================================
builder.prismaObject("HealthProfile", {
  name: "HealthProfile",
  fields: (t) => ({
    id: t.exposeString("id"),
    weight: t.exposeFloat("weight"),
    gender: t.exposeString("gender"),
    bodyFatPercentage: t.exposeFloat("bodyFatPercentage"),
    height: t.exposeFloat("height"),
    age: t.field({
      type: "Int",
      resolve: (profile) => new Date().getFullYear() - profile.yearBorn,
    }),
    activityLevel: t.exposeFloat("activityLevel"),
    targetProteinPecentage: t.exposeFloat("targetProteinPercentage", {
      nullable: true,
    }),
    targetProteinGrams: t.exposeFloat("targetProteinGrams", { nullable: true }),
    targetFatPercentage: t.exposeFloat("targetFatPercentage", {
      nullable: true,
    }),
    targetFatGrams: t.exposeFloat("targetFatGrams", { nullable: true }),
    targetCarbsPercentage: t.exposeFloat("targetCarbsPercentage", {
      nullable: true,
    }),
    targetCarbsGrams: t.exposeFloat("targetCarbsGrams", { nullable: true }),
  }),
});
// ============================================ Inputs ==================================
const profileInput = builder.inputType("ProfileInput", {
  fields: (t) => ({
    weight: t.float({ required: true }),
    gender: t.field({ type: Gender, required: true }),
    bodyFatPercentage: t.float({ required: true }),
    height: t.float({ required: true }),
    birthYear: t.int({ required: true }),
    activityLevel: t.float({ required: true }),
    targetProteinPecentage: t.float({ required: false }),
    targetProteinGrams: t.float({ required: false }),
    targetFatPercentage: t.float({ required: false }),
    targetFatGrams: t.float({ required: false }),
    targetCarbsPercentage: t.float({ required: false }),
    targetCarbsGrams: t.float({ required: false }),
  }),
});

// ============================================ Queries =================================

builder.queryField("profile", (t) =>
  t.prismaField({
    type: "HealthProfile",
    resolve: async (query) => {
      return await db.healthProfile.findFirstOrThrow({ ...query });
    },
  })
);

// ============================================ Mutations ===============================

builder.mutationFields((t) => ({
  createProfile: t.prismaField({
    type: "HealthProfile",
    args: {
      profile: t.arg({ type: profileInput, required: true }),
    },
    resolve: async (query, root, args) => {
      return await db.healthProfile.create({
        data: {
          weight: args.profile.weight,
          gender: args.profile.gender,
          bodyFatPercentage: args.profile.bodyFatPercentage,
          height: args.profile.height,
          yearBorn: args.profile.birthYear,
          activityLevel: args.profile.activityLevel,
          targetCarbsGrams: args.profile.targetCarbsGrams,
          targetCarbsPercentage: args.profile.targetCarbsPercentage,
          targetFatGrams: args.profile.targetFatGrams,
          targetFatPercentage: args.profile.targetFatPercentage,
          targetProteinGrams: args.profile.targetProteinGrams,
          targetProteinPercentage: args.profile.targetProteinGrams,
        },
        ...query,
      });
    },
  }),
  editProfile: t.prismaField({
    type: "HealthProfile",
    args: {
      id: t.arg.string({ required: true }),
      profile: t.arg({ type: profileInput, required: true }),
    },
    resolve: async (query, root, args) => {
      return await db.healthProfile.update({
        where: { id: args.id },
        data: {
          weight: args.profile.weight,
          gender: args.profile.gender,
          bodyFatPercentage: args.profile.bodyFatPercentage,
          height: args.profile.height,
          yearBorn: args.profile.birthYear,
          activityLevel: args.profile.activityLevel,
          targetCarbsGrams: args.profile.targetCarbsGrams,
          targetCarbsPercentage: args.profile.targetCarbsPercentage,
          targetFatGrams: args.profile.targetFatGrams,
          targetFatPercentage: args.profile.targetFatPercentage,
          targetProteinGrams: args.profile.targetProteinGrams,
          targetProteinPercentage: args.profile.targetProteinGrams,
        },
      });
    },
  }),
}));
