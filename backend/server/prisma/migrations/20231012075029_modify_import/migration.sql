/*
  Warnings:

  - You are about to drop the column `name` on the `Import` table. All the data in the column will be lost.
  - Added the required column `fileName` to the `Import` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Import" DROP COLUMN "name",
ADD COLUMN     "fileName" TEXT NOT NULL;
