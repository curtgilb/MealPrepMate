-- AlterTable
ALTER TABLE "NotificationSetting" ALTER COLUMN "defrostWarningTime" DROP NOT NULL,
ALTER COLUMN "leftoverTime" DROP NOT NULL,
ALTER COLUMN "mealTime" DROP NOT NULL,
ALTER COLUMN "shoppingTime" DROP NOT NULL;
