/*
  Warnings:

  - The `imageMapping` column on the `Import` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `parsedFormat` to the `ImportRecord` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Import" DROP COLUMN "imageMapping",
ADD COLUMN     "imageMapping" JSONB;

-- AlterTable
ALTER TABLE "ImportRecord" ADD COLUMN     "doNotImport" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "parsedFormat" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "Nutrient" ADD COLUMN     "cronometerMapping" TEXT,
ADD COLUMN     "driMapping" TEXT,
ADD COLUMN     "myFitnessPalMapping" TEXT,
ADD COLUMN     "recipeKeeperMapping" TEXT;
