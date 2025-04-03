import { Gender, SpecialCondition } from "@prisma/client";
import { builder } from "@/graphql/builder.js";
import { db } from "@/infrastructure/repository/db.js";
import { profileInputValidation } from "@/application/validations/UserValidation.js";
import { z } from "zod";

const specialCondition = builder.enumType(SpecialCondition, {
  name: "SpecialCondition",
});

// ============================================ Types ===================================
builder.prismaObject("HealthProfile", {
  fields: (t) => ({
    id: t.exposeString("id"),
    weight: t.exposeFloat("weight", { nullable: true }),
    gender: t.exposeString("gender"),
    bodyFatPercentage: t.exposeFloat("bodyFatPercentage", { nullable: true }),
    height: t.exposeFloat("height", { nullable: true }),
    specialCondition: t.field({
      type: specialCondition,
      resolve: (parent) => parent.specialCondition,
    }),
    age: t.field({
      type: "Int",
      resolve: (profile) => new Date().getFullYear() - profile.yearBorn,
    }),
    activityLevel: t.exposeFloat("activityLevel", { nullable: true }),
  }),
});
// ============================================ Inputs ==================================
const profileInput = builder.inputType("ProfileInput", {
  fields: (t) => ({
    weight: t.float({ required: false }),
    gender: t.field({ type: Gender, required: true }),
    bodyFatPercentage: t.float({ required: true }),
    height: t.float({ required: true }),
    birthYear: t.int({ required: true }),
    specialCondition: t.field({ type: SpecialCondition, required: true }),
    activityLevel: t.float({ required: true }),
  }),
});

// ============================================ Queries =================================

builder.queryFields((t) => ({
  healthProfile: t.prismaField({
    type: "HealthProfile",
    resolve: async (query) => {
      return await db.healthProfile.findFirstOrThrow({ ...query });
    },
  }),
}));

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
          specialCondition: args.profile.specialCondition,
          activityLevel: args.profile.activityLevel,
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
        },
        ...query,
      });
    },
  }),
}));
