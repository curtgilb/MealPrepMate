/*
  Warnings:

  - Added the required column `storagePath` to the `ImportRecord` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ImportRecord" ADD COLUMN     "storagePath" TEXT NOT NULL;
