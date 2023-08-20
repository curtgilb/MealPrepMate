-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY');

-- CreateEnum
CREATE TYPE "ImportType" AS ENUM ('MY_FITNESS_PAL', 'RECIPE_KEEPER', 'CRONOMETER');

-- CreateEnum
CREATE TYPE "IngredientCategory" AS ENUM ('DAIRY', 'VEGETABLE', 'FRUIT', 'MEAT', 'GRAIN', 'SAUCE', 'SPICE', 'BAKING');

-- CreateEnum
CREATE TYPE "NutrientType" AS ENUM ('CARBOHYDRATE', 'FAT', 'PROTEIN', 'ALCHOHOL', 'MINERAL', 'VITAMIN', 'OTHER');

-- CreateEnum
CREATE TYPE "Course" AS ENUM ('BREAKFAST', 'LUNCH', 'DINNER', 'SNACK', 'DESSERT', 'DRINK', 'OTHER');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

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
CREATE TABLE "Import" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "ImportType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Import_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecipeIngredient" (
    "id" TEXT NOT NULL,
    "isIngredient" BOOLEAN NOT NULL DEFAULT true,
    "sentence" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "minQuantity" DOUBLE PRECISION,
    "maxQuantity" DOUBLE PRECISION,
    "quantity" DOUBLE PRECISION,
    "unit" TEXT,
    "name" TEXT NOT NULL,
    "comment" TEXT,
    "recipeId" TEXT NOT NULL,
    "ingredientId" TEXT NOT NULL,
    "display" BOOLEAN,
    "servingPercentage" DOUBLE PRECISION,

    CONSTRAINT "RecipeIngredient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Collection" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

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
    "name" TEXT NOT NULL,
    "storageInstructions" TEXT,
    "perishable" BOOLEAN,
    "fridgeLife" INTEGER,
    "freezerLife" INTEGER,
    "defrostTime" INTEGER,

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
CREATE TABLE "Recipe" (
    "id" TEXT NOT NULL,
    "recipeKeeperId" TEXT,
    "title" TEXT NOT NULL,
    "source" TEXT,
    "servingsText" TEXT,
    "servings" INTEGER NOT NULL,
    "preparationTime" INTEGER,
    "cookingTime" INTEGER,
    "marinadeTime" INTEGER,
    "directions" TEXT,
    "notes" TEXT,
    "stars" INTEGER,
    "isFavorite" BOOLEAN DEFAULT false,
    "course" TEXT,
    "importId" TEXT,
    "leftoeverFridgeLife" INTEGER,
    "leftoverFreezerLife" INTEGER,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Recipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NutritionLabel" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,

    CONSTRAINT "NutritionLabel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NutritionLabelNutrient" (
    "nutritionLabelId" TEXT NOT NULL,
    "nutrientId" TEXT NOT NULL,

    CONSTRAINT "NutritionLabelNutrient_pkey" PRIMARY KEY ("nutritionLabelId","nutrientId")
);

-- CreateTable
CREATE TABLE "Nutrient" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "abbreviation" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "alternateNames" TEXT[],
    "type" "NutrientType" NOT NULL,
    "customTarget" BOOLEAN NOT NULL,
    "customValue" DOUBLE PRECISION,
    "parentNutrientId" TEXT,

    CONSTRAINT "Nutrient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyReferenceIntake" (
    "id" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "nutrientId" TEXT NOT NULL,

    CONSTRAINT "DailyReferenceIntake_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HealthProfile" (
    "id" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "gender" "Gender" NOT NULL,
    "bodyFatPercentage" DOUBLE PRECISION NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "yearBorn" INTEGER NOT NULL,
    "activityLevel" DOUBLE PRECISION NOT NULL,
    "targetProtein" DOUBLE PRECISION NOT NULL,
    "targetCarbs" DOUBLE PRECISION NOT NULL,
    "targetFat" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "HealthProfile_pkey" PRIMARY KEY ("id")
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

-- CreateTable
CREATE TABLE "_LinkedRecipes" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Collection_name_key" ON "Collection"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Ingredient_name_key" ON "Ingredient"("name");

-- CreateIndex
CREATE UNIQUE INDEX "IngredientAlternateName_name_key" ON "IngredientAlternateName"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToRecipe_AB_unique" ON "_CategoryToRecipe"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToRecipe_B_index" ON "_CategoryToRecipe"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CollectionToRecipe_AB_unique" ON "_CollectionToRecipe"("A", "B");

-- CreateIndex
CREATE INDEX "_CollectionToRecipe_B_index" ON "_CollectionToRecipe"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_LinkedRecipes_AB_unique" ON "_LinkedRecipes"("A", "B");

-- CreateIndex
CREATE INDEX "_LinkedRecipes_B_index" ON "_LinkedRecipes"("B");

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
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_importId_fkey" FOREIGN KEY ("importId") REFERENCES "Import"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NutritionLabel" ADD CONSTRAINT "NutritionLabel_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NutritionLabelNutrient" ADD CONSTRAINT "NutritionLabelNutrient_nutritionLabelId_fkey" FOREIGN KEY ("nutritionLabelId") REFERENCES "NutritionLabel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NutritionLabelNutrient" ADD CONSTRAINT "NutritionLabelNutrient_nutrientId_fkey" FOREIGN KEY ("nutrientId") REFERENCES "Nutrient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nutrient" ADD CONSTRAINT "Nutrient_parentNutrientId_fkey" FOREIGN KEY ("parentNutrientId") REFERENCES "Nutrient"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyReferenceIntake" ADD CONSTRAINT "DailyReferenceIntake_nutrientId_fkey" FOREIGN KEY ("nutrientId") REFERENCES "Nutrient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToRecipe" ADD CONSTRAINT "_CategoryToRecipe_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToRecipe" ADD CONSTRAINT "_CategoryToRecipe_B_fkey" FOREIGN KEY ("B") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CollectionToRecipe" ADD CONSTRAINT "_CollectionToRecipe_A_fkey" FOREIGN KEY ("A") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CollectionToRecipe" ADD CONSTRAINT "_CollectionToRecipe_B_fkey" FOREIGN KEY ("B") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LinkedRecipes" ADD CONSTRAINT "_LinkedRecipes_A_fkey" FOREIGN KEY ("A") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LinkedRecipes" ADD CONSTRAINT "_LinkedRecipes_B_fkey" FOREIGN KEY ("B") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
