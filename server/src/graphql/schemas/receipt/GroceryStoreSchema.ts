import {
  createGroceryStore,
  deleteGroceryStore,
  getGroceryStores,
} from "@/application/services/receipt/GroceryStoreService.js";
import { builder } from "@/graphql/builder.js";
import { DeleteResult } from "@/graphql/schemas/common/MutationResult.js";

// ============================================ Types ===================================
builder.prismaNode("GroceryStore", {
  id: { field: "id" },
  fields: (t) => ({
    id: t.exposeString("id"),
    name: t.exposeString("name"),
  }),
});

// ============================================ Inputs ==================================
// builder.inputType("", {});

// ============================================ Queries =================================
builder.queryFields((t) => ({
  stores: t.prismaConnection({
    type: "GroceryStore",
    cursor: "id",
    args: {
      search: t.arg.string(),
    },
    resolve: async (query, root, args) => {
      return await getGroceryStores(args?.search ?? undefined, query);
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
      return createGroceryStore(args.name, query);
    },
  }),
  deleteGroceryStore: t.field({
    type: DeleteResult,
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (root, args) => {
      await deleteGroceryStore(args.id);
      return { success: true };
    },
  }),
}));
