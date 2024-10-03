/*
  Warnings:

  - You are about to drop the column `servings` on the `ScheduledPlan` table. All the data in the column will be lost.
  - Made the column `defrostWarningTime` on table `NotificationSetting` required. This step will fail if there are existing NULL values in that column.
  - Made the column `leftoverTime` on table `NotificationSetting` required. This step will fail if there are existing NULL values in that column.
  - Made the column `mealTime` on table `NotificationSetting` required. This step will fail if there are existing NULL values in that column.
  - Made the column `shoppingTime` on table `NotificationSetting` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `recipes` to the `ScheduledPlan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "NotificationStatus" ADD VALUE 'CREATED';

-- AlterTable
ALTER TABLE "NotificationSetting" ALTER COLUMN "defrostWarningTime" SET NOT NULL,
ALTER COLUMN "leftoverTime" SET NOT NULL,
ALTER COLUMN "mealTime" SET NOT NULL,
ALTER COLUMN "shoppingTime" SET NOT NULL;

-- AlterTable
ALTER TABLE "ScheduledPlan" DROP COLUMN "servings",
ADD COLUMN     "recipes" JSONB NOT NULL;
