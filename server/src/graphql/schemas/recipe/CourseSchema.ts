import { db } from "@/infrastructure/repository/db.js";
import { builder } from "@/graphql/builder.js";
import { DeleteResult } from "@/graphql/schemas/common/MutationResult.js";
import { encodeGlobalID } from "@pothos/plugin-relay";
import { Prisma } from "@prisma/client";

// ============================================ Types ===================================
builder.prismaNode("Course", {
  id: { field: "id" },
  name: "Course",
  fields: (t) => ({
    name: t.exposeString("name"),
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
    resolve: async (query, root, args) => {
      await db.category.create({ data: { name: args.name } });
      //@ts-ignore
      return await db.category.findMany({ orderBy: { name: "asc" }, ...query });
    },
  }),
  deleteCourse: t.field({
    type: DeleteResult,
    args: {
      courseId: t.arg.globalID({ required: true }),
    },
    resolve: async (root, args) => {
      const guid = encodeGlobalID(args.courseId.typename, args.courseId.id);

      await db.category.delete({ where: { id: args.courseId.id } });
      return { id: guid, success: true };
    },
  }),
}));
