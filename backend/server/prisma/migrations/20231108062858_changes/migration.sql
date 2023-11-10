-- DropForeignKey
ALTER TABLE "ImportRecord" DROP CONSTRAINT "ImportRecord_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "RecipeIngredient" DROP CONSTRAINT "RecipeIngredient_measurementUnitId_fkey";

-- AlterTable
ALTER TABLE "ImportRecord" ALTER COLUMN "recipeId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "RecipeIngredient" ALTER COLUMN "measurementUnitId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ImportRecord" ADD CONSTRAINT "ImportRecord_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeIngredient" ADD CONSTRAINT "RecipeIngredient_measurementUnitId_fkey" FOREIGN KEY ("measurementUnitId") REFERENCES "MeasurementUnit"("id") ON DELETE SET NULL ON UPDATE CASCADE;
