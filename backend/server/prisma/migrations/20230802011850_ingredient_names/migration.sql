/*
  Warnings:

  - A unique constraint covering the columns `[primaryName]` on the table `Ingredient` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `primaryName` to the `Ingredient` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ingredient" ADD COLUMN     "primaryName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Ingredient_primaryName_key" ON "Ingredient"("primaryName");
