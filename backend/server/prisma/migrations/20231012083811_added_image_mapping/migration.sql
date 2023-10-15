/*
  Warnings:

  - Added the required column `imageMapping` to the `Import` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Import" ADD COLUMN     "imageMapping" TEXT NOT NULL;
