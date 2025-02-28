/*
  Warnings:

  - A unique constraint covering the columns `[nutrientId,specialCondition,gender,ageMin,ageMax]` on the table `DailyReferenceIntake` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "ReceiptLine" ADD COLUMN     "ignore" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "verifed" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "RecipeIngredient" ADD COLUMN     "mealPrepIngredient" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "unique_fields" ON "DailyReferenceIntake"("nutrientId", "specialCondition", "gender", "ageMin", "ageMax");
