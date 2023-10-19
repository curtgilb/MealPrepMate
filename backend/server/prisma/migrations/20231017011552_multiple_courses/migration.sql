/*
  Warnings:

  - You are about to drop the column `courseId` on the `Recipe` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Recipe" DROP CONSTRAINT "Recipe_courseId_fkey";

-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN "courseId";

-- CreateTable
CREATE TABLE "_CourseToRecipe" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CourseToRecipe_AB_unique" ON "_CourseToRecipe"("A", "B");

-- CreateIndex
CREATE INDEX "_CourseToRecipe_B_index" ON "_CourseToRecipe"("B");

-- AddForeignKey
ALTER TABLE "_CourseToRecipe" ADD CONSTRAINT "_CourseToRecipe_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToRecipe" ADD CONSTRAINT "_CourseToRecipe_B_fkey" FOREIGN KEY ("B") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
