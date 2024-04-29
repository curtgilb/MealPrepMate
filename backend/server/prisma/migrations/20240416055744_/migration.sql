/*
  Warnings:

  - You are about to drop the column `merchantname` on the `Receipt` table. All the data in the column will be lost.
  - Added the required column `siteName` to the `BookmarkedRecipe` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "IngredientPrice" DROP CONSTRAINT "IngredientPrice_receiptLineId_fkey";

-- AlterTable
ALTER TABLE "BookmarkedRecipe" ADD COLUMN     "siteName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "IngredientPrice" ALTER COLUMN "receiptLineId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Receipt" DROP COLUMN "merchantname",
ADD COLUMN     "merchantName" TEXT;

-- AddForeignKey
ALTER TABLE "IngredientPrice" ADD CONSTRAINT "IngredientPrice_receiptLineId_fkey" FOREIGN KEY ("receiptLineId") REFERENCES "ReceiptLine"("id") ON DELETE SET NULL ON UPDATE CASCADE;
