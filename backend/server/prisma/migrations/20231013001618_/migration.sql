/*
  Warnings:

  - You are about to drop the column `isUploaded` on the `Photo` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[hash]` on the table `Photo` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Photo" DROP COLUMN "isUploaded";

-- CreateIndex
CREATE UNIQUE INDEX "Photo_hash_key" ON "Photo"("hash");
