/*
  Warnings:

  - Added the required column `cookDay` to the `MealPlanRecipe` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('DELIVERED', 'SCHEDULED', 'CANCELED');

-- AlterTable
ALTER TABLE "MealPlanRecipe" ADD COLUMN     "cookDay" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "deliveryDate" TIMESTAMP(3) NOT NULL,
    "message" TEXT NOT NULL,
    "status" "NotificationStatus" NOT NULL,
    "scheduleId" TEXT NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScheduledPlan" (
    "id" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "mealPlanId" TEXT NOT NULL,
    "servings" JSONB NOT NULL,
    "recipes" JSONB NOT NULL,

    CONSTRAINT "ScheduledPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationSetting" (
    "id" TEXT NOT NULL,
    "defrostWarning" BOOLEAN NOT NULL DEFAULT true,
    "defrostWarningTime" TIMESTAMP(3) NOT NULL,
    "leftoverExpiration" BOOLEAN NOT NULL DEFAULT true,
    "leftoverTime" TIMESTAMP(3) NOT NULL,
    "mealReminder" BOOLEAN NOT NULL DEFAULT true,
    "mealTime" TIMESTAMP(3) NOT NULL,
    "shoppingReminder" BOOLEAN NOT NULL DEFAULT true,
    "shoppingTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NotificationSetting_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "ScheduledPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduledPlan" ADD CONSTRAINT "ScheduledPlan_mealPlanId_fkey" FOREIGN KEY ("mealPlanId") REFERENCES "MealPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
