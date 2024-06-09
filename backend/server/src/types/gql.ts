import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: { input: Date; output: Date; }
  File: { input: File; output: File; }
};

export type AddRecipeInput = {
  cookDay?: InputMaybe<Scalars['Int']['input']>;
  mealPlanId: Scalars['String']['input'];
  recipeId: Scalars['String']['input'];
  scaleFactor: Scalars['Float']['input'];
  servings: Scalars['Int']['input'];
};

export type AddRecipeServingInput = {
  day: Scalars['Int']['input'];
  meal: Meal;
  mealPlanId: Scalars['String']['input'];
  mealPlanRecipeId: Scalars['String']['input'];
  servings: Scalars['Int']['input'];
};

export type AggLabelNutrient = {
  __typename?: 'AggLabelNutrient';
  id: Scalars['String']['output'];
  nutrient: Nutrient;
  perServing?: Maybe<Scalars['Float']['output']>;
  value: Scalars['Float']['output'];
};

export type AggregateLabel = {
  __typename?: 'AggregateLabel';
  alcohol?: Maybe<Scalars['Float']['output']>;
  caloriesPerServing?: Maybe<Scalars['Float']['output']>;
  carbs?: Maybe<Scalars['Float']['output']>;
  fat?: Maybe<Scalars['Float']['output']>;
  id: Scalars['ID']['output'];
  nutrients: Array<AggLabelNutrient>;
  protein?: Maybe<Scalars['Float']['output']>;
  recipe?: Maybe<Recipe>;
  servingSize?: Maybe<Scalars['Float']['output']>;
  servingSizeUnit?: Maybe<MeasurementUnit>;
  servings?: Maybe<Scalars['Float']['output']>;
  totalCalories?: Maybe<Scalars['Float']['output']>;
};

export type Category = {
  __typename?: 'Category';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  recipes: Array<Recipe>;
};

export type Course = {
  __typename?: 'Course';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  recipes: Array<Recipe>;
};

export type CreateExpirationRule = {
  defrostTime?: InputMaybe<Scalars['Float']['input']>;
  freezerLife: Scalars['Int']['input'];
  fridgeLife: Scalars['Int']['input'];
  ingredientId?: InputMaybe<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
  perishable?: InputMaybe<Scalars['Boolean']['input']>;
  tableLife: Scalars['Int']['input'];
  variation?: InputMaybe<Scalars['String']['input']>;
};

export type CreateIngredientInput = {
  alternateNames?: InputMaybe<Array<Scalars['String']['input']>>;
  name: Scalars['String']['input'];
  storageInstructions?: InputMaybe<Scalars['String']['input']>;
};

export type CreateNutrientInput = {
  nutrientId: Scalars['String']['input'];
  value: Scalars['Float']['input'];
};

export type CreateNutritionLabelInput = {
  isPrimary?: InputMaybe<Scalars['Boolean']['input']>;
  nutrients?: InputMaybe<Array<CreateNutrientInput>>;
  servingSize?: InputMaybe<Scalars['Float']['input']>;
  servingSizeUnitId?: InputMaybe<Scalars['String']['input']>;
  servings: Scalars['Float']['input'];
  servingsUsed?: InputMaybe<Scalars['Float']['input']>;
};

export type CreatePriceHistoryInput = {
  date: Scalars['DateTime']['input'];
  foodType?: InputMaybe<FoodType>;
  groceryStore: Scalars['String']['input'];
  ingredientId: Scalars['String']['input'];
  price: Scalars['Float']['input'];
  pricePerUnit: Scalars['Float']['input'];
  quantity: Scalars['Float']['input'];
  recieptLineId?: InputMaybe<Scalars['String']['input']>;
  unitId: Scalars['String']['input'];
};

export type CreateUnitInput = {
  abbreviations: Array<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  symbol?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<UnitType>;
};

export type Cuisine = {
  __typename?: 'Cuisine';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  recipes: Array<Recipe>;
};

