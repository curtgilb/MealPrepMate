/*
  Warnings:

  - You are about to drop the column `unit` on the `IngredientPrice` table. All the data in the column will be lost.
  - You are about to drop the column `customValue` on the `Nutrient` table. All the data in the column will be lost.
  - You are about to drop the column `unit` on the `Nutrient` table. All the data in the column will be lost.
  - You are about to drop the column `unitAbbreviation` on the `Nutrient` table. All the data in the column will be lost.
  - The `customTarget` column on the `Nutrient` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `percentage` on the `NutritionLabel` table. All the data in the column will be lost.
  - You are about to drop the column `source` on the `NutritionLabel` table. All the data in the column will be lost.
  - You are about to drop the column `display` on the `RecipeIngredient` table. All the data in the column will be lost.
  - You are about to drop the column `isIngredient` on the `RecipeIngredient` table. All the data in the column will be lost.
  - You are about to drop the column `unit` on the `RecipeIngredient` table. All the data in the column will be lost.
  - You are about to drop the `RecipePhotos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_LinkedRecipes` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `unitId` to the `IngredientPrice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `advancedView` to the `Nutrient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitId` to the `Nutrient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `measurementUnitId` to the `RecipeIngredient` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "IngredientAlternateName" DROP CONSTRAINT "IngredientAlternateName_ingredientId_fkey";

-- DropForeignKey
ALTER TABLE "NutritionLabel" DROP CONSTRAINT "NutritionLabel_ingredientGroupId_fkey";

-- DropForeignKey
ALTER TABLE "NutritionLabel" DROP CONSTRAINT "NutritionLabel_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "NutritionLabelNutrient" DROP CONSTRAINT "NutritionLabelNutrient_nutritionLabelId_fkey";

-- DropForeignKey
ALTER TABLE "RecipeIngredient" DROP CONSTRAINT "RecipeIngredient_groupId_fkey";

-- DropForeignKey
ALTER TABLE "RecipePhotos" DROP CONSTRAINT "RecipePhotos_photoId_fkey";

-- DropForeignKey
ALTER TABLE "RecipePhotos" DROP CONSTRAINT "RecipePhotos_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "_LinkedRecipes" DROP CONSTRAINT "_LinkedRecipes_A_fkey";

-- DropForeignKey
ALTER TABLE "_LinkedRecipes" DROP CONSTRAINT "_LinkedRecipes_B_fkey";

-- AlterTable
ALTER TABLE "Ingredient" ADD COLUMN     "variant" TEXT;

-- AlterTable
ALTER TABLE "IngredientPrice" DROP COLUMN "unit",
ADD COLUMN     "unitId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Nutrient" DROP COLUMN "customValue",
DROP COLUMN "unit",
DROP COLUMN "unitAbbreviation",
ADD COLUMN     "advancedView" BOOLEAN NOT NULL,
ADD COLUMN     "expandedView" BOOLEAN,
ADD COLUMN     "unitId" TEXT NOT NULL,
DROP COLUMN "customTarget",
ADD COLUMN     "customTarget" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "NutritionLabel" DROP COLUMN "percentage",
DROP COLUMN "source",
ADD COLUMN     "servingsUsed" DOUBLE PRECISION,
ADD COLUMN     "unitId" TEXT,
ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "ingredientGroupId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "NutritionLabelNutrient" ADD COLUMN     "totalValue" DOUBLE PRECISION,
ADD COLUMN     "valuePerServing" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Photo" ADD COLUMN     "isPrimary" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "recipeId" TEXT;

-- AlterTable
ALTER TABLE "RecipeIngredient" DROP COLUMN "display",
DROP COLUMN "isIngredient",
DROP COLUMN "unit",
ADD COLUMN     "measurementUnitId" TEXT NOT NULL,
ALTER COLUMN "groupId" DROP NOT NULL;

-- DropTable
DROP TABLE "RecipePhotos";

-- DropTable
DROP TABLE "_LinkedRecipes";

-- DropEnum
DROP TYPE "NutritionSource";

-- CreateTable
CREATE TABLE "MeasurementUnit" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "abbreviations" TEXT[],
    "symbol" TEXT NOT NULL,

    CONSTRAINT "MeasurementUnit_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RecipeIngredient" ADD CONSTRAINT "RecipeIngredient_measurementUnitId_fkey" FOREIGN KEY ("measurementUnitId") REFERENCES "MeasurementUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeIngredient" ADD CONSTRAINT "RecipeIngredient_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "RecipeIngredientGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IngredientAlternateName" ADD CONSTRAINT "IngredientAlternateName_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IngredientPrice" ADD CONSTRAINT "IngredientPrice_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "MeasurementUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NutritionLabel" ADD CONSTRAINT "NutritionLabel_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NutritionLabel" ADD CONSTRAINT "NutritionLabel_ingredientGroupId_fkey" FOREIGN KEY ("ingredientGroupId") REFERENCES "RecipeIngredientGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NutritionLabel" ADD CONSTRAINT "NutritionLabel_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "MeasurementUnit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NutritionLabelNutrient" ADD CONSTRAINT "NutritionLabelNutrient_nutritionLabelId_fkey" FOREIGN KEY ("nutritionLabelId") REFERENCES "NutritionLabel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nutrient" ADD CONSTRAINT "Nutrient_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "MeasurementUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
