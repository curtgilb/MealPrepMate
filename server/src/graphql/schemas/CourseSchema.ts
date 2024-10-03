import { Prisma } from "@prisma/client";
import { z } from "zod";
import { db } from "../../db.js";
import { toTitleCase } from "../../util/utils.js";
import { cleanedStringSchema } from "../../validations/utilValidations.js";
import { builder } from "../builder.js";

// ============================================ Types ===================================
builder.prismaObject("Course", {
  name: "Course",
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name"),
    recipes: t.relation("recipes"),
  }),
});

// ============================================ Inputs ==================================

// ============================================ Queries =================================
builder.queryFields((t) => ({
  courses: t.prismaField({
    type: ["Course"],
    args: {
      searchString: t.arg.string(),
    },
    validate: {
      schema: z.object({ searchString: z.string().optional() }),
    },
    resolve: async (query, root, args) => {
      const search: Prisma.CourseFindManyArgs = {
        ...query,
        orderBy: { name: "asc" },
      };
      if (args.searchString) {
        search.where = {
          name: {
            contains: args.searchString,
            mode: "insensitive",
          },
        };
      }
      return await db.course.findMany(search);
    },
  }),
}));
// ============================================ Mutations ===============================
builder.mutationFields((t) => ({
  createCourse: t.prismaField({
    type: ["Course"],
    args: {
      name: t.arg.string({ required: true }),
    },
    validate: {
      schema: z.object({ name: cleanedStringSchema(30, toTitleCase) }),
    },
    resolve: async (query, root, args) => {
      await db.category.create({ data: { name: args.name } });
      return await db.category.findMany({ ...query, orderBy: { name: "asc" } });
    },
  }),
  deleteCourse: t.prismaField({
    type: ["Course"],
    args: {
      courseId: t.arg.string({ required: true }),
    },
    validate: {
      schema: z.object({ courseId: z.string().cuid() }),
    },
    resolve: async (query, root, args) => {
      await db.course.delete({ where: { id: args.courseId } });
      return await db.course.findMany({ ...query, orderBy: { name: "asc" } });
    },
  }),
  addCourseToRecipe: t.prismaField({
    type: "Recipe",
    args: {
      recipeId: t.arg.string({ required: true }),
      course: t.arg.string({ required: true }),
    },
    validate: {
      schema: z.object({
        recipeId: z.string().cuid(),
        course: cleanedStringSchema(30, toTitleCase),
      }),
    },
    resolve: async (query, root, args) => {
      const courseName = toTitleCase(args.course);
      return await db.recipe.update({
        where: { id: args.recipeId },
        data: {
          course: {
            connectOrCreate: {
              where: {
                name: courseName,
              },
              create: {
                name: courseName,
              },
            },
          },
        },
        ...query,
      });
    },
  }),
  removeCourseFromRecipe: t.prismaField({
    type: "Recipe",
    args: {
      recipeId: t.arg.string({ required: true }),
      courseId: t.arg.string({ required: true }),
    },
    validate: {
      schema: z.object({
        recipeId: z.string().cuid(),
        courseId: z.string().cuid(),
      }),
    },
    resolve: async (query, root, args) => {
      return await db.recipe.update({
        where: { id: args.recipeId },
        data: {
          course: {
            disconnect: [{ id: args.courseId }],
          },
        },
        ...query,
      });
    },
  }),
}));
