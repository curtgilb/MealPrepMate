/*
  Warnings:

  - You are about to drop the column `stars` on the `Recipe` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "NutritionLabel" ADD COLUMN     "nutrientMapping" JSONB;

-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN "stars",
ADD COLUMN     "nutrientMapping" JSONB;
