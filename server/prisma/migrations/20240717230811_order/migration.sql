/*
  Warnings:

  - You are about to drop the column `created` on the `ReceiptLine` table. All the data in the column will be lost.
  - Added the required column `order` to the `ReceiptLine` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ReceiptLine" DROP COLUMN "created",
ADD COLUMN     "order" INTEGER NOT NULL;
