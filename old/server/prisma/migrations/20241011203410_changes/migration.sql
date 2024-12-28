/*
  Warnings:

  - You are about to drop the column `endDay` on the `MealPlan` table. All the data in the column will be lost.
  - You are about to drop the column `numOfWeeks` on the `MealPlan` table. All the data in the column will be lost.
  - You are about to drop the column `startDay` on the `MealPlan` table. All the data in the column will be lost.
  - You are about to drop the column `ingredientsTxt` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the column `isFavorite` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the column `maxFreshness` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the column `totalTime` on the `Recipe` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MealPlan" DROP COLUMN "endDay",
DROP COLUMN "numOfWeeks",
DROP COLUMN "startDay";

-- AlterTable
ALTER TABLE "NutritionLabel" ADD COLUMN     "name" TEXT;

-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN "ingredientsTxt",
DROP COLUMN "isFavorite",
DROP COLUMN "maxFreshness",
DROP COLUMN "totalTime";
