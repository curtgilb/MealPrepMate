/*
  Warnings:

  - Added the required column `fileHash` to the `Import` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Import" ADD COLUMN     "fileHash" TEXT NOT NULL;
