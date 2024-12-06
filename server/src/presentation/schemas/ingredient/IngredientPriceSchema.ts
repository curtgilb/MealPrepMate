import {
  createPriceHistory,
  CreatePriceHistoryInput,
  deletePriceHistory,
  editPriceHistory,
  EditPriceHistoryInput,
  getIngredientPrice,
  getIngredientPrices,
  IngredientPriceFilter,
} from "@/application/services/ingredient/IngredientPriceService.js";
import { builder } from "@/presentation/builder.js";
import { DeleteResult } from "@/presentation/schemas/common/MutationResult.js";
import { encodeGlobalID } from "@pothos/plugin-relay";
import { FoodType } from "@prisma/client";

// ============================================ Types ===================================

export const foodTypeEnum = builder.enumType(FoodType, { name: "FoodType" });

builder.prismaNode("IngredientPrice", {
  id: { field: "id" },
  name: "IngredientPriceHistory",
  fields: (t) => ({
    date: t.expose("date", { type: "DateTime", nullable: true }),
    groceryStore: t.relation("groceryStore"),
    quantity: t.exposeFloat("size"),
    foodType: t.field({
      type: foodTypeEnum,
      nullable: true,
      resolve: (parent) => parent.foodType,
    }),
    pricePerUnit: t.exposeFloat("pricePerUnit"),
    ingredient: t.relation("ingredient"),
    unit: t.relation("unit"),
    receiptLine: t.relation("receiptLine", { nullable: true }),
    price: t.exposeFloat("price"),
  }),
});

// ============================================ Inputs ==================================
const createPriceHistoryInput = builder
  .inputRef<CreatePriceHistoryInput>("CreatePriceHistoryInput")
  .implement({
    fields: (t) => ({
      ingredientId: t.string({ required: true }),
      date: t.field({ type: "DateTime", required: true }),
      groceryStoreId: t.string({ required: true }),
      price: t.float({ required: true }),
      quantity: t.float({ required: true }),
      unitId: t.string({ required: true }),
      pricePerUnit: t.float({ required: true }),
      foodType: t.field({ type: foodTypeEnum, required: true }),
      recieptLineId: t.string(),
    }),
  });

const editPriceHistoryInput = builder
  .inputRef<EditPriceHistoryInput>("EditPriceHistoryInput")
  .implement({
    fields: (t) => ({
      ingredientId: t.string(),
      date: t.field({ type: "DateTime" }),
      groceryStore: t.string(),
      price: t.float(),
      quantity: t.float(),
      unitId: t.string(),
      pricePerUnit: t.float(),
      foodType: t.field({ type: foodTypeEnum }),
      recieptLineId: t.string(),
    }),
  });

const ingredientPriceFilterInput = builder
  .inputRef<IngredientPriceFilter>("IngredientPriceFilter")
  .implement({
    fields: (t) => ({
      beginDate: t.string(),
      endDate: t.string(),
      groceryStoreId: t.string(),
      unitId: t.string(),
      foodType: t.field({ type: foodTypeEnum }),
    }),
  });

// ============================================ Queries =================================
builder.queryFields((t) => ({
  ingredientPrice: t.prismaField({
    type: "IngredientPrice",
    args: {
      ingredientPriceId: t.arg.globalID({ required: true }),
    },
    resolve: async (query, root, args) => {
      return getIngredientPrice(args.ingredientPriceId.id, query);
    },
  }),
  ingredientPrices: t.prismaConnection({
    type: "IngredientPrice",
    cursor: "id",
    args: {
      ingredientId: t.arg.globalID({ required: true }),
      filter: t.arg({ type: ingredientPriceFilterInput }),
    },
    resolve: async (query, root, args) => {
      return getIngredientPrices(args.ingredientId.id, args.filter, query);
    },
  }),
}));
// ============================================ Mutations ===============================
builder.mutationFields((t) => ({
  addPriceHistory: t.prismaField({
    type: "IngredientPrice",
    args: {
      price: t.arg({ type: createPriceHistoryInput, required: true }),
    },
    resolve: async (query, root, args) => {
      return await createPriceHistory(args.price, query);
    },
  }),
  editPriceHistory: t.prismaField({
    type: "IngredientPrice",
    args: {
      priceId: t.arg.globalID({ required: true }),
      price: t.arg({ type: editPriceHistoryInput, required: true }),
    },
    resolve: async (query, root, args) => {
      return await editPriceHistory(args.priceId.id, args.price, query);
    },
  }),
  deletePriceHistory: t.field({
    type: DeleteResult,
    args: {
      ingredientPriceId: t.arg.globalID({ required: true }),
    },
    resolve: async (root, args) => {
      await deletePriceHistory(args.ingredientPriceId.id);
      return {
        success: true,
        id: encodeGlobalID(
          args.ingredientPriceId.typename,
          args.ingredientPriceId.id
        ),
      };
    },
  }),
}));
