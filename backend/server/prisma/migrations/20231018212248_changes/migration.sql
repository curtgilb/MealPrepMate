/*
  Warnings:

  - You are about to drop the column `ingredientsTxt` on the `Recipe` table. All the data in the column will be lost.
  - Added the required column `order` to the `RecipeIngredient` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN "ingredientsTxt";

-- AlterTable
ALTER TABLE "RecipeIngredient" ADD COLUMN     "order" INTEGER NOT NULL;
