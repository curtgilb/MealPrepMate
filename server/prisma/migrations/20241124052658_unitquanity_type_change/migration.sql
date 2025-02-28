/*
  Warnings:

  - The `unitQuantity` column on the `ReceiptLine` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "ReceiptLine" DROP COLUMN "unitQuantity",
ADD COLUMN     "unitQuantity" DOUBLE PRECISION;
