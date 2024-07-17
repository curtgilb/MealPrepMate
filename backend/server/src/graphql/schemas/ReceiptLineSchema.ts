import { db } from "../../db.js";
import { builder } from "../builder.js";
import { foodTypeEnum } from "./EnumSchema.js";

// ============================================ Types ===================================
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

// ============================================ Inputs ==================================
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

// ============================================ Queries =================================
// builder.queryFields((t) => ({}));

// ============================================ Mutaations ===============================
builder.mutationFields((t) => ({
  createReceiptItem: t.prismaField({
    type: "ReceiptLine",
    args: {
      receiptId: t.arg.string({ required: true }),
      line: t.arg({ type: updateReceiptLine, required: true }),
    },
    resolve: async (query, root, args) => {
      return await db.receiptLine.create({
        data: {
          receipt: { connect: { id: args.receiptId } },
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
  deleteReceiptItem: t.field({
    type: "Boolean",
    args: {
      lineId: t.arg.string({ required: true }),
    },
    resolve: async (root, args) => {
      await db.receiptLine.delete({ where: { id: args.lineId } });
      return true;
    },
  }),
}));
