/* eslint-disable */
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: { input: any; output: any; }
  File: { input: any; output: any; }
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

export type AggregateLabel = {
  __typename?: 'AggregateLabel';
  calories: Scalars['Float']['output'];
  caloriesPerServing?: Maybe<Scalars['Float']['output']>;
  carbPercentage: Scalars['Float']['output'];
  fatPercentage: Scalars['Float']['output'];
  nutrients: Array<AggregateNutrient>;
  proteinPercentage: Scalars['Float']['output'];
  servingSize?: Maybe<Scalars['Float']['output']>;
  servingUnit?: Maybe<MeasurementUnit>;
  servings?: Maybe<Scalars['Int']['output']>;
  servingsUsed?: Maybe<Scalars['Int']['output']>;
};

export type AggregateNutrient = {
  __typename?: 'AggregateNutrient';
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  perServing?: Maybe<Scalars['Float']['output']>;
  target?: Maybe<NutrientTarget>;
  unit: MeasurementUnit;
  value: Scalars['Float']['output'];
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
  ingredientGroupId?: InputMaybe<Scalars['String']['input']>;
  isPrimary?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  nutrients?: InputMaybe<Array<CreateNutrientInput>>;
  servingSize?: InputMaybe<Scalars['Float']['input']>;
  servingSizeUnitId?: InputMaybe<Scalars['String']['input']>;
  servings: Scalars['Float']['input'];
  servingsUsed?: InputMaybe<Scalars['Float']['input']>;
};

export type CreatePriceHistoryInput = {
  date: Scalars['DateTime']['input'];
  ingredientId: Scalars['String']['input'];
  price: Scalars['Float']['input'];
  pricePerUnit: Scalars['Float']['input'];
  quantity: Scalars['Float']['input'];
  retailer: Scalars['String']['input'];
  unitId: Scalars['String']['input'];
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
  nutrient: Nutrient;
  value: Scalars['Float']['output'];
};

export type Draft = NutritionLabel | Recipe;

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
  name?: InputMaybe<Scalars['String']['input']>;
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
  price?: InputMaybe<Scalars['Float']['input']>;
  pricePerUnit?: InputMaybe<Scalars['Float']['input']>;
  quantity?: InputMaybe<Scalars['Float']['input']>;
  retailer?: InputMaybe<Scalars['String']['input']>;
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
  ingredients: Array<ExpirationRule>;
  itemsRemaining: Scalars['Int']['output'];
  nextOffset?: Maybe<Scalars['Int']['output']>;
};

export enum Gender {
  Female = 'FEMALE',
  Male = 'MALE'
}

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

export type Import = {
  __typename?: 'Import';
  createdAt: Scalars['DateTime']['output'];
  fileName?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  records?: Maybe<Array<ImportRecord>>;
  recordsCount: Scalars['Int']['output'];
  status: ImportStatus;
  type: PrismaImportType;
};

export type ImportRecord = {
  __typename?: 'ImportRecord';
  draft?: Maybe<Draft>;
  id: Scalars['String']['output'];
  ingredientGroup: RecipeIngredientGroup;
  label: NutritionLabel;
  name: Scalars['String']['output'];
  recipe: Recipe;
  status: RecordStatus;
  verifed: Scalars['Boolean']['output'];
};

