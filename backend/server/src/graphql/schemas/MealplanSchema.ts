import { z } from "zod";
import { db } from "../../db.js";
import { scheduleMealPlan } from "../../services/mealplan/MealPlanService.js";
import { toTitleCase } from "../../util/utils.js";
import { editMealPlanValidation } from "../../validations/MealPlanValidation.js";
import { cleanedStringSchema } from "../../validations/utilValidations.js";
import { builder } from "../builder.js";

// ============================================ Types ===================================
builder.prismaObject("MealPlan", {
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name", { nullable: true }),
    mealPrepInstructions: t.exposeString("mealPrepInstructions", {
      nullable: true,
    }),
    numOfWeeks: t.exposeInt("numOfWeeks"),
    startDay: t.exposeInt("startDay", { nullable: true }),
    endDay: t.exposeInt("endDay", { nullable: true }),
    planRecipes: t.relation("planRecipes"),
    mealPlanServings: t.relation("mealPlanServings"),
    shopppingDays: t.exposeIntList("shoppingDays"),
    schedules: t.relation("schedules"),
  }),
});

builder.prismaObject("ScheduledPlan", {
  fields: (t) => ({
    id: t.exposeString("id", { nullable: true }),
    startDate: t.field({
      type: "DateTime",
      resolve: (parent) => parent.startDate,
    }),
    duration: t.exposeInt("duration", { nullable: true }),
    mealPlan: t.relation("mealPlan"),
  }),
});

// ============================================ Inputs ==================================

const editMealPlanInput = builder.inputType("EditMealPlanInput", {
  fields: (t) => ({
    id: t.string({ required: true }),
    name: t.string(),
    mealPrepInstructions: t.string(),
  }),
});

// ============================================ Queries =================================
builder.queryFields((t) => ({
  mealPlan: t.prismaField({
    type: "MealPlan",
    args: {
      id: t.arg.string({ required: true }),
    },
    validate: {
      schema: z.object({ id: z.string().cuid() }),
    },
    resolve: async (query, root, args) => {
      const mealPlan = await db.mealPlan.findUniqueOrThrow({
        where: { id: args.id },
        ...query,
      });
      console.log(mealPlan);
      return mealPlan;
    },
  }),
  mealPlans: t.prismaField({
    type: ["MealPlan"],
    resolve: async (query) => {
      return await db.mealPlan.findMany({ ...query });
    },
  }),
}));
// ============================================ Mutations ===============================
builder.mutationFields((t) => ({
  createMealPlan: t.prismaField({
    type: "MealPlan",
    args: {
      name: t.arg.string({ required: true }),
    },
    validate: {
      schema: z.object({ name: cleanedStringSchema(20, toTitleCase) }),
    },
    resolve: async (query, root, args) => {
      return await db.mealPlan.create({ data: { name: args.name }, ...query });
    },
  }),
  editMealPlan: t.prismaField({
    type: "MealPlan",
    args: {
      mealPlan: t.arg({
        type: editMealPlanInput,
        required: true,
      }),
    },
    validate: {
      schema: z.object({ mealPlan: editMealPlanValidation }),
    },
    resolve: async (query, root, args) => {
      return await db.mealPlan.update({
        where: { id: args.mealPlan.id },
        data: {
          name: args.mealPlan.name ?? undefined,
          mealPrepInstructions: args.mealPlan.mealPrepInstructions,
        },
      });
    },
  }),
  deleteMealPlan: t.prismaField({
    type: ["MealPlan"],
    args: {
      id: t.arg.string({ required: true }),
    },
    validate: { schema: z.object({ id: z.string().cuid() }) },
    resolve: async (query, root, args) => {
      await db.mealPlan.delete({
        where: { id: args.id },
      });
      return await db.mealPlan.findMany({});
    },
  }),

  updateShoppingDays: t.field({
    type: ["Int"],
    args: {
      mealPlanId: t.arg.string({ required: true }),
      days: t.arg.intList({ required: true }),
    },
    validate: {
      schema: z.object({
        mealPlanId: z.string().cuid(),
        days: z.number().gte(1).array(),
      }),
    },
    resolve: async (root, args) => {
      const updatedMealPlan = await db.mealPlan.update({
        where: { id: args.mealPlanId },
        data: { shoppingDays: args.days },
      });
      return updatedMealPlan.shoppingDays;
    },
  }),
  scheduleMealPlan: t.prismaField({
    type: "ScheduledPlan",
    args: {
      mealPlanId: t.arg.string({ required: true }),
      startDate: t.arg({ type: "DateTime", required: true }),
    },
    validate: {
      schema: z.object({ mealPlanId: z.string().cuid(), startDate: z.date() }),
    },
    resolve: async (query, root, args) => {
      return await scheduleMealPlan(args.mealPlanId, args.startDate, query);
    },
  }),
}));
