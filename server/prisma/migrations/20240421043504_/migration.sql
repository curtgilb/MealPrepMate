/*
  Warnings:

  - You are about to drop the column `quantity` on the `IngredientPrice` table. All the data in the column will be lost.
  - Added the required column `size` to the `IngredientPrice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "IngredientPrice" DROP COLUMN "quantity",
ADD COLUMN     "size" DOUBLE PRECISION NOT NULL;
