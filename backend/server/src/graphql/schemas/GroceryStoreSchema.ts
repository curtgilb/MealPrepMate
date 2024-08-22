import { z } from "zod";
import { db } from "../../db.js";
import { builder } from "../builder.js";

// ============================================ Types ===================================
const store = builder.prismaObject("GroceryStore", {
  fields: (t) => ({
    id: t.exposeString("id"),
    name: t.exposeString("name"),
  }),
});

// ============================================ Inputs ==================================
// builder.inputType("", {});

// ============================================ Queries =================================
builder.queryFields((t) => ({
  stores: t.prismaField({
    type: ["GroceryStore"],
    args: {
      search: t.arg.string(),
    },
    validate: {
      schema: z.object({
        search: z.string().optional(),
      }),
    },
    resolve: async (query, root, args) => {
      return await db.groceryStore.findMany({
        where: {
          name: { contains: args.search ?? undefined, mode: "insensitive" },
        },
        orderBy: { name: "asc" },
      });
    },
  }),
}));

// ============================================ Mutations ===============================
builder.mutationFields((t) => ({
  createGroceryStore: t.prismaField({
    type: "GroceryStore",
    args: {
      name: t.arg.string({ required: true }),
    },
    resolve: async (query, root, args) => {
      return await db.groceryStore.create({ data: { name: args.name } });
    },
  }),
}));
