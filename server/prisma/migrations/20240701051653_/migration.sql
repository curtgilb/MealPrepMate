-- CreateEnum
CREATE TYPE "MeasurementSystem" AS ENUM ('IMPERIAL', 'METRIC');

-- AlterEnum
ALTER TYPE "UnitType" ADD VALUE 'LENGTH';

-- AlterTable
ALTER TABLE "MeasurementUnit" ADD COLUMN     "system" "MeasurementSystem";
