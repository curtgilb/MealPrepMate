/*
  Warnings:

  - You are about to drop the `BookmarkedRecipe` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `boundingBoxes` to the `ReceiptLine` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "ImportType" ADD VALUE 'WEB';

-- DropForeignKey
ALTER TABLE "BookmarkedRecipe" DROP CONSTRAINT "BookmarkedRecipe_recipeId_fkey";

-- AlterTable
ALTER TABLE "ReceiptLine" ADD COLUMN     "boundingBoxes" JSONB NOT NULL,
ALTER COLUMN "unitQuantity" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "BookmarkedRecipe";

-- CreateTable
CREATE TABLE "WebScrapedRecipe" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "isBookmark" BOOLEAN NOT NULL DEFAULT false,
    "scraped" BOOLEAN NOT NULL DEFAULT false,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "recipeId" TEXT,

    CONSTRAINT "WebScrapedRecipe_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WebScrapedRecipe_recipeId_key" ON "WebScrapedRecipe"("recipeId");

-- AddForeignKey
ALTER TABLE "WebScrapedRecipe" ADD CONSTRAINT "WebScrapedRecipe_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE SET NULL ON UPDATE CASCADE;
