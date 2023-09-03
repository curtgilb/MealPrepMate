/*
  Warnings:

  - You are about to drop the column `servingsTxt` on the `NutritionLabel` table. All the data in the column will be lost.
  - You are about to drop the column `servings` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the column `servingsText` on the `Recipe` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Nutrient` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[recipeId]` on the table `NutritionLabel` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "NutritionLabel" DROP COLUMN "servingsTxt",
ADD COLUMN     "servingSize" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN "servings",
DROP COLUMN "servingsText";

-- CreateIndex
CREATE UNIQUE INDEX "Nutrient_name_key" ON "Nutrient"("name");

-- CreateIndex
CREATE UNIQUE INDEX "NutritionLabel_recipeId_key" ON "NutritionLabel"("recipeId");
