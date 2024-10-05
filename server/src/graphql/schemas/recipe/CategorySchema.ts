import { z } from "zod";
import { db } from "@/infrastructure/repository/db.js";
import { toTitleCase } from "@/util/utils.js";
import { cleanedStringSchema } from "@/validations/utilValidations.js";
import { builder } from "@/graphql/builder.js";

// ============================================ Types ===================================
builder.prismaObject("Category", {
  name: "Category",
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name"),
    recipes: t.relation("recipes"),
  }),
});

// ============================================ Inputs ==================================

// ============================================ Queries =================================
builder.queryFields((t) => ({
  categories: t.prismaField({
    type: ["Category"],
    args: {
      searchString: t.arg.string(),
    },
    validate: {
      schema: z.object({ searchString: z.string().optional() }),
    },
    resolve: async (query, root, args) => {
      //@ts-ignore
      return await db.category.findMany({
        where: {
          name: args.searchString
            ? { contains: args.searchString, mode: "insensitive" }
            : undefined,
        },
        orderBy: {
          name: "asc",
        },
        ...query,
      });
    },
  }),
}));

// ============================================ Mutations ===============================
builder.mutationFields((t) => ({
  createCategory: t.prismaField({
    type: ["Category"],
    args: {
      name: t.arg.string({
        required: true,
      }),
    },
    validate: {
      schema: z.object({ name: cleanedStringSchema(30, toTitleCase) }),
    },
    resolve: async (query, root, args) => {
      await db.category.create({ data: { name: args.name } });
      // @ts-ignore
      return await db.category.findMany({ orderBy: { name: "asc" }, ...query });
    },
  }),
  deleteCategory: t.prismaField({
    type: ["Category"],
    args: {
      categoryId: t.arg.string({ required: true }),
    },
    validate: {
      schema: z.object({ categoryId: z.string().cuid() }),
    },
    resolve: async (query, root, args) => {
      await db.category.delete({ where: { id: args.categoryId } });
      return await db.category.findMany({ ...query, orderBy: { name: "asc" } });
    },
  }),
}));
