import { ReceiptScanningQueue } from "@/application/services/receipt/ReceiptScanJob.js";
import { toNumber } from "@/application/util/TypeCast.js";
import { hash } from "@/infrastructure/file_io/common.js";
import { uploadFile } from "@/infrastructure/object_storage/storage.js";
import { db } from "@/infrastructure/repository/db.js";
import { Prisma, Receipt, ReceiptLine } from "@prisma/client";

type ReceiptQuery = {
  include?: Prisma.ReceiptInclude | undefined;
  select?: Prisma.ReceiptSelect | undefined;
};

type EditReceiptInput = {
  groceryStoreId: string;
  date: Date;
};

const ACCEPTED_RECEIPT_EXT = ["jpg", "png", "bmp", "tif", "heic"];

async function uploadReceipt(receiptFile: File, query?: ReceiptQuery) {
  const fileArrayBuffer = Buffer.from(await receiptFile.arrayBuffer());
  const fileHash = hash(fileArrayBuffer);
  const existingDuplicate = await checkForExistingUpload(fileHash, query);

  if (existingDuplicate) {
    if (!existingDuplicate.scanned) {
      await ReceiptScanningQueue.add(existingDuplicate.id, {
        bucketPath: existingDuplicate.path,
      });
    }
    return existingDuplicate;
  }

  return await addScanJobToQueue(fileArrayBuffer, fileHash, query);
}

async function checkForExistingUpload(fileHash: string, query?: ReceiptQuery) {
  // @ts-ignore
  return await db.receipt.findFirst({
    where: { hash: fileHash },
    ...query,
  });
}

async function addScanJobToQueue(
  fileBuffer: Buffer,
  hash: string,
  query?: ReceiptQuery
) {
  const uploadedFile = await uploadFile(
    fileBuffer,
    ACCEPTED_RECEIPT_EXT,
    "receipts"
  );

  const newRecord = await db.receipt.create({
    data: {
      hash: hash,
      path: uploadedFile.bucketPath,
    },
    ...query,
  });

  await ReceiptScanningQueue.add(newRecord.id, { bucketPath: newRecord.path });
  return newRecord;
}

async function getReceipt(id: string, query?: ReceiptQuery) {
  // @ts-ignore
  return await db.receipt.findUniqueOrThrow({
    // @ts-ignore
    where: { id: id },
    ...query,
  });
}

async function getReceipts(query?: ReceiptQuery) {
  const result = await db.receipt.findMany({
    ...query,
  });
  return result;
}

async function editReceipt(
  id: string,
  receipt: EditReceiptInput,
  query?: ReceiptQuery
) {
  return await db.receipt.update({
    where: { id: id },
    data: {
      matchingStore: { connect: { id: receipt.groceryStoreId } },
      transactionDate: receipt.date,
    },
    ...query,
  });
}

async function finalizeReceipt(receiptId: string, query?: ReceiptQuery) {
  const receipt = await db.receipt.findUniqueOrThrow({
    where: { id: receiptId },
    include: { lineItems: true },
  });
  checkIfVerified(receipt);

  for (const item of receipt.lineItems) {
    const size = toNumber(item.unitQuantity);
    await db.ingredientPrice.create({
      data: {
        date: receipt.transactionDate as Date,
        groceryStoreId: receipt.storeId as string,
        price: item.perUnitPrice as number,
        size: size,
        unitId: item.unitId as string,
        pricePerUnit: (item.perUnitPrice as number) / size,
        ingredientId: item.ingredientId as string,
        foodType: item.foodType,
        receiptLineId: item.id,
      },
    });
  }

  return await db.receipt.update({
    // @ts-ignore
    where: { id: receiptId },
    data: {
      verified: true,
    },
    ...query,
  });
}

function checkIfVerified(receipt: Receipt & { lineItems: ReceiptLine[] }) {
  // Check for both grocery store and date
  // Check that all line items have been verified
  if (
    !receipt.storeId ||
    !receipt.transactionDate ||
    !receipt.lineItems.every((item) => item.verifed)
  ) {
    throw new Error(
      "Receipt and line items must be completed before finalizing"
    );
  }
}

export {
  editReceipt,
  EditReceiptInput,
  finalizeReceipt,
  getReceipt,
  uploadReceipt,
  getReceipts,
};
