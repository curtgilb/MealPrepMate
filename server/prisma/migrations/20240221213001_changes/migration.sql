/*
  Warnings:

  - The values [PENDING,VERIFIED] on the enum `RecordStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `doNotImport` on the `ImportRecord` table. All the data in the column will be lost.
  - You are about to drop the column `verfied` on the `NutritionLabel` table. All the data in the column will be lost.
  - You are about to drop the column `valuePerServing` on the `NutritionLabelNutrient` table. All the data in the column will be lost.
  - You are about to drop the column `recipeKeeperId` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the column `maxQuantity` on the `RecipeIngredient` table. All the data in the column will be lost.
  - You are about to drop the column `minQuantity` on the `RecipeIngredient` table. All the data in the column will be lost.
  - You are about to drop the `MealPlanChain` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `week` to the `MealPlanServing` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `day` on the `MealPlanServing` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `order` to the `Nutrient` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "ImportStatus" ADD VALUE 'REVIEW';

-- AlterEnum
BEGIN;
CREATE TYPE "RecordStatus_new" AS ENUM ('IMPORTED', 'DUPLICATE', 'UPDATED', 'IGNORED');
ALTER TABLE "ImportRecord" ALTER COLUMN "status" TYPE "RecordStatus_new" USING ("status"::text::"RecordStatus_new");
ALTER TYPE "RecordStatus" RENAME TO "RecordStatus_old";
ALTER TYPE "RecordStatus_new" RENAME TO "RecordStatus";
DROP TYPE "RecordStatus_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "MealPlanChain" DROP CONSTRAINT "MealPlanChain_nextWeekId_fkey";

-- DropForeignKey
ALTER TABLE "MealPlanChain" DROP CONSTRAINT "MealPlanChain_prevWeekId_fkey";

-- AlterTable
ALTER TABLE "ImportRecord" DROP COLUMN "doNotImport",
ADD COLUMN     "draftId" TEXT,
ADD COLUMN     "verifed" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "MealPlan" ADD COLUMN     "draft" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "mealPrepInstructions" DROP NOT NULL;

-- AlterTable
ALTER TABLE "MealPlanRecipe" ALTER COLUMN "factor" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "MealPlanServing" ADD COLUMN     "week" INTEGER NOT NULL,
DROP COLUMN "day",
ADD COLUMN     "day" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Nutrient" ADD COLUMN     "order" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "NutritionLabel" DROP COLUMN "verfied",
ADD COLUMN     "verifed" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "NutritionLabelNutrient" DROP COLUMN "valuePerServing";

-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN "recipeKeeperId",
ADD COLUMN     "totalTime" INTEGER;

-- AlterTable
ALTER TABLE "RecipeIngredient" DROP COLUMN "maxQuantity",
DROP COLUMN "minQuantity";

-- DropTable
DROP TABLE "MealPlanChain";

-- DropEnum
DROP TYPE "DayOfWeek";

-- CreateTable
CREATE TABLE "ShoppingDay" (
    "id" TEXT NOT NULL,
    "week" INTEGER NOT NULL,
    "day" INTEGER NOT NULL,
    "mealPlanId" TEXT NOT NULL,

    CONSTRAINT "ShoppingDay_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MealPlanServing_mealPlanId_day_meal_mealPlanRecipeId_key" ON "MealPlanServing"("mealPlanId", "day", "meal", "mealPlanRecipeId");

-- AddForeignKey
ALTER TABLE "ShoppingDay" ADD CONSTRAINT "ShoppingDay_mealPlanId_fkey" FOREIGN KEY ("mealPlanId") REFERENCES "MealPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
