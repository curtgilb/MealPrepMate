/*
  Warnings:

  - You are about to drop the column `path` on the `Import` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Import" DROP COLUMN "path";

-- AlterTable
ALTER TABLE "NutritionLabel" ADD COLUMN     "verfied" BOOLEAN NOT NULL DEFAULT true;
