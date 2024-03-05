/*
  Warnings:

  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Course` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Cuisine` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DailyReferenceIntake` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ExpirationRule` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `HealthProfile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Import` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ImportRecord` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Ingredient` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `IngredientCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `IngredientPrice` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MealPlan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MealPlanRecipe` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MealPlanServing` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MeasurementConversion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MeasurementUnit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Nutrient` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `NutrientMapping` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `NutritionLabel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `NutritionLabelNutrient` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Photo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Recipe` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RecipeIngredient` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RecipeIngredientGroup` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ShoppingDay` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DailyReferenceIntake" DROP CONSTRAINT "DailyReferenceIntake_nutrientId_fkey";

-- DropForeignKey
ALTER TABLE "ImportRecord" DROP CONSTRAINT "ImportRecord_importId_fkey";

-- DropForeignKey
ALTER TABLE "ImportRecord" DROP CONSTRAINT "ImportRecord_nutritionLabelId_fkey";

-- DropForeignKey
ALTER TABLE "ImportRecord" DROP CONSTRAINT "ImportRecord_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "Ingredient" DROP CONSTRAINT "Ingredient_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Ingredient" DROP CONSTRAINT "Ingredient_expirationRuleId_fkey";

-- DropForeignKey
ALTER TABLE "IngredientPrice" DROP CONSTRAINT "IngredientPrice_ingredientId_fkey";

-- DropForeignKey
ALTER TABLE "IngredientPrice" DROP CONSTRAINT "IngredientPrice_unitId_fkey";

-- DropForeignKey
ALTER TABLE "MealPlanRecipe" DROP CONSTRAINT "MealPlanRecipe_mealPlanId_fkey";

-- DropForeignKey
ALTER TABLE "MealPlanRecipe" DROP CONSTRAINT "MealPlanRecipe_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "MealPlanServing" DROP CONSTRAINT "MealPlanServing_mealPlanId_fkey";

-- DropForeignKey
ALTER TABLE "MealPlanServing" DROP CONSTRAINT "MealPlanServing_mealPlanRecipeId_fkey";

-- DropForeignKey
ALTER TABLE "MeasurementConversion" DROP CONSTRAINT "MeasurementConversion_fromUnitId_fkey";

-- DropForeignKey
ALTER TABLE "MeasurementConversion" DROP CONSTRAINT "MeasurementConversion_ingredientId_fkey";

-- DropForeignKey
ALTER TABLE "MeasurementConversion" DROP CONSTRAINT "MeasurementConversion_toUnitId_fkey";

-- DropForeignKey
ALTER TABLE "Nutrient" DROP CONSTRAINT "Nutrient_parentNutrientId_fkey";

-- DropForeignKey
ALTER TABLE "Nutrient" DROP CONSTRAINT "Nutrient_unitId_fkey";

-- DropForeignKey
ALTER TABLE "NutrientMapping" DROP CONSTRAINT "NutrientMapping_nutrientId_fkey";

-- DropForeignKey
ALTER TABLE "NutritionLabel" DROP CONSTRAINT "NutritionLabel_ingredientGroupId_fkey";

-- DropForeignKey
ALTER TABLE "NutritionLabel" DROP CONSTRAINT "NutritionLabel_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "NutritionLabel" DROP CONSTRAINT "NutritionLabel_unitId_fkey";

-- DropForeignKey
ALTER TABLE "NutritionLabelNutrient" DROP CONSTRAINT "NutritionLabelNutrient_nutrientId_fkey";

-- DropForeignKey
ALTER TABLE "NutritionLabelNutrient" DROP CONSTRAINT "NutritionLabelNutrient_nutritionLabelId_fkey";

-- DropForeignKey
ALTER TABLE "Photo" DROP CONSTRAINT "Photo_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "Recipe" DROP CONSTRAINT "Recipe_cuisineId_fkey";

-- DropForeignKey
ALTER TABLE "RecipeIngredient" DROP CONSTRAINT "RecipeIngredient_groupId_fkey";

-- DropForeignKey
ALTER TABLE "RecipeIngredient" DROP CONSTRAINT "RecipeIngredient_ingredientId_fkey";

-- DropForeignKey
ALTER TABLE "RecipeIngredient" DROP CONSTRAINT "RecipeIngredient_measurementUnitId_fkey";

-- DropForeignKey
ALTER TABLE "RecipeIngredient" DROP CONSTRAINT "RecipeIngredient_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "ShoppingDay" DROP CONSTRAINT "ShoppingDay_mealPlanId_fkey";

-- DropForeignKey
ALTER TABLE "_CategoryToRecipe" DROP CONSTRAINT "_CategoryToRecipe_A_fkey";

-- DropForeignKey
ALTER TABLE "_CategoryToRecipe" DROP CONSTRAINT "_CategoryToRecipe_B_fkey";

-- DropForeignKey
ALTER TABLE "_CourseToRecipe" DROP CONSTRAINT "_CourseToRecipe_A_fkey";

-- DropForeignKey
ALTER TABLE "_CourseToRecipe" DROP CONSTRAINT "_CourseToRecipe_B_fkey";

-- DropTable
DROP TABLE "Category";

-- DropTable
DROP TABLE "Course";

-- DropTable
DROP TABLE "Cuisine";

-- DropTable
DROP TABLE "DailyReferenceIntake";

-- DropTable
DROP TABLE "ExpirationRule";

-- DropTable
DROP TABLE "HealthProfile";

-- DropTable
DROP TABLE "Import";

-- DropTable
DROP TABLE "ImportRecord";

-- DropTable
DROP TABLE "Ingredient";

-- DropTable
DROP TABLE "IngredientCategory";

-- DropTable
DROP TABLE "IngredientPrice";

-- DropTable
DROP TABLE "MealPlan";

-- DropTable
DROP TABLE "MealPlanRecipe";

-- DropTable
DROP TABLE "MealPlanServing";

-- DropTable
DROP TABLE "MeasurementConversion";

-- DropTable
DROP TABLE "MeasurementUnit";

-- DropTable
DROP TABLE "Nutrient";

-- DropTable
DROP TABLE "NutrientMapping";

-- DropTable
DROP TABLE "NutritionLabel";

-- DropTable
DROP TABLE "NutritionLabelNutrient";

-- DropTable
DROP TABLE "Photo";

-- DropTable
DROP TABLE "Recipe";

-- DropTable
DROP TABLE "RecipeIngredient";

-- DropTable
DROP TABLE "RecipeIngredientGroup";

-- DropTable
DROP TABLE "ShoppingDay";

-- CreateTable
CREATE TABLE "shopping_day" (
    "id" TEXT NOT NULL,
    "week" INTEGER NOT NULL,
    "day" INTEGER NOT NULL,
    "mealPlanId" TEXT NOT NULL,

    CONSTRAINT "shopping_day_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meal_plan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mealPrepInstructions" TEXT,
    "draft" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "meal_plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meal_plan_serving" (
    "id" TEXT NOT NULL,
    "mealPlanId" TEXT NOT NULL,
    "day" INTEGER NOT NULL,
    "meal" "Meal" NOT NULL,
    "week" INTEGER NOT NULL,
    "mealPlanRecipeId" TEXT NOT NULL,
    "numberOfServings" INTEGER NOT NULL,

    CONSTRAINT "meal_plan_serving_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meal_plan_recipe" (
    "id" TEXT NOT NULL,
    "mealPlanId" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "factor" DOUBLE PRECISION NOT NULL,
    "totalServings" INTEGER NOT NULL,

    CONSTRAINT "meal_plan_recipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "import" (
    "id" TEXT NOT NULL,
    "fileName" TEXT,
    "fileHash" TEXT,
    "type" "ImportType" NOT NULL,
    "status" "ImportStatus" NOT NULL,
    "storagePath" TEXT NOT NULL,
    "imageMapping" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "import_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "import_record" (
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

    CONSTRAINT "import_record_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recipe_ingredient" (
    "id" TEXT NOT NULL,
    "sentence" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION,
    "name" TEXT,
    "comment" TEXT,
    "other" TEXT,
    "order" INTEGER NOT NULL,
    "measurementUnitId" TEXT,
    "recipeId" TEXT NOT NULL,
    "ingredientId" TEXT,
    "groupId" TEXT,

    CONSTRAINT "recipe_ingredient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "measurement_unit" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "abbreviations" TEXT[],
    "symbol" TEXT,
    "type" "UnitType",

    CONSTRAINT "measurement_unit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recipe_ingredient_group" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "servings" INTEGER,
    "servingsInRecipe" INTEGER,

    CONSTRAINT "recipe_ingredient_group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ingredient" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "alternateNames" TEXT[],
    "variant" TEXT,
    "categoryId" TEXT,
    "storageInstructions" TEXT,
    "expirationRuleId" TEXT,

    CONSTRAINT "ingredient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "measurement_conversion" (
    "id" TEXT NOT NULL,
    "fromUnitId" TEXT NOT NULL,
    "toUnitId" TEXT NOT NULL,
    "conversionRatio" DOUBLE PRECISION NOT NULL,
    "ingredientId" TEXT,

    CONSTRAINT "measurement_conversion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ingredient_category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ingredient_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expiration_rule" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "variant" TEXT,
    "defrostTime" INTEGER,
    "perishable" BOOLEAN,
    "tableLife" INTEGER,
    "fridgeLife" INTEGER,
    "freezerLife" INTEGER,

    CONSTRAINT "expiration_rule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ingredient_price" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "retailer" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "pricePerUnit" DOUBLE PRECISION NOT NULL,
    "ingredientId" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,

    CONSTRAINT "ingredient_price_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recipe" (
    "id" TEXT NOT NULL,
    "type" "EntityType" NOT NULL DEFAULT 'RECIPE',
    "title" TEXT NOT NULL,
    "source" TEXT,
    "preparationTime" INTEGER,
    "cookingTime" INTEGER,
    "marinadeTime" INTEGER,
    "totalTime" INTEGER,
    "directions" TEXT,
    "notes" TEXT,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "cuisineId" TEXT,
    "importId" TEXT,
    "leftoverFridgeLife" INTEGER,
    "leftoverFreezerLife" INTEGER,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "nutrientMapping" JSONB,

    CONSTRAINT "recipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cuisine" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "cuisine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "photo" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "hash" TEXT NOT NULL,
    "recipeId" TEXT,

    CONSTRAINT "photo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nutrition_label" (
    "id" TEXT NOT NULL,
    "type" "EntityType" NOT NULL DEFAULT 'LABEL',
    "recipeId" TEXT,
    "ingredientGroupId" TEXT,
    "name" TEXT,
    "verifed" BOOLEAN NOT NULL DEFAULT false,
    "servings" DOUBLE PRECISION,
    "servingSize" DOUBLE PRECISION,
    "unitId" TEXT,
    "servingsUsed" DOUBLE PRECISION,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "nutrientMapping" JSONB,

    CONSTRAINT "nutrition_label_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nutrition_label_nutrient" (
    "nutritionLabelId" TEXT NOT NULL,
    "nutrientId" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "nutrition_label_nutrient_pkey" PRIMARY KEY ("nutritionLabelId","nutrientId")
);

-- CreateTable
CREATE TABLE "nutrient" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "alternateNames" TEXT[],
    "type" "NutrientType" NOT NULL,
    "advancedView" BOOLEAN NOT NULL,
    "customTarget" DOUBLE PRECISION,
    "parentNutrientId" TEXT,
    "order" INTEGER NOT NULL,
    "unitId" TEXT NOT NULL,

    CONSTRAINT "nutrient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nutrient_import_mapping" (
    "id" TEXT NOT NULL,
    "importType" "ImportType" NOT NULL,
    "nutrientId" TEXT NOT NULL,
    "lookupName" TEXT NOT NULL,

    CONSTRAINT "nutrient_import_mapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_reference_intake" (
    "id" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "gender" "Gender" NOT NULL,
    "ageMin" INTEGER NOT NULL,
    "ageMax" INTEGER NOT NULL,
    "specialCondition" "SpecialCondition" NOT NULL,
    "nutrientId" TEXT NOT NULL,

    CONSTRAINT "daily_reference_intake_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "health_profile" (
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

    CONSTRAINT "health_profile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "meal_plan_serving_mealPlanId_day_meal_mealPlanRecipeId_key" ON "meal_plan_serving"("mealPlanId", "day", "meal", "mealPlanRecipeId");

-- CreateIndex
CREATE UNIQUE INDEX "measurement_unit_name_key" ON "measurement_unit"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ingredient_name_key" ON "ingredient"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ingredient_category_name_key" ON "ingredient_category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "course_name_key" ON "course"("name");

-- CreateIndex
CREATE UNIQUE INDEX "category_name_key" ON "category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "cuisine_name_key" ON "cuisine"("name");

-- CreateIndex
CREATE UNIQUE INDEX "photo_hash_key" ON "photo"("hash");

-- CreateIndex
CREATE UNIQUE INDEX "nutrition_label_ingredientGroupId_key" ON "nutrition_label"("ingredientGroupId");

-- CreateIndex
CREATE UNIQUE INDEX "nutrition_label_recipeId_ingredientGroupId_key" ON "nutrition_label"("recipeId", "ingredientGroupId");

-- CreateIndex
CREATE UNIQUE INDEX "nutrient_name_key" ON "nutrient"("name");

-- AddForeignKey
ALTER TABLE "shopping_day" ADD CONSTRAINT "shopping_day_mealPlanId_fkey" FOREIGN KEY ("mealPlanId") REFERENCES "meal_plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meal_plan_serving" ADD CONSTRAINT "meal_plan_serving_mealPlanId_fkey" FOREIGN KEY ("mealPlanId") REFERENCES "meal_plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meal_plan_serving" ADD CONSTRAINT "meal_plan_serving_mealPlanRecipeId_fkey" FOREIGN KEY ("mealPlanRecipeId") REFERENCES "meal_plan_recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meal_plan_recipe" ADD CONSTRAINT "meal_plan_recipe_mealPlanId_fkey" FOREIGN KEY ("mealPlanId") REFERENCES "meal_plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meal_plan_recipe" ADD CONSTRAINT "meal_plan_recipe_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "import_record" ADD CONSTRAINT "import_record_importId_fkey" FOREIGN KEY ("importId") REFERENCES "import"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "import_record" ADD CONSTRAINT "import_record_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipe"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "import_record" ADD CONSTRAINT "import_record_nutritionLabelId_fkey" FOREIGN KEY ("nutritionLabelId") REFERENCES "nutrition_label"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_ingredient" ADD CONSTRAINT "recipe_ingredient_measurementUnitId_fkey" FOREIGN KEY ("measurementUnitId") REFERENCES "measurement_unit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_ingredient" ADD CONSTRAINT "recipe_ingredient_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_ingredient" ADD CONSTRAINT "recipe_ingredient_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "ingredient"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_ingredient" ADD CONSTRAINT "recipe_ingredient_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "recipe_ingredient_group"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingredient" ADD CONSTRAINT "ingredient_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ingredient_category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingredient" ADD CONSTRAINT "ingredient_expirationRuleId_fkey" FOREIGN KEY ("expirationRuleId") REFERENCES "expiration_rule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "measurement_conversion" ADD CONSTRAINT "measurement_conversion_fromUnitId_fkey" FOREIGN KEY ("fromUnitId") REFERENCES "measurement_unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "measurement_conversion" ADD CONSTRAINT "measurement_conversion_toUnitId_fkey" FOREIGN KEY ("toUnitId") REFERENCES "measurement_unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "measurement_conversion" ADD CONSTRAINT "measurement_conversion_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "ingredient"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingredient_price" ADD CONSTRAINT "ingredient_price_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "ingredient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingredient_price" ADD CONSTRAINT "ingredient_price_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "measurement_unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe" ADD CONSTRAINT "recipe_cuisineId_fkey" FOREIGN KEY ("cuisineId") REFERENCES "cuisine"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "photo" ADD CONSTRAINT "photo_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipe"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nutrition_label" ADD CONSTRAINT "nutrition_label_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nutrition_label" ADD CONSTRAINT "nutrition_label_ingredientGroupId_fkey" FOREIGN KEY ("ingredientGroupId") REFERENCES "recipe_ingredient_group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nutrition_label" ADD CONSTRAINT "nutrition_label_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "measurement_unit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nutrition_label_nutrient" ADD CONSTRAINT "nutrition_label_nutrient_nutritionLabelId_fkey" FOREIGN KEY ("nutritionLabelId") REFERENCES "nutrition_label"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nutrition_label_nutrient" ADD CONSTRAINT "nutrition_label_nutrient_nutrientId_fkey" FOREIGN KEY ("nutrientId") REFERENCES "nutrient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nutrient" ADD CONSTRAINT "nutrient_parentNutrientId_fkey" FOREIGN KEY ("parentNutrientId") REFERENCES "nutrient"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nutrient" ADD CONSTRAINT "nutrient_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "measurement_unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nutrient_import_mapping" ADD CONSTRAINT "nutrient_import_mapping_nutrientId_fkey" FOREIGN KEY ("nutrientId") REFERENCES "nutrient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_reference_intake" ADD CONSTRAINT "daily_reference_intake_nutrientId_fkey" FOREIGN KEY ("nutrientId") REFERENCES "nutrient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToRecipe" ADD CONSTRAINT "_CourseToRecipe_A_fkey" FOREIGN KEY ("A") REFERENCES "course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToRecipe" ADD CONSTRAINT "_CourseToRecipe_B_fkey" FOREIGN KEY ("B") REFERENCES "recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToRecipe" ADD CONSTRAINT "_CategoryToRecipe_A_fkey" FOREIGN KEY ("A") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToRecipe" ADD CONSTRAINT "_CategoryToRecipe_B_fkey" FOREIGN KEY ("B") REFERENCES "recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
