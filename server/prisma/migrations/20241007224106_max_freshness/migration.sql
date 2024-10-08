/*
  Warnings:

  - You are about to drop the column `maxQty` on the `RecipeIngredient` table. All the data in the column will be lost.
  - You are about to drop the column `minQty` on the `RecipeIngredient` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "maxFreshness" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "RecipeIngredient" DROP COLUMN "maxQty",
DROP COLUMN "minQty";
