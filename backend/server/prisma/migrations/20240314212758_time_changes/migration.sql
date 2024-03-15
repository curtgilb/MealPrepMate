/*
  Warnings:

  - You are about to drop the column `week` on the `MealPlanServing` table. All the data in the column will be lost.
  - You are about to drop the `ShoppingDay` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `jobId` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MealPlanServing" DROP CONSTRAINT "MealPlanServing_mealPlanRecipeId_fkey";

-- DropForeignKey
ALTER TABLE "ShoppingDay" DROP CONSTRAINT "ShoppingDay_mealPlanId_fkey";

-- AlterTable
ALTER TABLE "MealPlan" ADD COLUMN     "shoppingDays" INTEGER[];

-- AlterTable
ALTER TABLE "MealPlanRecipe" ALTER COLUMN "factor" SET DEFAULT 1,
ALTER COLUMN "cookDay" DROP NOT NULL;

-- AlterTable
ALTER TABLE "MealPlanServing" DROP COLUMN "week";

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "jobId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "NotificationSetting" ALTER COLUMN "defrostWarningTime" SET DATA TYPE TIME,
ALTER COLUMN "leftoverTime" SET DATA TYPE TIME,
ALTER COLUMN "mealTime" SET DATA TYPE TIME,
ALTER COLUMN "shoppingTime" SET DATA TYPE TIME;

-- DropTable
DROP TABLE "ShoppingDay";

-- AddForeignKey
ALTER TABLE "MealPlanServing" ADD CONSTRAINT "MealPlanServing_mealPlanRecipeId_fkey" FOREIGN KEY ("mealPlanRecipeId") REFERENCES "MealPlanRecipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
