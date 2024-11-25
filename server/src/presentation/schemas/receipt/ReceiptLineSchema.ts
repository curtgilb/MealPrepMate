import {
  BoundingBox,
  PolygonCoordinate,
} from "@/application/types/CustomTypes.js";
import { db } from "@/infrastructure/repository/db.js";
import { builder } from "@/presentation/builder.js";
import { foodTypeEnum } from "@/presentation/schemas/ingredient/IngredientPriceSchema.js";

// ============================================ Types ===================================

const polygonCoordinate = builder
  .objectRef<PolygonCoordinate>("PolygonCoordinate")
  .implement({
    description: "x, y coordinates",
    fields: (t) => ({
      x: t.exposeFloat("x"),
      y: t.exposeFloat("y"),
    }),
  });

const boundingBox = builder.objectRef<BoundingBox>("BoundingBox").implement({
  fields: (t) => ({
    coordinates: t.field({
      type: [polygonCoordinate],
      resolve: (parent) => parent,
    }),
  }),
});

builder.prismaNode("ReceiptLine", {
  id: { field: "id" },
  name: "ReceiptLine",
  fields: (t) => ({
    totalPrice: t.exposeFloat("totalPrice", { nullable: true }),
    description: t.exposeString("description", { nullable: true }),
    quantity: t.exposeFloat("quantity", { nullable: true }),
    perUnitPrice: t.exposeFloat("perUnitPrice", { nullable: true }),
    unitQuantity: t.exposeFloat("unitQuantity", { nullable: true }),
    matchingUnit: t.relation("matchingUnit", { nullable: true }),
    matchingIngredient: t.relation("matchingIngredient", { nullable: true }),
    verified: t.exposeBoolean("verifed"),
    ignore: t.exposeBoolean("ignore"),
    boundingBoxes: t.field({
      type: [boundingBox],
      nullable: true,
      resolve: (parent) => parent.boundingBoxes,
    }),
    order: t.exposeInt("order"),
    foodType: t.field({
      type: foodTypeEnum,
      nullable: true,
      resolve: (parent) => parent.foodType,
    }),
  }),
  include: {
    boundingBoxes: true,
  },
});

// ============================================ Inputs ==================================
const receiptLineInput = builder.inputType("ReceiptItemInput", {
  fields: (t) => ({
    totalPrice: t.float(),
    description: t.string(),
    quantity: t.float(),
    perUnitPrice: t.float(),
    productCode: t.string(),
    unitQuantity: t.float(),
    unitId: t.field({ type: "RefID" }),
    ingredientId: t.field({ type: "RefID" }),
    foodType: t.field({ type: foodTypeEnum }),
    ignore: t.boolean(),
  }),
});

// ============================================ Queries =================================
// builder.queryFields((t) => ({}));

// ============================================ Mutations ===============================
builder.mutationFields((t) => ({
  createReceiptItem: t.prismaField({
    type: "ReceiptLine",
    args: {
      receiptId: t.arg.globalID({ required: true }),
      line: t.arg({ type: receiptLineInput, required: true }),
    },
    resolve: async (query, root, args) => {
      // @ts-ignore
      return await db.receiptLine.create({
        data: {
          order: 0,
          receipt: { connect: { id: args.receiptId.id } },
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
  updateReceiptLine: t.prismaField({
    type: "ReceiptLine",
    args: {
      lineId: t.arg.globalID({ required: true }),
      line: t.arg({ type: receiptLineInput, required: true }),
    },
    resolve: async (query, root, args) => {
      return await db.receiptLine.update({
        where: { id: args.lineId.id },
        data: {
          totalPrice: args.line.totalPrice,
          description: args.line.description,
          quantity: args.line.quantity,
          perUnitPrice: args.line.perUnitPrice,
          unitQuantity: args.line.unitQuantity,
          verifed: true,
          ignore: args.line.ignore ?? false,
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
      receiptId: t.arg.string({ required: true }),
      lineId: t.arg.string({ required: true }),
    },
    resolve: async (root, args) => {
      await db.receiptLine.delete({ where: { id: args.lineId } });
      return true;
    },
  }),
}));
