import { z } from "zod";
import { db } from "../../db.js";
import {
  createPriceHistoryValidation,
  editPriceHistoryValidation,
} from "../../validations/IngredientValidation.js";
import { builder } from "../builder.js";
import { foodTypeEnum } from "./EnumSchema.js";

// ============================================ Types ===================================

builder.prismaObject("IngredientPrice", {
  name: "IngredientPriceHistory",
  fields: (t) => ({
    id: t.exposeString("id"),
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
const createPriceHistory = builder.inputType("CreatePriceHistoryInput", {
  fields: (t) => ({
    ingredientId: t.string({ required: true }),
    date: t.field({ type: "DateTime", required: true }),
    groceryStore: t.string({ required: true }),
    price: t.float({ required: true }),
    quantity: t.float({ required: true }),
    unitId: t.string({ required: true }),
    pricePerUnit: t.float({ required: true }),
    foodType: t.field({ type: foodTypeEnum }),
    recieptLineId: t.string(),
  }),
});

const editPriceHistory = builder.inputType("EditPriceHistoryInput", {
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

// ============================================ Queries =================================
builder.queryFields((t) => ({
  ingredientPrice: t.prismaField({
    type: "IngredientPrice",
    args: {
      ingredientPriceId: t.arg.string({ required: true }),
    },
    validate: {
      schema: z.object({ ingredientPriceId: z.string().cuid() }),
    },
    resolve: async (query, root, args) => {
      return await db.ingredientPrice.findUniqueOrThrow({
        where: { id: args.ingredientPriceId },
        ...query,
      });
    },
  }),
  priceHistory: t.prismaField({
    type: ["IngredientPrice"],
    args: {
      ingredientId: t.arg.string({ required: true }),
    },
    validate: {
      schema: z.object({
        ingredientId: z.string().cuid(),
      }),
    },
    resolve: async (query, root, args) => {
      return await db.ingredientPrice.findMany({
        where: { ingredientId: args.ingredientId },
        orderBy: {
          date: "asc",
        },
        ...query,
      });
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
    validate: {
      schema: z.object({ price: createPriceHistoryValidation }),
    },
    resolve: async (query, root, args) => {
      return await db.ingredientPrice.create({
        data: {
          receiptLine: args.price.recieptLineId
            ? { connect: { id: args.price.recieptLineId } }
            : undefined,
          date: args.price.date,
          groceryStore: {
            connectOrCreate: {
              where: { name: args.price.groceryStore },
              create: { name: args.price.groceryStore },
            },
          },
          price: args.price.price,
          size: args.price.quantity,
          unit: {
            connect: {
              id: args.price.unitId,
            },
          },
          pricePerUnit: args.price.pricePerUnit,
          ingredient: {
            connect: {
              id: args.price.ingredientId,
            },
          },
        },
        ...query,
      });
    },
  }),
  editPriceHistory: t.prismaField({
    type: "IngredientPrice",
    args: {
      priceId: t.arg.string({ required: true }),
      price: t.arg({ type: editPriceHistory, required: true }),
    },
    validate: {
      schema: z.object({
        priceId: z.string().cuid(),
        price: editPriceHistoryValidation,
      }),
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
    validate: {
      schema: z.object({
        ingredientId: z.string().cuid(),
        ingredientPriceId: z.string().cuid(),
      }),
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
