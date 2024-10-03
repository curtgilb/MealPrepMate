/*
  Warnings:

  - You are about to drop the column `quantityUnit` on the `ReceiptLine` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ReceiptLine" DROP COLUMN "quantityUnit",
ADD COLUMN     "unitQuantity" DOUBLE PRECISION;
