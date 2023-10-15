/*
  Warnings:

  - The values [CREATED,UPLOADED] on the enum `ImportStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `staus` on the `ImportRecord` table. All the data in the column will be lost.
  - Added the required column `status` to the `ImportRecord` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RecordStatus" AS ENUM ('IMPORTED', 'DUPLICATE', 'UPDATE');

-- AlterEnum
BEGIN;
CREATE TYPE "ImportStatus_new" AS ENUM ('PENDING', 'COMPLETED');
ALTER TABLE "Import" ALTER COLUMN "status" TYPE "ImportStatus_new" USING ("status"::text::"ImportStatus_new");
ALTER TYPE "ImportStatus" RENAME TO "ImportStatus_old";
ALTER TYPE "ImportStatus_new" RENAME TO "ImportStatus";
DROP TYPE "ImportStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "ImportRecord" DROP COLUMN "staus",
ADD COLUMN     "status" "RecordStatus" NOT NULL;

-- DropEnum
DROP TYPE "RecordSatus";
