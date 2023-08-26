/*
  Warnings:

  - You are about to drop the column `amount` on the `NutritionLabel` table. All the data in the column will be lost.
  - You are about to drop the column `course` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the column `leftoeverFridgeLife` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `RecipeIngredient` table. All the data in the column will be lost.
  - You are about to drop the `Collection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CollectionToRecipe` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[importRecordId]` on the table `NutritionLabel` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[importRecordId]` on the table `Recipe` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `path` to the `Import` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Import` table without a default value. This is not possible if the table is not empty.
  - Made the column `isFavorite` on table `Recipe` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "ImportStatus" AS ENUM ('CREATED', 'UPLOADED', 'PENDING', 'COMPLETED');

-- CreateEnum
CREATE TYPE "RecordSatus" AS ENUM ('IMPORTED', 'DUPLICATE');

-- DropForeignKey
ALTER TABLE "Recipe" DROP CONSTRAINT "Recipe_importId_fkey";

-- DropForeignKey
ALTER TABLE "_CollectionToRecipe" DROP CONSTRAINT "_CollectionToRecipe_A_fkey";

-- DropForeignKey
ALTER TABLE "_CollectionToRecipe" DROP CONSTRAINT "_CollectionToRecipe_B_fkey";

-- AlterTable
ALTER TABLE "Import" ADD COLUMN     "path" TEXT NOT NULL,
ADD COLUMN     "status" "ImportStatus" NOT NULL;

-- AlterTable
ALTER TABLE "NutritionLabel" DROP COLUMN "amount",
ADD COLUMN     "importRecordId" TEXT,
ADD COLUMN     "servings" DOUBLE PRECISION,
ADD COLUMN     "servingsTxt" TEXT;

-- AlterTable
ALTER TABLE "Photo" ADD COLUMN     "isUploaded" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN "course",
DROP COLUMN "leftoeverFridgeLife",
ADD COLUMN     "courseId" TEXT,
ADD COLUMN     "cuisineId" TEXT,
ADD COLUMN     "importRecordId" TEXT,
ADD COLUMN     "ingredientsTxt" TEXT,
ADD COLUMN     "leftoverFridgeLife" INTEGER,
ALTER COLUMN "isFavorite" SET NOT NULL;

-- AlterTable
ALTER TABLE "RecipeIngredient" DROP COLUMN "order",
ADD COLUMN     "other" TEXT,
ALTER COLUMN "servingPercentage" SET DEFAULT 1.00;

-- DropTable
DROP TABLE "Collection";

-- DropTable
DROP TABLE "_CollectionToRecipe";

-- DropEnum
DROP TYPE "Course";

-- CreateTable
CREATE TABLE "ImportRecord" (
    "id" TEXT NOT NULL,
    "importId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "staus" "RecordSatus" NOT NULL,

    CONSTRAINT "ImportRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cuisine" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Cuisine_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Course_name_key" ON "Course"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Cuisine_name_key" ON "Cuisine"("name");

-- CreateIndex
CREATE UNIQUE INDEX "NutritionLabel_importRecordId_key" ON "NutritionLabel"("importRecordId");

-- CreateIndex
CREATE UNIQUE INDEX "Recipe_importRecordId_key" ON "Recipe"("importRecordId");

-- AddForeignKey
ALTER TABLE "ImportRecord" ADD CONSTRAINT "ImportRecord_importId_fkey" FOREIGN KEY ("importId") REFERENCES "Import"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_cuisineId_fkey" FOREIGN KEY ("cuisineId") REFERENCES "Cuisine"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_importRecordId_fkey" FOREIGN KEY ("importRecordId") REFERENCES "ImportRecord"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NutritionLabel" ADD CONSTRAINT "NutritionLabel_importRecordId_fkey" FOREIGN KEY ("importRecordId") REFERENCES "ImportRecord"("id") ON DELETE SET NULL ON UPDATE CASCADE;
