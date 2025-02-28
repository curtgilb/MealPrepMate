-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- CreateEnum
CREATE TYPE "ImportType" AS ENUM ('MY_FITNESS_PAL', 'RECIPE_KEEPER', 'CRONOMETER', 'DRI', 'WEB');

-- CreateEnum
CREATE TYPE "NutrientType" AS ENUM ('CARBOHYDRATE', 'FAT', 'PROTEIN', 'ALCOHOL', 'MINERAL', 'VITAMIN', 'OTHER', 'GENERAL');

-- CreateEnum
CREATE TYPE "UnitType" AS ENUM ('VOLUME', 'WEIGHT', 'COUNT', 'ENERGY', 'LENGTH');

-- CreateEnum
CREATE TYPE "Meal" AS ENUM ('BREAKFAST', 'LUNCH', 'DINNER', 'SNACK');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('CREATED', 'DELIVERED', 'SCHEDULED', 'CANCELED');

-- CreateEnum
CREATE TYPE "ImportStatus" AS ENUM ('PENDING', 'REVIEW', 'DUPLICATE', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "RecordStatus" AS ENUM ('IMPORTED', 'DUPLICATE', 'UPDATED', 'IGNORED', 'FAILED');

-- CreateEnum
CREATE TYPE "MeasurementSystem" AS ENUM ('IMPERIAL', 'METRIC');

-- CreateEnum
CREATE TYPE "FoodType" AS ENUM ('FROZEN', 'CANNED', 'PACKAGED', 'FRESH');

-- CreateEnum
CREATE TYPE "EntityType" AS ENUM ('RECIPE', 'LABEL');

-- CreateEnum
CREATE TYPE "TargetPreference" AS ENUM ('OVER', 'UNDER', 'NONE');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "SpecialCondition" AS ENUM ('PREGNANT', 'LACTATING', 'NONE');

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "deliveryDate" TIMESTAMP(3) NOT NULL,
    "message" TEXT NOT NULL,
    "status" "NotificationStatus" NOT NULL,
    "scheduleId" TEXT NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScheduledPlan" (
    "id" TEXT NOT NULL,
    "startDate" DATE NOT NULL,
    "duration" INTEGER NOT NULL,
    "mealPlanId" TEXT NOT NULL,
    "recipes" JSONB NOT NULL,
    "shoppingDays" INTEGER[],

    CONSTRAINT "ScheduledPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MealPlan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mealPrepInstructions" TEXT,
    "numOfWeeks" INTEGER NOT NULL DEFAULT 1,
    "startDay" INTEGER,
    "endDay" INTEGER,
    "shoppingDays" INTEGER[],
    "draft" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "MealPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationSetting" (
    "id" TEXT NOT NULL,
    "timeZone" TEXT NOT NULL,
    "defrostWarning" BOOLEAN NOT NULL DEFAULT true,
    "defrostWarningTime" INTEGER NOT NULL DEFAULT 19,
    "leftoverExpiration" BOOLEAN NOT NULL DEFAULT true,
    "leftoverTime" INTEGER NOT NULL DEFAULT 8,
    "mealReminder" BOOLEAN NOT NULL DEFAULT true,
    "mealTime" INTEGER NOT NULL DEFAULT 8,
    "shoppingReminder" BOOLEAN NOT NULL DEFAULT true,
    "shoppingTime" INTEGER NOT NULL DEFAULT 9,

    CONSTRAINT "NotificationSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MealPlanServing" (
    "id" TEXT NOT NULL,
    "mealPlanId" TEXT NOT NULL,
    "day" INTEGER NOT NULL,
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
    "factor" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "totalServings" INTEGER NOT NULL,
    "cookDayOffset" INTEGER NOT NULL DEFAULT 0,

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
CREATE TABLE "ImportItem" (
    "id" TEXT NOT NULL,
    "importId" TEXT NOT NULL,
    "hash" TEXT,
    "externalId" TEXT,
    "name" TEXT NOT NULL,
    "parsedFormat" JSONB NOT NULL,
    "status" "RecordStatus" NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "recipeId" TEXT,
    "nutritionLabelId" TEXT,
    "ingredientGroupId" TEXT,
    "draftId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ImportItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImportDraft" (
    "id" TEXT NOT NULL,
    "draftId" TEXT NOT NULL,
    "type" "EntityType" NOT NULL,

    CONSTRAINT "ImportDraft_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecipeIngredient" (
    "id" TEXT NOT NULL,
    "sentence" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION,
    "minQty" DOUBLE PRECISION,
    "maxQty" DOUBLE PRECISION,
    "name" TEXT,
    "order" INTEGER NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
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
    "conversionName" TEXT,
    "abbreviations" TEXT[],
    "symbol" TEXT,
    "type" "UnitType",
    "system" "MeasurementSystem",

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
    "groceryStoreId" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "size" DOUBLE PRECISION NOT NULL,
    "foodType" "FoodType",
    "pricePerUnit" DOUBLE PRECISION NOT NULL,
    "ingredientId" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "receiptLineId" TEXT,

    CONSTRAINT "IngredientPrice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroceryStore" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "GroceryStore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Receipt" (
    "id" TEXT NOT NULL,
    "merchantName" TEXT,
    "storeId" TEXT,
    "total" DOUBLE PRECISION,
    "transactionDate" TIMESTAMP(3),
    "hash" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "scanned" BOOLEAN NOT NULL DEFAULT false,
    "verified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Receipt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReceiptLine" (
    "id" TEXT NOT NULL,
    "totalPrice" DOUBLE PRECISION,
    "description" TEXT,
    "quantity" DOUBLE PRECISION,
    "perUnitPrice" DOUBLE PRECISION,
    "productCode" TEXT,
    "unitQuantity" TEXT,
    "receiptId" TEXT NOT NULL,
    "unitId" TEXT,
    "foodType" "FoodType",
    "ingredientId" TEXT,
    "boundingBoxes" JSONB,
    "order" INTEGER NOT NULL,

    CONSTRAINT "ReceiptLine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebScrapedRecipe" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "isBookmark" BOOLEAN NOT NULL DEFAULT false,
    "scraped" BOOLEAN NOT NULL DEFAULT false,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "recipeId" TEXT,

    CONSTRAINT "WebScrapedRecipe_pkey" PRIMARY KEY ("id")
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
    "ingredientsTxt" TEXT,
    "directions" TEXT,
    "notes" TEXT,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "importId" TEXT,
    "leftoverFridgeLife" INTEGER,
    "leftoverFreezerLife" INTEGER,
    "verified" BOOLEAN NOT NULL DEFAULT false,

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
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "servings" DOUBLE PRECISION,
    "servingSize" DOUBLE PRECISION,
    "unitId" TEXT,
    "servingsUsed" DOUBLE PRECISION,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NutritionLabel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AggregateLabel" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "servings" DOUBLE PRECISION,
    "servingSize" DOUBLE PRECISION,
    "unitId" TEXT,
    "protein" DOUBLE PRECISION,
    "carbs" DOUBLE PRECISION,
    "fat" DOUBLE PRECISION,
    "alcohol" DOUBLE PRECISION,
    "totalCalories" DOUBLE PRECISION,
    "caloriesPerServing" DOUBLE PRECISION,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AggregateLabel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NutritionLabelNutrient" (
    "nutritionLabelId" TEXT NOT NULL,
    "nutrientId" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "NutritionLabelNutrient_pkey" PRIMARY KEY ("nutritionLabelId","nutrientId")
);

-- CreateTable
CREATE TABLE "AggLabelNutrient" (
    "aggLabelId" TEXT NOT NULL,
    "nutrientId" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "valuePerServing" DOUBLE PRECISION,

    CONSTRAINT "AggLabelNutrient_pkey" PRIMARY KEY ("aggLabelId","nutrientId")
);

-- CreateTable
CREATE TABLE "Nutrient" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isMacro" BOOLEAN NOT NULL,
    "alternateNames" TEXT[],
    "type" "NutrientType" NOT NULL,
    "advancedView" BOOLEAN NOT NULL,
    "important" BOOLEAN NOT NULL DEFAULT false,
    "parentNutrientId" TEXT,
    "order" INTEGER NOT NULL,
    "unitId" TEXT NOT NULL,

    CONSTRAINT "Nutrient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RankedNutrient" (
    "id" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "nutrientId" TEXT NOT NULL,

    CONSTRAINT "RankedNutrient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NutrientTarget" (
    "id" TEXT NOT NULL,
    "targetValue" DOUBLE PRECISION NOT NULL,
    "preference" "TargetPreference" NOT NULL,
    "threshold" DOUBLE PRECISION,
    "nutrientId" TEXT NOT NULL,

    CONSTRAINT "NutrientTarget_pkey" PRIMARY KEY ("id")
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
    "upperLimit" DOUBLE PRECISION,
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

-- CreateTable
CREATE TABLE "_CuisineToRecipe" (
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
CREATE UNIQUE INDEX "IngredientPrice_receiptLineId_key" ON "IngredientPrice"("receiptLineId");

-- CreateIndex
CREATE UNIQUE INDEX "GroceryStore_name_key" ON "GroceryStore"("name");

-- CreateIndex
CREATE UNIQUE INDEX "WebScrapedRecipe_recipeId_key" ON "WebScrapedRecipe"("recipeId");

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
CREATE UNIQUE INDEX "AggregateLabel_recipeId_key" ON "AggregateLabel"("recipeId");

-- CreateIndex
CREATE UNIQUE INDEX "Nutrient_name_key" ON "Nutrient"("name");

-- CreateIndex
CREATE UNIQUE INDEX "RankedNutrient_nutrientId_key" ON "RankedNutrient"("nutrientId");

-- CreateIndex
CREATE UNIQUE INDEX "NutrientTarget_nutrientId_key" ON "NutrientTarget"("nutrientId");

-- CreateIndex
CREATE UNIQUE INDEX "_CourseToRecipe_AB_unique" ON "_CourseToRecipe"("A", "B");

-- CreateIndex
CREATE INDEX "_CourseToRecipe_B_index" ON "_CourseToRecipe"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToRecipe_AB_unique" ON "_CategoryToRecipe"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToRecipe_B_index" ON "_CategoryToRecipe"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CuisineToRecipe_AB_unique" ON "_CuisineToRecipe"("A", "B");

-- CreateIndex
CREATE INDEX "_CuisineToRecipe_B_index" ON "_CuisineToRecipe"("B");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "ScheduledPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduledPlan" ADD CONSTRAINT "ScheduledPlan_mealPlanId_fkey" FOREIGN KEY ("mealPlanId") REFERENCES "MealPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealPlanServing" ADD CONSTRAINT "MealPlanServing_mealPlanId_fkey" FOREIGN KEY ("mealPlanId") REFERENCES "MealPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealPlanServing" ADD CONSTRAINT "MealPlanServing_mealPlanRecipeId_fkey" FOREIGN KEY ("mealPlanRecipeId") REFERENCES "MealPlanRecipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealPlanRecipe" ADD CONSTRAINT "MealPlanRecipe_mealPlanId_fkey" FOREIGN KEY ("mealPlanId") REFERENCES "MealPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealPlanRecipe" ADD CONSTRAINT "MealPlanRecipe_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImportItem" ADD CONSTRAINT "ImportItem_importId_fkey" FOREIGN KEY ("importId") REFERENCES "Import"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImportItem" ADD CONSTRAINT "ImportItem_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImportItem" ADD CONSTRAINT "ImportItem_nutritionLabelId_fkey" FOREIGN KEY ("nutritionLabelId") REFERENCES "NutritionLabel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImportItem" ADD CONSTRAINT "ImportItem_ingredientGroupId_fkey" FOREIGN KEY ("ingredientGroupId") REFERENCES "RecipeIngredientGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

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
ALTER TABLE "IngredientPrice" ADD CONSTRAINT "IngredientPrice_groceryStoreId_fkey" FOREIGN KEY ("groceryStoreId") REFERENCES "GroceryStore"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IngredientPrice" ADD CONSTRAINT "IngredientPrice_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IngredientPrice" ADD CONSTRAINT "IngredientPrice_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "MeasurementUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IngredientPrice" ADD CONSTRAINT "IngredientPrice_receiptLineId_fkey" FOREIGN KEY ("receiptLineId") REFERENCES "ReceiptLine"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receipt" ADD CONSTRAINT "Receipt_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "GroceryStore"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReceiptLine" ADD CONSTRAINT "ReceiptLine_receiptId_fkey" FOREIGN KEY ("receiptId") REFERENCES "Receipt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReceiptLine" ADD CONSTRAINT "ReceiptLine_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "MeasurementUnit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReceiptLine" ADD CONSTRAINT "ReceiptLine_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredient"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WebScrapedRecipe" ADD CONSTRAINT "WebScrapedRecipe_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NutritionLabel" ADD CONSTRAINT "NutritionLabel_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NutritionLabel" ADD CONSTRAINT "NutritionLabel_ingredientGroupId_fkey" FOREIGN KEY ("ingredientGroupId") REFERENCES "RecipeIngredientGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NutritionLabel" ADD CONSTRAINT "NutritionLabel_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "MeasurementUnit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AggregateLabel" ADD CONSTRAINT "AggregateLabel_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AggregateLabel" ADD CONSTRAINT "AggregateLabel_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "MeasurementUnit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NutritionLabelNutrient" ADD CONSTRAINT "NutritionLabelNutrient_nutritionLabelId_fkey" FOREIGN KEY ("nutritionLabelId") REFERENCES "NutritionLabel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NutritionLabelNutrient" ADD CONSTRAINT "NutritionLabelNutrient_nutrientId_fkey" FOREIGN KEY ("nutrientId") REFERENCES "Nutrient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AggLabelNutrient" ADD CONSTRAINT "AggLabelNutrient_aggLabelId_fkey" FOREIGN KEY ("aggLabelId") REFERENCES "AggregateLabel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AggLabelNutrient" ADD CONSTRAINT "AggLabelNutrient_nutrientId_fkey" FOREIGN KEY ("nutrientId") REFERENCES "Nutrient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nutrient" ADD CONSTRAINT "Nutrient_parentNutrientId_fkey" FOREIGN KEY ("parentNutrientId") REFERENCES "Nutrient"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nutrient" ADD CONSTRAINT "Nutrient_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "MeasurementUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RankedNutrient" ADD CONSTRAINT "RankedNutrient_nutrientId_fkey" FOREIGN KEY ("nutrientId") REFERENCES "Nutrient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NutrientTarget" ADD CONSTRAINT "NutrientTarget_nutrientId_fkey" FOREIGN KEY ("nutrientId") REFERENCES "Nutrient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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
