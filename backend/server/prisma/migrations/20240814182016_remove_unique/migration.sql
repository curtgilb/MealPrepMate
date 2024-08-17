/*
  Warnings:

  - You are about to drop the `MeasurementConversion` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MeasurementConversion" DROP CONSTRAINT "MeasurementConversion_fromUnitId_fkey";

-- DropForeignKey
ALTER TABLE "MeasurementConversion" DROP CONSTRAINT "MeasurementConversion_ingredientId_fkey";

-- DropForeignKey
ALTER TABLE "MeasurementConversion" DROP CONSTRAINT "MeasurementConversion_toUnitId_fkey";

-- DropIndex
DROP INDEX "RecipeIngredientGroup_recipeId_name_key";

-- DropTable
DROP TABLE "MeasurementConversion";
