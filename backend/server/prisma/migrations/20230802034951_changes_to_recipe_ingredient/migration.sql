/*
  Warnings:

  - Added the required column `order` to the `RecipeIngredient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sentence` to the `RecipeIngredient` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RecipeIngredient" ADD COLUMN     "order" INTEGER NOT NULL,
ADD COLUMN     "sentence" TEXT NOT NULL;
