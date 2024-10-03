-- CreateEnum
CREATE TYPE "EntityType" AS ENUM ('RECIPE', 'LABEL');

-- AlterTable
ALTER TABLE "NutritionLabel" ADD COLUMN     "type" "EntityType" NOT NULL DEFAULT 'LABEL';

-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "type" "EntityType" NOT NULL DEFAULT 'RECIPE';
