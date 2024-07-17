import { GroceryStore, Prisma } from "@prisma/client";
import { db } from "../../db.js";
import { builder } from "../builder.js";
import { nextPageInfo, offsetPagination } from "./UtilitySchema.js";
import { offsetPaginationValidation } from "../../validations/UtilityValidation.js";
import { z } from "zod";
import { queryFromInfo } from "@pothos/plugin-prisma";

// ============================================ Types ===================================
const store = builder.prismaObject("GroceryStore", {
  fields: (t) => ({
    id: t.exposeString("id"),
    name: t.exposeString("name"),
  }),
});

// const storeSearch = builder
//   .objectRef<{
//     nextOffset: number | null;
//     itemsRemaining: number;
//     stores: GroceryStore[];
//   }>("StoreSearch")
//   .implement({
//     fields: (t) => ({
//       nextOffset: t.exposeInt("nextOffset", { nullable: true }),
//       itemsRemaining: t.exposeInt("itemsRemaining"),
//       stores: t.field({
//         type: [store],
//         resolve: (result) => result.stores,
//       }),
//     }),
//   });

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
