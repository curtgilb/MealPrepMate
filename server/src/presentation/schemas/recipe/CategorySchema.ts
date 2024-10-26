import { builder } from "@/presentation/builder.js";
import { DeleteResult } from "@/presentation/schemas/common/MutationResult.js";
import { db } from "@/infrastructure/repository/db.js";

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
      categoryId: t.arg.string({ required: true }),
    },
    resolve: async (root, args) => {
      try {
        await db.category.delete({ where: { id: args.categoryId } });
        return { success: true };
      } catch (e) {
        return { success: false, message: e.message };
      }
    },
  }),
}));
