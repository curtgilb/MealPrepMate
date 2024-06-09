/*
  Warnings:

  - You are about to drop the column `name` on the `NutritionLabel` table. All the data in the column will be lost.
  - You are about to drop the column `verifed` on the `NutritionLabel` table. All the data in the column will be lost.
  - You are about to drop the column `verifed` on the `Receipt` table. All the data in the column will be lost.
  - You are about to drop the column `isVerified` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the `ImportRecord` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updated` to the `NutritionLabel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "RecordStatus" ADD VALUE 'FAILED';

-- DropForeignKey
ALTER TABLE "ImportRecord" DROP CONSTRAINT "ImportRecord_importId_fkey";

-- DropForeignKey
ALTER TABLE "ImportRecord" DROP CONSTRAINT "ImportRecord_ingredientGroupId_fkey";

-- DropForeignKey
ALTER TABLE "ImportRecord" DROP CONSTRAINT "ImportRecord_nutritionLabelId_fkey";

-- DropForeignKey
ALTER TABLE "ImportRecord" DROP CONSTRAINT "ImportRecord_recipeId_fkey";

-- AlterTable
ALTER TABLE "NutritionLabel" DROP COLUMN "name",
DROP COLUMN "verifed",
ADD COLUMN     "updated" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Receipt" DROP COLUMN "verifed",
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN "isVerified",
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "ImportRecord";

-- CreateTable
CREATE TABLE "ImportItem" (
    "id" TEXT NOT NULL,
    "importId" TEXT NOT NULL,
    "hash" TEXT,
    "externalId" TEXT,
    "name" TEXT NOT NULL,
    "parsedFormat" JSONB NOT NULL,
    "status" "RecordStatus" NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "recipeId" TEXT,
    "nutritionLabelId" TEXT,
    "ingredientGroupId" TEXT,
    "draftId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ImportItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImportDraft" (
    "id" TEXT NOT NULL,
    "draftId" TEXT NOT NULL,
    "type" "EntityType" NOT NULL,

    CONSTRAINT "ImportDraft_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AggregateLabel" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "servings" DOUBLE PRECISION,
    "servingSize" DOUBLE PRECISION,
    "unitId" TEXT,
    "protein" DOUBLE PRECISION,
    "carbs" DOUBLE PRECISION,
    "fat" DOUBLE PRECISION,
    "alcohol" DOUBLE PRECISION,
    "totalCalories" DOUBLE PRECISION,
    "caloriesPerServing" DOUBLE PRECISION,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AggregateLabel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AggLabelNutrient" (
    "aggLabelId" TEXT NOT NULL,
    "nutrientId" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "valuePerServing" DOUBLE PRECISION,

    CONSTRAINT "AggLabelNutrient_pkey" PRIMARY KEY ("aggLabelId","nutrientId")
);

-- CreateIndex
CREATE UNIQUE INDEX "AggregateLabel_recipeId_key" ON "AggregateLabel"("recipeId");

-- AddForeignKey
ALTER TABLE "ImportItem" ADD CONSTRAINT "ImportItem_importId_fkey" FOREIGN KEY ("importId") REFERENCES "Import"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImportItem" ADD CONSTRAINT "ImportItem_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImportItem" ADD CONSTRAINT "ImportItem_nutritionLabelId_fkey" FOREIGN KEY ("nutritionLabelId") REFERENCES "NutritionLabel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImportItem" ADD CONSTRAINT "ImportItem_ingredientGroupId_fkey" FOREIGN KEY ("ingredientGroupId") REFERENCES "RecipeIngredientGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AggregateLabel" ADD CONSTRAINT "AggregateLabel_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AggregateLabel" ADD CONSTRAINT "AggregateLabel_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "MeasurementUnit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AggLabelNutrient" ADD CONSTRAINT "AggLabelNutrient_aggLabelId_fkey" FOREIGN KEY ("aggLabelId") REFERENCES "AggregateLabel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AggLabelNutrient" ADD CONSTRAINT "AggLabelNutrient_nutrientId_fkey" FOREIGN KEY ("nutrientId") REFERENCES "Nutrient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
