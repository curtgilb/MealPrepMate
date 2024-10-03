-- AlterTable
ALTER TABLE "ImportRecord" ADD COLUMN     "ingredientGroupId" TEXT;

-- AddForeignKey
ALTER TABLE "ImportRecord" ADD CONSTRAINT "ImportRecord_ingredientGroupId_fkey" FOREIGN KEY ("ingredientGroupId") REFERENCES "RecipeIngredientGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;
