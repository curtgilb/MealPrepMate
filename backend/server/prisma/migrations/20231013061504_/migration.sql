/*
  Warnings:

  - The values [UPDATE] on the enum `RecordStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RecordStatus_new" AS ENUM ('IMPORTED', 'DUPLICATE', 'PENDING');
ALTER TABLE "ImportRecord" ALTER COLUMN "status" TYPE "RecordStatus_new" USING ("status"::text::"RecordStatus_new");
ALTER TYPE "RecordStatus" RENAME TO "RecordStatus_old";
ALTER TYPE "RecordStatus_new" RENAME TO "RecordStatus";
DROP TYPE "RecordStatus_old";
COMMIT;
