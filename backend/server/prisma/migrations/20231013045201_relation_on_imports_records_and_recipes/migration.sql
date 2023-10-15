/*
  Warnings:

  - You are about to drop the column `importRecordId` on the `Recipe` table. All the data in the column will be lost.
  - Added the required column `recipeId` to the `ImportRecord` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Recipe" DROP CONSTRAINT "Recipe_importRecordId_fkey";

-- DropIndex
DROP INDEX "Recipe_importRecordId_key";

-- AlterTable
ALTER TABLE "ImportRecord" ADD COLUMN     "recipeId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN "importRecordId";

-- AddForeignKey
ALTER TABLE "ImportRecord" ADD CONSTRAINT "ImportRecord_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
