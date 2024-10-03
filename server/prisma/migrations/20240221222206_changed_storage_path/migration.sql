/*
  Warnings:

  - You are about to drop the column `storagePath` on the `ImportRecord` table. All the data in the column will be lost.
  - Added the required column `storagePath` to the `Import` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Import" ADD COLUMN     "storagePath" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ImportRecord" DROP COLUMN "storagePath";
