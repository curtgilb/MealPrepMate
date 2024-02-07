/*
  Warnings:

  - You are about to drop the column `rawInput` on the `ImportRecord` table. All the data in the column will be lost.
  - You are about to drop the column `importRecordId` on the `NutritionLabel` table. All the data in the column will be lost.
  - Added the required column `hash` to the `ImportRecord` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "ImportStatus" ADD VALUE 'DUPLICATE';

-- DropForeignKey
ALTER TABLE "NutritionLabel" DROP CONSTRAINT "NutritionLabel_importRecordId_fkey";

-- DropIndex
DROP INDEX "NutritionLabel_importRecordId_key";

-- AlterTable
ALTER TABLE "Import" ALTER COLUMN "fileName" DROP NOT NULL,
ALTER COLUMN "fileHash" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ImportRecord" DROP COLUMN "rawInput",
ADD COLUMN     "externalId" TEXT,
ADD COLUMN     "hash" TEXT NOT NULL,
ADD COLUMN     "nutritionLabelId" TEXT;

-- AlterTable
ALTER TABLE "NutritionLabel" DROP COLUMN "importRecordId";

-- AddForeignKey
ALTER TABLE "ImportRecord" ADD CONSTRAINT "ImportRecord_nutritionLabelId_fkey" FOREIGN KEY ("nutritionLabelId") REFERENCES "NutritionLabel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