export type CursorPagination = {
  cursor?: InputMaybe<Scalars['DateTime']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type DailyReferenceIntake = {
  __typename?: 'DailyReferenceIntake';
  id: Scalars['String']['output'];
  value: Scalars['Float']['output'];
};

export type EditMealPlanInput = {
  id: Scalars['String']['input'];
  mealPrepInstructions?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type EditMealPlanRecipeInput = {
  factor?: InputMaybe<Scalars['Float']['input']>;
  servings?: InputMaybe<Scalars['Int']['input']>;
};

export type EditNutritionLabelInput = {
  id: Scalars['String']['input'];
  ingredientGroupId?: InputMaybe<Scalars['String']['input']>;
  isPrimary?: InputMaybe<Scalars['Boolean']['input']>;
  nutrientsToAdd?: InputMaybe<Array<CreateNutrientInput>>;
  nutrientsToDelete?: InputMaybe<Array<Scalars['String']['input']>>;
  nutrientsToEdit?: InputMaybe<Array<CreateNutrientInput>>;
  servingSize?: InputMaybe<Scalars['Float']['input']>;
  servingSizeUnitId?: InputMaybe<Scalars['String']['input']>;
  servings?: InputMaybe<Scalars['Float']['input']>;
  servingsUsed?: InputMaybe<Scalars['Float']['input']>;
};

export type EditPriceHistoryInput = {
  date?: InputMaybe<Scalars['DateTime']['input']>;
  foodType?: InputMaybe<FoodType>;
  groceryStore?: InputMaybe<Scalars['String']['input']>;
  ingredientId?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['Float']['input']>;
  pricePerUnit?: InputMaybe<Scalars['Float']['input']>;
  quantity?: InputMaybe<Scalars['Float']['input']>;
  recieptLineId?: InputMaybe<Scalars['String']['input']>;
  unitId?: InputMaybe<Scalars['String']['input']>;
};

export type EditRecipeServingInput = {
  day: Scalars['Int']['input'];
  id: Scalars['String']['input'];
  meal: Meal;
  servings: Scalars['Int']['input'];
};

export type ExpirationRule = {
  __typename?: 'ExpirationRule';
  defrostTime?: Maybe<Scalars['Int']['output']>;
  freezerLife?: Maybe<Scalars['Int']['output']>;
  fridgeLife?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  perishable?: Maybe<Scalars['Boolean']['output']>;
  tableLife?: Maybe<Scalars['Int']['output']>;
  variation?: Maybe<Scalars['String']['output']>;
};

export type ExpirationRulesQuery = {
  __typename?: 'ExpirationRulesQuery';
  items: Array<ExpirationRule>;
  itemsRemaining: Scalars['Int']['output'];
  nextOffset?: Maybe<Scalars['Int']['output']>;
};

export enum FoodType {
  Canned = 'CANNED',
  Fresh = 'FRESH',
  Frozen = 'FROZEN',
  Packaged = 'PACKAGED'
}

export enum Gender {
  Female = 'FEMALE',
  Male = 'MALE'
}

export type GroceryStore = {
  __typename?: 'GroceryStore';
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type GroupedRecipeIngredient = {
  __typename?: 'GroupedRecipeIngredient';
  ingredientId?: Maybe<Scalars['String']['output']>;
  ingredientName?: Maybe<Scalars['String']['output']>;
  recipeIngredients: Array<RecipeIngredients>;
};

export type HealthProfile = {
  __typename?: 'HealthProfile';
  activityLevel?: Maybe<Scalars['Float']['output']>;
  age: Scalars['Int']['output'];
  bodyFatPercentage?: Maybe<Scalars['Float']['output']>;
  gender: Scalars['String']['output'];
  height?: Maybe<Scalars['Float']['output']>;
  id: Scalars['String']['output'];
  specialCondition: SpecialCondition;
  targetCarbsGrams?: Maybe<Scalars['Float']['output']>;
  targetCarbsPercentage?: Maybe<Scalars['Float']['output']>;
  targetFatGrams?: Maybe<Scalars['Float']['output']>;
  targetFatPercentage?: Maybe<Scalars['Float']['output']>;
  targetProteinGrams?: Maybe<Scalars['Float']['output']>;
  targetProteinPecentage?: Maybe<Scalars['Float']['output']>;
  weight?: Maybe<Scalars['Float']['output']>;
};

export enum ImportStatus {
  Completed = 'COMPLETED',
  Duplicate = 'DUPLICATE',
  Failed = 'FAILED',
  Pending = 'PENDING',
  Review = 'REVIEW'
}

export enum ImportType {
  Cronometer = 'CRONOMETER',
  RecipeKeeper = 'RECIPE_KEEPER'
}

export type Ingredient = {
  __typename?: 'Ingredient';
  alternateNames: Array<Scalars['String']['output']>;
  expiration?: Maybe<ExpirationRule>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  priceHistory?: Maybe<Array<IngredientPriceHistory>>;
  storageInstructions?: Maybe<Scalars['String']['output']>;
};

export type IngredientFilter = {
  amount?: InputMaybe<NumericalComparison>;
  ingredientID: Scalars['String']['input'];
  unitId?: InputMaybe<Scalars['String']['input']>;
};

export type IngredientPriceHistory = {
  __typename?: 'IngredientPriceHistory';
  date?: Maybe<Scalars['DateTime']['output']>;
  foodType?: Maybe<FoodType>;
  groceryStore: GroceryStore;
  id: Scalars['String']['output'];
  ingredient: Ingredient;
  price: Scalars['Float']['output'];
  pricePerUnit: Scalars['Float']['output'];
  quantity: Scalars['Float']['output'];
  receiptLine: ReceiptLine;
  unit: MeasurementUnit;
};

export type IngredientsQuery = {
  __typename?: 'IngredientsQuery';
  ingredients: Array<Ingredient>;
  itemsRemaining: Scalars['Int']['output'];
  nextOffset?: Maybe<Scalars['Int']['output']>;
};

export type MacroFilter = {
  alcoholPerServing?: InputMaybe<NumericalComparison>;
  caloriePerServing?: InputMaybe<NumericalComparison>;
  carbPerServing?: InputMaybe<NumericalComparison>;
  fatPerServing?: InputMaybe<NumericalComparison>;
  protienPerServing?: InputMaybe<NumericalComparison>;
};

export enum Meal {
  Breakfast = 'BREAKFAST',
  Dinner = 'DINNER',
  Lunch = 'LUNCH',
  Snack = 'SNACK'
}

export type MealPlan = {
  __typename?: 'MealPlan';
  id: Scalars['ID']['output'];
  mealPlanServings: Array<MealPlanServing>;
  mealPrepInstructions?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  planRecipes: Array<MealPlanRecipe>;
  schedules: Array<ScheduledPlan>;
  shopppingDays: Array<Scalars['Int']['output']>;
};

export type MealPlanRecipe = {
  __typename?: 'MealPlanRecipe';
  factor: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  mealPlan: MealPlan;
  mealPlanServings: Array<MealPlanServing>;
  originalRecipe: Recipe;
  servingsOnPlan: Scalars['Int']['output'];
  totalServings: Scalars['Int']['output'];
};

export type MealPlanServing = {
  __typename?: 'MealPlanServing';
  day: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  meal: Scalars['String']['output'];
  mealPlanRecipeId: Scalars['String']['output'];
  numberOfServings: Scalars['Int']['output'];
};

export type MeasurementUnit = {
  __typename?: 'MeasurementUnit';
  abbreviations: Array<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  symbol?: Maybe<Scalars['String']['output']>;
  type?: Maybe<UnitType>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addCategoryToRecipe: Array<Category>;
  addCourseToRecipe: Recipe;
  addCuisineToRecipe: Recipe;
  addPhotoToRecipe: Recipe;
  addPriceHistory: IngredientPriceHistory;
  addRecipeServing: MealPlanServing;
  addRecipeToMealPlan: MealPlanRecipe;
  connectExpirationRule: Ingredient;
  createCategory: Array<Category>;
  createCourse: Array<Course>;
  createCuisine: Array<Cuisine>;
  createExpirationRule: ExpirationRule;
  createIngredient: Ingredient;
  createMealPlan: MealPlan;
  createNutritionLabels: NutritionLabel;
  createProfile: HealthProfile;
  createRecipe: Recipe;
  createUnit: MeasurementUnit;
  deleteCategory: Array<Category>;
  deleteCourse: Array<Course>;
  deleteCuisine: Array<Cuisine>;
  deleteExpirationRule: Array<ExpirationRule>;
  deleteIngredient: Array<Ingredient>;
  deleteMealPlan: Array<MealPlan>;
  deleteNutritionLabel: Array<NutritionLabel>;
  deletePriceHistory: Array<IngredientPriceHistory>;
  deleteRecipeServing: Array<MealPlanServing>;
  deleteRecipes: Array<Recipe>;
  editExpirationRule: ExpirationRule;
  editIngredient: Ingredient;
  editMealPlan: MealPlan;
  editMealPlanRecipe: Array<MealPlanRecipe>;
  editNutritionLabel: NutritionLabel;
  editPriceHistory: IngredientPriceHistory;
  editProfile: HealthProfile;
  editRecipeServing: Array<MealPlanServing>;
  finalizeReceipt: Receipt;
  mergeIngredients: Ingredient;
  removeCategoryFromRecipe: Array<Category>;
  removeCourseFromRecipe: Recipe;
  removeCuisineFromRecipe: Recipe;
  removeMealPlanRecipe: Array<MealPlanRecipe>;
  removePhotoFromRecipe: Recipe;
  scheduleMealPlan: ScheduledPlan;
  setNutritionTarget: Nutrient;
  updateReceipt: Receipt;
  updateReceiptLine: ReceiptLine;
  updateRecipe: Recipe;
  updateRecipeIngredients: Array<RecipeIngredients>;
  updateShoppingDays: Array<Scalars['Int']['output']>;
  uploadPhoto: Photo;
  uploadReceipt: Receipt;
};


export type MutationAddCategoryToRecipeArgs = {
  categoryName: Scalars['String']['input'];
  recipeId: Scalars['String']['input'];
};


export type MutationAddCourseToRecipeArgs = {
  course: Scalars['String']['input'];
  recipeId: Scalars['String']['input'];
};


export type MutationAddCuisineToRecipeArgs = {
  cuisineId: Array<Scalars['String']['input']>;
  recipeId: Scalars['String']['input'];
};


export type MutationAddPhotoToRecipeArgs = {
  photoId: Array<Scalars['String']['input']>;
  recipeId: Scalars['String']['input'];
};


export type MutationAddPriceHistoryArgs = {
  price: CreatePriceHistoryInput;
};


export type MutationAddRecipeServingArgs = {
  serving: AddRecipeServingInput;
};


export type MutationAddRecipeToMealPlanArgs = {
  recipe: AddRecipeInput;
};


export type MutationConnectExpirationRuleArgs = {
  expirationRuleId: Scalars['String']['input'];
  ingredientId: Scalars['String']['input'];
};


export type MutationCreateCategoryArgs = {
  name: Scalars['String']['input'];
};


export type MutationCreateCourseArgs = {
  name: Scalars['String']['input'];
};


export type MutationCreateCuisineArgs = {
  name: Scalars['String']['input'];
};


export type MutationCreateExpirationRuleArgs = {
  ingredientId: Scalars['String']['input'];
  rule: CreateExpirationRule;
};


export type MutationCreateIngredientArgs = {
  ingredient: CreateIngredientInput;
};


export type MutationCreateMealPlanArgs = {
  name: Scalars['String']['input'];
};


export type MutationCreateNutritionLabelsArgs = {
  ingredientGroupId?: InputMaybe<Scalars['String']['input']>;
  nutritionLabel: CreateNutritionLabelInput;
  recipeId: Scalars['String']['input'];
};


export type MutationCreateProfileArgs = {
  profile: ProfileInput;
};


export type MutationCreateRecipeArgs = {
  recipe: RecipeInput;
};


export type MutationCreateUnitArgs = {
  input: CreateUnitInput;
};


export type MutationDeleteCategoryArgs = {
  categoryId: Scalars['String']['input'];
};


export type MutationDeleteCourseArgs = {
  courseId: Scalars['String']['input'];
};


export type MutationDeleteCuisineArgs = {
  cuisineId: Scalars['String']['input'];
};


export type MutationDeleteExpirationRuleArgs = {
  expirationRuleId: Scalars['String']['input'];
};


export type MutationDeleteIngredientArgs = {
  ingredientToDeleteId: Scalars['String']['input'];
};


export type MutationDeleteMealPlanArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteNutritionLabelArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeletePriceHistoryArgs = {
  ingredientId: Scalars['String']['input'];
  ingredientPriceId: Scalars['String']['input'];
};


export type MutationDeleteRecipeServingArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteRecipesArgs = {
  recipeIds: Array<Scalars['String']['input']>;
};


export type MutationEditExpirationRuleArgs = {
  expirationRule: CreateExpirationRule;
  expirationRuleId: Scalars['String']['input'];
};


export type MutationEditIngredientArgs = {
  ingredient: CreateIngredientInput;
  ingredientId: Scalars['String']['input'];
};


export type MutationEditMealPlanArgs = {
  mealPlan: EditMealPlanInput;
};


export type MutationEditMealPlanRecipeArgs = {
  id: Scalars['String']['input'];
  recipe: EditMealPlanRecipeInput;
};


export type MutationEditNutritionLabelArgs = {
  label: EditNutritionLabelInput;
};


export type MutationEditPriceHistoryArgs = {
  price: EditPriceHistoryInput;
  priceId: Scalars['String']['input'];
};


export type MutationEditProfileArgs = {
  id: Scalars['String']['input'];
  profile: ProfileInput;
};


export type MutationEditRecipeServingArgs = {
  serving: EditRecipeServingInput;
};


export type MutationFinalizeReceiptArgs = {
  receiptId: Scalars['String']['input'];
};


export type MutationMergeIngredientsArgs = {
  ingredientIdToDelete: Scalars['String']['input'];
  ingredientIdToKeep: Scalars['String']['input'];
};


export type MutationRemoveCategoryFromRecipeArgs = {
  categoryId: Scalars['String']['input'];
  recipeId: Scalars['String']['input'];
};


export type MutationRemoveCourseFromRecipeArgs = {
  courseId: Scalars['String']['input'];
  recipeId: Scalars['String']['input'];
};


export type MutationRemoveCuisineFromRecipeArgs = {
  cuisineId: Scalars['String']['input'];
  recipeId: Scalars['String']['input'];
};


export type MutationRemoveMealPlanRecipeArgs = {
  id: Scalars['String']['input'];
};


export type MutationRemovePhotoFromRecipeArgs = {
  photoIds: Array<Scalars['String']['input']>;
  recipeId: Scalars['String']['input'];
};


export type MutationScheduleMealPlanArgs = {
  mealPlanId: Scalars['String']['input'];
  startDate: Scalars['DateTime']['input'];
};


export type MutationSetNutritionTargetArgs = {
  nutrientId: Scalars['String']['input'];
  target: Scalars['Float']['input'];
};


export type MutationUpdateReceiptArgs = {
  receipt: UpdateReceipt;
  receiptId: Scalars['String']['input'];
};


export type MutationUpdateReceiptLineArgs = {
  line: UpdateReceiptItem;
  lineId: Scalars['String']['input'];
};


export type MutationUpdateRecipeArgs = {
  recipe: RecipeInput;
  recipeId: Scalars['String']['input'];
};


export type MutationUpdateRecipeIngredientsArgs = {
  ingredient: RecipeIngredientUpdateInput;
};


export type MutationUpdateShoppingDaysArgs = {
  days: Array<Scalars['Int']['input']>;
  mealPlanId: Scalars['String']['input'];
};


export type MutationUploadPhotoArgs = {
  isPrimary: Scalars['Boolean']['input'];
  photo: Scalars['File']['input'];
};


export type MutationUploadReceiptArgs = {
  file: Scalars['File']['input'];
};

export type NumericalComparison = {
  eq?: InputMaybe<Scalars['Int']['input']>;
  gte?: InputMaybe<Scalars['Int']['input']>;
  lte?: InputMaybe<Scalars['Int']['input']>;
};

export type Nutrient = {
  __typename?: 'Nutrient';
  advancedView: Scalars['Boolean']['output'];
  alternateNames: Array<Scalars['String']['output']>;
  customTarget?: Maybe<Scalars['Float']['output']>;
  dri?: Maybe<DailyReferenceIntake>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  parentNutrientId?: Maybe<Scalars['String']['output']>;
  type: Scalars['String']['output'];
  unit: MeasurementUnit;
};

export enum NutrientType {
  Alcohol = 'ALCOHOL',
  Carbohydrate = 'CARBOHYDRATE',
  Fat = 'FAT',
  General = 'GENERAL',
  Mineral = 'MINERAL',
  Other = 'OTHER',
  Protein = 'PROTEIN',
  Vitamin = 'VITAMIN'
}

export type NutrientsQuery = {
  __typename?: 'NutrientsQuery';
  items: Array<Nutrient>;
  itemsRemaining: Scalars['Int']['output'];
  nextOffset?: Maybe<Scalars['Int']['output']>;
};

export type NutritionFilter = {
  nutrientId: Scalars['String']['input'];
  perServing?: InputMaybe<Scalars['Boolean']['input']>;
  target: NumericalComparison;
};

export type NutritionLabel = {
  __typename?: 'NutritionLabel';
  id: Scalars['ID']['output'];
  ingredientGroup: RecipeIngredientGroup;
  isPrimary: Scalars['Boolean']['output'];
  recipe?: Maybe<Recipe>;
  servingSize?: Maybe<Scalars['Float']['output']>;
  servingSizeUnit?: Maybe<MeasurementUnit>;
  servings?: Maybe<Scalars['Float']['output']>;
  servingsUsed?: Maybe<Scalars['Float']['output']>;
};

export type NutritionLabelNutrient = {
  __typename?: 'NutritionLabelNutrient';
  nutrient: Nutrient;
  value: Scalars['Float']['output'];
};

export type NutritionLabelQuery = {
  __typename?: 'NutritionLabelQuery';
  items: Array<NutritionLabel>;
  itemsRemaining: Scalars['Int']['output'];
  nextOffset?: Maybe<Scalars['Int']['output']>;
};

export type OffsetPagination = {
  offset: Scalars['Int']['input'];
  take: Scalars['Int']['input'];
};

export type Photo = {
  __typename?: 'Photo';
  id: Scalars['ID']['output'];
  isPrimary: Scalars['Boolean']['output'];
  url: Scalars['String']['output'];
};

export enum PrismaImportType {
  Cronometer = 'CRONOMETER',
  Dri = 'DRI',
  MyFitnessPal = 'MY_FITNESS_PAL',
  RecipeKeeper = 'RECIPE_KEEPER',
  Web = 'WEB'
}

export type ProfileInput = {
  activityLevel: Scalars['Float']['input'];
  birthYear: Scalars['Int']['input'];
  bodyFatPercentage: Scalars['Float']['input'];
  gender: Gender;
  height: Scalars['Float']['input'];
  specialCondition: SpecialCondition;
  targetCarbsGrams?: InputMaybe<Scalars['Float']['input']>;
  targetCarbsPercentage?: InputMaybe<Scalars['Float']['input']>;
  targetFatGrams?: InputMaybe<Scalars['Float']['input']>;
  targetFatPercentage?: InputMaybe<Scalars['Float']['input']>;
  targetProteinGrams?: InputMaybe<Scalars['Float']['input']>;
  targetProteinPecentage?: InputMaybe<Scalars['Float']['input']>;
  weight?: InputMaybe<Scalars['Float']['input']>;
};

export type Query = {
  __typename?: 'Query';
  categories: Array<Category>;
  courses: Array<Course>;
  cuisines: Array<Cuisine>;
  expirationRule: ExpirationRule;
  expirationRules: ExpirationRulesQuery;
  groupedRecipeIngredients: Array<GroupedRecipeIngredient>;
  healthProfile: HealthProfile;
  ingredient: Ingredient;
  ingredientPrice: IngredientPriceHistory;
  ingredients: IngredientsQuery;
  mealPlan: MealPlan;
  mealPlanRecipes: Array<MealPlanRecipe>;
  mealPlanServings: Array<MealPlanServing>;
  mealPlans: Array<MealPlan>;
  nutrients: NutrientsQuery;
  nutritionLabel: NutritionLabel;
  nutritionLabels: NutritionLabelQuery;
  priceHistory: Array<IngredientPriceHistory>;
  receipt: Receipt;
  recipe: Recipe;
  recipes: RecipesQuery;
  stores: StoreSearch;
  unit: MeasurementUnit;
  units: UnitQuery;
};


export type QueryCategoriesArgs = {
  searchString?: InputMaybe<Scalars['String']['input']>;
};


export type QueryCoursesArgs = {
  searchString?: InputMaybe<Scalars['String']['input']>;
};


export type QueryCuisinesArgs = {
  searchString?: InputMaybe<Scalars['String']['input']>;
};


export type QueryExpirationRuleArgs = {
  expirationRuleId: Scalars['String']['input'];
};


export type QueryExpirationRulesArgs = {
  pagination: OffsetPagination;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGroupedRecipeIngredientsArgs = {
  recipeIds: Array<Scalars['String']['input']>;
};


export type QueryIngredientArgs = {
  ingredientId: Scalars['String']['input'];
};


export type QueryIngredientPriceArgs = {
  ingredientPriceId: Scalars['String']['input'];
};


export type QueryIngredientsArgs = {
  pagination: OffsetPagination;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryMealPlanArgs = {
  id: Scalars['String']['input'];
};


export type QueryMealPlanRecipesArgs = {
  mealPlanId: Scalars['String']['input'];
};


export type QueryMealPlanServingsArgs = {
  maxDay?: InputMaybe<Scalars['Int']['input']>;
  mealPlanId: Scalars['String']['input'];
  minDay?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryNutrientsArgs = {
  advanced: Scalars['Boolean']['input'];
  pagination: OffsetPagination;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryNutritionLabelArgs = {
  labelId: Scalars['String']['input'];
};


export type QueryNutritionLabelsArgs = {
  pagination: OffsetPagination;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryPriceHistoryArgs = {
  ingredientId: Scalars['String']['input'];
};


export type QueryReceiptArgs = {
  id: Scalars['String']['input'];
};


export type QueryRecipeArgs = {
  recipeId: Scalars['String']['input'];
};


export type QueryRecipesArgs = {
  filter?: InputMaybe<RecipeFilter>;
  pagination: OffsetPagination;
};


export type QueryStoresArgs = {
  pagination: OffsetPagination;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryUnitArgs = {
  id: Scalars['String']['input'];
};


export type QueryUnitsArgs = {
  pagination: OffsetPagination;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type Receipt = {
  __typename?: 'Receipt';
  date?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['String']['output'];
  imagePath: Scalars['String']['output'];
  items?: Maybe<Array<ReceiptLine>>;
  merchantName?: Maybe<Scalars['String']['output']>;
  scanned: Scalars['Boolean']['output'];
  total?: Maybe<Scalars['Float']['output']>;
};

export type ReceiptLine = {
  __typename?: 'ReceiptLine';
  description?: Maybe<Scalars['String']['output']>;
  foodType?: Maybe<FoodType>;
  id: Scalars['String']['output'];
  matchingIngredient?: Maybe<Ingredient>;
  matchingUnit?: Maybe<MeasurementUnit>;
  perUnitPrice?: Maybe<Scalars['Float']['output']>;
  quantity?: Maybe<Scalars['Float']['output']>;
  totalPrice?: Maybe<Scalars['Float']['output']>;
  unitQuantity?: Maybe<Scalars['String']['output']>;
};

export type Recipe = {
  __typename?: 'Recipe';
  aggregateLabel?: Maybe<AggregateLabel>;
  category: Array<Category>;
  cookTime?: Maybe<Scalars['Int']['output']>;
  course: Array<Course>;
  cuisine: Array<Cuisine>;
  directions?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  ingredientFreshness?: Maybe<Scalars['Int']['output']>;
  ingredients: Array<RecipeIngredients>;
  isFavorite: Scalars['Boolean']['output'];
  leftoverFreezerLife?: Maybe<Scalars['Int']['output']>;
  leftoverFridgeLife?: Maybe<Scalars['Int']['output']>;
  marinadeTime?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  nutritionLabels?: Maybe<Array<NutritionLabel>>;
  photos: Array<Photo>;
  prepTime?: Maybe<Scalars['Int']['output']>;
  source?: Maybe<Scalars['String']['output']>;
  totalTime?: Maybe<Scalars['Int']['output']>;
  verified: Scalars['Boolean']['output'];
};

export type RecipeFilter = {
  categoryIds?: InputMaybe<Array<Scalars['String']['input']>>;
  cookTime?: InputMaybe<NumericalComparison>;
  courseIds?: InputMaybe<Array<Scalars['String']['input']>>;
  cuisineId?: InputMaybe<Array<Scalars['String']['input']>>;
  ingredientFilter?: InputMaybe<Array<IngredientFilter>>;
  ingredientFreshDays?: InputMaybe<NumericalComparison>;
  isFavorite?: InputMaybe<Scalars['Boolean']['input']>;
  leftoverFreezerLife?: InputMaybe<NumericalComparison>;
  leftoverFridgeLife?: InputMaybe<NumericalComparison>;
  macroFilter?: InputMaybe<MacroFilter>;
  marinadeTime?: InputMaybe<NumericalComparison>;
  numOfServings?: InputMaybe<NumericalComparison>;
  nutrientFilters?: InputMaybe<Array<NutritionFilter>>;
  prepTime?: InputMaybe<NumericalComparison>;
  searchString?: InputMaybe<Scalars['String']['input']>;
  totalPrepTime?: InputMaybe<NumericalComparison>;
};

export type RecipeIngredientGroup = {
  __typename?: 'RecipeIngredientGroup';
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  nutritionLabel?: Maybe<NutritionLabel>;
};

export type RecipeIngredientInput = {
  groupId?: InputMaybe<Scalars['String']['input']>;
  groupName?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  ingredientId?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
  sentence?: InputMaybe<Scalars['String']['input']>;
  unitId?: InputMaybe<Scalars['String']['input']>;
};

export type RecipeIngredientUpdateInput = {
  groupsToAdd?: InputMaybe<Array<Scalars['String']['input']>>;
  groupsToDelete?: InputMaybe<Array<Scalars['String']['input']>>;
  ingredientsToAdd?: InputMaybe<Array<RecipeIngredientInput>>;
  ingredientsToDelete?: InputMaybe<Array<Scalars['String']['input']>>;
  ingredientsToUpdate?: InputMaybe<Array<RecipeIngredientInput>>;
  recipeId: Scalars['String']['input'];
};

export type RecipeIngredients = {
  __typename?: 'RecipeIngredients';
  baseIngredient?: Maybe<Ingredient>;
  group?: Maybe<RecipeIngredientGroup>;
  id: Scalars['String']['output'];
  name?: Maybe<Scalars['String']['output']>;
  order: Scalars['Int']['output'];
  quantity?: Maybe<Scalars['Float']['output']>;
  recipe: Recipe;
  sentence: Scalars['String']['output'];
  unit?: Maybe<MeasurementUnit>;
};

export type RecipeInput = {
  categoryIds?: InputMaybe<Array<Scalars['String']['input']>>;
  cookTime?: InputMaybe<Scalars['Int']['input']>;
  courseIds?: InputMaybe<Array<Scalars['String']['input']>>;
  cuisineIds?: InputMaybe<Array<Scalars['String']['input']>>;
  directions?: InputMaybe<Scalars['String']['input']>;
  ingredients?: InputMaybe<Scalars['String']['input']>;
  isFavorite?: InputMaybe<Scalars['Boolean']['input']>;
  leftoverFreezerLife?: InputMaybe<Scalars['Int']['input']>;
  leftoverFridgeLife?: InputMaybe<Scalars['Int']['input']>;
  marinadeTime?: InputMaybe<Scalars['Int']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  photoIds?: InputMaybe<Array<Scalars['String']['input']>>;
  prepTime?: InputMaybe<Scalars['Int']['input']>;
  source?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};

export type RecipesQuery = {
  __typename?: 'RecipesQuery';
  itemsRemaining: Scalars['Int']['output'];
  nextOffset?: Maybe<Scalars['Int']['output']>;
  recipes: Array<Recipe>;
};

export enum RecordStatus {
  Duplicate = 'DUPLICATE',
  Failed = 'FAILED',
  Ignored = 'IGNORED',
  Imported = 'IMPORTED',
  Updated = 'UPDATED'
}

export type ScheduledPlan = {
  __typename?: 'ScheduledPlan';
  duration: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  mealPlan: MealPlan;
  startDate: Scalars['DateTime']['output'];
};

export enum SpecialCondition {
  Lactating = 'LACTATING',
  None = 'NONE',
  Pregnant = 'PREGNANT'
}

export type StoreSearch = {
  __typename?: 'StoreSearch';
  itemsRemaining: Scalars['Int']['output'];
  nextOffset?: Maybe<Scalars['Int']['output']>;
  stores: Array<GroceryStore>;
};

export type UnitQuery = {
  __typename?: 'UnitQuery';
  items: Array<MeasurementUnit>;
  itemsRemaining: Scalars['Int']['output'];
  nextOffset?: Maybe<Scalars['Int']['output']>;
};

export enum UnitType {
  Count = 'COUNT',
  Energy = 'ENERGY',
  Volume = 'VOLUME',
  Weight = 'WEIGHT'
}

export type UpdateReceipt = {
  date?: InputMaybe<Scalars['DateTime']['input']>;
  store?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateReceiptItem = {
  description?: InputMaybe<Scalars['String']['input']>;
  foodType?: InputMaybe<FoodType>;
  ingredientId?: InputMaybe<Scalars['String']['input']>;
  perUnitPrice?: InputMaybe<Scalars['Float']['input']>;
  productCode?: InputMaybe<Scalars['String']['input']>;
  quantity?: InputMaybe<Scalars['Float']['input']>;
  totalPrice?: InputMaybe<Scalars['Float']['input']>;
  unitId?: InputMaybe<Scalars['String']['input']>;
  unitQuantity?: InputMaybe<Scalars['String']['input']>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AddRecipeInput: AddRecipeInput;
  AddRecipeServingInput: AddRecipeServingInput;
  AggLabelNutrient: ResolverTypeWrapper<AggLabelNutrient>;
  AggregateLabel: ResolverTypeWrapper<AggregateLabel>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Category: ResolverTypeWrapper<Category>;
  Course: ResolverTypeWrapper<Course>;
  CreateExpirationRule: CreateExpirationRule;
  CreateIngredientInput: CreateIngredientInput;
  CreateNutrientInput: CreateNutrientInput;
  CreateNutritionLabelInput: CreateNutritionLabelInput;
  CreatePriceHistoryInput: CreatePriceHistoryInput;
  CreateUnitInput: CreateUnitInput;
  Cuisine: ResolverTypeWrapper<Cuisine>;
  CursorPagination: CursorPagination;
  DailyReferenceIntake: ResolverTypeWrapper<DailyReferenceIntake>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  EditMealPlanInput: EditMealPlanInput;
  EditMealPlanRecipeInput: EditMealPlanRecipeInput;
  EditNutritionLabelInput: EditNutritionLabelInput;
  EditPriceHistoryInput: EditPriceHistoryInput;
  EditRecipeServingInput: EditRecipeServingInput;
  ExpirationRule: ResolverTypeWrapper<ExpirationRule>;
  ExpirationRulesQuery: ResolverTypeWrapper<ExpirationRulesQuery>;
  File: ResolverTypeWrapper<Scalars['File']['output']>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  FoodType: FoodType;
  Gender: Gender;
  GroceryStore: ResolverTypeWrapper<GroceryStore>;
  GroupedRecipeIngredient: ResolverTypeWrapper<GroupedRecipeIngredient>;
  HealthProfile: ResolverTypeWrapper<HealthProfile>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  ImportStatus: ImportStatus;
  ImportType: ImportType;
  Ingredient: ResolverTypeWrapper<Ingredient>;
  IngredientFilter: IngredientFilter;
  IngredientPriceHistory: ResolverTypeWrapper<IngredientPriceHistory>;
  IngredientsQuery: ResolverTypeWrapper<IngredientsQuery>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  MacroFilter: MacroFilter;
  Meal: Meal;
  MealPlan: ResolverTypeWrapper<MealPlan>;
  MealPlanRecipe: ResolverTypeWrapper<MealPlanRecipe>;
  MealPlanServing: ResolverTypeWrapper<MealPlanServing>;
  MeasurementUnit: ResolverTypeWrapper<MeasurementUnit>;
  Mutation: ResolverTypeWrapper<{}>;
  NumericalComparison: NumericalComparison;
  Nutrient: ResolverTypeWrapper<Nutrient>;
  NutrientType: NutrientType;
  NutrientsQuery: ResolverTypeWrapper<NutrientsQuery>;
  NutritionFilter: NutritionFilter;
  NutritionLabel: ResolverTypeWrapper<NutritionLabel>;
  NutritionLabelNutrient: ResolverTypeWrapper<NutritionLabelNutrient>;
  NutritionLabelQuery: ResolverTypeWrapper<NutritionLabelQuery>;
  OffsetPagination: OffsetPagination;
  Photo: ResolverTypeWrapper<Photo>;
  PrismaImportType: PrismaImportType;
  ProfileInput: ProfileInput;
  Query: ResolverTypeWrapper<{}>;
  Receipt: ResolverTypeWrapper<Receipt>;
  ReceiptLine: ResolverTypeWrapper<ReceiptLine>;
  Recipe: ResolverTypeWrapper<Recipe>;
  RecipeFilter: RecipeFilter;
  RecipeIngredientGroup: ResolverTypeWrapper<RecipeIngredientGroup>;
  RecipeIngredientInput: RecipeIngredientInput;
  RecipeIngredientUpdateInput: RecipeIngredientUpdateInput;
  RecipeIngredients: ResolverTypeWrapper<RecipeIngredients>;
  RecipeInput: RecipeInput;
  RecipesQuery: ResolverTypeWrapper<RecipesQuery>;
  RecordStatus: RecordStatus;
  ScheduledPlan: ResolverTypeWrapper<ScheduledPlan>;
  SpecialCondition: SpecialCondition;
  StoreSearch: ResolverTypeWrapper<StoreSearch>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  UnitQuery: ResolverTypeWrapper<UnitQuery>;
  UnitType: UnitType;
  UpdateReceipt: UpdateReceipt;
  UpdateReceiptItem: UpdateReceiptItem;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AddRecipeInput: AddRecipeInput;
  AddRecipeServingInput: AddRecipeServingInput;
  AggLabelNutrient: AggLabelNutrient;
  AggregateLabel: AggregateLabel;
  Boolean: Scalars['Boolean']['output'];
  Category: Category;
  Course: Course;
  CreateExpirationRule: CreateExpirationRule;
  CreateIngredientInput: CreateIngredientInput;
  CreateNutrientInput: CreateNutrientInput;
  CreateNutritionLabelInput: CreateNutritionLabelInput;
  CreatePriceHistoryInput: CreatePriceHistoryInput;
  CreateUnitInput: CreateUnitInput;
  Cuisine: Cuisine;
  CursorPagination: CursorPagination;
  DailyReferenceIntake: DailyReferenceIntake;
  DateTime: Scalars['DateTime']['output'];
  EditMealPlanInput: EditMealPlanInput;
  EditMealPlanRecipeInput: EditMealPlanRecipeInput;
  EditNutritionLabelInput: EditNutritionLabelInput;
  EditPriceHistoryInput: EditPriceHistoryInput;
  EditRecipeServingInput: EditRecipeServingInput;
  ExpirationRule: ExpirationRule;
  ExpirationRulesQuery: ExpirationRulesQuery;
  File: Scalars['File']['output'];
  Float: Scalars['Float']['output'];
  GroceryStore: GroceryStore;
  GroupedRecipeIngredient: GroupedRecipeIngredient;
  HealthProfile: HealthProfile;
  ID: Scalars['ID']['output'];
  Ingredient: Ingredient;
  IngredientFilter: IngredientFilter;
  IngredientPriceHistory: IngredientPriceHistory;
  IngredientsQuery: IngredientsQuery;
  Int: Scalars['Int']['output'];
  MacroFilter: MacroFilter;
  MealPlan: MealPlan;
  MealPlanRecipe: MealPlanRecipe;
  MealPlanServing: MealPlanServing;
  MeasurementUnit: MeasurementUnit;
  Mutation: {};
  NumericalComparison: NumericalComparison;
  Nutrient: Nutrient;
  NutrientsQuery: NutrientsQuery;
  NutritionFilter: NutritionFilter;
  NutritionLabel: NutritionLabel;
  NutritionLabelNutrient: NutritionLabelNutrient;
  NutritionLabelQuery: NutritionLabelQuery;
  OffsetPagination: OffsetPagination;
  Photo: Photo;
  ProfileInput: ProfileInput;
  Query: {};
  Receipt: Receipt;
  ReceiptLine: ReceiptLine;
  Recipe: Recipe;
  RecipeFilter: RecipeFilter;
  RecipeIngredientGroup: RecipeIngredientGroup;
  RecipeIngredientInput: RecipeIngredientInput;
  RecipeIngredientUpdateInput: RecipeIngredientUpdateInput;
  RecipeIngredients: RecipeIngredients;
  RecipeInput: RecipeInput;
  RecipesQuery: RecipesQuery;
  ScheduledPlan: ScheduledPlan;
  StoreSearch: StoreSearch;
  String: Scalars['String']['output'];
  UnitQuery: UnitQuery;
  UpdateReceipt: UpdateReceipt;
  UpdateReceiptItem: UpdateReceiptItem;
};

export type AggLabelNutrientResolvers<ContextType = any, ParentType extends ResolversParentTypes['AggLabelNutrient'] = ResolversParentTypes['AggLabelNutrient']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nutrient?: Resolver<ResolversTypes['Nutrient'], ParentType, ContextType>;
  perServing?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  value?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AggregateLabelResolvers<ContextType = any, ParentType extends ResolversParentTypes['AggregateLabel'] = ResolversParentTypes['AggregateLabel']> = {
  alcohol?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  caloriesPerServing?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  carbs?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  fat?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  nutrients?: Resolver<Array<ResolversTypes['AggLabelNutrient']>, ParentType, ContextType>;
  protein?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  recipe?: Resolver<Maybe<ResolversTypes['Recipe']>, ParentType, ContextType>;
  servingSize?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  servingSizeUnit?: Resolver<Maybe<ResolversTypes['MeasurementUnit']>, ParentType, ContextType>;
  servings?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  totalCalories?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CategoryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Category'] = ResolversParentTypes['Category']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  recipes?: Resolver<Array<ResolversTypes['Recipe']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CourseResolvers<ContextType = any, ParentType extends ResolversParentTypes['Course'] = ResolversParentTypes['Course']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  recipes?: Resolver<Array<ResolversTypes['Recipe']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CuisineResolvers<ContextType = any, ParentType extends ResolversParentTypes['Cuisine'] = ResolversParentTypes['Cuisine']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  recipes?: Resolver<Array<ResolversTypes['Recipe']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DailyReferenceIntakeResolvers<ContextType = any, ParentType extends ResolversParentTypes['DailyReferenceIntake'] = ResolversParentTypes['DailyReferenceIntake']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type ExpirationRuleResolvers<ContextType = any, ParentType extends ResolversParentTypes['ExpirationRule'] = ResolversParentTypes['ExpirationRule']> = {
  defrostTime?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  freezerLife?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  fridgeLife?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  perishable?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  tableLife?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  variation?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ExpirationRulesQueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['ExpirationRulesQuery'] = ResolversParentTypes['ExpirationRulesQuery']> = {
  items?: Resolver<Array<ResolversTypes['ExpirationRule']>, ParentType, ContextType>;
  itemsRemaining?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  nextOffset?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface FileScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['File'], any> {
  name: 'File';
}

export type GroceryStoreResolvers<ContextType = any, ParentType extends ResolversParentTypes['GroceryStore'] = ResolversParentTypes['GroceryStore']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GroupedRecipeIngredientResolvers<ContextType = any, ParentType extends ResolversParentTypes['GroupedRecipeIngredient'] = ResolversParentTypes['GroupedRecipeIngredient']> = {
  ingredientId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  ingredientName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  recipeIngredients?: Resolver<Array<ResolversTypes['RecipeIngredients']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type HealthProfileResolvers<ContextType = any, ParentType extends ResolversParentTypes['HealthProfile'] = ResolversParentTypes['HealthProfile']> = {
  activityLevel?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  age?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  bodyFatPercentage?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  gender?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  height?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  specialCondition?: Resolver<ResolversTypes['SpecialCondition'], ParentType, ContextType>;
  targetCarbsGrams?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  targetCarbsPercentage?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  targetFatGrams?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  targetFatPercentage?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  targetProteinGrams?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  targetProteinPecentage?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  weight?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IngredientResolvers<ContextType = any, ParentType extends ResolversParentTypes['Ingredient'] = ResolversParentTypes['Ingredient']> = {
  alternateNames?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  expiration?: Resolver<Maybe<ResolversTypes['ExpirationRule']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  priceHistory?: Resolver<Maybe<Array<ResolversTypes['IngredientPriceHistory']>>, ParentType, ContextType>;
  storageInstructions?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IngredientPriceHistoryResolvers<ContextType = any, ParentType extends ResolversParentTypes['IngredientPriceHistory'] = ResolversParentTypes['IngredientPriceHistory']> = {
  date?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  foodType?: Resolver<Maybe<ResolversTypes['FoodType']>, ParentType, ContextType>;
  groceryStore?: Resolver<ResolversTypes['GroceryStore'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ingredient?: Resolver<ResolversTypes['Ingredient'], ParentType, ContextType>;
  price?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  pricePerUnit?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  quantity?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  receiptLine?: Resolver<ResolversTypes['ReceiptLine'], ParentType, ContextType>;
  unit?: Resolver<ResolversTypes['MeasurementUnit'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IngredientsQueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['IngredientsQuery'] = ResolversParentTypes['IngredientsQuery']> = {
  ingredients?: Resolver<Array<ResolversTypes['Ingredient']>, ParentType, ContextType>;
  itemsRemaining?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  nextOffset?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MealPlanResolvers<ContextType = any, ParentType extends ResolversParentTypes['MealPlan'] = ResolversParentTypes['MealPlan']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  mealPlanServings?: Resolver<Array<ResolversTypes['MealPlanServing']>, ParentType, ContextType>;
  mealPrepInstructions?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  planRecipes?: Resolver<Array<ResolversTypes['MealPlanRecipe']>, ParentType, ContextType>;
  schedules?: Resolver<Array<ResolversTypes['ScheduledPlan']>, ParentType, ContextType>;
  shopppingDays?: Resolver<Array<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MealPlanRecipeResolvers<ContextType = any, ParentType extends ResolversParentTypes['MealPlanRecipe'] = ResolversParentTypes['MealPlanRecipe']> = {
  factor?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  mealPlan?: Resolver<ResolversTypes['MealPlan'], ParentType, ContextType>;
  mealPlanServings?: Resolver<Array<ResolversTypes['MealPlanServing']>, ParentType, ContextType>;
  originalRecipe?: Resolver<ResolversTypes['Recipe'], ParentType, ContextType>;
  servingsOnPlan?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalServings?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MealPlanServingResolvers<ContextType = any, ParentType extends ResolversParentTypes['MealPlanServing'] = ResolversParentTypes['MealPlanServing']> = {
  day?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  meal?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  mealPlanRecipeId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  numberOfServings?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MeasurementUnitResolvers<ContextType = any, ParentType extends ResolversParentTypes['MeasurementUnit'] = ResolversParentTypes['MeasurementUnit']> = {
  abbreviations?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  symbol?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes['UnitType']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  addCategoryToRecipe?: Resolver<Array<ResolversTypes['Category']>, ParentType, ContextType, RequireFields<MutationAddCategoryToRecipeArgs, 'categoryName' | 'recipeId'>>;
  addCourseToRecipe?: Resolver<ResolversTypes['Recipe'], ParentType, ContextType, RequireFields<MutationAddCourseToRecipeArgs, 'course' | 'recipeId'>>;
  addCuisineToRecipe?: Resolver<ResolversTypes['Recipe'], ParentType, ContextType, RequireFields<MutationAddCuisineToRecipeArgs, 'cuisineId' | 'recipeId'>>;
  addPhotoToRecipe?: Resolver<ResolversTypes['Recipe'], ParentType, ContextType, RequireFields<MutationAddPhotoToRecipeArgs, 'photoId' | 'recipeId'>>;
  addPriceHistory?: Resolver<ResolversTypes['IngredientPriceHistory'], ParentType, ContextType, RequireFields<MutationAddPriceHistoryArgs, 'price'>>;
  addRecipeServing?: Resolver<ResolversTypes['MealPlanServing'], ParentType, ContextType, RequireFields<MutationAddRecipeServingArgs, 'serving'>>;
  addRecipeToMealPlan?: Resolver<ResolversTypes['MealPlanRecipe'], ParentType, ContextType, RequireFields<MutationAddRecipeToMealPlanArgs, 'recipe'>>;
  connectExpirationRule?: Resolver<ResolversTypes['Ingredient'], ParentType, ContextType, RequireFields<MutationConnectExpirationRuleArgs, 'expirationRuleId' | 'ingredientId'>>;
  createCategory?: Resolver<Array<ResolversTypes['Category']>, ParentType, ContextType, RequireFields<MutationCreateCategoryArgs, 'name'>>;
  createCourse?: Resolver<Array<ResolversTypes['Course']>, ParentType, ContextType, RequireFields<MutationCreateCourseArgs, 'name'>>;
  createCuisine?: Resolver<Array<ResolversTypes['Cuisine']>, ParentType, ContextType, RequireFields<MutationCreateCuisineArgs, 'name'>>;
  createExpirationRule?: Resolver<ResolversTypes['ExpirationRule'], ParentType, ContextType, RequireFields<MutationCreateExpirationRuleArgs, 'ingredientId' | 'rule'>>;
  createIngredient?: Resolver<ResolversTypes['Ingredient'], ParentType, ContextType, RequireFields<MutationCreateIngredientArgs, 'ingredient'>>;
  createMealPlan?: Resolver<ResolversTypes['MealPlan'], ParentType, ContextType, RequireFields<MutationCreateMealPlanArgs, 'name'>>;
  createNutritionLabels?: Resolver<ResolversTypes['NutritionLabel'], ParentType, ContextType, RequireFields<MutationCreateNutritionLabelsArgs, 'nutritionLabel' | 'recipeId'>>;
  createProfile?: Resolver<ResolversTypes['HealthProfile'], ParentType, ContextType, RequireFields<MutationCreateProfileArgs, 'profile'>>;
  createRecipe?: Resolver<ResolversTypes['Recipe'], ParentType, ContextType, RequireFields<MutationCreateRecipeArgs, 'recipe'>>;
  createUnit?: Resolver<ResolversTypes['MeasurementUnit'], ParentType, ContextType, RequireFields<MutationCreateUnitArgs, 'input'>>;
  deleteCategory?: Resolver<Array<ResolversTypes['Category']>, ParentType, ContextType, RequireFields<MutationDeleteCategoryArgs, 'categoryId'>>;
  deleteCourse?: Resolver<Array<ResolversTypes['Course']>, ParentType, ContextType, RequireFields<MutationDeleteCourseArgs, 'courseId'>>;
  deleteCuisine?: Resolver<Array<ResolversTypes['Cuisine']>, ParentType, ContextType, RequireFields<MutationDeleteCuisineArgs, 'cuisineId'>>;
  deleteExpirationRule?: Resolver<Array<ResolversTypes['ExpirationRule']>, ParentType, ContextType, RequireFields<MutationDeleteExpirationRuleArgs, 'expirationRuleId'>>;
  deleteIngredient?: Resolver<Array<ResolversTypes['Ingredient']>, ParentType, ContextType, RequireFields<MutationDeleteIngredientArgs, 'ingredientToDeleteId'>>;
  deleteMealPlan?: Resolver<Array<ResolversTypes['MealPlan']>, ParentType, ContextType, RequireFields<MutationDeleteMealPlanArgs, 'id'>>;
  deleteNutritionLabel?: Resolver<Array<ResolversTypes['NutritionLabel']>, ParentType, ContextType, RequireFields<MutationDeleteNutritionLabelArgs, 'id'>>;
  deletePriceHistory?: Resolver<Array<ResolversTypes['IngredientPriceHistory']>, ParentType, ContextType, RequireFields<MutationDeletePriceHistoryArgs, 'ingredientId' | 'ingredientPriceId'>>;
  deleteRecipeServing?: Resolver<Array<ResolversTypes['MealPlanServing']>, ParentType, ContextType, RequireFields<MutationDeleteRecipeServingArgs, 'id'>>;
  deleteRecipes?: Resolver<Array<ResolversTypes['Recipe']>, ParentType, ContextType, RequireFields<MutationDeleteRecipesArgs, 'recipeIds'>>;
  editExpirationRule?: Resolver<ResolversTypes['ExpirationRule'], ParentType, ContextType, RequireFields<MutationEditExpirationRuleArgs, 'expirationRule' | 'expirationRuleId'>>;
  editIngredient?: Resolver<ResolversTypes['Ingredient'], ParentType, ContextType, RequireFields<MutationEditIngredientArgs, 'ingredient' | 'ingredientId'>>;
  editMealPlan?: Resolver<ResolversTypes['MealPlan'], ParentType, ContextType, RequireFields<MutationEditMealPlanArgs, 'mealPlan'>>;
  editMealPlanRecipe?: Resolver<Array<ResolversTypes['MealPlanRecipe']>, ParentType, ContextType, RequireFields<MutationEditMealPlanRecipeArgs, 'id' | 'recipe'>>;
  editNutritionLabel?: Resolver<ResolversTypes['NutritionLabel'], ParentType, ContextType, RequireFields<MutationEditNutritionLabelArgs, 'label'>>;
  editPriceHistory?: Resolver<ResolversTypes['IngredientPriceHistory'], ParentType, ContextType, RequireFields<MutationEditPriceHistoryArgs, 'price' | 'priceId'>>;
  editProfile?: Resolver<ResolversTypes['HealthProfile'], ParentType, ContextType, RequireFields<MutationEditProfileArgs, 'id' | 'profile'>>;
  editRecipeServing?: Resolver<Array<ResolversTypes['MealPlanServing']>, ParentType, ContextType, RequireFields<MutationEditRecipeServingArgs, 'serving'>>;
  finalizeReceipt?: Resolver<ResolversTypes['Receipt'], ParentType, ContextType, RequireFields<MutationFinalizeReceiptArgs, 'receiptId'>>;
  mergeIngredients?: Resolver<ResolversTypes['Ingredient'], ParentType, ContextType, RequireFields<MutationMergeIngredientsArgs, 'ingredientIdToDelete' | 'ingredientIdToKeep'>>;
  removeCategoryFromRecipe?: Resolver<Array<ResolversTypes['Category']>, ParentType, ContextType, RequireFields<MutationRemoveCategoryFromRecipeArgs, 'categoryId' | 'recipeId'>>;
  removeCourseFromRecipe?: Resolver<ResolversTypes['Recipe'], ParentType, ContextType, RequireFields<MutationRemoveCourseFromRecipeArgs, 'courseId' | 'recipeId'>>;
  removeCuisineFromRecipe?: Resolver<ResolversTypes['Recipe'], ParentType, ContextType, RequireFields<MutationRemoveCuisineFromRecipeArgs, 'cuisineId' | 'recipeId'>>;
  removeMealPlanRecipe?: Resolver<Array<ResolversTypes['MealPlanRecipe']>, ParentType, ContextType, RequireFields<MutationRemoveMealPlanRecipeArgs, 'id'>>;
  removePhotoFromRecipe?: Resolver<ResolversTypes['Recipe'], ParentType, ContextType, RequireFields<MutationRemovePhotoFromRecipeArgs, 'photoIds' | 'recipeId'>>;
  scheduleMealPlan?: Resolver<ResolversTypes['ScheduledPlan'], ParentType, ContextType, RequireFields<MutationScheduleMealPlanArgs, 'mealPlanId' | 'startDate'>>;
  setNutritionTarget?: Resolver<ResolversTypes['Nutrient'], ParentType, ContextType, RequireFields<MutationSetNutritionTargetArgs, 'nutrientId' | 'target'>>;
  updateReceipt?: Resolver<ResolversTypes['Receipt'], ParentType, ContextType, RequireFields<MutationUpdateReceiptArgs, 'receipt' | 'receiptId'>>;
  updateReceiptLine?: Resolver<ResolversTypes['ReceiptLine'], ParentType, ContextType, RequireFields<MutationUpdateReceiptLineArgs, 'line' | 'lineId'>>;
  updateRecipe?: Resolver<ResolversTypes['Recipe'], ParentType, ContextType, RequireFields<MutationUpdateRecipeArgs, 'recipe' | 'recipeId'>>;
  updateRecipeIngredients?: Resolver<Array<ResolversTypes['RecipeIngredients']>, ParentType, ContextType, RequireFields<MutationUpdateRecipeIngredientsArgs, 'ingredient'>>;
  updateShoppingDays?: Resolver<Array<ResolversTypes['Int']>, ParentType, ContextType, RequireFields<MutationUpdateShoppingDaysArgs, 'days' | 'mealPlanId'>>;
  uploadPhoto?: Resolver<ResolversTypes['Photo'], ParentType, ContextType, RequireFields<MutationUploadPhotoArgs, 'isPrimary' | 'photo'>>;
  uploadReceipt?: Resolver<ResolversTypes['Receipt'], ParentType, ContextType, RequireFields<MutationUploadReceiptArgs, 'file'>>;
};

export type NutrientResolvers<ContextType = any, ParentType extends ResolversParentTypes['Nutrient'] = ResolversParentTypes['Nutrient']> = {
  advancedView?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  alternateNames?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  customTarget?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  dri?: Resolver<Maybe<ResolversTypes['DailyReferenceIntake']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  parentNutrientId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  unit?: Resolver<ResolversTypes['MeasurementUnit'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NutrientsQueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['NutrientsQuery'] = ResolversParentTypes['NutrientsQuery']> = {
  items?: Resolver<Array<ResolversTypes['Nutrient']>, ParentType, ContextType>;
  itemsRemaining?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  nextOffset?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NutritionLabelResolvers<ContextType = any, ParentType extends ResolversParentTypes['NutritionLabel'] = ResolversParentTypes['NutritionLabel']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  ingredientGroup?: Resolver<ResolversTypes['RecipeIngredientGroup'], ParentType, ContextType>;
  isPrimary?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  recipe?: Resolver<Maybe<ResolversTypes['Recipe']>, ParentType, ContextType>;
  servingSize?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  servingSizeUnit?: Resolver<Maybe<ResolversTypes['MeasurementUnit']>, ParentType, ContextType>;
  servings?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  servingsUsed?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NutritionLabelNutrientResolvers<ContextType = any, ParentType extends ResolversParentTypes['NutritionLabelNutrient'] = ResolversParentTypes['NutritionLabelNutrient']> = {
  nutrient?: Resolver<ResolversTypes['Nutrient'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NutritionLabelQueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['NutritionLabelQuery'] = ResolversParentTypes['NutritionLabelQuery']> = {
  items?: Resolver<Array<ResolversTypes['NutritionLabel']>, ParentType, ContextType>;
  itemsRemaining?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  nextOffset?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PhotoResolvers<ContextType = any, ParentType extends ResolversParentTypes['Photo'] = ResolversParentTypes['Photo']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isPrimary?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  categories?: Resolver<Array<ResolversTypes['Category']>, ParentType, ContextType, Partial<QueryCategoriesArgs>>;
  courses?: Resolver<Array<ResolversTypes['Course']>, ParentType, ContextType, Partial<QueryCoursesArgs>>;
  cuisines?: Resolver<Array<ResolversTypes['Cuisine']>, ParentType, ContextType, Partial<QueryCuisinesArgs>>;
  expirationRule?: Resolver<ResolversTypes['ExpirationRule'], ParentType, ContextType, RequireFields<QueryExpirationRuleArgs, 'expirationRuleId'>>;
  expirationRules?: Resolver<ResolversTypes['ExpirationRulesQuery'], ParentType, ContextType, RequireFields<QueryExpirationRulesArgs, 'pagination'>>;
  groupedRecipeIngredients?: Resolver<Array<ResolversTypes['GroupedRecipeIngredient']>, ParentType, ContextType, RequireFields<QueryGroupedRecipeIngredientsArgs, 'recipeIds'>>;
  healthProfile?: Resolver<ResolversTypes['HealthProfile'], ParentType, ContextType>;
  ingredient?: Resolver<ResolversTypes['Ingredient'], ParentType, ContextType, RequireFields<QueryIngredientArgs, 'ingredientId'>>;
  ingredientPrice?: Resolver<ResolversTypes['IngredientPriceHistory'], ParentType, ContextType, RequireFields<QueryIngredientPriceArgs, 'ingredientPriceId'>>;
  ingredients?: Resolver<ResolversTypes['IngredientsQuery'], ParentType, ContextType, RequireFields<QueryIngredientsArgs, 'pagination'>>;
  mealPlan?: Resolver<ResolversTypes['MealPlan'], ParentType, ContextType, RequireFields<QueryMealPlanArgs, 'id'>>;
  mealPlanRecipes?: Resolver<Array<ResolversTypes['MealPlanRecipe']>, ParentType, ContextType, RequireFields<QueryMealPlanRecipesArgs, 'mealPlanId'>>;
  mealPlanServings?: Resolver<Array<ResolversTypes['MealPlanServing']>, ParentType, ContextType, RequireFields<QueryMealPlanServingsArgs, 'mealPlanId'>>;
  mealPlans?: Resolver<Array<ResolversTypes['MealPlan']>, ParentType, ContextType>;
  nutrients?: Resolver<ResolversTypes['NutrientsQuery'], ParentType, ContextType, RequireFields<QueryNutrientsArgs, 'advanced' | 'pagination'>>;
  nutritionLabel?: Resolver<ResolversTypes['NutritionLabel'], ParentType, ContextType, RequireFields<QueryNutritionLabelArgs, 'labelId'>>;
  nutritionLabels?: Resolver<ResolversTypes['NutritionLabelQuery'], ParentType, ContextType, RequireFields<QueryNutritionLabelsArgs, 'pagination'>>;
  priceHistory?: Resolver<Array<ResolversTypes['IngredientPriceHistory']>, ParentType, ContextType, RequireFields<QueryPriceHistoryArgs, 'ingredientId'>>;
  receipt?: Resolver<ResolversTypes['Receipt'], ParentType, ContextType, RequireFields<QueryReceiptArgs, 'id'>>;
  recipe?: Resolver<ResolversTypes['Recipe'], ParentType, ContextType, RequireFields<QueryRecipeArgs, 'recipeId'>>;
  recipes?: Resolver<ResolversTypes['RecipesQuery'], ParentType, ContextType, RequireFields<QueryRecipesArgs, 'pagination'>>;
  stores?: Resolver<ResolversTypes['StoreSearch'], ParentType, ContextType, RequireFields<QueryStoresArgs, 'pagination'>>;
  unit?: Resolver<ResolversTypes['MeasurementUnit'], ParentType, ContextType, RequireFields<QueryUnitArgs, 'id'>>;
  units?: Resolver<ResolversTypes['UnitQuery'], ParentType, ContextType, RequireFields<QueryUnitsArgs, 'pagination'>>;
};

export type ReceiptResolvers<ContextType = any, ParentType extends ResolversParentTypes['Receipt'] = ResolversParentTypes['Receipt']> = {
  date?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  imagePath?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  items?: Resolver<Maybe<Array<ResolversTypes['ReceiptLine']>>, ParentType, ContextType>;
  merchantName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  scanned?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  total?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ReceiptLineResolvers<ContextType = any, ParentType extends ResolversParentTypes['ReceiptLine'] = ResolversParentTypes['ReceiptLine']> = {
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  foodType?: Resolver<Maybe<ResolversTypes['FoodType']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  matchingIngredient?: Resolver<Maybe<ResolversTypes['Ingredient']>, ParentType, ContextType>;
  matchingUnit?: Resolver<Maybe<ResolversTypes['MeasurementUnit']>, ParentType, ContextType>;
  perUnitPrice?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  quantity?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  totalPrice?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  unitQuantity?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RecipeResolvers<ContextType = any, ParentType extends ResolversParentTypes['Recipe'] = ResolversParentTypes['Recipe']> = {
  aggregateLabel?: Resolver<Maybe<ResolversTypes['AggregateLabel']>, ParentType, ContextType>;
  category?: Resolver<Array<ResolversTypes['Category']>, ParentType, ContextType>;
  cookTime?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  course?: Resolver<Array<ResolversTypes['Course']>, ParentType, ContextType>;
  cuisine?: Resolver<Array<ResolversTypes['Cuisine']>, ParentType, ContextType>;
  directions?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  ingredientFreshness?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  ingredients?: Resolver<Array<ResolversTypes['RecipeIngredients']>, ParentType, ContextType>;
  isFavorite?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  leftoverFreezerLife?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  leftoverFridgeLife?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  marinadeTime?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  notes?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  nutritionLabels?: Resolver<Maybe<Array<ResolversTypes['NutritionLabel']>>, ParentType, ContextType>;
  photos?: Resolver<Array<ResolversTypes['Photo']>, ParentType, ContextType>;
  prepTime?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  source?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  totalTime?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  verified?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RecipeIngredientGroupResolvers<ContextType = any, ParentType extends ResolversParentTypes['RecipeIngredientGroup'] = ResolversParentTypes['RecipeIngredientGroup']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nutritionLabel?: Resolver<Maybe<ResolversTypes['NutritionLabel']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RecipeIngredientsResolvers<ContextType = any, ParentType extends ResolversParentTypes['RecipeIngredients'] = ResolversParentTypes['RecipeIngredients']> = {
  baseIngredient?: Resolver<Maybe<ResolversTypes['Ingredient']>, ParentType, ContextType>;
  group?: Resolver<Maybe<ResolversTypes['RecipeIngredientGroup']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  order?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  quantity?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  recipe?: Resolver<ResolversTypes['Recipe'], ParentType, ContextType>;
  sentence?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  unit?: Resolver<Maybe<ResolversTypes['MeasurementUnit']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RecipesQueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['RecipesQuery'] = ResolversParentTypes['RecipesQuery']> = {
  itemsRemaining?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  nextOffset?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  recipes?: Resolver<Array<ResolversTypes['Recipe']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ScheduledPlanResolvers<ContextType = any, ParentType extends ResolversParentTypes['ScheduledPlan'] = ResolversParentTypes['ScheduledPlan']> = {
  duration?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  mealPlan?: Resolver<ResolversTypes['MealPlan'], ParentType, ContextType>;
  startDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type StoreSearchResolvers<ContextType = any, ParentType extends ResolversParentTypes['StoreSearch'] = ResolversParentTypes['StoreSearch']> = {
  itemsRemaining?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  nextOffset?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  stores?: Resolver<Array<ResolversTypes['GroceryStore']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UnitQueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['UnitQuery'] = ResolversParentTypes['UnitQuery']> = {
  items?: Resolver<Array<ResolversTypes['MeasurementUnit']>, ParentType, ContextType>;
  itemsRemaining?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  nextOffset?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  AggLabelNutrient?: AggLabelNutrientResolvers<ContextType>;
  AggregateLabel?: AggregateLabelResolvers<ContextType>;
  Category?: CategoryResolvers<ContextType>;
  Course?: CourseResolvers<ContextType>;
  Cuisine?: CuisineResolvers<ContextType>;
  DailyReferenceIntake?: DailyReferenceIntakeResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  ExpirationRule?: ExpirationRuleResolvers<ContextType>;
  ExpirationRulesQuery?: ExpirationRulesQueryResolvers<ContextType>;
  File?: GraphQLScalarType;
  GroceryStore?: GroceryStoreResolvers<ContextType>;
  GroupedRecipeIngredient?: GroupedRecipeIngredientResolvers<ContextType>;
  HealthProfile?: HealthProfileResolvers<ContextType>;
  Ingredient?: IngredientResolvers<ContextType>;
  IngredientPriceHistory?: IngredientPriceHistoryResolvers<ContextType>;
  IngredientsQuery?: IngredientsQueryResolvers<ContextType>;
  MealPlan?: MealPlanResolvers<ContextType>;
  MealPlanRecipe?: MealPlanRecipeResolvers<ContextType>;
  MealPlanServing?: MealPlanServingResolvers<ContextType>;
  MeasurementUnit?: MeasurementUnitResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Nutrient?: NutrientResolvers<ContextType>;
  NutrientsQuery?: NutrientsQueryResolvers<ContextType>;
  NutritionLabel?: NutritionLabelResolvers<ContextType>;
  NutritionLabelNutrient?: NutritionLabelNutrientResolvers<ContextType>;
  NutritionLabelQuery?: NutritionLabelQueryResolvers<ContextType>;
  Photo?: PhotoResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Receipt?: ReceiptResolvers<ContextType>;
  ReceiptLine?: ReceiptLineResolvers<ContextType>;
  Recipe?: RecipeResolvers<ContextType>;
  RecipeIngredientGroup?: RecipeIngredientGroupResolvers<ContextType>;
  RecipeIngredients?: RecipeIngredientsResolvers<ContextType>;
  RecipesQuery?: RecipesQueryResolvers<ContextType>;
  ScheduledPlan?: ScheduledPlanResolvers<ContextType>;
  StoreSearch?: StoreSearchResolvers<ContextType>;
  UnitQuery?: UnitQueryResolvers<ContextType>;
};

