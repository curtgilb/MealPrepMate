import { Queue, Worker } from "bullmq";

import { BoundingBox } from "@/application/types/CustomTypes.js";
import { toNumber } from "@/application/util/TypeCast.js";
import { downloadFile } from "@/infrastructure/object_storage/storage.js";
import { redis_connection } from "@/infrastructure/Redis.js";
import { db } from "@/infrastructure/repository/db.js";
import {
  AzureKeyCredential,
  DocumentAnalysisClient,
} from "@azure/ai-form-recognizer";
import { Prisma } from "@prisma/client";

import {
  PrebuiltReceiptModel,
  ReceiptRetailMealFields,
} from "./PrebuiltReceipt.js";

async function searchIngredients(
  storeId: string | undefined,
  desc: string | undefined,
  productCode: string | undefined
) {
  if (!desc && !productCode) return undefined;
  // Check previous receipts to see if there is a match that has been previously made
  const matchingIngredient = await db.receiptLine.findFirst({
    where: {
      OR: [{ description: desc }, { productCode: productCode }],
      receipt: { verified: true, storeId: storeId },
    },
    include: { matchingIngredient: true },
  });
  if (matchingIngredient) {
    return matchingIngredient.id;
  }
  if (desc) {
    return (await db.ingredient.match(desc))?.id;
  }
}

const ReceiptScanningQueue = new Queue("receipts", redis_connection);

const worker = new Worker(
  "receipts",
  // eslint-disable-next-line @typescript-eslint/require-await
  async (job) => {
    console.log("Processing receipt job");
    const receipt = await db.receipt.findUniqueOrThrow({
      where: { id: job.name },
    });
    const receiptFile = await downloadFile(receipt.path);

    if (!process.env.AZURE_ENDPOINT || !process.env.AZURE_KEY) {
      throw new Error("Missing azure credentials");
    }
    const client = new DocumentAnalysisClient(
      process.env.AZURE_ENDPOINT,
      new AzureKeyCredential(process.env.AZURE_KEY)
    );

    const poller = await client.beginAnalyzeDocument(
      PrebuiltReceiptModel,
      await receiptFile.arrayBuffer()
    );

    const result = await poller.pollUntilDone();
    if (result.documents && result.documents.length === 1) {
      const receipt = result.documents[0];
      const { merchantName, items, transactionDate } =
        receipt.fields as ReceiptRetailMealFields;

      const matchingStore = merchantName?.value
        ? await db.groceryStore.findFirst({
            where: {
              name: { contains: merchantName.value, mode: "insensitive" },
            },
          })
        : undefined;

      const itemsCreateStmt: Prisma.ReceiptLineCreateManyReceiptInput[] = [];
      if (items) {
        for (const [index, receiptItem] of items.values.entries()) {
          const itemBoundingBoxes = receiptItem.boundingRegions?.map(
            (region) => region.polygon
          );
          const matchingIngredientId = await searchIngredients(
            matchingStore?.id,
            receiptItem.properties.description?.value,
            receiptItem.properties.productCode?.value
          );

          const matchingUnitId = receiptItem.properties.quantityUnit?.value
            ? (
                await db.measurementUnit.match(
                  receiptItem.properties.quantityUnit?.value
                )
              )?.id
            : undefined;

          itemsCreateStmt.push({
            totalPrice: receiptItem.properties.totalPrice?.value,
            description: receiptItem.properties.description?.value,
            quantity: receiptItem.properties.quantity?.value,
            perUnitPrice: receiptItem.properties.price?.value,
            productCode: receiptItem.properties.productCode?.value,
            unitQuantity: toNumber(receiptItem.properties.quantityUnit?.value),
            ingredientId: matchingIngredientId,
            unitId: matchingUnitId,
            boundingBoxes: itemBoundingBoxes as BoundingBox[],
            order: index + 1,
          });
        }
      }
      await db.receipt.update({
        where: { id: job.name },
        data: {
          merchantName: merchantName?.value,
          transactionDate: transactionDate?.value,
          scanned: true,
          lineItems: { createMany: { data: itemsCreateStmt } },
        },
      });
    }
  },
  redis_connection
);

export { ReceiptScanningQueue };
