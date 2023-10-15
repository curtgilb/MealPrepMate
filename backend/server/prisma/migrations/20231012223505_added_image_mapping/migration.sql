/*
  Warnings:

  - You are about to drop the `PhotoAlias` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PhotoAlias" DROP CONSTRAINT "PhotoAlias_photoId_fkey";

-- AlterTable
ALTER TABLE "Import" ALTER COLUMN "imageMapping" DROP NOT NULL;

-- DropTable
DROP TABLE "PhotoAlias";
