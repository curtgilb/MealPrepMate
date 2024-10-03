/*
  Warnings:

  - You are about to drop the column `retailer` on the `IngredientPrice` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[receiptLineId]` on the table `IngredientPrice` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `groceryStoreId` to the `IngredientPrice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receiptLineId` to the `IngredientPrice` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FoodType" AS ENUM ('FROZEN', 'CANNED', 'FRESH');

-- AlterTable
ALTER TABLE "IngredientPrice" DROP COLUMN "retailer",
ADD COLUMN     "foodType" "FoodType",
ADD COLUMN     "groceryStoreId" TEXT NOT NULL,
ADD COLUMN     "receiptLineId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "GroceryStore" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "GroceryStore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Receipt" (
    "id" TEXT NOT NULL,
    "merchantname" TEXT,
    "total" DOUBLE PRECISION,
    "transactionDate" TIMESTAMP(3),
    "hash" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "scanned" BOOLEAN NOT NULL DEFAULT false,
    "reviewed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Receipt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReceiptLine" (
    "id" TEXT NOT NULL,
    "totalPrice" DOUBLE PRECISION,
    "description" TEXT,
    "quantity" DOUBLE PRECISION,
    "perEachPrice" DOUBLE PRECISION,
    "productCode" TEXT,
    "quantityUnit" TEXT,
    "receiptId" TEXT NOT NULL,

    CONSTRAINT "ReceiptLine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookmarkedRecipe" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,

    CONSTRAINT "BookmarkedRecipe_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GroceryStore_name_key" ON "GroceryStore"("name");

-- CreateIndex
CREATE UNIQUE INDEX "BookmarkedRecipe_recipeId_key" ON "BookmarkedRecipe"("recipeId");

-- CreateIndex
CREATE UNIQUE INDEX "IngredientPrice_receiptLineId_key" ON "IngredientPrice"("receiptLineId");

-- AddForeignKey
ALTER TABLE "IngredientPrice" ADD CONSTRAINT "IngredientPrice_groceryStoreId_fkey" FOREIGN KEY ("groceryStoreId") REFERENCES "GroceryStore"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IngredientPrice" ADD CONSTRAINT "IngredientPrice_receiptLineId_fkey" FOREIGN KEY ("receiptLineId") REFERENCES "ReceiptLine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReceiptLine" ADD CONSTRAINT "ReceiptLine_receiptId_fkey" FOREIGN KEY ("receiptId") REFERENCES "Receipt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookmarkedRecipe" ADD CONSTRAINT "BookmarkedRecipe_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
