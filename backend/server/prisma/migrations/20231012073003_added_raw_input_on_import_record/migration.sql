/*
  Warnings:

  - Added the required column `rawInput` to the `ImportRecord` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ImportRecord" ADD COLUMN     "rawInput" TEXT NOT NULL;
