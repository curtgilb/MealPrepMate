/*
  Warnings:

  - You are about to drop the column `reviewed` on the `Receipt` table. All the data in the column will be lost.
  - You are about to drop the column `perEachPrice` on the `ReceiptLine` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Receipt" DROP COLUMN "reviewed";

-- AlterTable
ALTER TABLE "ReceiptLine" DROP COLUMN "perEachPrice",
ADD COLUMN     "perUnitPrice" DOUBLE PRECISION;
