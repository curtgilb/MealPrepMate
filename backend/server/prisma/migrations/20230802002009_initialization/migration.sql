-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY');

-- CreateEnum
CREATE TYPE "IngredientCategory" AS ENUM ('DAIRY', 'VEGETABLE', 'FRUIT', 'MEAT', 'BREAD');

-- CreateTable
CREATE TABLE "MealPlan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mealPrepInstructions" TEXT NOT NULL,

    CONSTRAINT "MealPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Servings" (
    "mealPlanId" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "numOfServings" INTEGER NOT NULL,
    "day" "DayOfWeek" NOT NULL,

    CONSTRAINT "Servings_pkey" PRIMARY KEY ("mealPlanId","recipeId")
);

-- CreateTable
CREATE TABLE "Recipe" (
    "id" TEXT NOT NULL,
    "recipeKeeperId" TEXT,
    "title" TEXT NOT NULL,
    "source" TEXT,
    "servingsText" TEXT,
    "servingsNumber" INTEGER,
    "preparationTime" INTEGER,
    "cookingTime" INTEGER,
    "directions" TEXT,
    "notes" TEXT,
    "stars" INTEGER,
    "isFavorite" BOOLEAN NOT NULL,
    "course" TEXT,

    CONSTRAINT "Recipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecipeIngredient" (
    "quantity" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "ingredientId" TEXT NOT NULL,

    CONSTRAINT "RecipeIngredient_pkey" PRIMARY KEY ("recipeId","ingredientId")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Collection" (
    "id" TEXT NOT NULL,
    "collection" TEXT NOT NULL,

    CONSTRAINT "Collection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Photo" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL,
    "recipeId" TEXT NOT NULL,

    CONSTRAINT "Photo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ingredient" (
    "id" TEXT NOT NULL,
    "storageInstructions" TEXT NOT NULL,
    "perishable" BOOLEAN NOT NULL,
    "fridgeLife" INTEGER NOT NULL,
    "storageLife" INTEGER NOT NULL,
    "category" "IngredientCategory" NOT NULL,

    CONSTRAINT "Ingredient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IngredientAlternateName" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ingredientId" TEXT NOT NULL,

    CONSTRAINT "IngredientAlternateName_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IngredientPrice" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "retailer" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "pricePerUnit" DOUBLE PRECISION NOT NULL,
    "ingredientId" TEXT NOT NULL,

    CONSTRAINT "IngredientPrice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecipeKeeperNutritionProfile" (
    "id" TEXT NOT NULL,
    "servingSize" INTEGER NOT NULL,
    "calories" INTEGER NOT NULL,
    "totalFat" INTEGER NOT NULL,
    "saturatedFat" INTEGER NOT NULL,

    CONSTRAINT "RecipeKeeperNutritionProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_LinkedRecipes" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CategoryToRecipe" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CollectionToRecipe" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "IngredientAlternateName_name_key" ON "IngredientAlternateName"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_LinkedRecipes_AB_unique" ON "_LinkedRecipes"("A", "B");

-- CreateIndex
CREATE INDEX "_LinkedRecipes_B_index" ON "_LinkedRecipes"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToRecipe_AB_unique" ON "_CategoryToRecipe"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToRecipe_B_index" ON "_CategoryToRecipe"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CollectionToRecipe_AB_unique" ON "_CollectionToRecipe"("A", "B");

-- CreateIndex
CREATE INDEX "_CollectionToRecipe_B_index" ON "_CollectionToRecipe"("B");

-- AddForeignKey
ALTER TABLE "Servings" ADD CONSTRAINT "Servings_mealPlanId_fkey" FOREIGN KEY ("mealPlanId") REFERENCES "MealPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servings" ADD CONSTRAINT "Servings_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeIngredient" ADD CONSTRAINT "RecipeIngredient_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeIngredient" ADD CONSTRAINT "RecipeIngredient_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IngredientAlternateName" ADD CONSTRAINT "IngredientAlternateName_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IngredientPrice" ADD CONSTRAINT "IngredientPrice_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LinkedRecipes" ADD CONSTRAINT "_LinkedRecipes_A_fkey" FOREIGN KEY ("A") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LinkedRecipes" ADD CONSTRAINT "_LinkedRecipes_B_fkey" FOREIGN KEY ("B") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToRecipe" ADD CONSTRAINT "_CategoryToRecipe_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToRecipe" ADD CONSTRAINT "_CategoryToRecipe_B_fkey" FOREIGN KEY ("B") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CollectionToRecipe" ADD CONSTRAINT "_CollectionToRecipe_A_fkey" FOREIGN KEY ("A") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CollectionToRecipe" ADD CONSTRAINT "_CollectionToRecipe_B_fkey" FOREIGN KEY ("B") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
