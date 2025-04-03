import { db } from "@/infrastructure/repository/db.js";
import { builder } from "@/graphql/builder.js";
import { DeleteResult } from "@/graphql/schemas/common/MutationResult.js";
import { encodeGlobalID } from "@pothos/plugin-relay";

// ============================================ Types ===================================
builder.prismaNode("Category", {
  id: { field: "id" },
  name: "Category",
  fields: (t) => ({
    name: t.exposeString("name"),
  }),
});

// ============================================ Inputs ==================================

// ============================================ Queries =================================
builder.queryFields((t) => ({
  categories: t.prismaField({
    type: ["Category"],
    args: {
      search: t.arg.string(),
    },
    resolve: async (query, root, args) => {
      //@ts-ignore
      return await db.category.findMany({
        where: {
          name: args.search
            ? { contains: args.search, mode: "insensitive" }
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
    resolve: async (query, root, args) => {
      await db.category.create({ data: { name: args.name } });
      // @ts-ignore
      return await db.category.findMany({ orderBy: { name: "asc" }, ...query });
    },
  }),
  deleteCategory: t.field({
    type: DeleteResult,
    args: {
      categoryId: t.arg.globalID({ required: true }),
    },
    resolve: async (root, args) => {
      const guid = encodeGlobalID(args.categoryId.typename, args.categoryId.id);

      await db.category.delete({ where: { id: args.categoryId.id } });
      return { id: guid, success: true };
    },
  }),
}));
