import { z } from "zod";
import { db } from "@/infrastructure/repository/db.js";
import { uploadReceipt } from "@/application/services/ingredient/receipt/ReceiptScan.js";
import { builder } from "@/graphql/builder.js";

builder.prismaObject("Receipt", {
  name: "Receipt",
  fields: (t) => ({
    id: t.exposeString("id"),
    total: t.exposeFloat("total", { nullable: true }),
    merchantName: t.exposeString("merchantName", { nullable: true }),
    matchingStore: t.relation("matchingStore", { nullable: true }),
    date: t.expose("transactionDate", { type: "DateTime", nullable: true }),
    imagePath: t.exposeString("path"),
    items: t.relation("lineItems", { nullable: true }),
    scanned: t.exposeBoolean("scanned"),
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
      schema: z.object({ id: z.string() }),
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
}));
