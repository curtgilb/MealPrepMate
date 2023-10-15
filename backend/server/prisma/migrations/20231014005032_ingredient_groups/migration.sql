/*
  Warnings:

  - You are about to drop the column `servingPercentage` on the `RecipeIngredient` table. All the data in the column will be lost.
  - You are about to drop the `Media` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PostMedia` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[ingredientGroupId]` on the table `NutritionLabel` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ingredientGroupId` to the `NutritionLabel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `groupId` to the `RecipeIngredient` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PostMedia" DROP CONSTRAINT "PostMedia_mediaId_fkey";

-- DropForeignKey
ALTER TABLE "PostMedia" DROP CONSTRAINT "PostMedia_postId_fkey";

-- DropIndex
DROP INDEX "NutritionLabel_recipeId_key";

-- AlterTable
ALTER TABLE "NutritionLabel" ADD COLUMN     "ingredientGroupId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "RecipeIngredient" DROP COLUMN "servingPercentage",
ADD COLUMN     "groupId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Media";

-- DropTable
DROP TABLE "Post";

-- DropTable
DROP TABLE "PostMedia";

-- CreateTable
CREATE TABLE "RecipeIngredientGroup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "RecipeIngredientGroup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NutritionLabel_ingredientGroupId_key" ON "NutritionLabel"("ingredientGroupId");

-- AddForeignKey
ALTER TABLE "RecipeIngredient" ADD CONSTRAINT "RecipeIngredient_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "RecipeIngredientGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NutritionLabel" ADD CONSTRAINT "NutritionLabel_ingredientGroupId_fkey" FOREIGN KEY ("ingredientGroupId") REFERENCES "RecipeIngredientGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
