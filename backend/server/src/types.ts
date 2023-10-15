/* eslint-disable */
import type { Prisma, MealPlan, Servings, Import, ImportRecord, RecipeIngredient, RecipeIngredientGroup, Ingredient, ExpirationRule, IngredientAlternateName, IngredientPrice, Recipe, Course, Category, Cuisine, Photo, RecipePhotos, NutritionLabel, NutritionLabelNutrient, Nutrient, DailyReferenceIntake, HealthProfile } from "@prisma/client";
export default interface PrismaTypes {
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
        RelationName: "servings";
        ListRelations: "servings";
        Relations: {
            servings: {
                Shape: Servings[];
                Name: "Servings";
            };
        };
    };
    Servings: {
        Name: "Servings";
        Shape: Servings;
        Include: Prisma.ServingsInclude;
        Select: Prisma.ServingsSelect;
        OrderBy: Prisma.ServingsOrderByWithRelationInput;
        WhereUnique: Prisma.ServingsWhereUniqueInput;
        Where: Prisma.ServingsWhereInput;
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
                Shape: Recipe;
                Name: "Recipe";
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
        RelationName: "recipe" | "ingredient" | "group";
        ListRelations: never;
        Relations: {
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
        RelationName: "ingredients" | "nutritionLabel";
        ListRelations: "ingredients";
        Relations: {
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
        RelationName: "recipeIngredient" | "alternateNames" | "priceHistory" | "expirationRule";
        ListRelations: "recipeIngredient" | "alternateNames" | "priceHistory";
        Relations: {
            recipeIngredient: {
                Shape: RecipeIngredient[];
                Name: "RecipeIngredient";
            };
            alternateNames: {
                Shape: IngredientAlternateName[];
                Name: "IngredientAlternateName";
            };
            priceHistory: {
                Shape: IngredientPrice[];
                Name: "IngredientPrice";
            };
            expirationRule: {
                Shape: ExpirationRule | null;
                Name: "ExpirationRule";
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
    IngredientAlternateName: {
        Name: "IngredientAlternateName";
        Shape: IngredientAlternateName;
        Include: Prisma.IngredientAlternateNameInclude;
        Select: Prisma.IngredientAlternateNameSelect;
        OrderBy: Prisma.IngredientAlternateNameOrderByWithRelationInput;
        WhereUnique: Prisma.IngredientAlternateNameWhereUniqueInput;
        Where: Prisma.IngredientAlternateNameWhereInput;
        Create: {};
        Update: {};
        RelationName: "ingredient";
        ListRelations: never;
        Relations: {
            ingredient: {
                Shape: Ingredient;
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
        RelationName: "ingredient";
        ListRelations: never;
        Relations: {
            ingredient: {
                Shape: Ingredient;
                Name: "Ingredient";
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
        RelationName: "photos" | "childRecipes" | "parentRecipes" | "course" | "category" | "cuisine" | "ingredients" | "mealPlans" | "nutritionLabel" | "importRecords";
        ListRelations: "photos" | "childRecipes" | "parentRecipes" | "category" | "ingredients" | "mealPlans" | "nutritionLabel" | "importRecords";
        Relations: {
            photos: {
                Shape: RecipePhotos[];
                Name: "RecipePhotos";
            };
            childRecipes: {
                Shape: Recipe[];
                Name: "Recipe";
            };
            parentRecipes: {
                Shape: Recipe[];
                Name: "Recipe";
            };
            course: {
                Shape: Course | null;
                Name: "Course";
            };
            category: {
                Shape: Category[];
                Name: "Category";
            };
            cuisine: {
                Shape: Cuisine | null;
                Name: "Cuisine";
            };
            ingredients: {
                Shape: RecipeIngredient[];
                Name: "RecipeIngredient";
            };
            mealPlans: {
                Shape: Servings[];
                Name: "Servings";
            };
            nutritionLabel: {
                Shape: NutritionLabel[];
                Name: "NutritionLabel";
            };
            importRecords: {
                Shape: ImportRecord[];
                Name: "ImportRecord";
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
        RelationName: "recipes";
        ListRelations: "recipes";
        Relations: {
            recipes: {
                Shape: RecipePhotos[];
                Name: "RecipePhotos";
            };
        };
    };
    RecipePhotos: {
        Name: "RecipePhotos";
        Shape: RecipePhotos;
        Include: Prisma.RecipePhotosInclude;
        Select: Prisma.RecipePhotosSelect;
        OrderBy: Prisma.RecipePhotosOrderByWithRelationInput;
        WhereUnique: Prisma.RecipePhotosWhereUniqueInput;
        Where: Prisma.RecipePhotosWhereInput;
        Create: {};
        Update: {};
        RelationName: "photo" | "recipe";
        ListRelations: never;
        Relations: {
            photo: {
                Shape: Photo;
                Name: "Photo";
            };
            recipe: {
                Shape: Recipe;
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
        RelationName: "recipe" | "ingredientGroup" | "nutrients" | "importRecord";
        ListRelations: "nutrients";
        Relations: {
            recipe: {
                Shape: Recipe | null;
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
            importRecord: {
                Shape: ImportRecord | null;
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
        RelationName: "dri" | "parentNutrient" | "subNutrients" | "NutritionLabelNutrients";
        ListRelations: "dri" | "subNutrients" | "NutritionLabelNutrients";
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