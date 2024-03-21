/*
  Warnings:

  - You are about to drop the column `jobId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `recipes` on the `ScheduledPlan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "jobId";

-- AlterTable
ALTER TABLE "ScheduledPlan" DROP COLUMN "recipes",
ADD COLUMN     "shoppingDays" INTEGER[];
