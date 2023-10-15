/*
  Warnings:

  - You are about to drop the column `isPrimary` on the `Photo` table. All the data in the column will be lost.
  - You are about to drop the column `recipeId` on the `Photo` table. All the data in the column will be lost.
  - Added the required column `hash` to the `Photo` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Photo" DROP CONSTRAINT "Photo_recipeId_fkey";

-- AlterTable
ALTER TABLE "Photo" DROP COLUMN "isPrimary",
DROP COLUMN "recipeId",
ADD COLUMN     "hash" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "PhotoAlias" (
    "alias" TEXT NOT NULL,
    "photoId" TEXT NOT NULL,

    CONSTRAINT "PhotoAlias_pkey" PRIMARY KEY ("alias")
);

-- CreateTable
CREATE TABLE "RecipePhotos" (
    "photoId" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "RecipePhotos_pkey" PRIMARY KEY ("photoId","recipeId")
);

-- AddForeignKey
ALTER TABLE "PhotoAlias" ADD CONSTRAINT "PhotoAlias_photoId_fkey" FOREIGN KEY ("photoId") REFERENCES "Photo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipePhotos" ADD CONSTRAINT "RecipePhotos_photoId_fkey" FOREIGN KEY ("photoId") REFERENCES "Photo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipePhotos" ADD CONSTRAINT "RecipePhotos_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
