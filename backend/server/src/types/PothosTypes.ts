/* eslint-disable */
import type { Prisma, Notification, ScheduledPlan, MealPlan, NotificationSetting, MealPlanServing, MealPlanRecipe, Import, ImportItem, ImportDraft, RecipeIngredient, MeasurementUnit, RecipeIngredientGroup, Ingredient, MeasurementConversion, IngredientCategory, ExpirationRule, IngredientPrice, GroceryStore, Receipt, ReceiptLine, WebScrapedRecipe, Recipe, Course, Category, Cuisine, Photo, NutritionLabel, AggregateLabel, NutritionLabelNutrient, AggLabelNutrient, Nutrient, NutrientImportMapping, DailyReferenceIntake, HealthProfile } from "@prisma/client";
export default interface PrismaTypes {
    Notification: {
        Name: "Notification";
        Shape: Notification;
        Include: Prisma.NotificationInclude;
        Select: Prisma.NotificationSelect;
        OrderBy: Prisma.NotificationOrderByWithRelationInput;
        WhereUnique: Prisma.NotificationWhereUniqueInput;
        Where: Prisma.NotificationWhereInput;
        Create: {};
        Update: {};
        RelationName: "schedule";
        ListRelations: never;
        Relations: {
            schedule: {
                Shape: ScheduledPlan;
                Name: "ScheduledPlan";
                Nullable: false;
            };
        };
    };
    ScheduledPlan: {
        Name: "ScheduledPlan";
        Shape: ScheduledPlan;
        Include: Prisma.ScheduledPlanInclude;
        Select: Prisma.ScheduledPlanSelect;
        OrderBy: Prisma.ScheduledPlanOrderByWithRelationInput;
        WhereUnique: Prisma.ScheduledPlanWhereUniqueInput;
        Where: Prisma.ScheduledPlanWhereInput;
        Create: {};
        Update: {};
        RelationName: "notifications" | "mealPlan";
        ListRelations: "notifications";
        Relations: {
            notifications: {
                Shape: Notification[];
                Name: "Notification";
                Nullable: false;
            };
            mealPlan: {
                Shape: MealPlan;
                Name: "MealPlan";
                Nullable: false;
            };
        };
    };
    MealPlan: {
        Name: "MealPlan";
        Shape: MealPlan;
        Include: Prisma.MealPlanInclude;
        Select: Prisma.MealPlanSelect;
        OrderBy: Prisma.MealPlanOrderByWithRelationInput;
        WhereUnique: Prisma.MealPlanWhereUniqueInput;
        Where: Prisma.MealPlanWhereInput;
        Create: {};
        Update: {};
        RelationName: "planRecipes" | "mealPlanServings" | "schedules";
        ListRelations: "planRecipes" | "mealPlanServings" | "schedules";
        Relations: {
            planRecipes: {
                Shape: MealPlanRecipe[];
                Name: "MealPlanRecipe";
                Nullable: false;
            };
            mealPlanServings: {
                Shape: MealPlanServing[];
                Name: "MealPlanServing";
                Nullable: false;
            };
            schedules: {
                Shape: ScheduledPlan[];
                Name: "ScheduledPlan";
                Nullable: false;
            };
        };
    };
    NotificationSetting: {
        Name: "NotificationSetting";
        Shape: NotificationSetting;
        Include: never;
        Select: Prisma.NotificationSettingSelect;
        OrderBy: Prisma.NotificationSettingOrderByWithRelationInput;
        WhereUnique: Prisma.NotificationSettingWhereUniqueInput;
        Where: Prisma.NotificationSettingWhereInput;
        Create: {};
        Update: {};
        RelationName: never;
        ListRelations: never;
        Relations: {};
    };
    MealPlanServing: {
        Name: "MealPlanServing";
        Shape: MealPlanServing;
        Include: Prisma.MealPlanServingInclude;
        Select: Prisma.MealPlanServingSelect;
        OrderBy: Prisma.MealPlanServingOrderByWithRelationInput;
        WhereUnique: Prisma.MealPlanServingWhereUniqueInput;
        Where: Prisma.MealPlanServingWhereInput;
        Create: {};
        Update: {};
        RelationName: "mealPlan" | "recipe";
        ListRelations: never;
        Relations: {
            mealPlan: {
                Shape: MealPlan;
                Name: "MealPlan";
                Nullable: false;
            };
            recipe: {
                Shape: MealPlanRecipe;
                Name: "MealPlanRecipe";
                Nullable: false;
            };
        };
    };
    MealPlanRecipe: {
        Name: "MealPlanRecipe";
        Shape: MealPlanRecipe;
        Include: Prisma.MealPlanRecipeInclude;
        Select: Prisma.MealPlanRecipeSelect;
        OrderBy: Prisma.MealPlanRecipeOrderByWithRelationInput;
        WhereUnique: Prisma.MealPlanRecipeWhereUniqueInput;
        Where: Prisma.MealPlanRecipeWhereInput;
        Create: {};
        Update: {};
        RelationName: "mealPlan" | "recipe" | "servings";
        ListRelations: "servings";
        Relations: {
            mealPlan: {
                Shape: MealPlan;
                Name: "MealPlan";
                Nullable: false;
            };
            recipe: {
                Shape: Recipe;
                Name: "Recipe";
                Nullable: false;
            };
            servings: {
                Shape: MealPlanServing[];
                Name: "MealPlanServing";
                Nullable: false;
            };
        };
    };
    Import: {
        Name: "Import";
        Shape: Import;
        Include: Prisma.ImportInclude;
        Select: Prisma.ImportSelect;
        OrderBy: Prisma.ImportOrderByWithRelationInput;
        WhereUnique: Prisma.ImportWhereUniqueInput;
        Where: Prisma.ImportWhereInput;
        Create: {};
        Update: {};
        RelationName: "importRecords";
        ListRelations: "importRecords";
        Relations: {
            importRecords: {
                Shape: ImportItem[];
                Name: "ImportItem";
                Nullable: false;
            };
        };
    };
    ImportItem: {
        Name: "ImportItem";
        Shape: ImportItem;
        Include: Prisma.ImportItemInclude;
        Select: Prisma.ImportItemSelect;
        OrderBy: Prisma.ImportItemOrderByWithRelationInput;
        WhereUnique: Prisma.ImportItemWhereUniqueInput;
        Where: Prisma.ImportItemWhereInput;
        Create: {};
        Update: {};
        RelationName: "import" | "recipe" | "nutritionLabel" | "ingredientGroup";
        ListRelations: never;
        Relations: {
            import: {
                Shape: Import;
                Name: "Import";
                Nullable: false;
            };
            recipe: {
                Shape: Recipe | null;
                Name: "Recipe";
                Nullable: true;
            };
            nutritionLabel: {
                Shape: NutritionLabel | null;
                Name: "NutritionLabel";
                Nullable: true;
            };
            ingredientGroup: {
                Shape: RecipeIngredientGroup | null;
                Name: "RecipeIngredientGroup";
                Nullable: true;
            };
        };
    };
    ImportDraft: {
        Name: "ImportDraft";
        Shape: ImportDraft;
        Include: never;
        Select: Prisma.ImportDraftSelect;
        OrderBy: Prisma.ImportDraftOrderByWithRelationInput;
        WhereUnique: Prisma.ImportDraftWhereUniqueInput;
        Where: Prisma.ImportDraftWhereInput;
        Create: {};
        Update: {};
        RelationName: never;
        ListRelations: never;
        Relations: {};
    };
    RecipeIngredient: {
        Name: "RecipeIngredient";
        Shape: RecipeIngredient;
        Include: Prisma.RecipeIngredientInclude;
        Select: Prisma.RecipeIngredientSelect;
        OrderBy: Prisma.RecipeIngredientOrderByWithRelationInput;
        WhereUnique: Prisma.RecipeIngredientWhereUniqueInput;
        Where: Prisma.RecipeIngredientWhereInput;
        Create: {};
        Update: {};
        RelationName: "unit" | "recipe" | "ingredient" | "group";
        ListRelations: never;
        Relations: {
            unit: {
                Shape: MeasurementUnit | null;
                Name: "MeasurementUnit";
                Nullable: true;
            };
            recipe: {
                Shape: Recipe;
                Name: "Recipe";
                Nullable: false;
            };
            ingredient: {
                Shape: Ingredient | null;
                Name: "Ingredient";
                Nullable: true;
            };
            group: {
                Shape: RecipeIngredientGroup | null;
                Name: "RecipeIngredientGroup";
                Nullable: true;
            };
        };
    };
    MeasurementUnit: {
        Name: "MeasurementUnit";
        Shape: MeasurementUnit;
        Include: Prisma.MeasurementUnitInclude;
        Select: Prisma.MeasurementUnitSelect;
        OrderBy: Prisma.MeasurementUnitOrderByWithRelationInput;
        WhereUnique: Prisma.MeasurementUnitWhereUniqueInput;
        Where: Prisma.MeasurementUnitWhereInput;
        Create: {};
        Update: {};
        RelationName: "ingredients" | "nutrients" | "ingredientPrice" | "servingSizes" | "aggServingSizes" | "fromUnit" | "toUnit" | "recieptItems";
        ListRelations: "ingredients" | "nutrients" | "ingredientPrice" | "servingSizes" | "aggServingSizes" | "fromUnit" | "toUnit" | "recieptItems";
        Relations: {
            ingredients: {
                Shape: RecipeIngredient[];
                Name: "RecipeIngredient";
                Nullable: false;
            };
            nutrients: {
                Shape: Nutrient[];
                Name: "Nutrient";
                Nullable: false;
            };
            ingredientPrice: {
                Shape: IngredientPrice[];
                Name: "IngredientPrice";
                Nullable: false;
            };
            servingSizes: {
                Shape: NutritionLabel[];
                Name: "NutritionLabel";
                Nullable: false;
            };
            aggServingSizes: {
                Shape: AggregateLabel[];
                Name: "AggregateLabel";
                Nullable: false;
            };
            fromUnit: {
                Shape: MeasurementConversion[];
                Name: "MeasurementConversion";
                Nullable: false;
            };
            toUnit: {
                Shape: MeasurementConversion[];
                Name: "MeasurementConversion";
                Nullable: false;
            };
            recieptItems: {
                Shape: ReceiptLine[];
                Name: "ReceiptLine";
                Nullable: false;
            };
        };
    };
    RecipeIngredientGroup: {
        Name: "RecipeIngredientGroup";
        Shape: RecipeIngredientGroup;
        Include: Prisma.RecipeIngredientGroupInclude;
        Select: Prisma.RecipeIngredientGroupSelect;
        OrderBy: Prisma.RecipeIngredientGroupOrderByWithRelationInput;
        WhereUnique: Prisma.RecipeIngredientGroupWhereUniqueInput;
        Where: Prisma.RecipeIngredientGroupWhereInput;
        Create: {};
        Update: {};
        RelationName: "recipe" | "ingredients" | "nutritionLabel" | "importRecords";
        ListRelations: "ingredients" | "importRecords";
        Relations: {
            recipe: {
                Shape: Recipe;
                Name: "Recipe";
                Nullable: false;
            };
            ingredients: {
                Shape: RecipeIngredient[];
                Name: "RecipeIngredient";
                Nullable: false;
            };
            nutritionLabel: {
                Shape: NutritionLabel | null;
                Name: "NutritionLabel";
                Nullable: true;
            };
            importRecords: {
                Shape: ImportItem[];
                Name: "ImportItem";
                Nullable: false;
            };
        };
    };
    Ingredient: {
        Name: "Ingredient";
        Shape: Ingredient;
        Include: Prisma.IngredientInclude;
        Select: Prisma.IngredientSelect;
        OrderBy: Prisma.IngredientOrderByWithRelationInput;
        WhereUnique: Prisma.IngredientWhereUniqueInput;
        Where: Prisma.IngredientWhereInput;
        Create: {};
        Update: {};
        RelationName: "recipeIngredient" | "category" | "priceHistory" | "expirationRule" | "receiptLines" | "conversionRatio";
        ListRelations: "recipeIngredient" | "priceHistory" | "receiptLines" | "conversionRatio";
        Relations: {
            recipeIngredient: {
                Shape: RecipeIngredient[];
                Name: "RecipeIngredient";
                Nullable: false;
            };
            category: {
                Shape: IngredientCategory | null;
                Name: "IngredientCategory";
                Nullable: true;
            };
            priceHistory: {
                Shape: IngredientPrice[];
                Name: "IngredientPrice";
                Nullable: false;
            };
            expirationRule: {
                Shape: ExpirationRule | null;
                Name: "ExpirationRule";
                Nullable: true;
            };
            receiptLines: {
                Shape: ReceiptLine[];
                Name: "ReceiptLine";
                Nullable: false;
            };
            conversionRatio: {
                Shape: MeasurementConversion[];
                Name: "MeasurementConversion";
                Nullable: false;
            };
        };
    };
    MeasurementConversion: {
        Name: "MeasurementConversion";
        Shape: MeasurementConversion;
        Include: Prisma.MeasurementConversionInclude;
        Select: Prisma.MeasurementConversionSelect;
        OrderBy: Prisma.MeasurementConversionOrderByWithRelationInput;
        WhereUnique: Prisma.MeasurementConversionWhereUniqueInput;
        Where: Prisma.MeasurementConversionWhereInput;
        Create: {};
        Update: {};
        RelationName: "fromUnit" | "toUnit" | "ingredient";
        ListRelations: never;
        Relations: {
            fromUnit: {
                Shape: MeasurementUnit;
                Name: "MeasurementUnit";
                Nullable: false;
            };
            toUnit: {
                Shape: MeasurementUnit;
                Name: "MeasurementUnit";
                Nullable: false;
            };
            ingredient: {
                Shape: Ingredient | null;
                Name: "Ingredient";
                Nullable: true;
            };
        };
    };
    IngredientCategory: {
        Name: "IngredientCategory";
        Shape: IngredientCategory;
        Include: Prisma.IngredientCategoryInclude;
        Select: Prisma.IngredientCategorySelect;
        OrderBy: Prisma.IngredientCategoryOrderByWithRelationInput;
        WhereUnique: Prisma.IngredientCategoryWhereUniqueInput;
        Where: Prisma.IngredientCategoryWhereInput;
        Create: {};
        Update: {};
        RelationName: "ingredients";
        ListRelations: "ingredients";
        Relations: {
            ingredients: {
                Shape: Ingredient[];
                Name: "Ingredient";
                Nullable: false;
            };
        };
    };
    ExpirationRule: {
        Name: "ExpirationRule";
        Shape: ExpirationRule;
        Include: Prisma.ExpirationRuleInclude;
        Select: Prisma.ExpirationRuleSelect;
        OrderBy: Prisma.ExpirationRuleOrderByWithRelationInput;
        WhereUnique: Prisma.ExpirationRuleWhereUniqueInput;
        Where: Prisma.ExpirationRuleWhereInput;
        Create: {};
        Update: {};
        RelationName: "ingredients";
        ListRelations: "ingredients";
        Relations: {
            ingredients: {
                Shape: Ingredient[];
                Name: "Ingredient";
                Nullable: false;
            };
        };
    };
    IngredientPrice: {
        Name: "IngredientPrice";
        Shape: IngredientPrice;
        Include: Prisma.IngredientPriceInclude;
        Select: Prisma.IngredientPriceSelect;
        OrderBy: Prisma.IngredientPriceOrderByWithRelationInput;
        WhereUnique: Prisma.IngredientPriceWhereUniqueInput;
        Where: Prisma.IngredientPriceWhereInput;
        Create: {};
        Update: {};
        RelationName: "groceryStore" | "ingredient" | "unit" | "receiptLine";
        ListRelations: never;
        Relations: {
            groceryStore: {
                Shape: GroceryStore;
                Name: "GroceryStore";
                Nullable: false;
            };
            ingredient: {
                Shape: Ingredient;
                Name: "Ingredient";
                Nullable: false;
            };
            unit: {
                Shape: MeasurementUnit;
                Name: "MeasurementUnit";
                Nullable: false;
            };
            receiptLine: {
                Shape: ReceiptLine | null;
                Name: "ReceiptLine";
                Nullable: true;
            };
        };
    };
    GroceryStore: {
        Name: "GroceryStore";
        Shape: GroceryStore;
        Include: Prisma.GroceryStoreInclude;
        Select: Prisma.GroceryStoreSelect;
        OrderBy: Prisma.GroceryStoreOrderByWithRelationInput;
        WhereUnique: Prisma.GroceryStoreWhereUniqueInput;
        Where: Prisma.GroceryStoreWhereInput;
        Create: {};
        Update: {};
        RelationName: "receipts" | "ingredientPrices";
        ListRelations: "receipts" | "ingredientPrices";
        Relations: {
            receipts: {
                Shape: Receipt[];
                Name: "Receipt";
                Nullable: false;
            };
            ingredientPrices: {
                Shape: IngredientPrice[];
                Name: "IngredientPrice";
                Nullable: false;
            };
        };
    };
    Receipt: {
        Name: "Receipt";
        Shape: Receipt;
        Include: Prisma.ReceiptInclude;
        Select: Prisma.ReceiptSelect;
        OrderBy: Prisma.ReceiptOrderByWithRelationInput;
        WhereUnique: Prisma.ReceiptWhereUniqueInput;
        Where: Prisma.ReceiptWhereInput;
        Create: {};
        Update: {};
        RelationName: "matchingStore" | "lineItems";
        ListRelations: "lineItems";
        Relations: {
            matchingStore: {
                Shape: GroceryStore | null;
                Name: "GroceryStore";
                Nullable: true;
            };
            lineItems: {
                Shape: ReceiptLine[];
                Name: "ReceiptLine";
                Nullable: false;
            };
        };
    };
    ReceiptLine: {
        Name: "ReceiptLine";
        Shape: ReceiptLine;
        Include: Prisma.ReceiptLineInclude;
        Select: Prisma.ReceiptLineSelect;
        OrderBy: Prisma.ReceiptLineOrderByWithRelationInput;
        WhereUnique: Prisma.ReceiptLineWhereUniqueInput;
        Where: Prisma.ReceiptLineWhereInput;
        Create: {};
        Update: {};
        RelationName: "receipt" | "ingredientPrice" | "matchingUnit" | "matchingIngredient";
        ListRelations: never;
        Relations: {
            receipt: {
                Shape: Receipt;
                Name: "Receipt";
                Nullable: false;
            };
            ingredientPrice: {
                Shape: IngredientPrice | null;
                Name: "IngredientPrice";
                Nullable: true;
            };
            matchingUnit: {
                Shape: MeasurementUnit | null;
                Name: "MeasurementUnit";
                Nullable: true;
            };
            matchingIngredient: {
                Shape: Ingredient | null;
                Name: "Ingredient";
                Nullable: true;
            };
        };
    };
    WebScrapedRecipe: {
        Name: "WebScrapedRecipe";
        Shape: WebScrapedRecipe;
        Include: Prisma.WebScrapedRecipeInclude;
        Select: Prisma.WebScrapedRecipeSelect;
        OrderBy: Prisma.WebScrapedRecipeOrderByWithRelationInput;
        WhereUnique: Prisma.WebScrapedRecipeWhereUniqueInput;
        Where: Prisma.WebScrapedRecipeWhereInput;
        Create: {};
        Update: {};
        RelationName: "recipe";
        ListRelations: never;
        Relations: {
            recipe: {
                Shape: Recipe | null;
                Name: "Recipe";
                Nullable: true;
            };
        };
    };
    Recipe: {
        Name: "Recipe";
        Shape: Recipe;
        Include: Prisma.RecipeInclude;
        Select: Prisma.RecipeSelect;
        OrderBy: Prisma.RecipeOrderByWithRelationInput;
        WhereUnique: Prisma.RecipeWhereUniqueInput;
        Where: Prisma.RecipeWhereInput;
        Create: {};
        Update: {};
        RelationName: "photos" | "course" | "category" | "cuisine" | "ingredients" | "mealPlans" | "nutritionLabels" | "ingredientGroups" | "importRecord" | "bookmarkUrl" | "aggregateLabel";
        ListRelations: "photos" | "course" | "category" | "cuisine" | "ingredients" | "mealPlans" | "nutritionLabels" | "ingredientGroups" | "importRecord";
        Relations: {
            photos: {
                Shape: Photo[];
                Name: "Photo";
                Nullable: false;
            };
            course: {
                Shape: Course[];
                Name: "Course";
                Nullable: false;
            };
            category: {
                Shape: Category[];
                Name: "Category";
                Nullable: false;
            };
            cuisine: {
                Shape: Cuisine[];
                Name: "Cuisine";
                Nullable: false;
            };
            ingredients: {
                Shape: RecipeIngredient[];
                Name: "RecipeIngredient";
                Nullable: false;
            };
            mealPlans: {
                Shape: MealPlanRecipe[];
                Name: "MealPlanRecipe";
                Nullable: false;
            };
            nutritionLabels: {
                Shape: NutritionLabel[];
                Name: "NutritionLabel";
                Nullable: false;
            };
            ingredientGroups: {
                Shape: RecipeIngredientGroup[];
                Name: "RecipeIngredientGroup";
                Nullable: false;
            };
            importRecord: {
                Shape: ImportItem[];
                Name: "ImportItem";
                Nullable: false;
            };
            bookmarkUrl: {
                Shape: WebScrapedRecipe | null;
                Name: "WebScrapedRecipe";
                Nullable: true;
            };
            aggregateLabel: {
                Shape: AggregateLabel | null;
                Name: "AggregateLabel";
                Nullable: true;
            };
        };
    };
    Course: {
        Name: "Course";
        Shape: Course;
        Include: Prisma.CourseInclude;
        Select: Prisma.CourseSelect;
        OrderBy: Prisma.CourseOrderByWithRelationInput;
        WhereUnique: Prisma.CourseWhereUniqueInput;
        Where: Prisma.CourseWhereInput;
        Create: {};
        Update: {};
        RelationName: "recipes";
        ListRelations: "recipes";
        Relations: {
            recipes: {
                Shape: Recipe[];
                Name: "Recipe";
                Nullable: false;
            };
        };
    };
    Category: {
        Name: "Category";
        Shape: Category;
        Include: Prisma.CategoryInclude;
        Select: Prisma.CategorySelect;
        OrderBy: Prisma.CategoryOrderByWithRelationInput;
        WhereUnique: Prisma.CategoryWhereUniqueInput;
        Where: Prisma.CategoryWhereInput;
        Create: {};
        Update: {};
        RelationName: "recipes";
        ListRelations: "recipes";
        Relations: {
            recipes: {
                Shape: Recipe[];
                Name: "Recipe";
                Nullable: false;
            };
        };
    };
    Cuisine: {
        Name: "Cuisine";
        Shape: Cuisine;
        Include: Prisma.CuisineInclude;
        Select: Prisma.CuisineSelect;
        OrderBy: Prisma.CuisineOrderByWithRelationInput;
        WhereUnique: Prisma.CuisineWhereUniqueInput;
        Where: Prisma.CuisineWhereInput;
        Create: {};
        Update: {};
        RelationName: "recipes";
        ListRelations: "recipes";
        Relations: {
            recipes: {
                Shape: Recipe[];
                Name: "Recipe";
                Nullable: false;
            };
        };
    };
    Photo: {
        Name: "Photo";
        Shape: Photo;
        Include: Prisma.PhotoInclude;
        Select: Prisma.PhotoSelect;
        OrderBy: Prisma.PhotoOrderByWithRelationInput;
        WhereUnique: Prisma.PhotoWhereUniqueInput;
        Where: Prisma.PhotoWhereInput;
        Create: {};
        Update: {};
        RelationName: "recipe";
        ListRelations: never;
        Relations: {
            recipe: {
                Shape: Recipe | null;
                Name: "Recipe";
                Nullable: true;
            };
        };
    };
    NutritionLabel: {
        Name: "NutritionLabel";
        Shape: NutritionLabel;
        Include: Prisma.NutritionLabelInclude;
        Select: Prisma.NutritionLabelSelect;
        OrderBy: Prisma.NutritionLabelOrderByWithRelationInput;
        WhereUnique: Prisma.NutritionLabelWhereUniqueInput;
        Where: Prisma.NutritionLabelWhereInput;
        Create: {};
        Update: {};
        RelationName: "recipe" | "ingredientGroup" | "nutrients" | "servingSizeUnit" | "importRecords";
        ListRelations: "nutrients" | "importRecords";
        Relations: {
            recipe: {
                Shape: Recipe;
                Name: "Recipe";
                Nullable: false;
            };
            ingredientGroup: {
                Shape: RecipeIngredientGroup | null;
                Name: "RecipeIngredientGroup";
                Nullable: true;
            };
            nutrients: {
                Shape: NutritionLabelNutrient[];
                Name: "NutritionLabelNutrient";
                Nullable: false;
            };
            servingSizeUnit: {
                Shape: MeasurementUnit | null;
                Name: "MeasurementUnit";
                Nullable: true;
            };
            importRecords: {
                Shape: ImportItem[];
                Name: "ImportItem";
                Nullable: false;
            };
        };
    };
    AggregateLabel: {
        Name: "AggregateLabel";
        Shape: AggregateLabel;
        Include: Prisma.AggregateLabelInclude;
        Select: Prisma.AggregateLabelSelect;
        OrderBy: Prisma.AggregateLabelOrderByWithRelationInput;
        WhereUnique: Prisma.AggregateLabelWhereUniqueInput;
        Where: Prisma.AggregateLabelWhereInput;
        Create: {};
        Update: {};
        RelationName: "recipe" | "nutrients" | "servingSizeUnit";
        ListRelations: "nutrients";
        Relations: {
            recipe: {
                Shape: Recipe;
                Name: "Recipe";
                Nullable: false;
            };
            nutrients: {
                Shape: AggLabelNutrient[];
                Name: "AggLabelNutrient";
                Nullable: false;
            };
            servingSizeUnit: {
                Shape: MeasurementUnit | null;
                Name: "MeasurementUnit";
                Nullable: true;
            };
        };
    };
    NutritionLabelNutrient: {
        Name: "NutritionLabelNutrient";
        Shape: NutritionLabelNutrient;
        Include: Prisma.NutritionLabelNutrientInclude;
        Select: Prisma.NutritionLabelNutrientSelect;
        OrderBy: Prisma.NutritionLabelNutrientOrderByWithRelationInput;
        WhereUnique: Prisma.NutritionLabelNutrientWhereUniqueInput;
        Where: Prisma.NutritionLabelNutrientWhereInput;
        Create: {};
        Update: {};
        RelationName: "nutritionLabel" | "nutrient";
        ListRelations: never;
        Relations: {
            nutritionLabel: {
                Shape: NutritionLabel;
                Name: "NutritionLabel";
                Nullable: false;
            };
            nutrient: {
                Shape: Nutrient;
                Name: "Nutrient";
                Nullable: false;
            };
        };
    };
    AggLabelNutrient: {
        Name: "AggLabelNutrient";
        Shape: AggLabelNutrient;
        Include: Prisma.AggLabelNutrientInclude;
        Select: Prisma.AggLabelNutrientSelect;
        OrderBy: Prisma.AggLabelNutrientOrderByWithRelationInput;
        WhereUnique: Prisma.AggLabelNutrientWhereUniqueInput;
        Where: Prisma.AggLabelNutrientWhereInput;
        Create: {};
        Update: {};
        RelationName: "aggLabel" | "nutrient";
        ListRelations: never;
        Relations: {
            aggLabel: {
                Shape: AggregateLabel;
                Name: "AggregateLabel";
                Nullable: false;
            };
            nutrient: {
                Shape: Nutrient;
                Name: "Nutrient";
                Nullable: false;
            };
        };
    };
    Nutrient: {
        Name: "Nutrient";
        Shape: Nutrient;
        Include: Prisma.NutrientInclude;
        Select: Prisma.NutrientSelect;
        OrderBy: Prisma.NutrientOrderByWithRelationInput;
        WhereUnique: Prisma.NutrientWhereUniqueInput;
        Where: Prisma.NutrientWhereInput;
        Create: {};
        Update: {};
        RelationName: "dri" | "parentNutrient" | "subNutrients" | "nutritionLabelNutrients" | "aggLabelNutrients" | "unit" | "mappings";
        ListRelations: "dri" | "subNutrients" | "nutritionLabelNutrients" | "aggLabelNutrients" | "mappings";
        Relations: {
            dri: {
                Shape: DailyReferenceIntake[];
                Name: "DailyReferenceIntake";
                Nullable: false;
            };
            parentNutrient: {
                Shape: Nutrient | null;
                Name: "Nutrient";
                Nullable: true;
            };
            subNutrients: {
                Shape: Nutrient[];
                Name: "Nutrient";
                Nullable: false;
            };
            nutritionLabelNutrients: {
                Shape: NutritionLabelNutrient[];
                Name: "NutritionLabelNutrient";
                Nullable: false;
            };
            aggLabelNutrients: {
                Shape: AggLabelNutrient[];
                Name: "AggLabelNutrient";
                Nullable: false;
            };
            unit: {
                Shape: MeasurementUnit;
                Name: "MeasurementUnit";
                Nullable: false;
            };
            mappings: {
                Shape: NutrientImportMapping[];
                Name: "NutrientImportMapping";
                Nullable: false;
            };
        };
    };
    NutrientImportMapping: {
        Name: "NutrientImportMapping";
        Shape: NutrientImportMapping;
        Include: Prisma.NutrientImportMappingInclude;
        Select: Prisma.NutrientImportMappingSelect;
        OrderBy: Prisma.NutrientImportMappingOrderByWithRelationInput;
        WhereUnique: Prisma.NutrientImportMappingWhereUniqueInput;
        Where: Prisma.NutrientImportMappingWhereInput;
        Create: {};
        Update: {};
        RelationName: "nutrient";
        ListRelations: never;
        Relations: {
            nutrient: {
                Shape: Nutrient;
                Name: "Nutrient";
                Nullable: false;
            };
        };
    };
    DailyReferenceIntake: {
        Name: "DailyReferenceIntake";
        Shape: DailyReferenceIntake;
        Include: Prisma.DailyReferenceIntakeInclude;
        Select: Prisma.DailyReferenceIntakeSelect;
        OrderBy: Prisma.DailyReferenceIntakeOrderByWithRelationInput;
        WhereUnique: Prisma.DailyReferenceIntakeWhereUniqueInput;
        Where: Prisma.DailyReferenceIntakeWhereInput;
        Create: {};
        Update: {};
        RelationName: "nutrient";
        ListRelations: never;
        Relations: {
            nutrient: {
                Shape: Nutrient;
                Name: "Nutrient";
                Nullable: false;
            };
        };
    };
    HealthProfile: {
        Name: "HealthProfile";
        Shape: HealthProfile;
        Include: never;
        Select: Prisma.HealthProfileSelect;
        OrderBy: Prisma.HealthProfileOrderByWithRelationInput;
        WhereUnique: Prisma.HealthProfileWhereUniqueInput;
        Where: Prisma.HealthProfileWhereInput;
        Create: {};
        Update: {};
        RelationName: never;
        ListRelations: never;
        Relations: {};
    };
}