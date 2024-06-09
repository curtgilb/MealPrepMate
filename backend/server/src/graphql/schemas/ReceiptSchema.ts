import { z } from "zod";
import { db } from "../../db.js";
import { uploadReceipt } from "../../services/ingredient/receipt/ReceiptScan.js";
import { builder } from "../builder.js";
import { FoodType } from "@prisma/client";
import { foodTypeEnum } from "./EnumSchema.js";

builder.prismaObject("Receipt", {
  name: "Receipt",
  fields: (t) => ({
    id: t.exposeString("id"),
    total: t.exposeFloat("total", { nullable: true }),
    merchantName: t.exposeString("merchantName", { nullable: true }),
    date: t.expose("transactionDate", { type: "DateTime", nullable: true }),
    imagePath: t.exposeString("path"),
    items: t.relation("lineItems", { nullable: true }),
    scanned: t.exposeBoolean("scanned"),
  }),
});

builder.prismaObject("ReceiptLine", {
  name: "ReceiptLine",
  fields: (t) => ({
    id: t.exposeString("id"),
    totalPrice: t.exposeFloat("totalPrice", { nullable: true }),
    description: t.exposeString("description", { nullable: true }),
    quantity: t.exposeFloat("quantity", { nullable: true }),
    perUnitPrice: t.exposeFloat("perUnitPrice", { nullable: true }),
    unitQuantity: t.exposeString("unitQuantity", { nullable: true }),
    matchingUnit: t.relation("matchingUnit", { nullable: true }),
    matchingIngredient: t.relation("matchingIngredient", { nullable: true }),
    foodType: t.field({
      type: foodTypeEnum,
      nullable: true,
      resolve: (parent) => parent.foodType,
    }),
  }),
});

const updateReceiptLine = builder.inputType("UpdateReceiptItem", {
  fields: (t) => ({
    totalPrice: t.float(),
    description: t.string(),
    quantity: t.float(),
    perUnitPrice: t.float(),
    productCode: t.string(),
    unitQuantity: t.string(),
    unitId: t.string(),
    ingredientId: t.string(),
    foodType: t.field({ type: foodTypeEnum }),
  }),
});

const updateReceipt = builder.inputType("UpdateReceipt", {
  fields: (t) => ({
    store: t.string(),
    date: t.field({ type: "DateTime" }),
  }),
});

// ============================================ Queries =================================
builder.queryFields((t) => ({
  receipt: t.prismaField({
    args: {
      id: t.arg.string({ required: true }),
    },
    validate: {
      schema: z.object({ id: z.string().cuid() }),
    },
    type: "Receipt",
    resolve: async (query, root, args) => {
      return await db.receipt.findUniqueOrThrow({
        where: { id: args.id },
        ...query,
      });
    },
  }),
}));

// ============================================ Mutations =================================
builder.mutationFields((t) => ({
  uploadReceipt: t.prismaField({
    type: "Receipt",
    args: {
      file: t.arg({
        type: "File",
        required: true,
      }),
    },
    resolve: async (query, root, args) => {
      return await uploadReceipt(args.file, query);
    },
  }),
  updateReceipt: t.prismaField({
    type: "Receipt",
    args: {
      receiptId: t.arg.string({ required: true }),
      receipt: t.arg({ type: updateReceipt, required: true }),
    },
    resolve: async (query, root, args) => {
      return await db.receipt.update({
        where: { id: args.receiptId },
        data: {
          merchantName: args.receipt.store,
          transactionDate: args.receipt.date,
        },
        ...query,
      });
    },
  }),
  finalizeReceipt: t.prismaField({
    type: "Receipt",
    args: {
      receiptId: t.arg.string({ required: true }),
    },
    resolve: async (query, root, args) => {
      const receipt = await db.receipt.findUniqueOrThrow({
        where: { id: args.receiptId },
        include: { lineItems: true },
      });

      if (!(receipt.transactionDate && receipt.storeId))
        throw new Error("Date and store must be completed before finalizing");

      for (const item of receipt.lineItems) {
        if (
          item.ingredientId &&
          item.perUnitPrice &&
          item.quantity &&
          item.totalPrice &&
          item.unitId
        ) {
          const size = z.coerce.number().parse(item.unitQuantity);
          await db.ingredientPrice.create({
            data: {
              date: receipt.transactionDate,
              groceryStoreId: receipt.storeId,
              price: item.perUnitPrice,
              size: size,
              unitId: item.unitId,
              pricePerUnit: item.perUnitPrice / size,
              ingredientId: item.ingredientId,
              foodType: item.foodType,
              receiptLineId: item.id,
            },
          });
        }
      }

      return await db.receipt.update({
        where: { id: args.receiptId },
        data: {
          verified: true,
        },
        ...query,
      });
    },
  }),
  updateReceiptLine: t.prismaField({
    type: "ReceiptLine",
    args: {
      lineId: t.arg.string({ required: true }),
      line: t.arg({ type: updateReceiptLine, required: true }),
    },
    resolve: async (query, root, args) => {
      return await db.receiptLine.update({
        where: { id: args.lineId },
        data: {
          totalPrice: args.line.totalPrice,
          description: args.line.description,
          quantity: args.line.quantity,
          perUnitPrice: args.line.perUnitPrice,
          unitQuantity: args.line.unitQuantity,
          matchingUnit: args.line.unitId
            ? { connect: { id: args.line.unitId } }
            : undefined,
          matchingIngredient: args.line.ingredientId
            ? { connect: { id: args.line.ingredientId } }
            : undefined,
        },
        ...query,
      });
    },
  }),
}));
