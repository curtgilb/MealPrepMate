/* eslint-disable */
import type { Prisma, ShoppingDay, MealPlan, MealPlanServing, MealPlanRecipe, Import, ImportRecord, RecipeIngredient, MeasurementUnit, RecipeIngredientGroup, Ingredient, MeasurementConversion, IngredientCategory, ExpirationRule, IngredientPrice, Recipe, Course, Category, Cuisine, Photo, NutritionLabel, NutritionLabelNutrient, Nutrient, NutrientImportMapping, DailyReferenceIntake, HealthProfile } from "@prisma/client";
export default interface PrismaTypes {
    ShoppingDay: {
        Name: "ShoppingDay";
        Shape: ShoppingDay;
        Include: Prisma.ShoppingDayInclude;
        Select: Prisma.ShoppingDaySelect;
        OrderBy: Prisma.ShoppingDayOrderByWithRelationInput;
        WhereUnique: Prisma.ShoppingDayWhereUniqueInput;
        Where: Prisma.ShoppingDayWhereInput;
        Create: {};
        Update: {};
        RelationName: "mealPlan";
        ListRelations: never;
        Relations: {
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
        OrderBy: Prisma.MealPlanOrderByWithRelationInput;
        WhereUnique: Prisma.MealPlanWhereUniqueInput;
        Where: Prisma.MealPlanWhereInput;
        Create: {};
        Update: {};
        RelationName: "planRecipes" | "mealPlanServings" | "shoppingDays";
        ListRelations: "planRecipes" | "mealPlanServings" | "shoppingDays";
        Relations: {
            planRecipes: {
                Shape: MealPlanRecipe[];
                Name: "MealPlanRecipe";
            };
            mealPlanServings: {
                Shape: MealPlanServing[];
                Name: "MealPlanServing";
            };
            shoppingDays: {
                Shape: ShoppingDay[];
                Name: "ShoppingDay";
            };
        };
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
        OrderBy: Prisma.ImportOrderByWithRelationInput;
        WhereUnique: Prisma.ImportWhereUniqueInput;
        Where: Prisma.ImportWhereInput;
        Create: {};
        Update: {};
        RelationName: "importRecords";
        ListRelations: "importRecords";
        Relations: {
            importRecords: {
                Shape: ImportRecord[];
                Name: "ImportRecord";
            };
        };
    };
    ImportRecord: {
        Name: "ImportRecord";
        Shape: ImportRecord;
        Include: Prisma.ImportRecordInclude;
        Select: Prisma.ImportRecordSelect;
        OrderBy: Prisma.ImportRecordOrderByWithRelationInput;
        WhereUnique: Prisma.ImportRecordWhereUniqueInput;
        Where: Prisma.ImportRecordWhereInput;
        Create: {};
        Update: {};
        RelationName: "import" | "recipe" | "nutritionLabel";
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
        };
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
        RelationName: "unit" | "recipes" | "ingredient" | "group";
        ListRelations: never;
        Relations: {
            unit: {
                Shape: MeasurementUnit | null;
                Name: "MeasurementUnit";
            };
            recipes: {
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
        OrderBy: Prisma.MeasurementUnitOrderByWithRelationInput;
        WhereUnique: Prisma.MeasurementUnitWhereUniqueInput;
        Where: Prisma.MeasurementUnitWhereInput;
        Create: {};
        Update: {};
        RelationName: "ingredients" | "nutrients" | "ingredientPrice" | "servingSizes" | "fromUnit" | "toUnit";
        ListRelations: "ingredients" | "nutrients" | "ingredientPrice" | "servingSizes" | "fromUnit" | "toUnit";
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
            fromUnit: {
                Shape: MeasurementConversion[];
                Name: "MeasurementConversion";
            };
            toUnit: {
                Shape: MeasurementConversion[];
                Name: "MeasurementConversion";
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
        RelationName: "recipe" | "ingredients" | "nutritionLabel";
        ListRelations: "ingredients";
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
        RelationName: "recipeIngredient" | "category" | "priceHistory" | "expirationRule" | "conversionRatio";
        ListRelations: "recipeIngredient" | "priceHistory" | "conversionRatio";
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
        RelationName: "ingredient" | "unit";
        ListRelations: never;
        Relations: {
            ingredient: {
                Shape: Ingredient;
                Name: "Ingredient";
            };
            unit: {
                Shape: MeasurementUnit;
                Name: "MeasurementUnit";
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
        RelationName: "photos" | "course" | "category" | "cuisine" | "ingredients" | "mealPlans" | "nutritionLabels" | "importRecords" | "ingredientGroups";
        ListRelations: "photos" | "course" | "category" | "cuisine" | "ingredients" | "mealPlans" | "nutritionLabels" | "importRecords" | "ingredientGroups";
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
            importRecords: {
                Shape: ImportRecord[];
                Name: "ImportRecord";
            };
            ingredientGroups: {
                Shape: RecipeIngredientGroup[];
                Name: "RecipeIngredientGroup";
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
        RelationName: "recipe" | "ingredientGroup" | "nutrients" | "servingSizeUnit" | "importRecord";
        ListRelations: "nutrients" | "importRecord";
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
            importRecord: {
                Shape: ImportRecord[];
                Name: "ImportRecord";
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
        OrderBy: Prisma.NutrientOrderByWithRelationInput;
        WhereUnique: Prisma.NutrientWhereUniqueInput;
        Where: Prisma.NutrientWhereInput;
        Create: {};
        Update: {};
        RelationName: "dri" | "parentNutrient" | "subNutrients" | "NutritionLabelNutrients" | "unit" | "mappings";
        ListRelations: "dri" | "subNutrients" | "NutritionLabelNutrients" | "mappings";
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
            NutritionLabelNutrients: {
                Shape: NutritionLabelNutrient[];
                Name: "NutritionLabelNutrient";
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