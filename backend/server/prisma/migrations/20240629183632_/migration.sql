-- AlterTable
ALTER TABLE "MeasurementUnit" ADD COLUMN     "conversionName" TEXT;

-- AlterTable
ALTER TABLE "RecipeIngredient" ADD COLUMN     "maxQty" DOUBLE PRECISION,
ADD COLUMN     "minQty" DOUBLE PRECISION;
