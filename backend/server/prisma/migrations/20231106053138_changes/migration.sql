/*
  Warnings:

  - You are about to drop the column `expandedView` on the `Nutrient` table. All the data in the column will be lost.
  - You are about to drop the column `totalValue` on the `NutritionLabelNutrient` table. All the data in the column will be lost.
  - You are about to drop the `IngredientAlternateName` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `MeasurementUnit` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "UnitType" AS ENUM ('VOLUME', 'WEIGHT', 'COUNT', 'ENERGY');

-- DropForeignKey
ALTER TABLE "IngredientAlternateName" DROP CONSTRAINT "IngredientAlternateName_ingredientId_fkey";

-- AlterTable
ALTER TABLE "Ingredient" ADD COLUMN     "alternateNames" TEXT[];

-- AlterTable
ALTER TABLE "MeasurementUnit" ADD COLUMN     "type" "UnitType",
ALTER COLUMN "symbol" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Nutrient" DROP COLUMN "expandedView";

-- AlterTable
ALTER TABLE "NutritionLabelNutrient" DROP COLUMN "totalValue";

-- DropTable
DROP TABLE "IngredientAlternateName";

-- CreateIndex
CREATE UNIQUE INDEX "MeasurementUnit_name_key" ON "MeasurementUnit"("name");
