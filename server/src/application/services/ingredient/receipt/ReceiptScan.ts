import { Prisma } from "@prisma/client";
import { uploadFileToBucket } from "../../io/FileStorage.js";
import { hash } from "../../../util/utils.js";
import { db } from "../../../infrastructure/db.js";
import { ReceiptScanningQueue } from "./ReceiptScanJob.js";

type ReceiptQuery = {
  include?: Prisma.ReceiptInclude | undefined;
  select?: Prisma.ReceiptSelect | undefined;
};

const ACCEPTED_RECEIPT_EXT = ["jpg", "png", "bmp", "tif", "heic"];

async function uploadReceipt(receiptFile: File, query?: ReceiptQuery) {
  const fileArrayBuffer = Buffer.from(await receiptFile.arrayBuffer());
  const fileHash = hash(fileArrayBuffer);
  const existingDuplicate = await db.receipt.findFirst({
    where: { hash: fileHash },
    ...query,
  });
  if (existingDuplicate) {
    if (!existingDuplicate.scanned) {
      await ReceiptScanningQueue.add(existingDuplicate.id, {
        bucketPath: existingDuplicate.path,
      });
    }
    return existingDuplicate;
  }
  const uploadedFile = await uploadFileToBucket(
    fileArrayBuffer,
    ACCEPTED_RECEIPT_EXT,
    "receipts"
  );

  const newRecord = await db.receipt.create({
    data: {
      hash: fileHash,
      path: uploadedFile.bucketPath,
    },
    ...query,
  });

  await ReceiptScanningQueue.add(newRecord.id, { bucketPath: newRecord.path });
  return newRecord;
}

export { uploadReceipt };
