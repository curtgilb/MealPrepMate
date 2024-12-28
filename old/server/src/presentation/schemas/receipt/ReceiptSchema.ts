import {
  editReceipt,
  EditReceiptInput,
  finalizeReceipt,
  getReceipt,
  getReceipts,
  uploadReceipt,
} from "@/application/services/receipt/ReceiptService.js";
import { builder } from "@/presentation/builder.js";

builder.prismaNode("Receipt", {
  id: { field: "id" },
  name: "Receipt",
  fields: (t) => ({
    dateUploaded: t.expose("dateUploaded", { type: "DateTime" }),
    total: t.exposeFloat("total", { nullable: true }),
    merchantName: t.exposeString("merchantName", { nullable: true }),
    matchingStore: t.relation("matchingStore", { nullable: true }),
    date: t.expose("transactionDate", { type: "DateTime", nullable: true }),
    imagePath: t.exposeString("path"),
    items: t.relation("lineItems", { nullable: true }),
    scanned: t.exposeBoolean("scanned"),
    verified: t.exposeBoolean("verified"),
  }),
});

const updateReceipt = builder
  .inputRef<EditReceiptInput>("UpdateReceipt")
  .implement({
    fields: (t) => ({
      groceryStoreId: t.string({ required: true }),
      date: t.field({ type: "DateTime", required: true }),
    }),
  });

// ============================================ Queries =================================
builder.queryFields((t) => ({
  receipt: t.prismaField({
    args: {
      id: t.arg.globalID({ required: true }),
    },
    type: "Receipt",
    resolve: async (query, root, args) => {
      return await getReceipt(args.id.id, query);
    },
  }),
  receipts: t.prismaConnection({
    type: "Receipt",
    cursor: "id",
    edgesNullable: false,
    nodeNullable: false,
    resolve: async (query, root, args) => {
      return await getReceipts(query);
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
  editReceipt: t.prismaField({
    type: "Receipt",
    args: {
      receiptId: t.arg.id({ required: true }),
      receipt: t.arg({ type: updateReceipt, required: true }),
    },
    resolve: async (query, root, args) => {
      return editReceipt(args.receiptId, args.receipt, query);
    },
  }),
  finalizeReceipt: t.prismaField({
    type: "Receipt",
    args: {
      receiptId: t.arg.id({ required: true }),
    },
    resolve: async (query, root, args) => {
      return finalizeReceipt(args.receiptId, query);
    },
  }),
}));
