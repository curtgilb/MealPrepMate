/*
  Warnings:

  - Added the required column `name` to the `ExpirationRule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ExpirationRule" ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "variant" TEXT;

-- AlterTable
ALTER TABLE "Ingredient" ADD COLUMN     "categoryId" TEXT;

-- DropEnum
DROP TYPE "IngredientCategory";

-- CreateTable
CREATE TABLE "IngredientCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "IngredientCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "IngredientCategory_name_key" ON "IngredientCategory"("name");

-- AddForeignKey
ALTER TABLE "Ingredient" ADD CONSTRAINT "Ingredient_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "IngredientCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