export type ImportRecordsQuery = {
  __typename?: 'ImportRecordsQuery';
  itemsRemaining: Scalars['Int']['output'];
  nextOffset?: Maybe<Scalars['Int']['output']>;
  records: Array<ImportRecord>;
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

export type ImportsQuery = {
  __typename?: 'ImportsQuery';
  importJobs: Array<Import>;
  itemsRemaining: Scalars['Int']['output'];
  nextOffset?: Maybe<Scalars['Int']['output']>;
};

export type Ingredient = {
  __typename?: 'Ingredient';
  alternateNames: Array<Scalars['String']['output']>;
  expiration: ExpirationRule;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  priceHistory: Array<IngredientPrice>;
  storageInstructions?: Maybe<Scalars['String']['output']>;
};

export type IngredientFilter = {
  amount?: InputMaybe<NumericalComparison>;
  ingredientID: Scalars['String']['input'];
  unitId?: InputMaybe<Scalars['String']['input']>;
};

export type IngredientPrice = {
  __typename?: 'IngredientPrice';
  price: Scalars['Float']['output'];
  pricePerUnit: Scalars['Float']['output'];
  quantity: Scalars['Float']['output'];
  retailer: Scalars['String']['output'];
  unit: MeasurementUnit;
};

export type IngredientsQuery = {
  __typename?: 'IngredientsQuery';
  ingredients: Array<Ingredient>;
  itemsRemaining: Scalars['Int']['output'];
  nextOffset?: Maybe<Scalars['Int']['output']>;
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
  nutritionLabel?: Maybe<AggregateLabel>;
  recipe: Recipe;
  servingsUsed: Scalars['Int']['output'];
  totalServings: Scalars['Int']['output'];
};


export type MealPlanRecipeNutritionLabelArgs = {
  advanced?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MealPlanRecipeServingsUsedArgs = {
  mealId: Scalars['String']['input'];
};

export type MealPlanServing = {
  __typename?: 'MealPlanServing';
  day: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  meal: Scalars['String']['output'];
  mealPlan: MealPlan;
  numberOfServings: Scalars['Int']['output'];
  nutritionLabel?: Maybe<AggregateLabel>;
  recipe: MealPlanRecipe;
};


export type MealPlanServingNutritionLabelArgs = {
  advanced?: InputMaybe<Scalars['Boolean']['input']>;
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
  addCategoryToRecipe: Recipe;
  addPriceHistory: IngredientPrice;
  addRecipeCourse: Recipe;
  addRecipePhotos: Recipe;
  addRecipeServing: Array<MealPlanServing>;
  addRecipeToMealPlan: Array<MealPlanRecipe>;
  changeRecipeCuisine: Recipe;
  changeRecordStatus: ImportRecord;
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
  deleteCategory: Array<Category>;
  deleteCourse: Array<Course>;
  deleteCuisine: Array<Cuisine>;
  deleteExpirationRule: Array<ExpirationRule>;
  deleteIngredient: Array<Ingredient>;
  deleteMealPlan: Array<MealPlan>;
  deleteNutritionLabel: Array<NutritionLabel>;
  deletePriceHistory: Array<IngredientPrice>;
  deleteRecipeServing: Array<MealPlanServing>;
  deleteRecipes: Array<Recipe>;
  editExpirationRule: ExpirationRule;
  editIngredient: Ingredient;
  editMealPlan: MealPlan;
  editNutritionLabel: NutritionLabel;
  editPriceHistory: IngredientPrice;
  editProfile: HealthProfile;
  editRecipeServing: Array<MealPlanServing>;
  finalize: ImportRecord;
  mergeIngredients: Ingredient;
  removeCategoryFromRecipe: Recipe;
  removeCourseFromRecipe: Recipe;
  removeMealPlanRecipe: Array<MealPlanRecipe>;
  removeRecipeCuisine: Recipe;
  removeRecipePhotos: Recipe;
  scheduleMealPlan: ScheduledPlan;
  updateMatches: ImportRecord;
  updateRecipe: Recipe;
  updateRecipeIngredients: Array<RecipeIngredients>;
  updateShoppingDays: Array<Scalars['Int']['output']>;
  uploadImport: Import;
  uploadPhoto: Photo;
};


export type MutationAddCategoryToRecipeArgs = {
  category: Scalars['String']['input'];
  recipeId: Scalars['String']['input'];
};


export type MutationAddPriceHistoryArgs = {
  price: CreatePriceHistoryInput;
};


export type MutationAddRecipeCourseArgs = {
  course: Scalars['String']['input'];
  recipeId: Scalars['String']['input'];
};


export type MutationAddRecipePhotosArgs = {
  photoId: Array<Scalars['String']['input']>;
  recipeId: Scalars['String']['input'];
};


export type MutationAddRecipeServingArgs = {
  serving: AddRecipeServingInput;
};


export type MutationAddRecipeToMealPlanArgs = {
  recipe: AddRecipeInput;
};


export type MutationChangeRecipeCuisineArgs = {
  cuisineId: Array<Scalars['String']['input']>;
  recipeId: Scalars['String']['input'];
};


export type MutationChangeRecordStatusArgs = {
  id: Scalars['String']['input'];
  status: RecordStatus;
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
  nutritionLabel: CreateNutritionLabelInput;
  recipeId: Scalars['String']['input'];
};


export type MutationCreateProfileArgs = {
  profile: ProfileInput;
};


export type MutationCreateRecipeArgs = {
  recipe: RecipeInput;
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


export type MutationFinalizeArgs = {
  recordId: Scalars['String']['input'];
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


export type MutationRemoveMealPlanRecipeArgs = {
  id: Scalars['String']['input'];
};


export type MutationRemoveRecipeCuisineArgs = {
  cuisineId: Scalars['String']['input'];
  recipeId: Scalars['String']['input'];
};


export type MutationRemoveRecipePhotosArgs = {
  photoIds: Array<Scalars['String']['input']>;
  recipeId: Scalars['String']['input'];
};


export type MutationScheduleMealPlanArgs = {
  mealPlanId: Scalars['String']['input'];
  startDate: Scalars['DateTime']['input'];
};


export type MutationUpdateMatchesArgs = {
  groupId?: InputMaybe<Scalars['String']['input']>;
  labelId?: InputMaybe<Scalars['String']['input']>;
  recipeId?: InputMaybe<Scalars['String']['input']>;
  recordId: Scalars['String']['input'];
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


export type MutationUploadImportArgs = {
  file: Scalars['File']['input'];
  type: PrismaImportType;
};


export type MutationUploadPhotoArgs = {
  photo: Scalars['File']['input'];
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
  dri: Array<DailyReferenceIntake>;
  name: Scalars['String']['output'];
  subNutrients: Array<Nutrient>;
  type: Scalars['String']['output'];
  unit: MeasurementUnit;
};

export type NutrientTarget = {
  __typename?: 'NutrientTarget';
  customTarget?: Maybe<Scalars['Float']['output']>;
  dri?: Maybe<Scalars['Float']['output']>;
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

export type NutritionFilter = {
  nutrientID: Scalars['String']['input'];
  perServing?: InputMaybe<Scalars['Boolean']['input']>;
  target?: InputMaybe<NumericalComparison>;
};

export type NutritionLabel = {
  __typename?: 'NutritionLabel';
  aggregateLabel?: Maybe<AggregateLabel>;
  id: Scalars['ID']['output'];
  ingredientGroup: RecipeIngredientGroup;
  name?: Maybe<Scalars['String']['output']>;
  recipe?: Maybe<Recipe>;
  servingSize?: Maybe<Scalars['Float']['output']>;
  servings?: Maybe<Scalars['Float']['output']>;
  servingsUsed?: Maybe<Scalars['Float']['output']>;
};


export type NutritionLabelAggregateLabelArgs = {
  advanced?: InputMaybe<Scalars['Boolean']['input']>;
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
  RecipeKeeper = 'RECIPE_KEEPER'
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
  dailyReferenceIntake: Array<Nutrient>;
  expirationRule: ExpirationRule;
  expirationRules: ExpirationRulesQuery;
  groupedRecipeIngredients: Array<GroupedRecipeIngredient>;
  healthProfile: HealthProfile;
  import: Import;
  importRecord: ImportRecord;
  importRecords: ImportRecordsQuery;
  imports: ImportsQuery;
  ingredient: Ingredient;
  ingredientPrice: IngredientPrice;
  ingredients: IngredientsQuery;
  mealPlan: MealPlan;
  mealPlans: Array<MealPlan>;
  nutritionLabel: NutritionLabel;
  priceHistory: Array<IngredientPrice>;
  recipe: Recipe;
  recipes: RecipesQuery;
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


export type QueryImportArgs = {
  importId: Scalars['String']['input'];
};


export type QueryImportRecordArgs = {
  id: Scalars['String']['input'];
};


export type QueryImportRecordsArgs = {
  importId: Scalars['String']['input'];
  pagination: OffsetPagination;
};


export type QueryImportsArgs = {
  pagination: OffsetPagination;
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


export type QueryNutritionLabelArgs = {
  labelId: Scalars['String']['input'];
};


export type QueryPriceHistoryArgs = {
  ingredientId: Scalars['String']['input'];
  retailer?: InputMaybe<Scalars['String']['input']>;
};


export type QueryRecipeArgs = {
  recipeId: Scalars['String']['input'];
};


export type QueryRecipesArgs = {
  filter?: InputMaybe<RecipeFilter>;
  pagination: OffsetPagination;
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
  leftoverFridgeLife?: Maybe<Scalars['Int']['output']>;
  marinadeTime?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  photos: Array<Photo>;
  prepTime?: Maybe<Scalars['Int']['output']>;
};


export type RecipeAggregateLabelArgs = {
  advanced?: InputMaybe<Scalars['Boolean']['input']>;
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
  name?: Maybe<Scalars['String']['output']>;
  order: Scalars['Int']['output'];
  quantity?: Maybe<Scalars['Float']['output']>;
  recipe: Recipe;
  sentence: Scalars['String']['output'];
  unit: MeasurementUnit;
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

export enum UnitType {
  Count = 'COUNT',
  Energy = 'ENERGY',
  Volume = 'VOLUME',
  Weight = 'WEIGHT'
}
