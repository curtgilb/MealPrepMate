/*
  Warnings:

  - You are about to drop the column `defrostTime` on the `Ingredient` table. All the data in the column will be lost.
  - You are about to drop the column `freezerLife` on the `Ingredient` table. All the data in the column will be lost.
  - You are about to drop the column `fridgeLife` on the `Ingredient` table. All the data in the column will be lost.
  - You are about to drop the column `perishable` on the `Ingredient` table. All the data in the column will be lost.
  - You are about to drop the column `abbreviation` on the `Nutrient` table. All the data in the column will be lost.
  - Added the required column `ageMax` to the `DailyReferenceIntake` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ageMin` to the `DailyReferenceIntake` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `DailyReferenceIntake` table without a default value. This is not possible if the table is not empty.
  - Added the required column `specialCondition` to the `DailyReferenceIntake` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitAbbreviation` to the `Nutrient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `NutritionLabel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `source` to the `NutritionLabel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `NutritionLabelNutrient` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "NutritionSource" AS ENUM ('CRONOMETER', 'RECIPE_KEEPER', 'CUSTOM');

-- CreateEnum
CREATE TYPE "SpecialCondition" AS ENUM ('PREGNANT', 'LACTATING', 'NONE');

-- DropForeignKey
ALTER TABLE "NutritionLabel" DROP CONSTRAINT "NutritionLabel_recipeId_fkey";

-- AlterTable
ALTER TABLE "DailyReferenceIntake" ADD COLUMN     "ageMax" INTEGER NOT NULL,
ADD COLUMN     "ageMin" INTEGER NOT NULL,
ADD COLUMN     "gender" "Gender" NOT NULL,
ADD COLUMN     "specialCondition" "SpecialCondition" NOT NULL;

-- AlterTable
ALTER TABLE "Ingredient" DROP COLUMN "defrostTime",
DROP COLUMN "freezerLife",
DROP COLUMN "fridgeLife",
DROP COLUMN "perishable",
ADD COLUMN     "expirationRuleId" TEXT;

-- AlterTable
ALTER TABLE "Nutrient" DROP COLUMN "abbreviation",
ADD COLUMN     "unitAbbreviation" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "NutritionLabel" ADD COLUMN     "amount" TEXT,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "percentage" DOUBLE PRECISION,
ADD COLUMN     "source" "NutritionSource" NOT NULL,
ALTER COLUMN "recipeId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "NutritionLabelNutrient" ADD COLUMN     "value" DOUBLE PRECISION NOT NULL;

-- CreateTable
CREATE TABLE "ExpirationRule" (
    "id" TEXT NOT NULL,
    "defrostTime" INTEGER,
    "perishable" BOOLEAN,
    "tableLife" INTEGER,
    "fridgeLife" INTEGER,
    "freezerLife" INTEGER,

    CONSTRAINT "ExpirationRule_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Ingredient" ADD CONSTRAINT "Ingredient_expirationRuleId_fkey" FOREIGN KEY ("expirationRuleId") REFERENCES "ExpirationRule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NutritionLabel" ADD CONSTRAINT "NutritionLabel_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE SET NULL ON UPDATE CASCADE;
