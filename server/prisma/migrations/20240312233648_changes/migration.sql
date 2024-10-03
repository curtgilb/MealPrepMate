/*
  Warnings:

  - You are about to drop the column `nutrientMapping` on the `nutrition_label` table. All the data in the column will be lost.
  - You are about to drop the column `cuisineId` on the `recipe` table. All the data in the column will be lost.
  - You are about to drop the column `nutrientMapping` on the `recipe` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `recipe` table. All the data in the column will be lost.
  - You are about to drop the column `comment` on the `recipe_ingredient` table. All the data in the column will be lost.
  - You are about to drop the column `other` on the `recipe_ingredient` table. All the data in the column will be lost.
  - You are about to drop the column `servings` on the `recipe_ingredient_group` table. All the data in the column will be lost.
  - You are about to drop the column `servingsInRecipe` on the `recipe_ingredient_group` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[recipeId,name]` on the table `recipe_ingredient_group` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `specialCondition` to the `health_profile` table without a default value. This is not possible if the table is not empty.
  - Made the column `recipeId` on table `nutrition_label` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `name` to the `recipe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipeId` to the `recipe_ingredient_group` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "recipe" DROP CONSTRAINT "recipe_cuisineId_fkey";

-- AlterTable
ALTER TABLE "health_profile" ADD COLUMN     "specialCondition" "SpecialCondition" NOT NULL,
ALTER COLUMN "weight" DROP NOT NULL,
ALTER COLUMN "bodyFatPercentage" DROP NOT NULL,
ALTER COLUMN "height" DROP NOT NULL,
ALTER COLUMN "activityLevel" DROP NOT NULL;

-- AlterTable
ALTER TABLE "nutrition_label" DROP COLUMN "nutrientMapping",
ALTER COLUMN "recipeId" SET NOT NULL;

-- AlterTable
ALTER TABLE "recipe" DROP COLUMN "cuisineId",
DROP COLUMN "nutrientMapping",
DROP COLUMN "title",
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "recipe_ingredient" DROP COLUMN "comment",
DROP COLUMN "other";

-- AlterTable
ALTER TABLE "recipe_ingredient_group" DROP COLUMN "servings",
DROP COLUMN "servingsInRecipe",
ADD COLUMN     "recipeId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "_CuisineToRecipe" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CuisineToRecipe_AB_unique" ON "_CuisineToRecipe"("A", "B");

-- CreateIndex
CREATE INDEX "_CuisineToRecipe_B_index" ON "_CuisineToRecipe"("B");

-- CreateIndex
CREATE UNIQUE INDEX "recipe_ingredient_group_recipeId_name_key" ON "recipe_ingredient_group"("recipeId", "name");

-- AddForeignKey
ALTER TABLE "recipe_ingredient_group" ADD CONSTRAINT "recipe_ingredient_group_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CuisineToRecipe" ADD CONSTRAINT "_CuisineToRecipe_A_fkey" FOREIGN KEY ("A") REFERENCES "cuisine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CuisineToRecipe" ADD CONSTRAINT "_CuisineToRecipe_B_fkey" FOREIGN KEY ("B") REFERENCES "recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
