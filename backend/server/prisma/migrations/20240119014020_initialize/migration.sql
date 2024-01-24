-- CreateEnum
CREATE TYPE "ImportType" AS ENUM ('MY_FITNESS_PAL', 'RECIPE_KEEPER', 'CRONOMETER');

-- CreateEnum
CREATE TYPE "NutrientType" AS ENUM ('CARBOHYDRATE', 'FAT', 'PROTEIN', 'ALCOHOL', 'MINERAL', 'VITAMIN', 'OTHER');

-- CreateEnum
CREATE TYPE "UnitType" AS ENUM ('VOLUME', 'WEIGHT', 'COUNT', 'ENERGY');

-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY');

-- CreateEnum
CREATE TYPE "Meal" AS ENUM ('BREAKFAST', 'LUNCH', 'DINNER', 'SNACK');

-- CreateEnum
CREATE TYPE "ImportStatus" AS ENUM ('PENDING', 'COMPLETED');

-- CreateEnum
CREATE TYPE "RecordStatus" AS ENUM ('IMPORTED', 'DUPLICATE', 'UPDATED', 'IGNORED', 'PENDING', 'VERIFIED');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "SpecialCondition" AS ENUM ('PREGNANT', 'LACTATING', 'NONE');

-- CreateTable
CREATE TABLE "MealPlanChain" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "prevWeekId" TEXT,
    "nextWeekId" TEXT,

    CONSTRAINT "MealPlanChain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MealPlan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mealPrepInstructions" TEXT NOT NULL,

    CONSTRAINT "MealPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MealPlanServing" (
    "id" TEXT NOT NULL,
    "mealPlanId" TEXT NOT NULL,
    "day" "DayOfWeek" NOT NULL,
    "meal" "Meal" NOT NULL,
    "mealPlanRecipeId" TEXT NOT NULL,
    "numberOfServings" INTEGER NOT NULL,

    CONSTRAINT "MealPlanServing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MealPlanRecipe" (
    "id" TEXT NOT NULL,
    "mealPlanId" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "factor" INTEGER NOT NULL,
    "totalServings" INTEGER NOT NULL,

    CONSTRAINT "MealPlanRecipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Import" (
    "id" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileHash" TEXT NOT NULL,
    "type" "ImportType" NOT NULL,
    "status" "ImportStatus" NOT NULL,
    "imageMapping" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Import_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImportRecord" (
    "id" TEXT NOT NULL,
    "importId" TEXT NOT NULL,
    "rawInput" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "parsedFormat" JSONB NOT NULL,
    "doNotImport" BOOLEAN NOT NULL DEFAULT false,
    "status" "RecordStatus" NOT NULL,
    "recipeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ImportRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecipeIngredient" (
    "id" TEXT NOT NULL,
    "sentence" TEXT NOT NULL,
    "minQuantity" DOUBLE PRECISION,
    "maxQuantity" DOUBLE PRECISION,
    "quantity" DOUBLE PRECISION,
    "name" TEXT,
    "comment" TEXT,
    "other" TEXT,
    "order" INTEGER NOT NULL,
    "measurementUnitId" TEXT,
    "recipeId" TEXT NOT NULL,
    "ingredientId" TEXT,
    "groupId" TEXT,

    CONSTRAINT "RecipeIngredient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MeasurementUnit" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "abbreviations" TEXT[],
    "symbol" TEXT,
    "type" "UnitType",

    CONSTRAINT "MeasurementUnit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecipeIngredientGroup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "servings" INTEGER,
    "servingsInRecipe" INTEGER,

    CONSTRAINT "RecipeIngredientGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ingredient" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "alternateNames" TEXT[],
    "variant" TEXT,
    "categoryId" TEXT,
    "storageInstructions" TEXT,
    "expirationRuleId" TEXT,

    CONSTRAINT "Ingredient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MeasurementConversion" (
    "id" TEXT NOT NULL,
    "fromUnitId" TEXT NOT NULL,
    "toUnitId" TEXT NOT NULL,
    "conversionRatio" DOUBLE PRECISION NOT NULL,
    "ingredientId" TEXT,

    CONSTRAINT "MeasurementConversion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IngredientCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "IngredientCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExpirationRule" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "variant" TEXT,
    "defrostTime" INTEGER,
    "perishable" BOOLEAN,
    "tableLife" INTEGER,
    "fridgeLife" INTEGER,
    "freezerLife" INTEGER,

    CONSTRAINT "ExpirationRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IngredientPrice" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "retailer" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "pricePerUnit" DOUBLE PRECISION NOT NULL,
    "ingredientId" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,

    CONSTRAINT "IngredientPrice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recipe" (
    "id" TEXT NOT NULL,
    "recipeKeeperId" TEXT,
    "title" TEXT NOT NULL,
    "source" TEXT,
    "preparationTime" INTEGER,
    "cookingTime" INTEGER,
    "marinadeTime" INTEGER,
    "directions" TEXT,
    "notes" TEXT,
    "stars" INTEGER,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "cuisineId" TEXT,
    "importId" TEXT,
    "leftoverFridgeLife" INTEGER,
    "leftoverFreezerLife" INTEGER,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Recipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cuisine" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Cuisine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Photo" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "hash" TEXT NOT NULL,
    "recipeId" TEXT,

    CONSTRAINT "Photo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NutritionLabel" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT,
    "ingredientGroupId" TEXT,
    "name" TEXT,
    "verfied" BOOLEAN NOT NULL DEFAULT false,
    "servings" DOUBLE PRECISION,
    "servingSize" DOUBLE PRECISION,
    "unitId" TEXT,
    "servingsUsed" DOUBLE PRECISION,
    "importRecordId" TEXT,

    CONSTRAINT "NutritionLabel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NutritionLabelNutrient" (
    "nutritionLabelId" TEXT NOT NULL,
    "nutrientId" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "valuePerServing" DOUBLE PRECISION,

    CONSTRAINT "NutritionLabelNutrient_pkey" PRIMARY KEY ("nutritionLabelId","nutrientId")
);

-- CreateTable
CREATE TABLE "Nutrient" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "alternateNames" TEXT[],
    "type" "NutrientType" NOT NULL,
    "advancedView" BOOLEAN NOT NULL,
    "customTarget" DOUBLE PRECISION,
    "parentNutrientId" TEXT,
    "unitId" TEXT NOT NULL,
    "recipeKeeperMapping" TEXT,
    "cronometerMapping" TEXT,
    "myFitnessPalMapping" TEXT,
    "driMapping" TEXT,

    CONSTRAINT "Nutrient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyReferenceIntake" (
    "id" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "gender" "Gender" NOT NULL,
    "ageMin" INTEGER NOT NULL,
    "ageMax" INTEGER NOT NULL,
    "specialCondition" "SpecialCondition" NOT NULL,
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
    "targetProteinPercentage" DOUBLE PRECISION,
    "targetProteinGrams" DOUBLE PRECISION,
    "targetCarbsPercentage" DOUBLE PRECISION,
    "targetCarbsGrams" DOUBLE PRECISION,
    "targetFatPercentage" DOUBLE PRECISION,
    "targetFatGrams" DOUBLE PRECISION,

    CONSTRAINT "HealthProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CourseToRecipe" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CategoryToRecipe" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "MealPlanServing_mealPlanId_day_meal_mealPlanRecipeId_key" ON "MealPlanServing"("mealPlanId", "day", "meal", "mealPlanRecipeId");

-- CreateIndex
CREATE UNIQUE INDEX "MeasurementUnit_name_key" ON "MeasurementUnit"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Ingredient_name_key" ON "Ingredient"("name");

-- CreateIndex
CREATE UNIQUE INDEX "IngredientCategory_name_key" ON "IngredientCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Course_name_key" ON "Course"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Cuisine_name_key" ON "Cuisine"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Photo_hash_key" ON "Photo"("hash");

-- CreateIndex
CREATE UNIQUE INDEX "NutritionLabel_ingredientGroupId_key" ON "NutritionLabel"("ingredientGroupId");

-- CreateIndex
CREATE UNIQUE INDEX "NutritionLabel_importRecordId_key" ON "NutritionLabel"("importRecordId");

-- CreateIndex
CREATE UNIQUE INDEX "Nutrient_name_key" ON "Nutrient"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_CourseToRecipe_AB_unique" ON "_CourseToRecipe"("A", "B");

-- CreateIndex
CREATE INDEX "_CourseToRecipe_B_index" ON "_CourseToRecipe"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToRecipe_AB_unique" ON "_CategoryToRecipe"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToRecipe_B_index" ON "_CategoryToRecipe"("B");

-- AddForeignKey
ALTER TABLE "MealPlanChain" ADD CONSTRAINT "MealPlanChain_prevWeekId_fkey" FOREIGN KEY ("prevWeekId") REFERENCES "MealPlan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealPlanChain" ADD CONSTRAINT "MealPlanChain_nextWeekId_fkey" FOREIGN KEY ("nextWeekId") REFERENCES "MealPlan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealPlanServing" ADD CONSTRAINT "MealPlanServing_mealPlanId_fkey" FOREIGN KEY ("mealPlanId") REFERENCES "MealPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealPlanServing" ADD CONSTRAINT "MealPlanServing_mealPlanRecipeId_fkey" FOREIGN KEY ("mealPlanRecipeId") REFERENCES "MealPlanRecipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealPlanRecipe" ADD CONSTRAINT "MealPlanRecipe_mealPlanId_fkey" FOREIGN KEY ("mealPlanId") REFERENCES "MealPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealPlanRecipe" ADD CONSTRAINT "MealPlanRecipe_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImportRecord" ADD CONSTRAINT "ImportRecord_importId_fkey" FOREIGN KEY ("importId") REFERENCES "Import"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImportRecord" ADD CONSTRAINT "ImportRecord_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeIngredient" ADD CONSTRAINT "RecipeIngredient_measurementUnitId_fkey" FOREIGN KEY ("measurementUnitId") REFERENCES "MeasurementUnit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeIngredient" ADD CONSTRAINT "RecipeIngredient_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeIngredient" ADD CONSTRAINT "RecipeIngredient_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredient"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeIngredient" ADD CONSTRAINT "RecipeIngredient_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "RecipeIngredientGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ingredient" ADD CONSTRAINT "Ingredient_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "IngredientCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ingredient" ADD CONSTRAINT "Ingredient_expirationRuleId_fkey" FOREIGN KEY ("expirationRuleId") REFERENCES "ExpirationRule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeasurementConversion" ADD CONSTRAINT "MeasurementConversion_fromUnitId_fkey" FOREIGN KEY ("fromUnitId") REFERENCES "MeasurementUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeasurementConversion" ADD CONSTRAINT "MeasurementConversion_toUnitId_fkey" FOREIGN KEY ("toUnitId") REFERENCES "MeasurementUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeasurementConversion" ADD CONSTRAINT "MeasurementConversion_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredient"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IngredientPrice" ADD CONSTRAINT "IngredientPrice_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IngredientPrice" ADD CONSTRAINT "IngredientPrice_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "MeasurementUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_cuisineId_fkey" FOREIGN KEY ("cuisineId") REFERENCES "Cuisine"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NutritionLabel" ADD CONSTRAINT "NutritionLabel_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NutritionLabel" ADD CONSTRAINT "NutritionLabel_ingredientGroupId_fkey" FOREIGN KEY ("ingredientGroupId") REFERENCES "RecipeIngredientGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NutritionLabel" ADD CONSTRAINT "NutritionLabel_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "MeasurementUnit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NutritionLabel" ADD CONSTRAINT "NutritionLabel_importRecordId_fkey" FOREIGN KEY ("importRecordId") REFERENCES "ImportRecord"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NutritionLabelNutrient" ADD CONSTRAINT "NutritionLabelNutrient_nutritionLabelId_fkey" FOREIGN KEY ("nutritionLabelId") REFERENCES "NutritionLabel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NutritionLabelNutrient" ADD CONSTRAINT "NutritionLabelNutrient_nutrientId_fkey" FOREIGN KEY ("nutrientId") REFERENCES "Nutrient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nutrient" ADD CONSTRAINT "Nutrient_parentNutrientId_fkey" FOREIGN KEY ("parentNutrientId") REFERENCES "Nutrient"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nutrient" ADD CONSTRAINT "Nutrient_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "MeasurementUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyReferenceIntake" ADD CONSTRAINT "DailyReferenceIntake_nutrientId_fkey" FOREIGN KEY ("nutrientId") REFERENCES "Nutrient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToRecipe" ADD CONSTRAINT "_CourseToRecipe_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToRecipe" ADD CONSTRAINT "_CourseToRecipe_B_fkey" FOREIGN KEY ("B") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToRecipe" ADD CONSTRAINT "_CategoryToRecipe_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToRecipe" ADD CONSTRAINT "_CategoryToRecipe_B_fkey" FOREIGN KEY ("B") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
