import { builder } from "@/presentation/builder.js";
import { db } from "@/infrastructure/repository/db.js";

import {
  CreatePriceHistoryInput,
  EditPriceHistoryInput,
  getIngredientPrice,
  getIngredientPrices,
  IngredientPriceFilter,
} from "@/application/services/ingredient/IngredientPriceService.js";
import { FoodType } from "@prisma/client";

// ============================================ Types ===================================

const foodTypeEnum = builder.enumType(FoodType, { name: "FoodType" });

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
    receiptLine: t.relation("receiptLine"),
    price: t.exposeFloat("price"),
  }),
});

// ============================================ Inputs ==================================
const createPriceHistory = builder
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

const editPriceHistory = builder
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

const ingredientPriceFilter = builder
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
      filter: t.arg({ type: ingredientPriceFilter }),
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
      price: t.arg({ type: createPriceHistory, required: true }),
    },
    resolve: async (query, root, args) => {},
  }),
  editPriceHistory: t.prismaField({
    type: "IngredientPrice",
    args: {
      priceId: t.arg.string({ required: true }),
      price: t.arg({ type: editPriceHistory, required: true }),
    },
    resolve: async (query, root, args) => {
      return await db.ingredientPrice.update({
        where: {
          id: args.priceId,
        },
        data: {
          ingredient: args.price.ingredientId
            ? { connect: { id: args.price.ingredientId } }
            : undefined,
          receiptLine: args.price.recieptLineId
            ? { connect: { id: args.price.recieptLineId } }
            : undefined,
          date: args.price.date ? args.price.date : undefined,
          foodType: args.price.foodType,
          groceryStore: args.price.groceryStore
            ? {
                connectOrCreate: {
                  where: { name: args.price.groceryStore },
                  create: { name: args.price.groceryStore },
                },
              }
            : undefined,
          price: args.price.price ? args.price.price : undefined,
          size: args.price.quantity ? args.price.quantity : undefined,
          unit: args.price.unitId
            ? { connect: { id: args.price.unitId } }
            : undefined,
          pricePerUnit: args.price.pricePerUnit
            ? args.price.pricePerUnit
            : undefined,
        },
        ...query,
      });
    },
  }),
  deletePriceHistory: t.prismaField({
    type: ["IngredientPrice"],
    args: {
      ingredientId: t.arg.string({ required: true }),
      ingredientPriceId: t.arg.string({ required: true }),
    },
    resolve: async (query, root, args) => {
      await db.ingredientPrice.deleteMany({
        where: {
          id: args.ingredientPriceId,
        },
      });
      return await db.ingredientPrice.findMany({
        where: { ingredientId: args.ingredientId },
        ...query,
      });
    },
  }),
}));
