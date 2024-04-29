import { Queue, Worker } from "bullmq";

import {
  AzureKeyCredential,
  DocumentAnalysisClient,
} from "@azure/ai-form-recognizer";
import { Prisma } from "@prisma/client";
import { db } from "../../../db.js";
import { BoundingBox } from "../../../types/CustomTypes.js";
import { downloadFileFromBucket } from "../../io/FileStorage.js";
import {
  PrebuiltReceiptModel,
  ReceiptRetailMealFields,
} from "./PrebuiltReceipt.js";
import { IngredientSearch } from "../../search/IngredientSearch.js";
import { UnitSearch } from "../../search/UnitSearch.js";

const connection = {
  connection: {
    host: "localhost",
    port: 6379,
  },
};

async function searchIngredients(
  store: string | undefined,
  desc: string | undefined,
  productCode: string | undefined,
  matcher: IngredientSearch
) {
  if (!desc && !productCode) return undefined;
  const matchingIngredient = await db.receiptLine.findFirst({
    where: {
      OR: [{ description: desc }, { productCode: productCode }],
      receipt: { verifed: true, matchingStore: { name: store } },
    },
    include: { matchingIngredient: true },
  });
  if (matchingIngredient) {
    return matchingIngredient.id;
  }
  if (desc) {
    return matcher.search(desc)?.id;
  }
}

const ReceiptScanningQueue = new Queue("receipts", connection);

const worker = new Worker(
  "receipts",
  // eslint-disable-next-line @typescript-eslint/require-await
  async (job) => {
    console.log("Processing receipt job");
    const receipt = await db.receipt.findUniqueOrThrow({
      where: { id: job.name },
    });
    const receiptFile = await downloadFileFromBucket(receipt.path);

    const client = new DocumentAnalysisClient();

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
      const ingredientMatcher = new IngredientSearch();
      const unitMatcher = new UnitSearch();
      await ingredientMatcher.init();
      await unitMatcher.init();

      const itemsCreateStmt: Prisma.ReceiptLineCreateManyReceiptInput[] = [];
      if (items) {
        for (const receiptItem of items.values) {
          const itemBoundingBoxes = receiptItem.boundingRegions?.map(
            (region) => region.polygon
          );
          const matchingIngredientId = await searchIngredients(
            matchingStore?.name,
            receiptItem.properties.description?.value,
            receiptItem.properties.productCode?.value,
            ingredientMatcher
          );

          const matchingUnitId = receiptItem.properties.quantityUnit?.value
            ? unitMatcher.search(receiptItem.properties.quantityUnit?.value)?.id
            : undefined;

          itemsCreateStmt.push({
            totalPrice: receiptItem.properties.totalPrice?.value,
            description: receiptItem.properties.description?.value,
            quantity: receiptItem.properties.quantity?.value,
            perUnitPrice: receiptItem.properties.price?.value,
            productCode: receiptItem.properties.productCode?.value,
            unitQuantity: receiptItem.properties.quantityUnit?.value,
            ingredientId: matchingIngredientId,
            unitId: matchingUnitId,
            boundingBoxes: itemBoundingBoxes as BoundingBox[],
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
  connection
);

worker.on("failed", (job, err) => {
  console.log(err);
  // db.receipt
  //   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  //   .update({ where: { id: job.name }, data: { scanned: false } })
  //   .catch((err) => {
  //     console.log(err);
  //   });
});

export { ReceiptScanningQueue };
