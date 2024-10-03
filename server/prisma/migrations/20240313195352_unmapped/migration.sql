/*
  Warnings:

  - You are about to drop the `category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `course` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `cuisine` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `daily_reference_intake` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `expiration_rule` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `health_profile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `import` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `import_record` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ingredient` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ingredient_category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ingredient_price` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `meal_plan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `meal_plan_recipe` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `meal_plan_serving` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `measurement_conversion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `measurement_unit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `nutrient` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `nutrient_import_mapping` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `nutrition_label` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `nutrition_label_nutrient` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `photo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `recipe` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `recipe_ingredient` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `recipe_ingredient_group` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `shopping_day` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CategoryToRecipe" DROP CONSTRAINT "_CategoryToRecipe_A_fkey";

-- DropForeignKey
ALTER TABLE "_CategoryToRecipe" DROP CONSTRAINT "_CategoryToRecipe_B_fkey";

-- DropForeignKey
ALTER TABLE "_CourseToRecipe" DROP CONSTRAINT "_CourseToRecipe_A_fkey";

-- DropForeignKey
ALTER TABLE "_CourseToRecipe" DROP CONSTRAINT "_CourseToRecipe_B_fkey";

-- DropForeignKey
ALTER TABLE "_CuisineToRecipe" DROP CONSTRAINT "_CuisineToRecipe_A_fkey";

-- DropForeignKey
ALTER TABLE "_CuisineToRecipe" DROP CONSTRAINT "_CuisineToRecipe_B_fkey";

-- DropForeignKey
ALTER TABLE "daily_reference_intake" DROP CONSTRAINT "daily_reference_intake_nutrientId_fkey";

-- DropForeignKey
ALTER TABLE "import_record" DROP CONSTRAINT "import_record_importId_fkey";

-- DropForeignKey
ALTER TABLE "import_record" DROP CONSTRAINT "import_record_nutritionLabelId_fkey";

-- DropForeignKey
ALTER TABLE "import_record" DROP CONSTRAINT "import_record_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "ingredient" DROP CONSTRAINT "ingredient_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "ingredient" DROP CONSTRAINT "ingredient_expirationRuleId_fkey";

-- DropForeignKey
ALTER TABLE "ingredient_price" DROP CONSTRAINT "ingredient_price_ingredientId_fkey";

-- DropForeignKey
ALTER TABLE "ingredient_price" DROP CONSTRAINT "ingredient_price_unitId_fkey";

-- DropForeignKey
ALTER TABLE "meal_plan_recipe" DROP CONSTRAINT "meal_plan_recipe_mealPlanId_fkey";

-- DropForeignKey
ALTER TABLE "meal_plan_recipe" DROP CONSTRAINT "meal_plan_recipe_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "meal_plan_serving" DROP CONSTRAINT "meal_plan_serving_mealPlanId_fkey";

-- DropForeignKey
ALTER TABLE "meal_plan_serving" DROP CONSTRAINT "meal_plan_serving_mealPlanRecipeId_fkey";

-- DropForeignKey
ALTER TABLE "measurement_conversion" DROP CONSTRAINT "measurement_conversion_fromUnitId_fkey";

-- DropForeignKey
ALTER TABLE "measurement_conversion" DROP CONSTRAINT "measurement_conversion_ingredientId_fkey";

-- DropForeignKey
ALTER TABLE "measurement_conversion" DROP CONSTRAINT "measurement_conversion_toUnitId_fkey";

-- DropForeignKey
ALTER TABLE "nutrient" DROP CONSTRAINT "nutrient_parentNutrientId_fkey";

-- DropForeignKey
ALTER TABLE "nutrient" DROP CONSTRAINT "nutrient_unitId_fkey";

-- DropForeignKey
ALTER TABLE "nutrient_import_mapping" DROP CONSTRAINT "nutrient_import_mapping_nutrientId_fkey";

-- DropForeignKey
ALTER TABLE "nutrition_label" DROP CONSTRAINT "nutrition_label_ingredientGroupId_fkey";

-- DropForeignKey
ALTER TABLE "nutrition_label" DROP CONSTRAINT "nutrition_label_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "nutrition_label" DROP CONSTRAINT "nutrition_label_unitId_fkey";

-- DropForeignKey
ALTER TABLE "nutrition_label_nutrient" DROP CONSTRAINT "nutrition_label_nutrient_nutrientId_fkey";

-- DropForeignKey
ALTER TABLE "nutrition_label_nutrient" DROP CONSTRAINT "nutrition_label_nutrient_nutritionLabelId_fkey";

-- DropForeignKey
ALTER TABLE "photo" DROP CONSTRAINT "photo_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "recipe_ingredient" DROP CONSTRAINT "recipe_ingredient_groupId_fkey";

-- DropForeignKey
ALTER TABLE "recipe_ingredient" DROP CONSTRAINT "recipe_ingredient_ingredientId_fkey";

-- DropForeignKey
ALTER TABLE "recipe_ingredient" DROP CONSTRAINT "recipe_ingredient_measurementUnitId_fkey";

-- DropForeignKey
ALTER TABLE "recipe_ingredient" DROP CONSTRAINT "recipe_ingredient_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "recipe_ingredient_group" DROP CONSTRAINT "recipe_ingredient_group_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "shopping_day" DROP CONSTRAINT "shopping_day_mealPlanId_fkey";

-- DropTable
DROP TABLE "category";

-- DropTable
DROP TABLE "course";

-- DropTable
DROP TABLE "cuisine";

-- DropTable
DROP TABLE "daily_reference_intake";

-- DropTable
DROP TABLE "expiration_rule";

-- DropTable
DROP TABLE "health_profile";

-- DropTable
DROP TABLE "import";

-- DropTable
DROP TABLE "import_record";

-- DropTable
DROP TABLE "ingredient";

-- DropTable
DROP TABLE "ingredient_category";

-- DropTable
DROP TABLE "ingredient_price";

-- DropTable
DROP TABLE "meal_plan";

-- DropTable
DROP TABLE "meal_plan_recipe";

-- DropTable
DROP TABLE "meal_plan_serving";

-- DropTable
DROP TABLE "measurement_conversion";

-- DropTable
DROP TABLE "measurement_unit";

-- DropTable
DROP TABLE "nutrient";

-- DropTable
DROP TABLE "nutrient_import_mapping";

-- DropTable
DROP TABLE "nutrition_label";

-- DropTable
DROP TABLE "nutrition_label_nutrient";

-- DropTable
DROP TABLE "photo";

-- DropTable
DROP TABLE "recipe";

-- DropTable
DROP TABLE "recipe_ingredient";

-- DropTable
DROP TABLE "recipe_ingredient_group";

-- DropTable
DROP TABLE "shopping_day";

-- CreateTable
CREATE TABLE "ShoppingDay" (
    "id" TEXT NOT NULL,
    "week" INTEGER NOT NULL,
    "day" INTEGER NOT NULL,
    "mealPlanId" TEXT NOT NULL,

    CONSTRAINT "ShoppingDay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MealPlan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mealPrepInstructions" TEXT,
    "draft" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "MealPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MealPlanServing" (
    "id" TEXT NOT NULL,
    "mealPlanId" TEXT NOT NULL,
    "day" INTEGER NOT NULL,
    "meal" "Meal" NOT NULL,
    "week" INTEGER NOT NULL,
    "mealPlanRecipeId" TEXT NOT NULL,
    "numberOfServings" INTEGER NOT NULL,

    CONSTRAINT "MealPlanServing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MealPlanRecipe" (
    "id" TEXT NOT NULL,
    "mealPlanId" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "factor" DOUBLE PRECISION NOT NULL,
    "totalServings" INTEGER NOT NULL,

    CONSTRAINT "MealPlanRecipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Import" (
    "id" TEXT NOT NULL,
    "fileName" TEXT,
    "fileHash" TEXT,
    "type" "ImportType" NOT NULL,
    "status" "ImportStatus" NOT NULL,
    "storagePath" TEXT NOT NULL,
    "imageMapping" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Import_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImportRecord" (
    "id" TEXT NOT NULL,
    "importId" TEXT NOT NULL,
    "hash" TEXT,
    "externalId" TEXT,
    "name" TEXT NOT NULL,
    "parsedFormat" JSONB NOT NULL,
    "status" "RecordStatus" NOT NULL,
    "verifed" BOOLEAN NOT NULL DEFAULT false,
    "recipeId" TEXT,
    "nutritionLabelId" TEXT,
    "draftId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ImportRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecipeIngredient" (
    "id" TEXT NOT NULL,
    "sentence" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION,
    "name" TEXT,
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
    "recipeId" TEXT NOT NULL,

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
    "type" "EntityType" NOT NULL DEFAULT 'RECIPE',
    "name" TEXT NOT NULL,
    "source" TEXT,
    "preparationTime" INTEGER,
    "cookingTime" INTEGER,
    "marinadeTime" INTEGER,
    "totalTime" INTEGER,
    "directions" TEXT,
    "notes" TEXT,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
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
    "type" "EntityType" NOT NULL DEFAULT 'LABEL',
    "recipeId" TEXT NOT NULL,
    "ingredientGroupId" TEXT,
    "name" TEXT,
    "verifed" BOOLEAN NOT NULL DEFAULT false,
    "servings" DOUBLE PRECISION,
    "servingSize" DOUBLE PRECISION,
    "unitId" TEXT,
    "servingsUsed" DOUBLE PRECISION,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "NutritionLabel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NutritionLabelNutrient" (
    "nutritionLabelId" TEXT NOT NULL,
    "nutrientId" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,

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
    "order" INTEGER NOT NULL,
    "unitId" TEXT NOT NULL,

    CONSTRAINT "Nutrient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NutrientImportMapping" (
    "id" TEXT NOT NULL,
    "importType" "ImportType" NOT NULL,
    "nutrientId" TEXT NOT NULL,
    "lookupName" TEXT NOT NULL,

    CONSTRAINT "NutrientImportMapping_pkey" PRIMARY KEY ("id")
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
    "weight" DOUBLE PRECISION,
    "gender" "Gender" NOT NULL,
    "bodyFatPercentage" DOUBLE PRECISION,
    "height" DOUBLE PRECISION,
    "yearBorn" INTEGER NOT NULL,
    "activityLevel" DOUBLE PRECISION,
    "specialCondition" "SpecialCondition" NOT NULL,
    "targetProteinPercentage" DOUBLE PRECISION,
    "targetProteinGrams" DOUBLE PRECISION,
    "targetCarbsPercentage" DOUBLE PRECISION,
    "targetCarbsGrams" DOUBLE PRECISION,
    "targetFatPercentage" DOUBLE PRECISION,
    "targetFatGrams" DOUBLE PRECISION,

    CONSTRAINT "HealthProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MealPlanServing_mealPlanId_day_meal_mealPlanRecipeId_key" ON "MealPlanServing"("mealPlanId", "day", "meal", "mealPlanRecipeId");

-- CreateIndex
CREATE UNIQUE INDEX "MeasurementUnit_name_key" ON "MeasurementUnit"("name");

-- CreateIndex
CREATE UNIQUE INDEX "RecipeIngredientGroup_recipeId_name_key" ON "RecipeIngredientGroup"("recipeId", "name");

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
CREATE UNIQUE INDEX "NutritionLabel_recipeId_ingredientGroupId_key" ON "NutritionLabel"("recipeId", "ingredientGroupId");

-- CreateIndex
CREATE UNIQUE INDEX "Nutrient_name_key" ON "Nutrient"("name");

-- AddForeignKey
ALTER TABLE "ShoppingDay" ADD CONSTRAINT "ShoppingDay_mealPlanId_fkey" FOREIGN KEY ("mealPlanId") REFERENCES "MealPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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
ALTER TABLE "ImportRecord" ADD CONSTRAINT "ImportRecord_nutritionLabelId_fkey" FOREIGN KEY ("nutritionLabelId") REFERENCES "NutritionLabel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeIngredient" ADD CONSTRAINT "RecipeIngredient_measurementUnitId_fkey" FOREIGN KEY ("measurementUnitId") REFERENCES "MeasurementUnit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeIngredient" ADD CONSTRAINT "RecipeIngredient_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeIngredient" ADD CONSTRAINT "RecipeIngredient_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredient"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeIngredient" ADD CONSTRAINT "RecipeIngredient_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "RecipeIngredientGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeIngredientGroup" ADD CONSTRAINT "RecipeIngredientGroup_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

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
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NutritionLabel" ADD CONSTRAINT "NutritionLabel_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NutritionLabel" ADD CONSTRAINT "NutritionLabel_ingredientGroupId_fkey" FOREIGN KEY ("ingredientGroupId") REFERENCES "RecipeIngredientGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NutritionLabel" ADD CONSTRAINT "NutritionLabel_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "MeasurementUnit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NutritionLabelNutrient" ADD CONSTRAINT "NutritionLabelNutrient_nutritionLabelId_fkey" FOREIGN KEY ("nutritionLabelId") REFERENCES "NutritionLabel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NutritionLabelNutrient" ADD CONSTRAINT "NutritionLabelNutrient_nutrientId_fkey" FOREIGN KEY ("nutrientId") REFERENCES "Nutrient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nutrient" ADD CONSTRAINT "Nutrient_parentNutrientId_fkey" FOREIGN KEY ("parentNutrientId") REFERENCES "Nutrient"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nutrient" ADD CONSTRAINT "Nutrient_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "MeasurementUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NutrientImportMapping" ADD CONSTRAINT "NutrientImportMapping_nutrientId_fkey" FOREIGN KEY ("nutrientId") REFERENCES "Nutrient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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

-- AddForeignKey
ALTER TABLE "_CuisineToRecipe" ADD CONSTRAINT "_CuisineToRecipe_A_fkey" FOREIGN KEY ("A") REFERENCES "Cuisine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CuisineToRecipe" ADD CONSTRAINT "_CuisineToRecipe_B_fkey" FOREIGN KEY ("B") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
