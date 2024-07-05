/*
  Warnings:

  - You are about to drop the column `cookDay` on the `MealPlanRecipe` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MealPlanRecipe" DROP COLUMN "cookDay",
ADD COLUMN     "cookDayOffset" INTEGER NOT NULL DEFAULT 0;
