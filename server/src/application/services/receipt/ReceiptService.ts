import { ReceiptScanningQueue } from "@/application/services/receipt/ReceiptScanJob.js";
import { hash } from "@/infrastructure/file_io/common.js";
import { uploadFile } from "@/infrastructure/object_storage/storage.js";
import { db } from "@/infrastructure/repository/db.js";
import { FoodType, Prisma } from "@prisma/client";

type ReceiptQuery = {
  include?: Prisma.ReceiptInclude | undefined;
  select?: Prisma.ReceiptSelect | undefined;
};

type EditReceiptInput = {
  groceryStoreId: string | undefined;
  date: Date | undefined;
  verified: boolean | undefined;
};

type CreateReceiptLineItemInput = {
  totalPrice: number;
  description: string;
  quantity: number;
  perUnitPrice: number;
  productCode: string;
  unitQuantity: string;
  unitId: string;
  ingredientId: string;
  foodType: FoodType;
};

type EditReceiptLineItemInput = {};

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

export { uploadReceipt };
