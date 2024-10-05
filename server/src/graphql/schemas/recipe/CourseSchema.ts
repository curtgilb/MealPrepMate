import { Prisma } from "@prisma/client";
import { z } from "zod";
import { db } from "@/infrastructure/repository/db.js";
import { toTitleCase } from "@/util/utils.js";
import { cleanedStringSchema } from "@/validations/utilValidations.js";
import { builder } from "@/graphql/builder.js";

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
      //@ts-ignore
      return await db.category.findMany({ orderBy: { name: "asc" }, ...query });
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
}));
