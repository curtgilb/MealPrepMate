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

const storeSearch = builder
  .objectRef<{
    nextOffset: number | null;
    itemsRemaining: number;
    stores: GroceryStore[];
  }>("StoreSearch")
  .implement({
    fields: (t) => ({
      nextOffset: t.exposeInt("nextOffset", { nullable: true }),
      itemsRemaining: t.exposeInt("itemsRemaining"),
      stores: t.field({
        type: [store],
        resolve: (result) => result.stores,
      }),
    }),
  });

// ============================================ Inputs ==================================
// builder.inputType("", {});

// ============================================ Queries =================================
builder.queryFields((t) => ({
  stores: t.field({
    type: storeSearch,
    args: {
      search: t.arg.string(),
      pagination: t.arg({
        type: offsetPagination,
        required: true,
      }),
    },
    validate: {
      schema: z.object({
        search: z.string().optional(),
        pagination: offsetPaginationValidation,
      }),
    },
    resolve: async (root, args, context, info) => {
      const search: Prisma.GroceryStoreWhereInput = args.search
        ? { name: { contains: args.search, mode: "insensitive" } }
        : {};
      const query = queryFromInfo({ context, info, path: ["stores"] });
      const [data, count] = await db.$transaction([
        db.groceryStore.findMany({
          where: search,
          orderBy: { name: "asc" },
          take: args.pagination.take,
          skip: args.pagination.offset,
          ...query,
        }),
        db.groceryStore.count(),
      ]);

      const { itemsRemaining, nextOffset } = nextPageInfo(
        data.length,
        args.pagination.take,
        args.pagination.offset,
        count
      );
      return { stores: data, nextOffset, itemsRemaining };
    },
  }),
}));

// ============================================ Mutations ===============================
// builder.mutationFields((t) => ({}));
