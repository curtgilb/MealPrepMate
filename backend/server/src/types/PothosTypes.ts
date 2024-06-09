/* eslint-disable */
import type { Prisma, Notification, ScheduledPlan, MealPlan, NotificationSetting, MealPlanServing, MealPlanRecipe, Import, ImportItem, ImportDraft, RecipeIngredient, MeasurementUnit, RecipeIngredientGroup, Ingredient, MeasurementConversion, IngredientCategory, ExpirationRule, IngredientPrice, GroceryStore, Receipt, ReceiptLine, WebScrapedRecipe, Recipe, Course, Category, Cuisine, Photo, NutritionLabel, AggregateLabel, NutritionLabelNutrient, AggLabelNutrient, Nutrient, NutrientImportMapping, DailyReferenceIntake, HealthProfile } from "@prisma/client";
export default interface PrismaTypes {
    Notification: {
        Name: "Notification";
        Shape: Notification;
        Include: Prisma.NotificationInclude;
        Select: Prisma.NotificationSelect;
        OrderBy: Prisma.NotificationOrderByWithRelationAndSearchRelevanceInput;
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
            };
        };
    };
    ScheduledPlan: {
        Name: "ScheduledPlan";
        Shape: ScheduledPlan;
        Include: Prisma.ScheduledPlanInclude;
        Select: Prisma.ScheduledPlanSelect;
        OrderBy: Prisma.ScheduledPlanOrderByWithRelationAndSearchRelevanceInput;
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
            };
            mealPlan: {
                Shape: MealPlan;
                Name: "MealPlan";
            };
        };
    };
    MealPlan: {
        Name: "MealPlan";
        Shape: MealPlan;
        Include: Prisma.MealPlanInclude;
        Select: Prisma.MealPlanSelect;
        OrderBy: Prisma.MealPlanOrderByWithRelationAndSearchRelevanceInput;
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
            };
            mealPlanServings: {
                Shape: MealPlanServing[];
                Name: "MealPlanServing";
            };
            schedules: {
                Shape: ScheduledPlan[];
                Name: "ScheduledPlan";
            };
        };
    };
    NotificationSetting: {
        Name: "NotificationSetting";
        Shape: NotificationSetting;
        Include: never;
        Select: Prisma.NotificationSettingSelect;
        OrderBy: Prisma.NotificationSettingOrderByWithRelationAndSearchRelevanceInput;
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
        OrderBy: Prisma.MealPlanServingOrderByWithRelationAndSearchRelevanceInput;
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
            };
            recipe: {
                Shape: MealPlanRecipe;
                Name: "MealPlanRecipe";
            };
        };
    };
    MealPlanRecipe: {
        Name: "MealPlanRecipe";
        Shape: MealPlanRecipe;
        Include: Prisma.MealPlanRecipeInclude;
        Select: Prisma.MealPlanRecipeSelect;
        OrderBy: Prisma.MealPlanRecipeOrderByWithRelationAndSearchRelevanceInput;
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
            };
            recipe: {
                Shape: Recipe;
                Name: "Recipe";
            };
            servings: {
                Shape: MealPlanServing[];
                Name: "MealPlanServing";
            };
        };
    };
    Import: {
        Name: "Import";
        Shape: Import;
        Include: Prisma.ImportInclude;
        Select: Prisma.ImportSelect;
        OrderBy: Prisma.ImportOrderByWithRelationAndSearchRelevanceInput;
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
            };
        };
    };
    ImportItem: {
        Name: "ImportItem";
        Shape: ImportItem;
        Include: Prisma.ImportItemInclude;
        Select: Prisma.ImportItemSelect;
        OrderBy: Prisma.ImportItemOrderByWithRelationAndSearchRelevanceInput;
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
            };
            recipe: {
                Shape: Recipe | null;
                Name: "Recipe";
            };
            nutritionLabel: {
                Shape: NutritionLabel | null;
                Name: "NutritionLabel";
            };
            ingredientGroup: {
                Shape: RecipeIngredientGroup | null;
                Name: "RecipeIngredientGroup";
            };
        };
    };
    ImportDraft: {
        Name: "ImportDraft";
        Shape: ImportDraft;
        Include: never;
        Select: Prisma.ImportDraftSelect;
        OrderBy: Prisma.ImportDraftOrderByWithRelationAndSearchRelevanceInput;
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
        OrderBy: Prisma.RecipeIngredientOrderByWithRelationAndSearchRelevanceInput;
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
            };
            recipe: {
                Shape: Recipe;
                Name: "Recipe";
            };
            ingredient: {
                Shape: Ingredient | null;
                Name: "Ingredient";
            };
            group: {
                Shape: RecipeIngredientGroup | null;
                Name: "RecipeIngredientGroup";
            };
        };
    };
    MeasurementUnit: {
        Name: "MeasurementUnit";
        Shape: MeasurementUnit;
        Include: Prisma.MeasurementUnitInclude;
        Select: Prisma.MeasurementUnitSelect;
        OrderBy: Prisma.MeasurementUnitOrderByWithRelationAndSearchRelevanceInput;
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
            };
            nutrients: {
                Shape: Nutrient[];
                Name: "Nutrient";
            };
            ingredientPrice: {
                Shape: IngredientPrice[];
                Name: "IngredientPrice";
            };
            servingSizes: {
                Shape: NutritionLabel[];
                Name: "NutritionLabel";
            };
            aggServingSizes: {
                Shape: AggregateLabel[];
                Name: "AggregateLabel";
            };
            fromUnit: {
                Shape: MeasurementConversion[];
                Name: "MeasurementConversion";
            };
            toUnit: {
                Shape: MeasurementConversion[];
                Name: "MeasurementConversion";
            };
            recieptItems: {
                Shape: ReceiptLine[];
                Name: "ReceiptLine";
            };
        };
    };
    RecipeIngredientGroup: {
        Name: "RecipeIngredientGroup";
        Shape: RecipeIngredientGroup;
        Include: Prisma.RecipeIngredientGroupInclude;
        Select: Prisma.RecipeIngredientGroupSelect;
        OrderBy: Prisma.RecipeIngredientGroupOrderByWithRelationAndSearchRelevanceInput;
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
            };
            ingredients: {
                Shape: RecipeIngredient[];
                Name: "RecipeIngredient";
            };
            nutritionLabel: {
                Shape: NutritionLabel | null;
                Name: "NutritionLabel";
            };
            importRecords: {
                Shape: ImportItem[];
                Name: "ImportItem";
            };
        };
    };
    Ingredient: {
        Name: "Ingredient";
        Shape: Ingredient;
        Include: Prisma.IngredientInclude;
        Select: Prisma.IngredientSelect;
        OrderBy: Prisma.IngredientOrderByWithRelationAndSearchRelevanceInput;
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
            };
            category: {
                Shape: IngredientCategory | null;
                Name: "IngredientCategory";
            };
            priceHistory: {
                Shape: IngredientPrice[];
                Name: "IngredientPrice";
            };
            expirationRule: {
                Shape: ExpirationRule | null;
                Name: "ExpirationRule";
            };
            receiptLines: {
                Shape: ReceiptLine[];
                Name: "ReceiptLine";
            };
            conversionRatio: {
                Shape: MeasurementConversion[];
                Name: "MeasurementConversion";
            };
        };
    };
    MeasurementConversion: {
        Name: "MeasurementConversion";
        Shape: MeasurementConversion;
        Include: Prisma.MeasurementConversionInclude;
        Select: Prisma.MeasurementConversionSelect;
        OrderBy: Prisma.MeasurementConversionOrderByWithRelationAndSearchRelevanceInput;
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
            };
            toUnit: {
                Shape: MeasurementUnit;
                Name: "MeasurementUnit";
            };
            ingredient: {
                Shape: Ingredient | null;
                Name: "Ingredient";
            };
        };
    };
    IngredientCategory: {
        Name: "IngredientCategory";
        Shape: IngredientCategory;
        Include: Prisma.IngredientCategoryInclude;
        Select: Prisma.IngredientCategorySelect;
        OrderBy: Prisma.IngredientCategoryOrderByWithRelationAndSearchRelevanceInput;
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
            };
        };
    };
    ExpirationRule: {
        Name: "ExpirationRule";
        Shape: ExpirationRule;
        Include: Prisma.ExpirationRuleInclude;
        Select: Prisma.ExpirationRuleSelect;
        OrderBy: Prisma.ExpirationRuleOrderByWithRelationAndSearchRelevanceInput;
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
            };
        };
    };
    IngredientPrice: {
        Name: "IngredientPrice";
        Shape: IngredientPrice;
        Include: Prisma.IngredientPriceInclude;
        Select: Prisma.IngredientPriceSelect;
        OrderBy: Prisma.IngredientPriceOrderByWithRelationAndSearchRelevanceInput;
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
            };
            ingredient: {
                Shape: Ingredient;
                Name: "Ingredient";
            };
            unit: {
                Shape: MeasurementUnit;
                Name: "MeasurementUnit";
            };
            receiptLine: {
                Shape: ReceiptLine | null;
                Name: "ReceiptLine";
            };
        };
    };
    GroceryStore: {
        Name: "GroceryStore";
        Shape: GroceryStore;
        Include: Prisma.GroceryStoreInclude;
        Select: Prisma.GroceryStoreSelect;
        OrderBy: Prisma.GroceryStoreOrderByWithRelationAndSearchRelevanceInput;
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
            };
            ingredientPrices: {
                Shape: IngredientPrice[];
                Name: "IngredientPrice";
            };
        };
    };
    Receipt: {
        Name: "Receipt";
        Shape: Receipt;
        Include: Prisma.ReceiptInclude;
        Select: Prisma.ReceiptSelect;
        OrderBy: Prisma.ReceiptOrderByWithRelationAndSearchRelevanceInput;
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
            };
            lineItems: {
                Shape: ReceiptLine[];
                Name: "ReceiptLine";
            };
        };
    };
    ReceiptLine: {
        Name: "ReceiptLine";
        Shape: ReceiptLine;
        Include: Prisma.ReceiptLineInclude;
        Select: Prisma.ReceiptLineSelect;
        OrderBy: Prisma.ReceiptLineOrderByWithRelationAndSearchRelevanceInput;
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
            };
            ingredientPrice: {
                Shape: IngredientPrice | null;
                Name: "IngredientPrice";
            };
            matchingUnit: {
                Shape: MeasurementUnit | null;
                Name: "MeasurementUnit";
            };
            matchingIngredient: {
                Shape: Ingredient | null;
                Name: "Ingredient";
            };
        };
    };
    WebScrapedRecipe: {
        Name: "WebScrapedRecipe";
        Shape: WebScrapedRecipe;
        Include: Prisma.WebScrapedRecipeInclude;
        Select: Prisma.WebScrapedRecipeSelect;
        OrderBy: Prisma.WebScrapedRecipeOrderByWithRelationAndSearchRelevanceInput;
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
            };
        };
    };
    Recipe: {
        Name: "Recipe";
        Shape: Recipe;
        Include: Prisma.RecipeInclude;
        Select: Prisma.RecipeSelect;
        OrderBy: Prisma.RecipeOrderByWithRelationAndSearchRelevanceInput;
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
            };
            course: {
                Shape: Course[];
                Name: "Course";
            };
            category: {
                Shape: Category[];
                Name: "Category";
            };
            cuisine: {
                Shape: Cuisine[];
                Name: "Cuisine";
            };
            ingredients: {
                Shape: RecipeIngredient[];
                Name: "RecipeIngredient";
            };
            mealPlans: {
                Shape: MealPlanRecipe[];
                Name: "MealPlanRecipe";
            };
            nutritionLabels: {
                Shape: NutritionLabel[];
                Name: "NutritionLabel";
            };
            ingredientGroups: {
                Shape: RecipeIngredientGroup[];
                Name: "RecipeIngredientGroup";
            };
            importRecord: {
                Shape: ImportItem[];
                Name: "ImportItem";
            };
            bookmarkUrl: {
                Shape: WebScrapedRecipe | null;
                Name: "WebScrapedRecipe";
            };
            aggregateLabel: {
                Shape: AggregateLabel | null;
                Name: "AggregateLabel";
            };
        };
    };
    Course: {
        Name: "Course";
        Shape: Course;
        Include: Prisma.CourseInclude;
        Select: Prisma.CourseSelect;
        OrderBy: Prisma.CourseOrderByWithRelationAndSearchRelevanceInput;
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
            };
        };
    };
    Category: {
        Name: "Category";
        Shape: Category;
        Include: Prisma.CategoryInclude;
        Select: Prisma.CategorySelect;
        OrderBy: Prisma.CategoryOrderByWithRelationAndSearchRelevanceInput;
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
            };
        };
    };
    Cuisine: {
        Name: "Cuisine";
        Shape: Cuisine;
        Include: Prisma.CuisineInclude;
        Select: Prisma.CuisineSelect;
        OrderBy: Prisma.CuisineOrderByWithRelationAndSearchRelevanceInput;
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
            };
        };
    };
    Photo: {
        Name: "Photo";
        Shape: Photo;
        Include: Prisma.PhotoInclude;
        Select: Prisma.PhotoSelect;
        OrderBy: Prisma.PhotoOrderByWithRelationAndSearchRelevanceInput;
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
            };
        };
    };
    NutritionLabel: {
        Name: "NutritionLabel";
        Shape: NutritionLabel;
        Include: Prisma.NutritionLabelInclude;
        Select: Prisma.NutritionLabelSelect;
        OrderBy: Prisma.NutritionLabelOrderByWithRelationAndSearchRelevanceInput;
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
            };
            ingredientGroup: {
                Shape: RecipeIngredientGroup | null;
                Name: "RecipeIngredientGroup";
            };
            nutrients: {
                Shape: NutritionLabelNutrient[];
                Name: "NutritionLabelNutrient";
            };
            servingSizeUnit: {
                Shape: MeasurementUnit | null;
                Name: "MeasurementUnit";
            };
            importRecords: {
                Shape: ImportItem[];
                Name: "ImportItem";
            };
        };
    };
    AggregateLabel: {
        Name: "AggregateLabel";
        Shape: AggregateLabel;
        Include: Prisma.AggregateLabelInclude;
        Select: Prisma.AggregateLabelSelect;
        OrderBy: Prisma.AggregateLabelOrderByWithRelationAndSearchRelevanceInput;
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
            };
            nutrients: {
                Shape: AggLabelNutrient[];
                Name: "AggLabelNutrient";
            };
            servingSizeUnit: {
                Shape: MeasurementUnit | null;
                Name: "MeasurementUnit";
            };
        };
    };
    NutritionLabelNutrient: {
        Name: "NutritionLabelNutrient";
        Shape: NutritionLabelNutrient;
        Include: Prisma.NutritionLabelNutrientInclude;
        Select: Prisma.NutritionLabelNutrientSelect;
        OrderBy: Prisma.NutritionLabelNutrientOrderByWithRelationAndSearchRelevanceInput;
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
            };
            nutrient: {
                Shape: Nutrient;
                Name: "Nutrient";
            };
        };
    };
    AggLabelNutrient: {
        Name: "AggLabelNutrient";
        Shape: AggLabelNutrient;
        Include: Prisma.AggLabelNutrientInclude;
        Select: Prisma.AggLabelNutrientSelect;
        OrderBy: Prisma.AggLabelNutrientOrderByWithRelationAndSearchRelevanceInput;
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
            };
            nutrient: {
                Shape: Nutrient;
                Name: "Nutrient";
            };
        };
    };
    Nutrient: {
        Name: "Nutrient";
        Shape: Nutrient;
        Include: Prisma.NutrientInclude;
        Select: Prisma.NutrientSelect;
        OrderBy: Prisma.NutrientOrderByWithRelationAndSearchRelevanceInput;
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
            };
            parentNutrient: {
                Shape: Nutrient | null;
                Name: "Nutrient";
            };
            subNutrients: {
                Shape: Nutrient[];
                Name: "Nutrient";
            };
            nutritionLabelNutrients: {
                Shape: NutritionLabelNutrient[];
                Name: "NutritionLabelNutrient";
            };
            aggLabelNutrients: {
                Shape: AggLabelNutrient[];
                Name: "AggLabelNutrient";
            };
            unit: {
                Shape: MeasurementUnit;
                Name: "MeasurementUnit";
            };
            mappings: {
                Shape: NutrientImportMapping[];
                Name: "NutrientImportMapping";
            };
        };
    };
    NutrientImportMapping: {
        Name: "NutrientImportMapping";
        Shape: NutrientImportMapping;
        Include: Prisma.NutrientImportMappingInclude;
        Select: Prisma.NutrientImportMappingSelect;
        OrderBy: Prisma.NutrientImportMappingOrderByWithRelationAndSearchRelevanceInput;
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
            };
        };
    };
    DailyReferenceIntake: {
        Name: "DailyReferenceIntake";
        Shape: DailyReferenceIntake;
        Include: Prisma.DailyReferenceIntakeInclude;
        Select: Prisma.DailyReferenceIntakeSelect;
        OrderBy: Prisma.DailyReferenceIntakeOrderByWithRelationAndSearchRelevanceInput;
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
            };
        };
    };
    HealthProfile: {
        Name: "HealthProfile";
        Shape: HealthProfile;
        Include: never;
        Select: Prisma.HealthProfileSelect;
        OrderBy: Prisma.HealthProfileOrderByWithRelationAndSearchRelevanceInput;
        WhereUnique: Prisma.HealthProfileWhereUniqueInput;
        Where: Prisma.HealthProfileWhereInput;
        Create: {};
        Update: {};
        RelationName: never;
        ListRelations: never;
        Relations: {};
    };
}