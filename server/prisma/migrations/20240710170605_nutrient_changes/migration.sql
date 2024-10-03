/*
  Warnings:

  - You are about to drop the column `targetCarbsGrams` on the `HealthProfile` table. All the data in the column will be lost.
  - You are about to drop the column `targetCarbsPercentage` on the `HealthProfile` table. All the data in the column will be lost.
  - You are about to drop the column `targetFatGrams` on the `HealthProfile` table. All the data in the column will be lost.
  - You are about to drop the column `targetFatPercentage` on the `HealthProfile` table. All the data in the column will be lost.
  - You are about to drop the column `targetProteinGrams` on the `HealthProfile` table. All the data in the column will be lost.
  - You are about to drop the column `targetProteinPercentage` on the `HealthProfile` table. All the data in the column will be lost.
  - You are about to drop the column `customTarget` on the `Nutrient` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "TargetPreference" AS ENUM ('OVER', 'UNDER', 'NONE');

-- AlterTable
ALTER TABLE "DailyReferenceIntake" ADD COLUMN     "upperLimit" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "HealthProfile" DROP COLUMN "targetCarbsGrams",
DROP COLUMN "targetCarbsPercentage",
DROP COLUMN "targetFatGrams",
DROP COLUMN "targetFatPercentage",
DROP COLUMN "targetProteinGrams",
DROP COLUMN "targetProteinPercentage";

-- AlterTable
ALTER TABLE "Nutrient" DROP COLUMN "customTarget";

-- CreateTable
CREATE TABLE "RankedNutrient" (
    "id" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "nutrientId" TEXT NOT NULL,

    CONSTRAINT "RankedNutrient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NutrientTarget" (
    "id" TEXT NOT NULL,
    "targetValue" DOUBLE PRECISION NOT NULL,
    "preference" "TargetPreference" NOT NULL,
    "threshold" DOUBLE PRECISION,
    "nutrientId" TEXT NOT NULL,

    CONSTRAINT "NutrientTarget_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RankedNutrient_nutrientId_key" ON "RankedNutrient"("nutrientId");

-- CreateIndex
CREATE UNIQUE INDEX "NutrientTarget_nutrientId_key" ON "NutrientTarget"("nutrientId");

-- AddForeignKey
ALTER TABLE "RankedNutrient" ADD CONSTRAINT "RankedNutrient_nutrientId_fkey" FOREIGN KEY ("nutrientId") REFERENCES "Nutrient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NutrientTarget" ADD CONSTRAINT "NutrientTarget_nutrientId_fkey" FOREIGN KEY ("nutrientId") REFERENCES "Nutrient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
