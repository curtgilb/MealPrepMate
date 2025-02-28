import { db } from "@/infrastructure/repository/db.js";
import { FoodType, Prisma } from "@prisma/client";

type CreateReceiptLineItemInput = {
  totalPrice: number;
  description: string | undefined;
  quantity: number;
  perUnitPrice: number;
  productCode: string;
  unitQuantity: string;
  unitId: string;
  ingredientId: string;
  foodType: FoodType;
};

type EditReceiptLineItemInput = {};

type ReceiptLineQuery = {
  include?: Prisma.ReceiptLineInclude | undefined;
  select?: Prisma.ReceiptLineSelect | undefined;
};

async function createReceiptLine(
  receiptId: string,
  receiptLine: CreateReceiptLineItemInput,
  query?: ReceiptLineQuery
) {
  return await db.receiptLine.create({
    data: {
      totalPrice: receiptLine.totalPrice,
      description: receiptLine.description,
      quantity: receiptLine.quantity,
      receipt: { connect: { id: receiptId } },
      matchingUnit: { connect: { id: receiptLine.ingredientId } },
      foodType: receiptLine.foodType,
      order: 0,
    },
  });
}
async function editReceiptLine(
  id: string,
  line: EditReceiptLineItemInput,
  query?: ReceiptLineQuery
) {}

export { createReceiptLine, editReceiptLine };
