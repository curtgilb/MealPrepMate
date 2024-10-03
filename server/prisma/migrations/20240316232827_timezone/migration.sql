/*
  Warnings:

  - The `defrostWarningTime` column on the `NotificationSetting` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `leftoverTime` column on the `NotificationSetting` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `mealTime` column on the `NotificationSetting` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `shoppingTime` column on the `NotificationSetting` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `timeZone` to the `NotificationSetting` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "NotificationSetting" ADD COLUMN     "timeZone" TEXT NOT NULL,
DROP COLUMN "defrostWarningTime",
ADD COLUMN     "defrostWarningTime" INTEGER DEFAULT 19,
DROP COLUMN "leftoverTime",
ADD COLUMN     "leftoverTime" INTEGER DEFAULT 8,
DROP COLUMN "mealTime",
ADD COLUMN     "mealTime" INTEGER DEFAULT 8,
DROP COLUMN "shoppingTime",
ADD COLUMN     "shoppingTime" INTEGER DEFAULT 9;
