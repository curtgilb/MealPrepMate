/*
  Warnings:

  - You are about to drop the column `targetCarbs` on the `HealthProfile` table. All the data in the column will be lost.
  - You are about to drop the column `targetFat` on the `HealthProfile` table. All the data in the column will be lost.
  - You are about to drop the column `targetProtein` on the `HealthProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "HealthProfile" DROP COLUMN "targetCarbs",
DROP COLUMN "targetFat",
DROP COLUMN "targetProtein",
ADD COLUMN     "targetCarbsGrams" DOUBLE PRECISION,
ADD COLUMN     "targetCarbsPercentage" DOUBLE PRECISION,
ADD COLUMN     "targetFatGrams" DOUBLE PRECISION,
ADD COLUMN     "targetFatPercentage" DOUBLE PRECISION,
ADD COLUMN     "targetProteinGrams" DOUBLE PRECISION,
ADD COLUMN     "targetProteinPercentage" DOUBLE PRECISION;
