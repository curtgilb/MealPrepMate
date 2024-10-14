import {
  createMealPlan,
  CreateMealPlanInput,
  editMealPlan,
  EditMealPlanInput,
  getMealPlan,
  getMealPlans,
} from "@/application/services/mealplan/MealPlanService.js";
import { builder } from "@/graphql/builder.js";
import { db } from "@/infrastructure/repository/db.js";
import { z } from "zod";

// ============================================ Types ===================================
builder.prismaObject("MealPlan", {
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name", { nullable: true }),
    mealPrepInstructions: t.exposeString("mealPrepInstructions", {
      nullable: true,
    }),
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

const createMealPlanInput = builder
  .inputRef<CreateMealPlanInput>("CreateMealPlanInput")
  .implement({
    fields: (t) => ({
      name: t.string({ required: true }),
      mealPrepInstructions: t.string(),
      shoppingDays: t.intList(),
    }),
  });

const editMealPlanInput = builder
  .inputRef<EditMealPlanInput>("EditMealPlanInput")
  .implement({
    fields: (t) => ({
      name: t.string(),
      mealPrepInstructions: t.string(),
      shoppingDays: t.intList(),
    }),
  });

// ============================================ Queries =================================
builder.queryFields((t) => ({
  mealPlan: t.prismaField({
    type: "MealPlan",
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (query, root, args) => {
      return await getMealPlan(args.id, query);
    },
  }),
  mealPlans: t.prismaField({
    type: ["MealPlan"],
    resolve: async (query) => {
      return await getMealPlans(query);
    },
  }),
}));
// ============================================ Mutations ===============================
builder.mutationFields((t) => ({
  createMealPlan: t.prismaField({
    type: "MealPlan",
    args: {
      mealPlan: t.arg({ type: createMealPlanInput, required: true }),
    },
    resolve: async (query, root, args) => {
      return await createMealPlan(args.mealPlan, query);
    },
  }),
  editMealPlan: t.prismaField({
    type: "MealPlan",
    args: {
      id: t.arg.string({ required: true }),
      mealPlan: t.arg({
        type: editMealPlanInput,
        required: true,
      }),
    },
    resolve: async (query, root, args) => {
      return await editMealPlan(args.id, args.mealPlan, query);
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
}));
