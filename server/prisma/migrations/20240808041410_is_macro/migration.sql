/*
  Warnings:

  - Added the required column `isMacro` to the `Nutrient` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Nutrient" ADD COLUMN     "isMacro" BOOLEAN NOT NULL;
