/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
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
  RefID: { input: any; output: any; }
};

export type AddRecipeServingInput = {
  day: Scalars['Int']['input'];
  meal: Meal;
  mealPlanId: Scalars['RefID']['input'];
  mealPlanRecipeId: Scalars['RefID']['input'];
  servings: Scalars['Int']['input'];
};

export type AddRecipeToPlanInput = {
  recipeId: Scalars['RefID']['input'];
  scaleFactor: Scalars['Float']['input'];
  servings: Scalars['Int']['input'];
};

export type AggLabelNutrient = Node & {
  __typename?: 'AggLabelNutrient';
  id: Scalars['ID']['output'];
  nutrient: Nutrient;
  perServing?: Maybe<Scalars['Float']['output']>;
  value: Scalars['Float']['output'];
};

export type AggregateLabel = Node & {
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

export type BoundingBox = {
  __typename?: 'BoundingBox';
  coordinates: Array<PolygonCoordinate>;
};

export type Category = Node & {
  __typename?: 'Category';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type Course = Node & {
  __typename?: 'Course';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type CreateMealPlanInput = {
  mealPrepInstructions?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  shoppingDays?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type CreatePriceHistoryInput = {
  date: Scalars['DateTime']['input'];
  foodType: FoodType;
  groceryStoreId: Scalars['String']['input'];
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

export type Cuisine = Node & {
  __typename?: 'Cuisine';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type CursorPagination = {
  cursor?: InputMaybe<Scalars['DateTime']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type DailyReferenceIntake = Node & {
  __typename?: 'DailyReferenceIntake';
  id: Scalars['ID']['output'];
  upperLimit?: Maybe<Scalars['Float']['output']>;
  value: Scalars['Float']['output'];
};

export type DeleteResult = {
  __typename?: 'DeleteResult';
  id: Scalars['ID']['output'];
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type EditMealPlanInput = {
  mealPrepInstructions?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  shoppingDays?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type EditMealPlanRecipeInput = {
  factor: Scalars['Float']['input'];
  servings: Scalars['Int']['input'];
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

export type EditRecipeIngredientsInput = {
  id: Scalars['RefID']['input'];
  input: RecipeIngredientInput;
};

export type EditRecipeServingInput = {
  day: Scalars['Int']['input'];
  meal: Meal;
  servings: Scalars['Int']['input'];
};

export type ExpirationRule = Node & {
  __typename?: 'ExpirationRule';
  defrostTime?: Maybe<Scalars['Int']['output']>;
  freezerLife?: Maybe<Scalars['Int']['output']>;
  fridgeLife?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  longestLife?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
  perishable?: Maybe<Scalars['Boolean']['output']>;
  tableLife?: Maybe<Scalars['Int']['output']>;
  variation?: Maybe<Scalars['String']['output']>;
};

export type ExpirationRuleInput = {
  defrostTime?: InputMaybe<Scalars['Float']['input']>;
  freezerLife?: InputMaybe<Scalars['Int']['input']>;
  fridgeLife?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  perishable?: InputMaybe<Scalars['Boolean']['input']>;
  tableLife?: InputMaybe<Scalars['Int']['input']>;
  variation?: InputMaybe<Scalars['String']['input']>;
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

export type GroceryStore = Node & {
  __typename?: 'GroceryStore';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type GroupedRecipeIngredient = {
  __typename?: 'GroupedRecipeIngredient';
  ingredientId?: Maybe<Scalars['String']['output']>;
  ingredientName?: Maybe<Scalars['String']['output']>;
  recipeIngredients: Array<RecipeIngredient>;
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

export type Ingredient = Node & {
  __typename?: 'Ingredient';
  alternateNames: Array<Scalars['String']['output']>;
  category?: Maybe<IngredientCategory>;
  expiration?: Maybe<ExpirationRule>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  priceHistory?: Maybe<Array<IngredientPriceHistory>>;
  storageInstructions?: Maybe<Scalars['String']['output']>;
};

export type IngredientCategory = Node & {
  __typename?: 'IngredientCategory';
  id: Scalars['ID']['output'];
  ingredients: Array<Ingredient>;
  name: Scalars['String']['output'];
};

export type IngredientFilter = {
  amount?: InputMaybe<NumericalFilter>;
  ingredientId: Scalars['String']['input'];
  unitId?: InputMaybe<Scalars['String']['input']>;
};

export type IngredientInput = {
  alternateNames?: InputMaybe<Array<Scalars['String']['input']>>;
  categoryId?: InputMaybe<Scalars['RefID']['input']>;
  expirationRuleId?: InputMaybe<Scalars['RefID']['input']>;
  name: Scalars['String']['input'];
  storageInstructions?: InputMaybe<Scalars['String']['input']>;
};

export type IngredientPriceFilter = {
  beginDate?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['String']['input']>;
  foodType?: InputMaybe<FoodType>;
  groceryStoreId?: InputMaybe<Scalars['String']['input']>;
  unitId?: InputMaybe<Scalars['String']['input']>;
};

export type IngredientPriceHistory = Node & {
  __typename?: 'IngredientPriceHistory';
  date?: Maybe<Scalars['DateTime']['output']>;
  foodType?: Maybe<FoodType>;
  groceryStore: GroceryStore;
  id: Scalars['ID']['output'];
  ingredient: Ingredient;
  price: Scalars['Float']['output'];
  pricePerUnit: Scalars['Float']['output'];
  quantity: Scalars['Float']['output'];
  receiptLine?: Maybe<ReceiptLine>;
  unit: MeasurementUnit;
};

export type IngredientTotal = {
  __typename?: 'IngredientTotal';
  qty: Scalars['Float']['output'];
  unit?: Maybe<MeasurementUnit>;
};

export enum Meal {
  Breakfast = 'BREAKFAST',
  Dinner = 'DINNER',
  Lunch = 'LUNCH',
  Snack = 'SNACK'
}

export type MealPlan = Node & {
  __typename?: 'MealPlan';
  id: Scalars['ID']['output'];
  mealPlanServings: Array<MealPlanServing>;
  mealPrepInstructions?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  planRecipes: Array<MealPlanRecipe>;
  schedules: Array<ScheduledPlan>;
  shopppingDays: Array<Scalars['Int']['output']>;
};

export type MealPlanIngredient = {
  __typename?: 'MealPlanIngredient';
  baseIngredient?: Maybe<Ingredient>;
  recipeIngredients: Array<ScaledRecipeIngredient>;
  total: Array<IngredientTotal>;
};

export type MealPlanRecipe = Node & {
  __typename?: 'MealPlanRecipe';
  cookDayOffset: Scalars['Int']['output'];
  factor: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  mealPlan: MealPlan;
  mealPlanServings: Array<MealPlanServing>;
  originalRecipe: Recipe;
  servingsOnPlan: Scalars['Int']['output'];
  totalServings: Scalars['Int']['output'];
};

export type MealPlanServing = Node & {
  __typename?: 'MealPlanServing';
  day: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  meal: Meal;
  mealPlanRecipeId: Scalars['RefID']['output'];
  mealRecipe: MealPlanRecipe;
  numberOfServings: Scalars['Int']['output'];
};

export enum MeasurementSystem {
  Imperial = 'IMPERIAL',
  Metric = 'METRIC'
}

export type MeasurementUnit = Node & {
  __typename?: 'MeasurementUnit';
  abbreviations: Array<Scalars['String']['output']>;
  conversionName?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  measurementSystem?: Maybe<MeasurementSystem>;
  name: Scalars['String']['output'];
  symbol?: Maybe<Scalars['String']['output']>;
  type?: Maybe<UnitType>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addPhotoToRecipe: Recipe;
  addPriceHistory: IngredientPriceHistory;
  addRecipeIngredientsFromTxt: Array<RecipeIngredient>;
  addRecipeServing: MealPlanServing;
  addRecipeToMealPlan: MealPlanRecipe;
  createCategory: Array<Category>;
  createCourse: Array<Course>;
  createCuisine: Array<Cuisine>;
  createExpirationRule: ExpirationRule;
  createGroceryStore: GroceryStore;
  createIngredient: Ingredient;
  createIngredientGroup: RecipeIngredientGroup;
  createMealPlan: MealPlan;
  createNutritionLabel: NutritionLabel;
  createProfile: HealthProfile;
  createReceiptItem: ReceiptLine;
  createRecipe: Recipe;
  createUnit: MeasurementUnit;
  deleteCategory: DeleteResult;
  deleteCourse: DeleteResult;
  deleteCuisine: DeleteResult;
  deleteExpirationRule: DeleteResult;
  deleteGroceryStore: DeleteResult;
  deleteIngredient: DeleteResult;
  deleteMealPlan: Array<MealPlan>;
  deleteNutritionLabel: DeleteResult;
  deletePriceHistory: DeleteResult;
  deleteReceiptItem: Scalars['Boolean']['output'];
  deleteRecipe: DeleteResult;
  deleteRecipeIngredient: DeleteResult;
  deleteRecipeIngredientGroup: DeleteResult;
  deleteRecipeServing: DeleteResult;
  editExpirationRule: ExpirationRule;
  editIngredient: Ingredient;
  editMealPlan: MealPlan;
  editMealPlanRecipe: MealPlanRecipe;
  editNutritionLabel: NutritionLabel;
  editPriceHistory: IngredientPriceHistory;
  editProfile: HealthProfile;
  editReceipt: Receipt;
  editRecipe: Recipe;
  editRecipeIngredientGroup: RecipeIngredientGroup;
  editRecipeIngredients: Array<RecipeIngredient>;
  editRecipeServing: Array<MealPlanServing>;
  finalizeReceipt: Receipt;
  removeMealPlanRecipe: DeleteResult;
  removePhotoFromRecipe: Recipe;
  setNutritionTarget: Nutrient;
  setRankedNutrients: Array<Nutrient>;
  updateReceiptLine: ReceiptLine;
  uploadPhoto: Photo;
  uploadReceipt: Receipt;
};


export type MutationAddPhotoToRecipeArgs = {
  photoId: Array<Scalars['String']['input']>;
  recipeId: Scalars['String']['input'];
};


export type MutationAddPriceHistoryArgs = {
  price: CreatePriceHistoryInput;
};


export type MutationAddRecipeIngredientsFromTxtArgs = {
  groupId?: InputMaybe<Scalars['ID']['input']>;
  recipeId: Scalars['ID']['input'];
  text: Scalars['String']['input'];
};


export type MutationAddRecipeServingArgs = {
  serving: AddRecipeServingInput;
};


export type MutationAddRecipeToMealPlanArgs = {
  mealPlanId: Scalars['ID']['input'];
  recipe: AddRecipeToPlanInput;
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
  rule: ExpirationRuleInput;
};


export type MutationCreateGroceryStoreArgs = {
  name: Scalars['String']['input'];
};


export type MutationCreateIngredientArgs = {
  ingredient: IngredientInput;
};


export type MutationCreateIngredientGroupArgs = {
  name: Scalars['String']['input'];
  recipeId: Scalars['ID']['input'];
};


export type MutationCreateMealPlanArgs = {
  mealPlan: CreateMealPlanInput;
};


export type MutationCreateNutritionLabelArgs = {
  nutritionLabel: NutritionLabelInput;
};


export type MutationCreateProfileArgs = {
  profile: ProfileInput;
};


export type MutationCreateReceiptItemArgs = {
  line: ReceiptItemInput;
  receiptId: Scalars['ID']['input'];
};


export type MutationCreateRecipeArgs = {
  recipe: RecipeInput;
};


export type MutationCreateUnitArgs = {
  input: CreateUnitInput;
};


export type MutationDeleteCategoryArgs = {
  categoryId: Scalars['ID']['input'];
};


export type MutationDeleteCourseArgs = {
  courseId: Scalars['ID']['input'];
};


export type MutationDeleteCuisineArgs = {
  cuisineId: Scalars['ID']['input'];
};


export type MutationDeleteExpirationRuleArgs = {
  expirationRuleId: Scalars['ID']['input'];
};


export type MutationDeleteGroceryStoreArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteIngredientArgs = {
  ingredientId: Scalars['ID']['input'];
};


export type MutationDeleteMealPlanArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteNutritionLabelArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeletePriceHistoryArgs = {
  ingredientPriceId: Scalars['ID']['input'];
};


export type MutationDeleteReceiptItemArgs = {
  lineId: Scalars['String']['input'];
  receiptId: Scalars['String']['input'];
};


export type MutationDeleteRecipeArgs = {
  recipeId: Scalars['ID']['input'];
};


export type MutationDeleteRecipeIngredientArgs = {
  ingredientId: Scalars['ID']['input'];
};


export type MutationDeleteRecipeIngredientGroupArgs = {
  groupId: Scalars['ID']['input'];
};


export type MutationDeleteRecipeServingArgs = {
  id: Scalars['ID']['input'];
};


export type MutationEditExpirationRuleArgs = {
  expirationRule: ExpirationRuleInput;
  ruleId: Scalars['ID']['input'];
};


export type MutationEditIngredientArgs = {
  id: Scalars['ID']['input'];
  ingredient: IngredientInput;
};


export type MutationEditMealPlanArgs = {
  id: Scalars['ID']['input'];
  mealPlan: EditMealPlanInput;
};


export type MutationEditMealPlanRecipeArgs = {
  id: Scalars['ID']['input'];
  recipe: EditMealPlanRecipeInput;
};


export type MutationEditNutritionLabelArgs = {
  id: Scalars['ID']['input'];
  label: NutritionLabelInput;
};


export type MutationEditPriceHistoryArgs = {
  price: EditPriceHistoryInput;
  priceId: Scalars['ID']['input'];
};


export type MutationEditProfileArgs = {
  id: Scalars['String']['input'];
  profile: ProfileInput;
};


export type MutationEditReceiptArgs = {
  receipt: UpdateReceipt;
  receiptId: Scalars['ID']['input'];
};


export type MutationEditRecipeArgs = {
  recipe: RecipeInput;
  recipeId: Scalars['ID']['input'];
};


export type MutationEditRecipeIngredientGroupArgs = {
  groupId: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};


export type MutationEditRecipeIngredientsArgs = {
  ingredients: Array<EditRecipeIngredientsInput>;
};


export type MutationEditRecipeServingArgs = {
  id: Scalars['ID']['input'];
  serving: EditRecipeServingInput;
};


export type MutationFinalizeReceiptArgs = {
  receiptId: Scalars['ID']['input'];
};


export type MutationRemoveMealPlanRecipeArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemovePhotoFromRecipeArgs = {
  photoIds: Array<Scalars['String']['input']>;
  recipeId: Scalars['String']['input'];
};


export type MutationSetNutritionTargetArgs = {
  nutrientId: Scalars['ID']['input'];
  target: NutrientTargetInput;
};


export type MutationSetRankedNutrientsArgs = {
  nutrients: Array<RankedNutrientInput>;
};


export type MutationUpdateReceiptLineArgs = {
  line: ReceiptItemInput;
  lineId: Scalars['ID']['input'];
};


export type MutationUploadPhotoArgs = {
  isPrimary: Scalars['Boolean']['input'];
  photo: Scalars['File']['input'];
};


export type MutationUploadReceiptArgs = {
  file: Scalars['File']['input'];
};

export type Node = {
  id: Scalars['ID']['output'];
};

export type NumericalFilter = {
  equals?: InputMaybe<Scalars['Int']['input']>;
  gte?: InputMaybe<Scalars['Int']['input']>;
  lte?: InputMaybe<Scalars['Int']['input']>;
};

export type Nutrient = Node & {
  __typename?: 'Nutrient';
  advancedView: Scalars['Boolean']['output'];
  alternateNames: Array<Scalars['String']['output']>;
  dri?: Maybe<DailyReferenceIntake>;
  id: Scalars['ID']['output'];
  important: Scalars['Boolean']['output'];
  isMacro: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  parentNutrientId?: Maybe<Scalars['ID']['output']>;
  rank?: Maybe<Scalars['Int']['output']>;
  target?: Maybe<NutrientTarget>;
  type: Scalars['String']['output'];
  unit: MeasurementUnit;
};

export type NutrientGoal = {
  __typename?: 'NutrientGoal';
  dri?: Maybe<DailyReferenceIntake>;
  nutrientId: Scalars['ID']['output'];
  target?: Maybe<NutrientTarget>;
};

export type NutrientInput = {
  nutrientId: Scalars['RefID']['input'];
  value: Scalars['Float']['input'];
};

export type NutrientTarget = Node & {
  __typename?: 'NutrientTarget';
  id: Scalars['ID']['output'];
  nutrientId: Scalars['RefID']['output'];
  nutrientTarget: Scalars['Float']['output'];
  preference: TargetPreference;
  threshold?: Maybe<Scalars['Float']['output']>;
};

export type NutrientTargetInput = {
  preference: TargetPreference;
  threshold?: InputMaybe<Scalars['Float']['input']>;
  value: Scalars['Float']['input'];
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
  nutrientId: Scalars['String']['input'];
  perServing: Scalars['Boolean']['input'];
  target: NumericalFilter;
};

export type NutritionLabel = Node & {
  __typename?: 'NutritionLabel';
  id: Scalars['ID']['output'];
  ingredientGroup?: Maybe<RecipeIngredientGroup>;
  isPrimary: Scalars['Boolean']['output'];
  nutrients: Array<NutritionLabelNutrient>;
  recipe?: Maybe<Recipe>;
  servingSize?: Maybe<Scalars['Float']['output']>;
  servingSizeUnit?: Maybe<MeasurementUnit>;
  servings?: Maybe<Scalars['Float']['output']>;
  servingsUsed?: Maybe<Scalars['Float']['output']>;
};

export type NutritionLabelInput = {
  ingredientGroupId?: InputMaybe<Scalars['RefID']['input']>;
  isPrimary: Scalars['Boolean']['input'];
  nutrients?: InputMaybe<Array<NutrientInput>>;
  recipeId?: InputMaybe<Scalars['RefID']['input']>;
  servingSize?: InputMaybe<Scalars['Float']['input']>;
  servingSizeUnitId?: InputMaybe<Scalars['RefID']['input']>;
  servings: Scalars['Float']['input'];
  servingsUsed?: InputMaybe<Scalars['Float']['input']>;
};

export type NutritionLabelNutrient = {
  __typename?: 'NutritionLabelNutrient';
  nutrient: Nutrient;
  value: Scalars['Float']['output'];
};

export type NutritionTargets = {
  __typename?: 'NutritionTargets';
  alcohol?: Maybe<NutrientGoal>;
  calories?: Maybe<NutrientGoal>;
  carbs?: Maybe<NutrientGoal>;
  fat?: Maybe<NutrientGoal>;
  nutrients: Array<NutrientGoal>;
  protein?: Maybe<NutrientGoal>;
};

export type OffsetPagination = {
  offset: Scalars['Int']['input'];
  take: Scalars['Int']['input'];
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type Photo = Node & {
  __typename?: 'Photo';
  blurData?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isPrimary: Scalars['Boolean']['output'];
  url: Scalars['String']['output'];
};

/** x, y coordinates */
export type PolygonCoordinate = {
  __typename?: 'PolygonCoordinate';
  x: Scalars['Float']['output'];
  y: Scalars['Float']['output'];
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
  weight?: InputMaybe<Scalars['Float']['input']>;
};

export type Query = {
  __typename?: 'Query';
  allIngredients: Array<Ingredient>;
  categories: Array<Category>;
  courses: Array<Course>;
  cuisines: Array<Cuisine>;
  expirationRule: ExpirationRule;
  expirationRules: QueryExpirationRulesConnection;
  healthProfile: HealthProfile;
  ingredient: Ingredient;
  ingredientCategories: Array<IngredientCategory>;
  ingredientPrice: IngredientPriceHistory;
  ingredientPrices: QueryIngredientPricesConnection;
  ingredients: QueryIngredientsConnection;
  mealPlan: MealPlan;
  mealPlanIngredients: Array<MealPlanIngredient>;
  mealPlanRecipes: Array<MealPlanRecipe>;
  mealPlanServings: Array<MealPlanServing>;
  mealPlans: QueryMealPlansConnection;
  node?: Maybe<Node>;
  nodes: Array<Maybe<Node>>;
  nutrients: Array<Nutrient>;
  nutritionLabel: NutritionLabel;
  nutritionTargets: NutritionTargets;
  rankedNutrients: Array<Nutrient>;
  receipt: Receipt;
  receipts: QueryReceiptsConnection;
  recipe: Recipe;
  recipes: QueryRecipesConnection;
  stores: QueryStoresConnection;
  tagIngredients: Array<TaggedIngredient>;
  unit: MeasurementUnit;
  units: Array<MeasurementUnit>;
};


export type QueryCategoriesArgs = {
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryCoursesArgs = {
  searchString?: InputMaybe<Scalars['String']['input']>;
};


export type QueryCuisinesArgs = {
  searchString?: InputMaybe<Scalars['String']['input']>;
};


export type QueryExpirationRuleArgs = {
  expirationRuleId: Scalars['ID']['input'];
};


export type QueryExpirationRulesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryIngredientArgs = {
  ingredientId: Scalars['ID']['input'];
};


export type QueryIngredientPriceArgs = {
  ingredientPriceId: Scalars['ID']['input'];
};


export type QueryIngredientPricesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<IngredientPriceFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  ingredientId: Scalars['ID']['input'];
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryIngredientsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryMealPlanArgs = {
  id: Scalars['ID']['input'];
};


export type QueryMealPlanIngredientsArgs = {
  mealPlanId: Scalars['String']['input'];
};


export type QueryMealPlanRecipesArgs = {
  mealPlanId: Scalars['ID']['input'];
};


export type QueryMealPlanServingsArgs = {
  filter?: InputMaybe<ServingsFilterInput>;
  mealPlanId: Scalars['ID']['input'];
};


export type QueryMealPlansArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryNodeArgs = {
  id: Scalars['ID']['input'];
};


export type QueryNodesArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type QueryNutrientsArgs = {
  advanced: Scalars['Boolean']['input'];
  favorites?: InputMaybe<Scalars['Boolean']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryNutritionLabelArgs = {
  labelId: Scalars['String']['input'];
};


export type QueryReceiptArgs = {
  id: Scalars['ID']['input'];
};


export type QueryReceiptsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryRecipeArgs = {
  recipeId: Scalars['ID']['input'];
};


export type QueryRecipesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filter: RecipeFilter;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryStoresArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryTagIngredientsArgs = {
  ingredientTxt: Scalars['String']['input'];
};


export type QueryUnitArgs = {
  id: Scalars['String']['input'];
};

export type QueryExpirationRulesConnection = {
  __typename?: 'QueryExpirationRulesConnection';
  edges: Array<QueryExpirationRulesConnectionEdge>;
  pageInfo: PageInfo;
};

export type QueryExpirationRulesConnectionEdge = {
  __typename?: 'QueryExpirationRulesConnectionEdge';
  cursor: Scalars['String']['output'];
  node: ExpirationRule;
};

export type QueryIngredientPricesConnection = {
  __typename?: 'QueryIngredientPricesConnection';
  edges: Array<QueryIngredientPricesConnectionEdge>;
  pageInfo: PageInfo;
};

export type QueryIngredientPricesConnectionEdge = {
  __typename?: 'QueryIngredientPricesConnectionEdge';
  cursor: Scalars['String']['output'];
  node: IngredientPriceHistory;
};

export type QueryIngredientsConnection = {
  __typename?: 'QueryIngredientsConnection';
  edges: Array<QueryIngredientsConnectionEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type QueryIngredientsConnectionEdge = {
  __typename?: 'QueryIngredientsConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Ingredient;
};

export type QueryMealPlansConnection = {
  __typename?: 'QueryMealPlansConnection';
  edges: Array<QueryMealPlansConnectionEdge>;
  pageInfo: PageInfo;
};

export type QueryMealPlansConnectionEdge = {
  __typename?: 'QueryMealPlansConnectionEdge';
  cursor: Scalars['String']['output'];
  node: MealPlan;
};

export type QueryReceiptsConnection = {
  __typename?: 'QueryReceiptsConnection';
  edges: Array<QueryReceiptsConnectionEdge>;
  pageInfo: PageInfo;
};

export type QueryReceiptsConnectionEdge = {
  __typename?: 'QueryReceiptsConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Receipt;
};

export type QueryRecipesConnection = {
  __typename?: 'QueryRecipesConnection';
  edges: Array<QueryRecipesConnectionEdge>;
  pageInfo: PageInfo;
};

export type QueryRecipesConnectionEdge = {
  __typename?: 'QueryRecipesConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Recipe;
};

export type QueryStoresConnection = {
  __typename?: 'QueryStoresConnection';
  edges: Array<QueryStoresConnectionEdge>;
  pageInfo: PageInfo;
};

export type QueryStoresConnectionEdge = {
  __typename?: 'QueryStoresConnectionEdge';
  cursor: Scalars['String']['output'];
  node: GroceryStore;
};

export type RankedNutrientInput = {
  nutrientId: Scalars['String']['input'];
  rank: Scalars['Int']['input'];
};

export type Receipt = Node & {
  __typename?: 'Receipt';
  date?: Maybe<Scalars['DateTime']['output']>;
  dateUploaded: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  imagePath: Scalars['String']['output'];
  items?: Maybe<Array<ReceiptLine>>;
  matchingStore?: Maybe<GroceryStore>;
  merchantName?: Maybe<Scalars['String']['output']>;
  scanned: Scalars['Boolean']['output'];
  total?: Maybe<Scalars['Float']['output']>;
  verified: Scalars['Boolean']['output'];
};

export type ReceiptItemInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  foodType?: InputMaybe<FoodType>;
  ignore?: InputMaybe<Scalars['Boolean']['input']>;
  ingredientId?: InputMaybe<Scalars['RefID']['input']>;
  perUnitPrice?: InputMaybe<Scalars['Float']['input']>;
  quantity?: InputMaybe<Scalars['Float']['input']>;
  totalPrice?: InputMaybe<Scalars['Float']['input']>;
  unitId?: InputMaybe<Scalars['RefID']['input']>;
  unitQuantity?: InputMaybe<Scalars['Float']['input']>;
};

export type ReceiptLine = Node & {
  __typename?: 'ReceiptLine';
  boundingBoxes?: Maybe<Array<BoundingBox>>;
  description?: Maybe<Scalars['String']['output']>;
  foodType?: Maybe<FoodType>;
  id: Scalars['ID']['output'];
  ignore: Scalars['Boolean']['output'];
  matchingIngredient?: Maybe<Ingredient>;
  matchingUnit?: Maybe<MeasurementUnit>;
  order: Scalars['Int']['output'];
  perUnitPrice?: Maybe<Scalars['Float']['output']>;
  quantity?: Maybe<Scalars['Float']['output']>;
  totalPrice?: Maybe<Scalars['Float']['output']>;
  unitQuantity?: Maybe<Scalars['Float']['output']>;
  verified: Scalars['Boolean']['output'];
};

export type Recipe = Node & {
  __typename?: 'Recipe';
  aggregateLabel?: Maybe<AggregateLabel>;
  category: Array<Category>;
  cookTime?: Maybe<Scalars['Int']['output']>;
  course: Array<Course>;
  cuisine: Array<Cuisine>;
  directions?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  ingredientFreshness?: Maybe<Scalars['Int']['output']>;
  ingredientGroups: Array<RecipeIngredientGroup>;
  ingredientText: Scalars['String']['output'];
  ingredients: Array<RecipeIngredient>;
  leftoverFreezerLife?: Maybe<Scalars['Int']['output']>;
  leftoverFridgeLife?: Maybe<Scalars['Int']['output']>;
  marinadeTime?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  nutritionLabels?: Maybe<Array<NutritionLabel>>;
  photos: Array<Photo>;
  prepTime?: Maybe<Scalars['Int']['output']>;
  source?: Maybe<Scalars['String']['output']>;
  verified: Scalars['Boolean']['output'];
};

export type RecipeFilter = {
  alcoholPerServing?: InputMaybe<NumericalFilter>;
  caloriePerServing?: InputMaybe<NumericalFilter>;
  carbPerServing?: InputMaybe<NumericalFilter>;
  categoryIds?: InputMaybe<Array<Scalars['String']['input']>>;
  cookTime?: InputMaybe<NumericalFilter>;
  courseIds?: InputMaybe<Array<Scalars['String']['input']>>;
  cuisineIds?: InputMaybe<Array<Scalars['String']['input']>>;
  fatPerServing?: InputMaybe<NumericalFilter>;
  ingredientFilters?: InputMaybe<Array<IngredientFilter>>;
  ingredientFreshDays?: InputMaybe<NumericalFilter>;
  isFavorite?: InputMaybe<Scalars['Boolean']['input']>;
  leftoverFreezerLife?: InputMaybe<NumericalFilter>;
  leftoverFridgeLife?: InputMaybe<NumericalFilter>;
  marinadeTime?: InputMaybe<NumericalFilter>;
  numOfServings?: InputMaybe<NumericalFilter>;
  nutrientFilters?: InputMaybe<Array<NutritionFilter>>;
  prepTime?: InputMaybe<NumericalFilter>;
  protienPerServing?: InputMaybe<NumericalFilter>;
  searchTerm?: InputMaybe<Scalars['String']['input']>;
  totalPrepTime?: InputMaybe<NumericalFilter>;
};

export type RecipeIngredient = Node & {
  __typename?: 'RecipeIngredient';
  baseIngredient?: Maybe<Ingredient>;
  group?: Maybe<RecipeIngredientGroup>;
  id: Scalars['ID']['output'];
  mealPrepIngredient: Scalars['Boolean']['output'];
  optional: Scalars['Boolean']['output'];
  order: Scalars['Int']['output'];
  quantity?: Maybe<Scalars['Float']['output']>;
  recipe: Recipe;
  sentence: Scalars['String']['output'];
  unit?: Maybe<MeasurementUnit>;
  verified: Scalars['Boolean']['output'];
};

export type RecipeIngredientGroup = Node & {
  __typename?: 'RecipeIngredientGroup';
  id: Scalars['ID']['output'];
  ingredients: Array<RecipeIngredient>;
  label?: Maybe<NutritionLabel>;
  name: Scalars['String']['output'];
  recipe: Recipe;
};

export type RecipeIngredientInput = {
  groupId?: InputMaybe<Scalars['RefID']['input']>;
  ingredientId: Scalars['RefID']['input'];
  mealPrepIngredient: Scalars['Boolean']['input'];
  order: Scalars['Int']['input'];
  quantity?: InputMaybe<Scalars['Float']['input']>;
  sentence: Scalars['String']['input'];
  unitId: Scalars['RefID']['input'];
  verified: Scalars['Boolean']['input'];
};

export type RecipeInput = {
  categoryIds?: InputMaybe<Array<Scalars['RefID']['input']>>;
  cookTime?: InputMaybe<Scalars['Int']['input']>;
  courseIds?: InputMaybe<Array<Scalars['RefID']['input']>>;
  cuisineIds?: InputMaybe<Array<Scalars['RefID']['input']>>;
  directions?: InputMaybe<Scalars['String']['input']>;
  ingredientText?: InputMaybe<Scalars['String']['input']>;
  ingredients?: InputMaybe<Array<RecipeIngredientInput>>;
  leftoverFreezerLife?: InputMaybe<Scalars['Int']['input']>;
  leftoverFridgeLife?: InputMaybe<Scalars['Int']['input']>;
  marinadeTime?: InputMaybe<Scalars['Int']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  photoIds?: InputMaybe<Array<Scalars['RefID']['input']>>;
  prepTime?: InputMaybe<Scalars['Int']['input']>;
  source?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};

export enum RecordStatus {
  Duplicate = 'DUPLICATE',
  Failed = 'FAILED',
  Ignored = 'IGNORED',
  Imported = 'IMPORTED',
  Updated = 'UPDATED'
}

export type ScaledRecipeIngredient = {
  __typename?: 'ScaledRecipeIngredient';
  factor: Scalars['Float']['output'];
  name: Scalars['String']['output'];
  recipeId: Scalars['String']['output'];
  recipeIngredient: RecipeIngredient;
};

export type ScheduledPlan = Node & {
  __typename?: 'ScheduledPlan';
  duration?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  mealPlan: MealPlan;
  startDate: Scalars['DateTime']['output'];
};

export type ServingsFilterInput = {
  day?: InputMaybe<Scalars['Int']['input']>;
  maxDay?: InputMaybe<Scalars['Int']['input']>;
  minDay?: InputMaybe<Scalars['Int']['input']>;
};

export enum SpecialCondition {
  Lactating = 'LACTATING',
  None = 'NONE',
  Pregnant = 'PREGNANT'
}

export type TaggedIngredient = {
  __typename?: 'TaggedIngredient';
  ingredient?: Maybe<Ingredient>;
  order: Scalars['Int']['output'];
  quantity?: Maybe<Scalars['Float']['output']>;
  sentence: Scalars['String']['output'];
  unit?: Maybe<MeasurementUnit>;
  verified: Scalars['Boolean']['output'];
};

export enum TargetPreference {
  None = 'NONE',
  Over = 'OVER',
  Under = 'UNDER'
}

export enum UnitType {
  Count = 'COUNT',
  Energy = 'ENERGY',
  Length = 'LENGTH',
  Volume = 'VOLUME',
  Weight = 'WEIGHT'
}

export type UpdateReceipt = {
  date: Scalars['DateTime']['input'];
  groceryStoreId: Scalars['String']['input'];
};

export type PhotoFieldsFragment = { __typename?: 'Photo', id: string, isPrimary: boolean, url: string } & { ' $fragmentName'?: 'PhotoFieldsFragment' };

export type UploadPhotoMutationVariables = Exact<{
  file: Scalars['File']['input'];
}>;


export type UploadPhotoMutation = { __typename?: 'Mutation', uploadPhoto: { __typename?: 'Photo', id: string, url: string, isPrimary: boolean } };

export type FetchUnitsQueryVariables = Exact<{ [key: string]: never; }>;


export type FetchUnitsQuery = { __typename?: 'Query', units: Array<{ __typename?: 'MeasurementUnit', id: string, name: string, symbol?: string | null }> };

export type CreateUnitMutationVariables = Exact<{
  unit: CreateUnitInput;
}>;


export type CreateUnitMutation = { __typename?: 'Mutation', createUnit: { __typename?: 'MeasurementUnit', id: string, name: string, symbol?: string | null } };

export type ExpirationRuleFieldsFragment = { __typename?: 'ExpirationRule', id: string, name: string, variation?: string | null, defrostTime?: number | null, perishable?: boolean | null, tableLife?: number | null, fridgeLife?: number | null, freezerLife?: number | null } & { ' $fragmentName'?: 'ExpirationRuleFieldsFragment' };

export type GetExpirationRulesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetExpirationRulesQuery = { __typename?: 'Query', expirationRules: { __typename?: 'QueryExpirationRulesConnection', pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: string | null }, edges: Array<{ __typename?: 'QueryExpirationRulesConnectionEdge', node: (
        { __typename?: 'ExpirationRule' }
        & { ' $fragmentRefs'?: { 'ExpirationRuleFieldsFragment': ExpirationRuleFieldsFragment } }
      ) }> } };

export type CreateExpirationRuleMutationVariables = Exact<{
  input: ExpirationRuleInput;
}>;


export type CreateExpirationRuleMutation = { __typename?: 'Mutation', createExpirationRule: (
    { __typename?: 'ExpirationRule' }
    & { ' $fragmentRefs'?: { 'ExpirationRuleFieldsFragment': ExpirationRuleFieldsFragment } }
  ) };

export type EditExpirationRuleMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: ExpirationRuleInput;
}>;


export type EditExpirationRuleMutation = { __typename?: 'Mutation', editExpirationRule: (
    { __typename?: 'ExpirationRule' }
    & { ' $fragmentRefs'?: { 'ExpirationRuleFieldsFragment': ExpirationRuleFieldsFragment } }
  ) };

export type DeleteRuleMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteRuleMutation = { __typename?: 'Mutation', deleteExpirationRule: { __typename?: 'DeleteResult', success: boolean, message?: string | null } };

export type GetGroceryStoresQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetGroceryStoresQuery = { __typename?: 'Query', stores: { __typename?: 'QueryStoresConnection', pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: string | null }, edges: Array<{ __typename?: 'QueryStoresConnectionEdge', node: { __typename?: 'GroceryStore', id: string, name: string } }> } };

export type CreateStoreMutationVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type CreateStoreMutation = { __typename?: 'Mutation', createGroceryStore: { __typename?: 'GroceryStore', id: string, name: string } };

export type IngredientFieldsFragment = { __typename?: 'Ingredient', id: string, name: string, alternateNames: Array<string>, storageInstructions?: string | null, category?: { __typename?: 'IngredientCategory', id: string, name: string } | null, expiration?: (
    { __typename?: 'ExpirationRule' }
    & { ' $fragmentRefs'?: { 'ExpirationRuleFieldsFragment': ExpirationRuleFieldsFragment } }
  ) | null, priceHistory?: Array<{ __typename?: 'IngredientPriceHistory', id: string, date?: any | null, foodType?: FoodType | null, price: number, pricePerUnit: number, quantity: number, groceryStore: { __typename?: 'GroceryStore', id: string, name: string }, unit: { __typename?: 'MeasurementUnit', id: string, name: string, symbol?: string | null, conversionName?: string | null, measurementSystem?: MeasurementSystem | null, type?: UnitType | null } }> | null } & { ' $fragmentName'?: 'IngredientFieldsFragment' };

export type GetIngredientQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetIngredientQuery = { __typename?: 'Query', ingredient: (
    { __typename?: 'Ingredient' }
    & { ' $fragmentRefs'?: { 'IngredientFieldsFragment': IngredientFieldsFragment } }
  ) };

export type GetIngredientsQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetIngredientsQuery = { __typename?: 'Query', ingredients: { __typename?: 'QueryIngredientsConnection', totalCount: number, pageInfo: { __typename?: 'PageInfo', endCursor?: string | null, hasNextPage: boolean }, edges: Array<{ __typename?: 'QueryIngredientsConnectionEdge', node: { __typename?: 'Ingredient', id: string, name: string } }> } };

export type GetAllIngredientsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllIngredientsQuery = { __typename?: 'Query', allIngredients: Array<{ __typename?: 'Ingredient', id: string, name: string, category?: { __typename?: 'IngredientCategory', id: string, name: string } | null, expiration?: { __typename?: 'ExpirationRule', id: string, perishable?: boolean | null, tableLife?: number | null, fridgeLife?: number | null, freezerLife?: number | null, longestLife?: number | null } | null }> };

export type EditIngredientMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: IngredientInput;
}>;


export type EditIngredientMutation = { __typename?: 'Mutation', editIngredient: (
    { __typename?: 'Ingredient' }
    & { ' $fragmentRefs'?: { 'IngredientFieldsFragment': IngredientFieldsFragment } }
  ) };

export type CreateIngredientMutationVariables = Exact<{
  input: IngredientInput;
}>;


export type CreateIngredientMutation = { __typename?: 'Mutation', createIngredient: (
    { __typename?: 'Ingredient' }
    & { ' $fragmentRefs'?: { 'IngredientFieldsFragment': IngredientFieldsFragment } }
  ) };

export type DeleteIngredientMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteIngredientMutation = { __typename?: 'Mutation', deleteIngredient: { __typename?: 'DeleteResult', message?: string | null, success: boolean } };

export type GetIngredientCategoryQueryVariables = Exact<{ [key: string]: never; }>;


export type GetIngredientCategoryQuery = { __typename?: 'Query', ingredientCategories: Array<{ __typename?: 'IngredientCategory', id: string, name: string }> };

export type MealRecipeFieldsFragment = { __typename?: 'MealPlanRecipe', id: string, totalServings: number, factor: number, servingsOnPlan: number, originalRecipe: { __typename?: 'Recipe', id: string, name: string, ingredientFreshness?: number | null, photos: Array<{ __typename?: 'Photo', id: string, url: string, isPrimary: boolean }>, ingredients: Array<{ __typename?: 'RecipeIngredient', id: string, quantity?: number | null, sentence: string, baseIngredient?: { __typename?: 'Ingredient', id: string, name: string } | null, unit?: { __typename?: 'MeasurementUnit', id: string, name: string, symbol?: string | null } | null }>, aggregateLabel?: { __typename?: 'AggregateLabel', id: string, totalCalories?: number | null, fat?: number | null, alcohol?: number | null, carbs?: number | null, protein?: number | null, servings?: number | null, servingSize?: number | null, nutrients: Array<{ __typename?: 'AggLabelNutrient', id: string, perServing?: number | null, value: number, nutrient: { __typename?: 'Nutrient', id: string } }>, servingSizeUnit?: { __typename?: 'MeasurementUnit', id: string, name: string, symbol?: string | null } | null } | null } } & { ' $fragmentName'?: 'MealRecipeFieldsFragment' };

export type GetMealPlanQueryVariables = Exact<{
  mealPlanId: Scalars['ID']['input'];
}>;


export type GetMealPlanQuery = { __typename?: 'Query', mealPlan: { __typename?: 'MealPlan', id: string, name?: string | null, mealPrepInstructions?: string | null } };

export type GetMealPlanInfoQueryVariables = Exact<{
  mealPlanId: Scalars['ID']['input'];
}>;


export type GetMealPlanInfoQuery = { __typename?: 'Query', mealPlan: { __typename?: 'MealPlan', id: string, name?: string | null, mealPrepInstructions?: string | null } };

export type CreateMealPlanMutationVariables = Exact<{
  input: CreateMealPlanInput;
}>;


export type CreateMealPlanMutation = { __typename?: 'Mutation', createMealPlan: { __typename?: 'MealPlan', id: string } };

export type EditMealPlanMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  mealPlan: EditMealPlanInput;
}>;


export type EditMealPlanMutation = { __typename?: 'Mutation', editMealPlan: { __typename?: 'MealPlan', id: string, name?: string | null, mealPrepInstructions?: string | null } };

export type GetMealPlansQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMealPlansQuery = { __typename?: 'Query', mealPlans: { __typename?: 'QueryMealPlansConnection', pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: string | null }, edges: Array<{ __typename?: 'QueryMealPlansConnectionEdge', node: { __typename?: 'MealPlan', id: string, name?: string | null, planRecipes: Array<{ __typename?: 'MealPlanRecipe', id: string, originalRecipe: { __typename?: 'Recipe', id: string, name: string, photos: Array<{ __typename?: 'Photo', id: string, url: string, isPrimary: boolean }> } }> } }> } };

export type MealPlanRecipeFieldsFragment = { __typename?: 'MealPlanRecipe', id: string, totalServings: number, factor: number, servingsOnPlan: number, mealPlan: { __typename?: 'MealPlan', id: string }, originalRecipe: { __typename?: 'Recipe', id: string, name: string, directions?: string | null, notes?: string | null, source?: string | null, leftoverFridgeLife?: number | null, leftoverFreezerLife?: number | null, prepTime?: number | null, marinadeTime?: number | null, cookTime?: number | null, ingredientFreshness?: number | null, photos: Array<{ __typename?: 'Photo', id: string, url: string, isPrimary: boolean }>, ingredients: Array<(
      { __typename?: 'RecipeIngredient' }
      & { ' $fragmentRefs'?: { 'RecipeIngredientFieldsFragment': RecipeIngredientFieldsFragment } }
    )>, aggregateLabel?: { __typename?: 'AggregateLabel', id: string, totalCalories?: number | null, fat?: number | null, alcohol?: number | null, carbs?: number | null, protein?: number | null, servings?: number | null, servingSize?: number | null, servingSizeUnit?: { __typename?: 'MeasurementUnit', id: string, name: string, symbol?: string | null } | null } | null } } & { ' $fragmentName'?: 'MealPlanRecipeFieldsFragment' };

export type BasicPlanRecipeFieldsFragment = { __typename?: 'MealPlanRecipe', id: string, totalServings: number, servingsOnPlan: number, mealPlan: { __typename?: 'MealPlan', id: string }, originalRecipe: { __typename?: 'Recipe', id: string, name: string, photos: Array<{ __typename?: 'Photo', id: string, url: string, isPrimary: boolean }> } } & { ' $fragmentName'?: 'BasicPlanRecipeFieldsFragment' };

export type PlanNutritionFieldsFragment = { __typename?: 'MealPlanRecipe', id: string, totalServings: number, factor: number, mealPlan: { __typename?: 'MealPlan', id: string }, originalRecipe: { __typename?: 'Recipe', id: string, aggregateLabel?: { __typename?: 'AggregateLabel', id: string, totalCalories?: number | null, fat?: number | null, alcohol?: number | null, carbs?: number | null, protein?: number | null, nutrients: Array<{ __typename?: 'AggLabelNutrient', id: string, perServing?: number | null, value: number, nutrient: { __typename?: 'Nutrient', id: string } }> } | null } } & { ' $fragmentName'?: 'PlanNutritionFieldsFragment' };

export type GetBasicPlanRecipeInfoQueryVariables = Exact<{
  mealPlanId: Scalars['ID']['input'];
}>;


export type GetBasicPlanRecipeInfoQuery = { __typename?: 'Query', mealPlanRecipes: Array<(
    { __typename?: 'MealPlanRecipe' }
    & { ' $fragmentRefs'?: { 'BasicPlanRecipeFieldsFragment': BasicPlanRecipeFieldsFragment } }
  )> };

export type GetMealPlanRecipesQueryVariables = Exact<{
  mealPlanId: Scalars['ID']['input'];
}>;


export type GetMealPlanRecipesQuery = { __typename?: 'Query', mealPlanRecipes: Array<(
    { __typename?: 'MealPlanRecipe' }
    & { ' $fragmentRefs'?: { 'MealPlanRecipeFieldsFragment': MealPlanRecipeFieldsFragment } }
  )> };

export type GetMealPlanRecipeNutritionQueryVariables = Exact<{
  mealPlanRecipeId: Scalars['ID']['input'];
}>;


export type GetMealPlanRecipeNutritionQuery = { __typename?: 'Query', mealPlanRecipes: Array<(
    { __typename?: 'MealPlanRecipe' }
    & { ' $fragmentRefs'?: { 'PlanNutritionFieldsFragment': PlanNutritionFieldsFragment } }
  )> };

export type AddRecipeToPlanMutationVariables = Exact<{
  mealPlanId: Scalars['ID']['input'];
  recipe: AddRecipeToPlanInput;
}>;


export type AddRecipeToPlanMutation = { __typename?: 'Mutation', addRecipeToMealPlan: (
    { __typename?: 'MealPlanRecipe', mealPlan: { __typename?: 'MealPlan', id: string } }
    & { ' $fragmentRefs'?: { 'MealPlanRecipeFieldsFragment': MealPlanRecipeFieldsFragment } }
  ) };

export type EditMealPlanRecipeMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  recipe: EditMealPlanRecipeInput;
}>;


export type EditMealPlanRecipeMutation = { __typename?: 'Mutation', editMealPlanRecipe: (
    { __typename?: 'MealPlanRecipe' }
    & { ' $fragmentRefs'?: { 'MealPlanRecipeFieldsFragment': MealPlanRecipeFieldsFragment } }
  ) };

export type RemoveMealPlanRecipeMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type RemoveMealPlanRecipeMutation = { __typename?: 'Mutation', removeMealPlanRecipe: { __typename?: 'DeleteResult', id: string, success: boolean } };

export type MealPlanServingsFieldFragment = { __typename?: 'MealPlanServing', id: string, day: number, meal: Meal, numberOfServings: number, mealPlanRecipeId: any } & { ' $fragmentName'?: 'MealPlanServingsFieldFragment' };

export type GetServingsQueryVariables = Exact<{
  mealPlanId: Scalars['ID']['input'];
  filter?: InputMaybe<ServingsFilterInput>;
}>;


export type GetServingsQuery = { __typename?: 'Query', mealPlanServings: Array<(
    { __typename?: 'MealPlanServing' }
    & { ' $fragmentRefs'?: { 'MealPlanServingsFieldFragment': MealPlanServingsFieldFragment } }
  )> };

export type AddServingToPlanMutationVariables = Exact<{
  serving: AddRecipeServingInput;
}>;


export type AddServingToPlanMutation = { __typename?: 'Mutation', addRecipeServing: { __typename?: 'MealPlanServing', day: number, id: string, meal: Meal, mealPlanRecipeId: any, numberOfServings: number, mealRecipe: { __typename?: 'MealPlanRecipe', id: string, servingsOnPlan: number } } };

export type RemoveServingMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type RemoveServingMutation = { __typename?: 'Mutation', deleteRecipeServing: { __typename?: 'DeleteResult', id: string, success: boolean } };

export type EditServingMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  serving: EditRecipeServingInput;
}>;


export type EditServingMutation = { __typename?: 'Mutation', editRecipeServing: Array<{ __typename?: 'MealPlanServing', id: string, day: number, meal: Meal, numberOfServings: number, mealRecipe: { __typename?: 'MealPlanRecipe', id: string, servingsOnPlan: number } }> };

export type NutrientTargetFieldsFragment = { __typename?: 'NutrientGoal', nutrientId: string, dri?: { __typename?: 'DailyReferenceIntake', id: string, upperLimit?: number | null, value: number } | null, target?: { __typename?: 'NutrientTarget', id: string, nutrientTarget: number, preference: TargetPreference, threshold?: number | null } | null } & { ' $fragmentName'?: 'NutrientTargetFieldsFragment' };

export type GetNutrientTargetsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetNutrientTargetsQuery = { __typename?: 'Query', nutritionTargets: { __typename?: 'NutritionTargets', alcohol?: (
      { __typename?: 'NutrientGoal' }
      & { ' $fragmentRefs'?: { 'NutrientTargetFieldsFragment': NutrientTargetFieldsFragment } }
    ) | null, fat?: (
      { __typename?: 'NutrientGoal' }
      & { ' $fragmentRefs'?: { 'NutrientTargetFieldsFragment': NutrientTargetFieldsFragment } }
    ) | null, calories?: (
      { __typename?: 'NutrientGoal' }
      & { ' $fragmentRefs'?: { 'NutrientTargetFieldsFragment': NutrientTargetFieldsFragment } }
    ) | null, carbs?: (
      { __typename?: 'NutrientGoal' }
      & { ' $fragmentRefs'?: { 'NutrientTargetFieldsFragment': NutrientTargetFieldsFragment } }
    ) | null, protein?: (
      { __typename?: 'NutrientGoal' }
      & { ' $fragmentRefs'?: { 'NutrientTargetFieldsFragment': NutrientTargetFieldsFragment } }
    ) | null, nutrients: Array<(
      { __typename?: 'NutrientGoal' }
      & { ' $fragmentRefs'?: { 'NutrientTargetFieldsFragment': NutrientTargetFieldsFragment } }
    )> } };

export type SetNutrientTargetMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  target: NutrientTargetInput;
}>;


export type SetNutrientTargetMutation = { __typename?: 'Mutation', setNutritionTarget: { __typename?: 'Nutrient', id: string, target?: { __typename?: 'NutrientTarget', id: string, nutrientTarget: number, preference: TargetPreference, threshold?: number | null } | null } };

export type GetIngredientCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetIngredientCategoriesQuery = { __typename?: 'Query', ingredientCategories: Array<{ __typename?: 'IngredientCategory', id: string, name: string }> };

export type NutrientFieldsFragment = { __typename?: 'Nutrient', id: string, alternateNames: Array<string>, advancedView: boolean, name: string, important: boolean, parentNutrientId?: string | null, type: string, target?: { __typename?: 'NutrientTarget', id: string, nutrientTarget: number, preference: TargetPreference, threshold?: number | null } | null, dri?: { __typename?: 'DailyReferenceIntake', id: string, value: number, upperLimit?: number | null } | null, unit: { __typename?: 'MeasurementUnit', id: string, name: string, symbol?: string | null, abbreviations: Array<string> } } & { ' $fragmentName'?: 'NutrientFieldsFragment' };

export type GetNutrientsQueryVariables = Exact<{
  advanced: Scalars['Boolean']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  favorites?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type GetNutrientsQuery = { __typename?: 'Query', nutrients: Array<(
    { __typename?: 'Nutrient' }
    & { ' $fragmentRefs'?: { 'NutrientFieldsFragment': NutrientFieldsFragment } }
  )> };

export type SearchNutrientsQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type SearchNutrientsQuery = { __typename?: 'Query', nutrients: Array<{ __typename?: 'Nutrient', id: string, name: string, alternateNames: Array<string>, unit: { __typename?: 'MeasurementUnit', id: string, symbol?: string | null } }> };

export type GetRankedNutrientsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetRankedNutrientsQuery = { __typename?: 'Query', rankedNutrients: Array<{ __typename?: 'Nutrient', id: string, name: string, alternateNames: Array<string>, unit: { __typename?: 'MeasurementUnit', id: string, symbol?: string | null } }> };

export type SetRankedNutrientsMutationVariables = Exact<{
  nutrients: Array<RankedNutrientInput> | RankedNutrientInput;
}>;


export type SetRankedNutrientsMutation = { __typename?: 'Mutation', setRankedNutrients: Array<{ __typename?: 'Nutrient', id: string, name: string, alternateNames: Array<string>, unit: { __typename?: 'MeasurementUnit', id: string, symbol?: string | null } }> };

export type ReceiptItemFragment = { __typename?: 'ReceiptLine', id: string, totalPrice?: number | null, description?: string | null, quantity?: number | null, perUnitPrice?: number | null, unitQuantity?: number | null, foodType?: FoodType | null, order: number, verified: boolean, ignore: boolean, boundingBoxes?: Array<{ __typename?: 'BoundingBox', coordinates: Array<{ __typename?: 'PolygonCoordinate', x: number, y: number }> }> | null, matchingUnit?: { __typename?: 'MeasurementUnit', id: string, name: string } | null, matchingIngredient?: { __typename?: 'Ingredient', id: string, name: string } | null } & { ' $fragmentName'?: 'ReceiptItemFragment' };

export type GetReceiptQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetReceiptQuery = { __typename?: 'Query', receipt: { __typename?: 'Receipt', id: string, imagePath: string, total?: number | null, merchantName?: string | null, date?: any | null, scanned: boolean, verified: boolean, matchingStore?: { __typename?: 'GroceryStore', id: string, name: string } | null, items?: Array<(
      { __typename?: 'ReceiptLine' }
      & { ' $fragmentRefs'?: { 'ReceiptItemFragment': ReceiptItemFragment } }
    )> | null } };

export type GetReceiptsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetReceiptsQuery = { __typename?: 'Query', receipts: { __typename?: 'QueryReceiptsConnection', pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: string | null }, edges: Array<{ __typename?: 'QueryReceiptsConnectionEdge', node: { __typename?: 'Receipt', id: string, date?: any | null, dateUploaded: any, total?: number | null, verified: boolean, matchingStore?: { __typename?: 'GroceryStore', id: string, name: string } | null } }> } };

export type EditReceiptItemMutationVariables = Exact<{
  lineId: Scalars['ID']['input'];
  lineItem: ReceiptItemInput;
}>;


export type EditReceiptItemMutation = { __typename?: 'Mutation', updateReceiptLine: (
    { __typename?: 'ReceiptLine' }
    & { ' $fragmentRefs'?: { 'ReceiptItemFragment': ReceiptItemFragment } }
  ) };

export type FinalizeReceiptMutationVariables = Exact<{
  receiptId: Scalars['ID']['input'];
}>;


export type FinalizeReceiptMutation = { __typename?: 'Mutation', finalizeReceipt: { __typename?: 'Receipt', id: string, imagePath: string, total?: number | null, merchantName?: string | null, date?: any | null, scanned: boolean, matchingStore?: { __typename?: 'GroceryStore', id: string, name: string } | null, items?: Array<(
      { __typename?: 'ReceiptLine' }
      & { ' $fragmentRefs'?: { 'ReceiptItemFragment': ReceiptItemFragment } }
    )> | null } };

export type UploadReceiptMutationVariables = Exact<{
  file: Scalars['File']['input'];
}>;


export type UploadReceiptMutation = { __typename?: 'Mutation', uploadReceipt: { __typename?: 'Receipt', id: string } };

export type GetCategoriesQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetCategoriesQuery = { __typename?: 'Query', categories: Array<{ __typename?: 'Category', id: string, name: string }> };

export type CreateCategoryMutationVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type CreateCategoryMutation = { __typename?: 'Mutation', createCategory: Array<{ __typename?: 'Category', id: string, name: string }> };

export type GetCoursesQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetCoursesQuery = { __typename?: 'Query', courses: Array<{ __typename?: 'Course', id: string, name: string }> };

export type CreateCourseMutationVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type CreateCourseMutation = { __typename?: 'Mutation', createCourse: Array<{ __typename?: 'Course', id: string, name: string }> };

export type GetCuisinesQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetCuisinesQuery = { __typename?: 'Query', cuisines: Array<{ __typename?: 'Cuisine', id: string, name: string }> };

export type CreateCuisineMutationVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type CreateCuisineMutation = { __typename?: 'Mutation', createCuisine: Array<{ __typename?: 'Cuisine', id: string, name: string }> };

export type NutritionLabelFieldsFragment = { __typename?: 'NutritionLabel', id: string, isPrimary: boolean, servingSize?: number | null, servings?: number | null, servingsUsed?: number | null, ingredientGroup?: { __typename?: 'RecipeIngredientGroup', id: string, name: string } | null, servingSizeUnit?: { __typename?: 'MeasurementUnit', id: string, name: string, symbol?: string | null } | null, nutrients: Array<{ __typename?: 'NutritionLabelNutrient', value: number, nutrient: { __typename?: 'Nutrient', id: string } }> } & { ' $fragmentName'?: 'NutritionLabelFieldsFragment' };

export type CreateNutritionLabelMutationVariables = Exact<{
  input: NutritionLabelInput;
}>;


export type CreateNutritionLabelMutation = { __typename?: 'Mutation', createNutritionLabel: (
    { __typename?: 'NutritionLabel' }
    & { ' $fragmentRefs'?: { 'NutritionLabelFieldsFragment': NutritionLabelFieldsFragment } }
  ) };

export type EditNutritionLabelMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  label: NutritionLabelInput;
}>;


export type EditNutritionLabelMutation = { __typename?: 'Mutation', editNutritionLabel: (
    { __typename?: 'NutritionLabel' }
    & { ' $fragmentRefs'?: { 'NutritionLabelFieldsFragment': NutritionLabelFieldsFragment } }
  ) };

export type RecipeFieldsFragment = { __typename?: 'Recipe', id: string, name: string, cookTime?: number | null, directions?: string | null, leftoverFridgeLife?: number | null, leftoverFreezerLife?: number | null, marinadeTime?: number | null, ingredientText: string, verified: boolean, notes?: string | null, prepTime?: number | null, source?: string | null, category: Array<{ __typename?: 'Category', id: string, name: string }>, cuisine: Array<{ __typename?: 'Cuisine', id: string, name: string }>, course: Array<{ __typename?: 'Course', id: string, name: string }>, photos: Array<{ __typename?: 'Photo', id: string, isPrimary: boolean, url: string }>, ingredientGroups: Array<{ __typename?: 'RecipeIngredientGroup', id: string, name: string }>, ingredients: Array<(
    { __typename?: 'RecipeIngredient' }
    & { ' $fragmentRefs'?: { 'RecipeIngredientFieldsFragment': RecipeIngredientFieldsFragment } }
  )>, nutritionLabels?: Array<(
    { __typename?: 'NutritionLabel' }
    & { ' $fragmentRefs'?: { 'NutritionLabelFieldsFragment': NutritionLabelFieldsFragment } }
  )> | null, aggregateLabel?: { __typename?: 'AggregateLabel', id: string, alcohol?: number | null, servings?: number | null, totalCalories?: number | null, carbs?: number | null, fat?: number | null, protein?: number | null, servingSize?: number | null, servingSizeUnit?: { __typename?: 'MeasurementUnit', id: string, name: string, symbol?: string | null } | null, nutrients: Array<{ __typename?: 'AggLabelNutrient', id: string, value: number, nutrient: { __typename?: 'Nutrient', id: string } }> } | null } & { ' $fragmentName'?: 'RecipeFieldsFragment' };

export type CreateRecipeMutationVariables = Exact<{
  input: RecipeInput;
}>;


export type CreateRecipeMutation = { __typename?: 'Mutation', createRecipe: (
    { __typename?: 'Recipe' }
    & { ' $fragmentRefs'?: { 'RecipeFieldsFragment': RecipeFieldsFragment } }
  ) };

export type GetRecipeQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetRecipeQuery = { __typename?: 'Query', recipe: (
    { __typename?: 'Recipe' }
    & { ' $fragmentRefs'?: { 'RecipeFieldsFragment': RecipeFieldsFragment } }
  ) };

export type EditRecipeMutationVariables = Exact<{
  recipe: RecipeInput;
  id: Scalars['ID']['input'];
}>;


export type EditRecipeMutation = { __typename?: 'Mutation', editRecipe: (
    { __typename?: 'Recipe' }
    & { ' $fragmentRefs'?: { 'RecipeFieldsFragment': RecipeFieldsFragment } }
  ) };

export type GetRecipeBaiscInfoQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetRecipeBaiscInfoQuery = { __typename?: 'Query', recipe: { __typename?: 'Recipe', id: string, name: string, cookTime?: number | null, directions?: string | null, leftoverFridgeLife?: number | null, leftoverFreezerLife?: number | null, marinadeTime?: number | null, verified: boolean, notes?: string | null, prepTime?: number | null, source?: string | null, ingredients: Array<(
      { __typename?: 'RecipeIngredient' }
      & { ' $fragmentRefs'?: { 'RecipeIngredientFieldsFragment': RecipeIngredientFieldsFragment } }
    )>, photos: Array<{ __typename?: 'Photo', id: string, isPrimary: boolean, url: string }>, aggregateLabel?: { __typename?: 'AggregateLabel', id: string, servings?: number | null, totalCalories?: number | null, protein?: number | null, fat?: number | null, carbs?: number | null, alcohol?: number | null } | null } };

export type GetRecipeLabelsQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetRecipeLabelsQuery = { __typename?: 'Query', recipe: { __typename?: 'Recipe', id: string, nutritionLabels?: Array<{ __typename?: 'NutritionLabel', id: string, isPrimary: boolean, servingSize?: number | null, servings?: number | null, servingsUsed?: number | null, ingredientGroup?: { __typename?: 'RecipeIngredientGroup', id: string, name: string } | null, servingSizeUnit?: { __typename?: 'MeasurementUnit', id: string, name: string, symbol?: string | null } | null, nutrients: Array<{ __typename?: 'NutritionLabelNutrient', value: number, nutrient: { __typename?: 'Nutrient', id: string } }> }> | null } };

export type RecipeSearchFieldsFragment = { __typename?: 'Recipe', id: string, name: string, verified: boolean, ingredients: Array<{ __typename?: 'RecipeIngredient', id: string, sentence: string, quantity?: number | null, unit?: { __typename?: 'MeasurementUnit', id: string, name: string } | null }>, aggregateLabel?: { __typename?: 'AggregateLabel', id: string, totalCalories?: number | null, protein?: number | null, fat?: number | null, carbs?: number | null, alcohol?: number | null, servings?: number | null } | null, photos: Array<{ __typename?: 'Photo', id: string, isPrimary: boolean, url: string }> } & { ' $fragmentName'?: 'RecipeSearchFieldsFragment' };

export type SearchRecipesQueryVariables = Exact<{
  filters: RecipeFilter;
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
}>;


export type SearchRecipesQuery = { __typename?: 'Query', recipes: { __typename?: 'QueryRecipesConnection', pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: string | null }, edges: Array<{ __typename?: 'QueryRecipesConnectionEdge', cursor: string, node: (
        { __typename?: 'Recipe' }
        & { ' $fragmentRefs'?: { 'RecipeSearchFieldsFragment': RecipeSearchFieldsFragment } }
      ) }> } };

export type RecipeIngredientFieldsFragment = { __typename?: 'RecipeIngredient', id: string, sentence: string, order: number, quantity?: number | null, verified: boolean, mealPrepIngredient: boolean, baseIngredient?: { __typename?: 'Ingredient', id: string, name: string } | null, unit?: { __typename?: 'MeasurementUnit', id: string, name: string, symbol?: string | null } | null, group?: { __typename?: 'RecipeIngredientGroup', id: string, name: string } | null, recipe: { __typename?: 'Recipe', id: string } } & { ' $fragmentName'?: 'RecipeIngredientFieldsFragment' };

export type ParseIngredientsQueryVariables = Exact<{
  lines: Scalars['String']['input'];
}>;


export type ParseIngredientsQuery = { __typename?: 'Query', tagIngredients: Array<{ __typename?: 'TaggedIngredient', order: number, quantity?: number | null, sentence: string, unit?: { __typename?: 'MeasurementUnit', id: string, name: string } | null, ingredient?: { __typename?: 'Ingredient', id: string, name: string } | null }> };

export type GetRecipeIngredientsQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetRecipeIngredientsQuery = { __typename?: 'Query', recipe: { __typename?: 'Recipe', id: string, ingredients: Array<(
      { __typename?: 'RecipeIngredient' }
      & { ' $fragmentRefs'?: { 'RecipeIngredientFieldsFragment': RecipeIngredientFieldsFragment } }
    )> } };

export type CreateRecipeIngredientMutationVariables = Exact<{
  recipeId: Scalars['ID']['input'];
  ingredient: Scalars['String']['input'];
  groupId?: InputMaybe<Scalars['ID']['input']>;
}>;


export type CreateRecipeIngredientMutation = { __typename?: 'Mutation', addRecipeIngredientsFromTxt: Array<(
    { __typename?: 'RecipeIngredient' }
    & { ' $fragmentRefs'?: { 'RecipeIngredientFieldsFragment': RecipeIngredientFieldsFragment } }
  )> };

export type EditRecipeIngredientMutationVariables = Exact<{
  input: Array<EditRecipeIngredientsInput> | EditRecipeIngredientsInput;
}>;


export type EditRecipeIngredientMutation = { __typename?: 'Mutation', editRecipeIngredients: Array<(
    { __typename?: 'RecipeIngredient' }
    & { ' $fragmentRefs'?: { 'RecipeIngredientFieldsFragment': RecipeIngredientFieldsFragment } }
  )> };

export type DeleteRecipeIngredientMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteRecipeIngredientMutation = { __typename?: 'Mutation', deleteRecipeIngredient: { __typename?: 'DeleteResult', success: boolean } };

export type CreateIngredientGroupMutationVariables = Exact<{
  name: Scalars['String']['input'];
  recipeId: Scalars['ID']['input'];
}>;


export type CreateIngredientGroupMutation = { __typename?: 'Mutation', createIngredientGroup: { __typename?: 'RecipeIngredientGroup', id: string, name: string, recipe: { __typename?: 'Recipe', id: string }, ingredients: Array<{ __typename?: 'RecipeIngredient', id: string }> } };

export type DeleteIngredientGroupMutationVariables = Exact<{
  groupId: Scalars['ID']['input'];
}>;


export type DeleteIngredientGroupMutation = { __typename?: 'Mutation', deleteRecipeIngredientGroup: { __typename?: 'DeleteResult', success: boolean } };

export type EditIngredientGroupMutationVariables = Exact<{
  name: Scalars['String']['input'];
  groupId: Scalars['ID']['input'];
}>;


export type EditIngredientGroupMutation = { __typename?: 'Mutation', editRecipeIngredientGroup: { __typename?: 'RecipeIngredientGroup', id: string, name: string, recipe: { __typename?: 'Recipe', id: string }, ingredients: Array<{ __typename?: 'RecipeIngredient', id: string }> } };

export const PhotoFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PhotoFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Photo"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]} as unknown as DocumentNode<PhotoFieldsFragment, unknown>;
export const ExpirationRuleFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ExpirationRuleFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ExpirationRule"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"variation"}},{"kind":"Field","name":{"kind":"Name","value":"defrostTime"}},{"kind":"Field","name":{"kind":"Name","value":"perishable"}},{"kind":"Field","name":{"kind":"Name","value":"tableLife"}},{"kind":"Field","name":{"kind":"Name","value":"fridgeLife"}},{"kind":"Field","name":{"kind":"Name","value":"freezerLife"}}]}}]} as unknown as DocumentNode<ExpirationRuleFieldsFragment, unknown>;
export const IngredientFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"IngredientFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Ingredient"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"alternateNames"}},{"kind":"Field","name":{"kind":"Name","value":"storageInstructions"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"expiration"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ExpirationRuleFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"priceHistory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"foodType"}},{"kind":"Field","name":{"kind":"Name","value":"groceryStore"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"pricePerUnit"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"conversionName"}},{"kind":"Field","name":{"kind":"Name","value":"measurementSystem"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ExpirationRuleFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ExpirationRule"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"variation"}},{"kind":"Field","name":{"kind":"Name","value":"defrostTime"}},{"kind":"Field","name":{"kind":"Name","value":"perishable"}},{"kind":"Field","name":{"kind":"Name","value":"tableLife"}},{"kind":"Field","name":{"kind":"Name","value":"fridgeLife"}},{"kind":"Field","name":{"kind":"Name","value":"freezerLife"}}]}}]} as unknown as DocumentNode<IngredientFieldsFragment, unknown>;
export const MealRecipeFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MealRecipeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MealPlanRecipe"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"totalServings"}},{"kind":"Field","name":{"kind":"Name","value":"factor"}},{"kind":"Field","name":{"kind":"Name","value":"servingsOnPlan"}},{"kind":"Field","name":{"kind":"Name","value":"originalRecipe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"photos"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ingredientFreshness"}},{"kind":"Field","name":{"kind":"Name","value":"ingredients"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"sentence"}},{"kind":"Field","name":{"kind":"Name","value":"baseIngredient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"unit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"aggregateLabel"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"totalCalories"}},{"kind":"Field","name":{"kind":"Name","value":"fat"}},{"kind":"Field","name":{"kind":"Name","value":"alcohol"}},{"kind":"Field","name":{"kind":"Name","value":"carbs"}},{"kind":"Field","name":{"kind":"Name","value":"protein"}},{"kind":"Field","name":{"kind":"Name","value":"nutrients"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"perServing"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"nutrient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"servings"}},{"kind":"Field","name":{"kind":"Name","value":"servingSize"}},{"kind":"Field","name":{"kind":"Name","value":"servingSizeUnit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}}]}}]}}]}}]} as unknown as DocumentNode<MealRecipeFieldsFragment, unknown>;
export const RecipeIngredientFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RecipeIngredientFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RecipeIngredient"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sentence"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}},{"kind":"Field","name":{"kind":"Name","value":"mealPrepIngredient"}},{"kind":"Field","name":{"kind":"Name","value":"baseIngredient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"unit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}},{"kind":"Field","name":{"kind":"Name","value":"group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"recipe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<RecipeIngredientFieldsFragment, unknown>;
export const MealPlanRecipeFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MealPlanRecipeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MealPlanRecipe"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"totalServings"}},{"kind":"Field","name":{"kind":"Name","value":"mealPlan"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"factor"}},{"kind":"Field","name":{"kind":"Name","value":"servingsOnPlan"}},{"kind":"Field","name":{"kind":"Name","value":"originalRecipe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"directions"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"leftoverFridgeLife"}},{"kind":"Field","name":{"kind":"Name","value":"leftoverFreezerLife"}},{"kind":"Field","name":{"kind":"Name","value":"prepTime"}},{"kind":"Field","name":{"kind":"Name","value":"marinadeTime"}},{"kind":"Field","name":{"kind":"Name","value":"cookTime"}},{"kind":"Field","name":{"kind":"Name","value":"photos"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ingredientFreshness"}},{"kind":"Field","name":{"kind":"Name","value":"ingredients"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"RecipeIngredientFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"aggregateLabel"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"totalCalories"}},{"kind":"Field","name":{"kind":"Name","value":"fat"}},{"kind":"Field","name":{"kind":"Name","value":"alcohol"}},{"kind":"Field","name":{"kind":"Name","value":"carbs"}},{"kind":"Field","name":{"kind":"Name","value":"protein"}},{"kind":"Field","name":{"kind":"Name","value":"servings"}},{"kind":"Field","name":{"kind":"Name","value":"servingSize"}},{"kind":"Field","name":{"kind":"Name","value":"servingSizeUnit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RecipeIngredientFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RecipeIngredient"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sentence"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}},{"kind":"Field","name":{"kind":"Name","value":"mealPrepIngredient"}},{"kind":"Field","name":{"kind":"Name","value":"baseIngredient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"unit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}},{"kind":"Field","name":{"kind":"Name","value":"group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"recipe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<MealPlanRecipeFieldsFragment, unknown>;
export const BasicPlanRecipeFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BasicPlanRecipeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MealPlanRecipe"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"mealPlan"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalServings"}},{"kind":"Field","name":{"kind":"Name","value":"servingsOnPlan"}},{"kind":"Field","name":{"kind":"Name","value":"originalRecipe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"photos"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}}]}}]}}]}}]} as unknown as DocumentNode<BasicPlanRecipeFieldsFragment, unknown>;
export const PlanNutritionFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PlanNutritionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MealPlanRecipe"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"totalServings"}},{"kind":"Field","name":{"kind":"Name","value":"mealPlan"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"factor"}},{"kind":"Field","name":{"kind":"Name","value":"originalRecipe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"aggregateLabel"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"totalCalories"}},{"kind":"Field","name":{"kind":"Name","value":"fat"}},{"kind":"Field","name":{"kind":"Name","value":"alcohol"}},{"kind":"Field","name":{"kind":"Name","value":"carbs"}},{"kind":"Field","name":{"kind":"Name","value":"protein"}},{"kind":"Field","name":{"kind":"Name","value":"nutrients"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"perServing"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"nutrient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<PlanNutritionFieldsFragment, unknown>;
export const MealPlanServingsFieldFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MealPlanServingsField"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MealPlanServing"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"day"}},{"kind":"Field","name":{"kind":"Name","value":"meal"}},{"kind":"Field","name":{"kind":"Name","value":"numberOfServings"}},{"kind":"Field","name":{"kind":"Name","value":"mealPlanRecipeId"}}]}}]} as unknown as DocumentNode<MealPlanServingsFieldFragment, unknown>;
export const NutrientTargetFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NutrientTargetFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NutrientGoal"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nutrientId"}},{"kind":"Field","name":{"kind":"Name","value":"dri"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"upperLimit"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"target"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"nutrientTarget"}},{"kind":"Field","name":{"kind":"Name","value":"preference"}},{"kind":"Field","name":{"kind":"Name","value":"threshold"}}]}}]}}]} as unknown as DocumentNode<NutrientTargetFieldsFragment, unknown>;
export const NutrientFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NutrientFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Nutrient"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"alternateNames"}},{"kind":"Field","name":{"kind":"Name","value":"advancedView"}},{"kind":"Field","name":{"kind":"Name","value":"target"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"nutrientTarget"}},{"kind":"Field","name":{"kind":"Name","value":"preference"}},{"kind":"Field","name":{"kind":"Name","value":"threshold"}}]}},{"kind":"Field","name":{"kind":"Name","value":"dri"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"upperLimit"}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"important"}},{"kind":"Field","name":{"kind":"Name","value":"parentNutrientId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"unit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"abbreviations"}}]}}]}}]} as unknown as DocumentNode<NutrientFieldsFragment, unknown>;
export const ReceiptItemFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ReceiptItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ReceiptLine"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"totalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"perUnitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"unitQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"foodType"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}},{"kind":"Field","name":{"kind":"Name","value":"ignore"}},{"kind":"Field","name":{"kind":"Name","value":"boundingBoxes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"coordinates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"x"}},{"kind":"Field","name":{"kind":"Name","value":"y"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"matchingUnit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"matchingIngredient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<ReceiptItemFragment, unknown>;
export const NutritionLabelFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NutritionLabelFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NutritionLabel"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"ingredientGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"servingSize"}},{"kind":"Field","name":{"kind":"Name","value":"servingSizeUnit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}},{"kind":"Field","name":{"kind":"Name","value":"servings"}},{"kind":"Field","name":{"kind":"Name","value":"servingsUsed"}},{"kind":"Field","name":{"kind":"Name","value":"nutrients"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"nutrient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<NutritionLabelFieldsFragment, unknown>;
export const RecipeFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RecipeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Recipe"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"cuisine"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"cookTime"}},{"kind":"Field","name":{"kind":"Name","value":"course"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"directions"}},{"kind":"Field","name":{"kind":"Name","value":"leftoverFridgeLife"}},{"kind":"Field","name":{"kind":"Name","value":"leftoverFreezerLife"}},{"kind":"Field","name":{"kind":"Name","value":"marinadeTime"}},{"kind":"Field","name":{"kind":"Name","value":"ingredientText"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"photos"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"prepTime"}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"ingredientGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ingredients"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"RecipeIngredientFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nutritionLabels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NutritionLabelFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"aggregateLabel"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"alcohol"}},{"kind":"Field","name":{"kind":"Name","value":"servings"}},{"kind":"Field","name":{"kind":"Name","value":"totalCalories"}},{"kind":"Field","name":{"kind":"Name","value":"carbs"}},{"kind":"Field","name":{"kind":"Name","value":"fat"}},{"kind":"Field","name":{"kind":"Name","value":"protein"}},{"kind":"Field","name":{"kind":"Name","value":"servingSize"}},{"kind":"Field","name":{"kind":"Name","value":"servingSizeUnit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nutrients"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"nutrient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RecipeIngredientFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RecipeIngredient"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sentence"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}},{"kind":"Field","name":{"kind":"Name","value":"mealPrepIngredient"}},{"kind":"Field","name":{"kind":"Name","value":"baseIngredient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"unit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}},{"kind":"Field","name":{"kind":"Name","value":"group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"recipe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NutritionLabelFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NutritionLabel"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"ingredientGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"servingSize"}},{"kind":"Field","name":{"kind":"Name","value":"servingSizeUnit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}},{"kind":"Field","name":{"kind":"Name","value":"servings"}},{"kind":"Field","name":{"kind":"Name","value":"servingsUsed"}},{"kind":"Field","name":{"kind":"Name","value":"nutrients"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"nutrient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<RecipeFieldsFragment, unknown>;
export const RecipeSearchFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RecipeSearchFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Recipe"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}},{"kind":"Field","name":{"kind":"Name","value":"ingredients"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sentence"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"aggregateLabel"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"totalCalories"}},{"kind":"Field","name":{"kind":"Name","value":"protein"}},{"kind":"Field","name":{"kind":"Name","value":"fat"}},{"kind":"Field","name":{"kind":"Name","value":"carbs"}},{"kind":"Field","name":{"kind":"Name","value":"alcohol"}},{"kind":"Field","name":{"kind":"Name","value":"servings"}}]}},{"kind":"Field","name":{"kind":"Name","value":"photos"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]} as unknown as DocumentNode<RecipeSearchFieldsFragment, unknown>;
export const UploadPhotoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"uploadPhoto"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"file"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"File"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uploadPhoto"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"photo"},"value":{"kind":"Variable","name":{"kind":"Name","value":"file"}}},{"kind":"Argument","name":{"kind":"Name","value":"isPrimary"},"value":{"kind":"BooleanValue","value":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}}]}}]}}]} as unknown as DocumentNode<UploadPhotoMutation, UploadPhotoMutationVariables>;
export const FetchUnitsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"fetchUnits"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"units"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}}]}}]} as unknown as DocumentNode<FetchUnitsQuery, FetchUnitsQueryVariables>;
export const CreateUnitDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createUnit"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"unit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateUnitInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createUnit"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"unit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}}]}}]} as unknown as DocumentNode<CreateUnitMutation, CreateUnitMutationVariables>;
export const GetExpirationRulesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetExpirationRules"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"expirationRules"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}}]}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ExpirationRuleFields"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ExpirationRuleFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ExpirationRule"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"variation"}},{"kind":"Field","name":{"kind":"Name","value":"defrostTime"}},{"kind":"Field","name":{"kind":"Name","value":"perishable"}},{"kind":"Field","name":{"kind":"Name","value":"tableLife"}},{"kind":"Field","name":{"kind":"Name","value":"fridgeLife"}},{"kind":"Field","name":{"kind":"Name","value":"freezerLife"}}]}}]} as unknown as DocumentNode<GetExpirationRulesQuery, GetExpirationRulesQueryVariables>;
export const CreateExpirationRuleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateExpirationRule"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ExpirationRuleInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createExpirationRule"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"rule"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ExpirationRuleFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ExpirationRuleFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ExpirationRule"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"variation"}},{"kind":"Field","name":{"kind":"Name","value":"defrostTime"}},{"kind":"Field","name":{"kind":"Name","value":"perishable"}},{"kind":"Field","name":{"kind":"Name","value":"tableLife"}},{"kind":"Field","name":{"kind":"Name","value":"fridgeLife"}},{"kind":"Field","name":{"kind":"Name","value":"freezerLife"}}]}}]} as unknown as DocumentNode<CreateExpirationRuleMutation, CreateExpirationRuleMutationVariables>;
export const EditExpirationRuleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"EditExpirationRule"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ExpirationRuleInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"editExpirationRule"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ruleId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"expirationRule"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ExpirationRuleFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ExpirationRuleFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ExpirationRule"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"variation"}},{"kind":"Field","name":{"kind":"Name","value":"defrostTime"}},{"kind":"Field","name":{"kind":"Name","value":"perishable"}},{"kind":"Field","name":{"kind":"Name","value":"tableLife"}},{"kind":"Field","name":{"kind":"Name","value":"fridgeLife"}},{"kind":"Field","name":{"kind":"Name","value":"freezerLife"}}]}}]} as unknown as DocumentNode<EditExpirationRuleMutation, EditExpirationRuleMutationVariables>;
export const DeleteRuleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteRule"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteExpirationRule"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"expirationRuleId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<DeleteRuleMutation, DeleteRuleMutationVariables>;
export const GetGroceryStoresDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getGroceryStores"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stores"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}}]}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetGroceryStoresQuery, GetGroceryStoresQueryVariables>;
export const CreateStoreDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createStore"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createGroceryStore"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<CreateStoreMutation, CreateStoreMutationVariables>;
export const GetIngredientDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetIngredient"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ingredient"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ingredientId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"IngredientFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ExpirationRuleFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ExpirationRule"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"variation"}},{"kind":"Field","name":{"kind":"Name","value":"defrostTime"}},{"kind":"Field","name":{"kind":"Name","value":"perishable"}},{"kind":"Field","name":{"kind":"Name","value":"tableLife"}},{"kind":"Field","name":{"kind":"Name","value":"fridgeLife"}},{"kind":"Field","name":{"kind":"Name","value":"freezerLife"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"IngredientFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Ingredient"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"alternateNames"}},{"kind":"Field","name":{"kind":"Name","value":"storageInstructions"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"expiration"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ExpirationRuleFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"priceHistory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"foodType"}},{"kind":"Field","name":{"kind":"Name","value":"groceryStore"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"pricePerUnit"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"conversionName"}},{"kind":"Field","name":{"kind":"Name","value":"measurementSystem"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]} as unknown as DocumentNode<GetIngredientQuery, GetIngredientQueryVariables>;
export const GetIngredientsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetIngredients"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ingredients"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}}]}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetIngredientsQuery, GetIngredientsQueryVariables>;
export const GetAllIngredientsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllIngredients"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allIngredients"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"expiration"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"perishable"}},{"kind":"Field","name":{"kind":"Name","value":"tableLife"}},{"kind":"Field","name":{"kind":"Name","value":"fridgeLife"}},{"kind":"Field","name":{"kind":"Name","value":"freezerLife"}},{"kind":"Field","name":{"kind":"Name","value":"longestLife"}}]}}]}}]}}]} as unknown as DocumentNode<GetAllIngredientsQuery, GetAllIngredientsQueryVariables>;
export const EditIngredientDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"EditIngredient"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"IngredientInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"editIngredient"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"ingredient"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"IngredientFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ExpirationRuleFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ExpirationRule"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"variation"}},{"kind":"Field","name":{"kind":"Name","value":"defrostTime"}},{"kind":"Field","name":{"kind":"Name","value":"perishable"}},{"kind":"Field","name":{"kind":"Name","value":"tableLife"}},{"kind":"Field","name":{"kind":"Name","value":"fridgeLife"}},{"kind":"Field","name":{"kind":"Name","value":"freezerLife"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"IngredientFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Ingredient"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"alternateNames"}},{"kind":"Field","name":{"kind":"Name","value":"storageInstructions"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"expiration"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ExpirationRuleFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"priceHistory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"foodType"}},{"kind":"Field","name":{"kind":"Name","value":"groceryStore"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"pricePerUnit"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"conversionName"}},{"kind":"Field","name":{"kind":"Name","value":"measurementSystem"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]} as unknown as DocumentNode<EditIngredientMutation, EditIngredientMutationVariables>;
export const CreateIngredientDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateIngredient"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"IngredientInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createIngredient"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ingredient"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"IngredientFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ExpirationRuleFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ExpirationRule"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"variation"}},{"kind":"Field","name":{"kind":"Name","value":"defrostTime"}},{"kind":"Field","name":{"kind":"Name","value":"perishable"}},{"kind":"Field","name":{"kind":"Name","value":"tableLife"}},{"kind":"Field","name":{"kind":"Name","value":"fridgeLife"}},{"kind":"Field","name":{"kind":"Name","value":"freezerLife"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"IngredientFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Ingredient"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"alternateNames"}},{"kind":"Field","name":{"kind":"Name","value":"storageInstructions"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"expiration"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ExpirationRuleFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"priceHistory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"foodType"}},{"kind":"Field","name":{"kind":"Name","value":"groceryStore"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"pricePerUnit"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"conversionName"}},{"kind":"Field","name":{"kind":"Name","value":"measurementSystem"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]} as unknown as DocumentNode<CreateIngredientMutation, CreateIngredientMutationVariables>;
export const DeleteIngredientDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteIngredient"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteIngredient"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ingredientId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<DeleteIngredientMutation, DeleteIngredientMutationVariables>;
export const GetIngredientCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetIngredientCategory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ingredientCategories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetIngredientCategoryQuery, GetIngredientCategoryQueryVariables>;
export const GetMealPlanDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMealPlan"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"mealPlanId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mealPlan"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"mealPlanId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"mealPrepInstructions"}}]}}]}}]} as unknown as DocumentNode<GetMealPlanQuery, GetMealPlanQueryVariables>;
export const GetMealPlanInfoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMealPlanInfo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"mealPlanId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mealPlan"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"mealPlanId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"mealPrepInstructions"}}]}}]}}]} as unknown as DocumentNode<GetMealPlanInfoQuery, GetMealPlanInfoQueryVariables>;
export const CreateMealPlanDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createMealPlan"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateMealPlanInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createMealPlan"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"mealPlan"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateMealPlanMutation, CreateMealPlanMutationVariables>;
export const EditMealPlanDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"editMealPlan"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"mealPlan"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EditMealPlanInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"editMealPlan"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"mealPlan"},"value":{"kind":"Variable","name":{"kind":"Name","value":"mealPlan"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"mealPrepInstructions"}}]}}]}}]} as unknown as DocumentNode<EditMealPlanMutation, EditMealPlanMutationVariables>;
export const GetMealPlansDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMealPlans"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mealPlans"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}}]}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"planRecipes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"originalRecipe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"photos"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}}]}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetMealPlansQuery, GetMealPlansQueryVariables>;
export const GetBasicPlanRecipeInfoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetBasicPlanRecipeInfo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"mealPlanId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mealPlanRecipes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"mealPlanId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"mealPlanId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BasicPlanRecipeFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BasicPlanRecipeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MealPlanRecipe"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"mealPlan"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalServings"}},{"kind":"Field","name":{"kind":"Name","value":"servingsOnPlan"}},{"kind":"Field","name":{"kind":"Name","value":"originalRecipe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"photos"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}}]}}]}}]}}]} as unknown as DocumentNode<GetBasicPlanRecipeInfoQuery, GetBasicPlanRecipeInfoQueryVariables>;
export const GetMealPlanRecipesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMealPlanRecipes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"mealPlanId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mealPlanRecipes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"mealPlanId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"mealPlanId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MealPlanRecipeFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RecipeIngredientFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RecipeIngredient"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sentence"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}},{"kind":"Field","name":{"kind":"Name","value":"mealPrepIngredient"}},{"kind":"Field","name":{"kind":"Name","value":"baseIngredient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"unit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}},{"kind":"Field","name":{"kind":"Name","value":"group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"recipe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MealPlanRecipeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MealPlanRecipe"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"totalServings"}},{"kind":"Field","name":{"kind":"Name","value":"mealPlan"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"factor"}},{"kind":"Field","name":{"kind":"Name","value":"servingsOnPlan"}},{"kind":"Field","name":{"kind":"Name","value":"originalRecipe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"directions"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"leftoverFridgeLife"}},{"kind":"Field","name":{"kind":"Name","value":"leftoverFreezerLife"}},{"kind":"Field","name":{"kind":"Name","value":"prepTime"}},{"kind":"Field","name":{"kind":"Name","value":"marinadeTime"}},{"kind":"Field","name":{"kind":"Name","value":"cookTime"}},{"kind":"Field","name":{"kind":"Name","value":"photos"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ingredientFreshness"}},{"kind":"Field","name":{"kind":"Name","value":"ingredients"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"RecipeIngredientFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"aggregateLabel"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"totalCalories"}},{"kind":"Field","name":{"kind":"Name","value":"fat"}},{"kind":"Field","name":{"kind":"Name","value":"alcohol"}},{"kind":"Field","name":{"kind":"Name","value":"carbs"}},{"kind":"Field","name":{"kind":"Name","value":"protein"}},{"kind":"Field","name":{"kind":"Name","value":"servings"}},{"kind":"Field","name":{"kind":"Name","value":"servingSize"}},{"kind":"Field","name":{"kind":"Name","value":"servingSizeUnit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetMealPlanRecipesQuery, GetMealPlanRecipesQueryVariables>;
export const GetMealPlanRecipeNutritionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMealPlanRecipeNutrition"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"mealPlanRecipeId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mealPlanRecipes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"mealPlanId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"mealPlanRecipeId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PlanNutritionFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PlanNutritionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MealPlanRecipe"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"totalServings"}},{"kind":"Field","name":{"kind":"Name","value":"mealPlan"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"factor"}},{"kind":"Field","name":{"kind":"Name","value":"originalRecipe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"aggregateLabel"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"totalCalories"}},{"kind":"Field","name":{"kind":"Name","value":"fat"}},{"kind":"Field","name":{"kind":"Name","value":"alcohol"}},{"kind":"Field","name":{"kind":"Name","value":"carbs"}},{"kind":"Field","name":{"kind":"Name","value":"protein"}},{"kind":"Field","name":{"kind":"Name","value":"nutrients"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"perServing"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"nutrient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetMealPlanRecipeNutritionQuery, GetMealPlanRecipeNutritionQueryVariables>;
export const AddRecipeToPlanDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"addRecipeToPlan"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"mealPlanId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"recipe"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddRecipeToPlanInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addRecipeToMealPlan"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"mealPlanId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"mealPlanId"}}},{"kind":"Argument","name":{"kind":"Name","value":"recipe"},"value":{"kind":"Variable","name":{"kind":"Name","value":"recipe"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mealPlan"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"MealPlanRecipeFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RecipeIngredientFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RecipeIngredient"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sentence"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}},{"kind":"Field","name":{"kind":"Name","value":"mealPrepIngredient"}},{"kind":"Field","name":{"kind":"Name","value":"baseIngredient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"unit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}},{"kind":"Field","name":{"kind":"Name","value":"group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"recipe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MealPlanRecipeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MealPlanRecipe"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"totalServings"}},{"kind":"Field","name":{"kind":"Name","value":"mealPlan"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"factor"}},{"kind":"Field","name":{"kind":"Name","value":"servingsOnPlan"}},{"kind":"Field","name":{"kind":"Name","value":"originalRecipe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"directions"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"leftoverFridgeLife"}},{"kind":"Field","name":{"kind":"Name","value":"leftoverFreezerLife"}},{"kind":"Field","name":{"kind":"Name","value":"prepTime"}},{"kind":"Field","name":{"kind":"Name","value":"marinadeTime"}},{"kind":"Field","name":{"kind":"Name","value":"cookTime"}},{"kind":"Field","name":{"kind":"Name","value":"photos"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ingredientFreshness"}},{"kind":"Field","name":{"kind":"Name","value":"ingredients"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"RecipeIngredientFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"aggregateLabel"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"totalCalories"}},{"kind":"Field","name":{"kind":"Name","value":"fat"}},{"kind":"Field","name":{"kind":"Name","value":"alcohol"}},{"kind":"Field","name":{"kind":"Name","value":"carbs"}},{"kind":"Field","name":{"kind":"Name","value":"protein"}},{"kind":"Field","name":{"kind":"Name","value":"servings"}},{"kind":"Field","name":{"kind":"Name","value":"servingSize"}},{"kind":"Field","name":{"kind":"Name","value":"servingSizeUnit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}}]}}]}}]}}]} as unknown as DocumentNode<AddRecipeToPlanMutation, AddRecipeToPlanMutationVariables>;
export const EditMealPlanRecipeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"editMealPlanRecipe"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"recipe"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EditMealPlanRecipeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"editMealPlanRecipe"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"recipe"},"value":{"kind":"Variable","name":{"kind":"Name","value":"recipe"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MealPlanRecipeFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RecipeIngredientFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RecipeIngredient"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sentence"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}},{"kind":"Field","name":{"kind":"Name","value":"mealPrepIngredient"}},{"kind":"Field","name":{"kind":"Name","value":"baseIngredient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"unit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}},{"kind":"Field","name":{"kind":"Name","value":"group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"recipe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MealPlanRecipeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MealPlanRecipe"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"totalServings"}},{"kind":"Field","name":{"kind":"Name","value":"mealPlan"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"factor"}},{"kind":"Field","name":{"kind":"Name","value":"servingsOnPlan"}},{"kind":"Field","name":{"kind":"Name","value":"originalRecipe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"directions"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"leftoverFridgeLife"}},{"kind":"Field","name":{"kind":"Name","value":"leftoverFreezerLife"}},{"kind":"Field","name":{"kind":"Name","value":"prepTime"}},{"kind":"Field","name":{"kind":"Name","value":"marinadeTime"}},{"kind":"Field","name":{"kind":"Name","value":"cookTime"}},{"kind":"Field","name":{"kind":"Name","value":"photos"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ingredientFreshness"}},{"kind":"Field","name":{"kind":"Name","value":"ingredients"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"RecipeIngredientFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"aggregateLabel"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"totalCalories"}},{"kind":"Field","name":{"kind":"Name","value":"fat"}},{"kind":"Field","name":{"kind":"Name","value":"alcohol"}},{"kind":"Field","name":{"kind":"Name","value":"carbs"}},{"kind":"Field","name":{"kind":"Name","value":"protein"}},{"kind":"Field","name":{"kind":"Name","value":"servings"}},{"kind":"Field","name":{"kind":"Name","value":"servingSize"}},{"kind":"Field","name":{"kind":"Name","value":"servingSizeUnit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}}]}}]}}]}}]} as unknown as DocumentNode<EditMealPlanRecipeMutation, EditMealPlanRecipeMutationVariables>;
export const RemoveMealPlanRecipeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"removeMealPlanRecipe"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeMealPlanRecipe"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<RemoveMealPlanRecipeMutation, RemoveMealPlanRecipeMutationVariables>;
export const GetServingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getServings"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"mealPlanId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ServingsFilterInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mealPlanServings"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"mealPlanId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"mealPlanId"}}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MealPlanServingsField"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MealPlanServingsField"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MealPlanServing"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"day"}},{"kind":"Field","name":{"kind":"Name","value":"meal"}},{"kind":"Field","name":{"kind":"Name","value":"numberOfServings"}},{"kind":"Field","name":{"kind":"Name","value":"mealPlanRecipeId"}}]}}]} as unknown as DocumentNode<GetServingsQuery, GetServingsQueryVariables>;
export const AddServingToPlanDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"addServingToPlan"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"serving"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddRecipeServingInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addRecipeServing"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"serving"},"value":{"kind":"Variable","name":{"kind":"Name","value":"serving"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"day"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"meal"}},{"kind":"Field","name":{"kind":"Name","value":"mealPlanRecipeId"}},{"kind":"Field","name":{"kind":"Name","value":"numberOfServings"}},{"kind":"Field","name":{"kind":"Name","value":"mealRecipe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"servingsOnPlan"}}]}}]}}]}}]} as unknown as DocumentNode<AddServingToPlanMutation, AddServingToPlanMutationVariables>;
export const RemoveServingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"removeServing"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteRecipeServing"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<RemoveServingMutation, RemoveServingMutationVariables>;
export const EditServingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"editServing"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"serving"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EditRecipeServingInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"editRecipeServing"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"serving"},"value":{"kind":"Variable","name":{"kind":"Name","value":"serving"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"day"}},{"kind":"Field","name":{"kind":"Name","value":"meal"}},{"kind":"Field","name":{"kind":"Name","value":"numberOfServings"}},{"kind":"Field","name":{"kind":"Name","value":"mealRecipe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"servingsOnPlan"}}]}}]}}]}}]} as unknown as DocumentNode<EditServingMutation, EditServingMutationVariables>;
export const GetNutrientTargetsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getNutrientTargets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nutritionTargets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"alcohol"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NutrientTargetFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fat"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NutrientTargetFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"calories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NutrientTargetFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"carbs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NutrientTargetFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"protein"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NutrientTargetFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nutrients"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NutrientTargetFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NutrientTargetFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NutrientGoal"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nutrientId"}},{"kind":"Field","name":{"kind":"Name","value":"dri"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"upperLimit"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"target"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"nutrientTarget"}},{"kind":"Field","name":{"kind":"Name","value":"preference"}},{"kind":"Field","name":{"kind":"Name","value":"threshold"}}]}}]}}]} as unknown as DocumentNode<GetNutrientTargetsQuery, GetNutrientTargetsQueryVariables>;
export const SetNutrientTargetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"setNutrientTarget"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"target"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NutrientTargetInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setNutritionTarget"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"nutrientId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"target"},"value":{"kind":"Variable","name":{"kind":"Name","value":"target"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"target"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"nutrientTarget"}},{"kind":"Field","name":{"kind":"Name","value":"preference"}},{"kind":"Field","name":{"kind":"Name","value":"threshold"}}]}}]}}]}}]} as unknown as DocumentNode<SetNutrientTargetMutation, SetNutrientTargetMutationVariables>;
export const GetIngredientCategoriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetIngredientCategories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ingredientCategories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetIngredientCategoriesQuery, GetIngredientCategoriesQueryVariables>;
export const GetNutrientsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getNutrients"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"advanced"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"favorites"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nutrients"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"advanced"},"value":{"kind":"Variable","name":{"kind":"Name","value":"advanced"}}},{"kind":"Argument","name":{"kind":"Name","value":"favorites"},"value":{"kind":"Variable","name":{"kind":"Name","value":"favorites"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NutrientFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NutrientFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Nutrient"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"alternateNames"}},{"kind":"Field","name":{"kind":"Name","value":"advancedView"}},{"kind":"Field","name":{"kind":"Name","value":"target"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"nutrientTarget"}},{"kind":"Field","name":{"kind":"Name","value":"preference"}},{"kind":"Field","name":{"kind":"Name","value":"threshold"}}]}},{"kind":"Field","name":{"kind":"Name","value":"dri"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"upperLimit"}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"important"}},{"kind":"Field","name":{"kind":"Name","value":"parentNutrientId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"unit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"abbreviations"}}]}}]}}]} as unknown as DocumentNode<GetNutrientsQuery, GetNutrientsQueryVariables>;
export const SearchNutrientsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"searchNutrients"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nutrients"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"advanced"},"value":{"kind":"BooleanValue","value":true}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"unit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}},{"kind":"Field","name":{"kind":"Name","value":"alternateNames"}}]}}]}}]} as unknown as DocumentNode<SearchNutrientsQuery, SearchNutrientsQueryVariables>;
export const GetRankedNutrientsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getRankedNutrients"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rankedNutrients"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"unit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}},{"kind":"Field","name":{"kind":"Name","value":"alternateNames"}}]}}]}}]} as unknown as DocumentNode<GetRankedNutrientsQuery, GetRankedNutrientsQueryVariables>;
export const SetRankedNutrientsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"setRankedNutrients"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"nutrients"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RankedNutrientInput"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setRankedNutrients"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"nutrients"},"value":{"kind":"Variable","name":{"kind":"Name","value":"nutrients"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"unit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}},{"kind":"Field","name":{"kind":"Name","value":"alternateNames"}}]}}]}}]} as unknown as DocumentNode<SetRankedNutrientsMutation, SetRankedNutrientsMutationVariables>;
export const GetReceiptDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getReceipt"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"receipt"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"imagePath"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"merchantName"}},{"kind":"Field","name":{"kind":"Name","value":"matchingStore"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ReceiptItem"}}]}},{"kind":"Field","name":{"kind":"Name","value":"scanned"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ReceiptItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ReceiptLine"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"totalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"perUnitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"unitQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"foodType"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}},{"kind":"Field","name":{"kind":"Name","value":"ignore"}},{"kind":"Field","name":{"kind":"Name","value":"boundingBoxes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"coordinates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"x"}},{"kind":"Field","name":{"kind":"Name","value":"y"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"matchingUnit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"matchingIngredient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetReceiptQuery, GetReceiptQueryVariables>;
export const GetReceiptsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getReceipts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"receipts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}}]}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"dateUploaded"}},{"kind":"Field","name":{"kind":"Name","value":"matchingStore"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetReceiptsQuery, GetReceiptsQueryVariables>;
export const EditReceiptItemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"editReceiptItem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lineId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lineItem"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ReceiptItemInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateReceiptLine"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"lineId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lineId"}}},{"kind":"Argument","name":{"kind":"Name","value":"line"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lineItem"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ReceiptItem"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ReceiptItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ReceiptLine"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"totalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"perUnitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"unitQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"foodType"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}},{"kind":"Field","name":{"kind":"Name","value":"ignore"}},{"kind":"Field","name":{"kind":"Name","value":"boundingBoxes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"coordinates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"x"}},{"kind":"Field","name":{"kind":"Name","value":"y"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"matchingUnit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"matchingIngredient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<EditReceiptItemMutation, EditReceiptItemMutationVariables>;
export const FinalizeReceiptDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"finalizeReceipt"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"receiptId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"finalizeReceipt"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"receiptId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"receiptId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"imagePath"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"merchantName"}},{"kind":"Field","name":{"kind":"Name","value":"matchingStore"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ReceiptItem"}}]}},{"kind":"Field","name":{"kind":"Name","value":"scanned"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ReceiptItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ReceiptLine"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"totalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"perUnitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"unitQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"foodType"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}},{"kind":"Field","name":{"kind":"Name","value":"ignore"}},{"kind":"Field","name":{"kind":"Name","value":"boundingBoxes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"coordinates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"x"}},{"kind":"Field","name":{"kind":"Name","value":"y"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"matchingUnit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"matchingIngredient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<FinalizeReceiptMutation, FinalizeReceiptMutationVariables>;
export const UploadReceiptDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"uploadReceipt"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"file"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"File"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uploadReceipt"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"file"},"value":{"kind":"Variable","name":{"kind":"Name","value":"file"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UploadReceiptMutation, UploadReceiptMutationVariables>;
export const GetCategoriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getCategories"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categories"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetCategoriesQuery, GetCategoriesQueryVariables>;
export const CreateCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<CreateCategoryMutation, CreateCategoryMutationVariables>;
export const GetCoursesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getCourses"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"courses"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"searchString"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetCoursesQuery, GetCoursesQueryVariables>;
export const CreateCourseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createCourse"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCourse"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<CreateCourseMutation, CreateCourseMutationVariables>;
export const GetCuisinesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getCuisines"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cuisines"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"searchString"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetCuisinesQuery, GetCuisinesQueryVariables>;
export const CreateCuisineDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createCuisine"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCuisine"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<CreateCuisineMutation, CreateCuisineMutationVariables>;
export const CreateNutritionLabelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createNutritionLabel"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NutritionLabelInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createNutritionLabel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"nutritionLabel"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NutritionLabelFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NutritionLabelFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NutritionLabel"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"ingredientGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"servingSize"}},{"kind":"Field","name":{"kind":"Name","value":"servingSizeUnit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}},{"kind":"Field","name":{"kind":"Name","value":"servings"}},{"kind":"Field","name":{"kind":"Name","value":"servingsUsed"}},{"kind":"Field","name":{"kind":"Name","value":"nutrients"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"nutrient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<CreateNutritionLabelMutation, CreateNutritionLabelMutationVariables>;
export const EditNutritionLabelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"editNutritionLabel"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"label"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NutritionLabelInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"editNutritionLabel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"label"},"value":{"kind":"Variable","name":{"kind":"Name","value":"label"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NutritionLabelFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NutritionLabelFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NutritionLabel"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"ingredientGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"servingSize"}},{"kind":"Field","name":{"kind":"Name","value":"servingSizeUnit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}},{"kind":"Field","name":{"kind":"Name","value":"servings"}},{"kind":"Field","name":{"kind":"Name","value":"servingsUsed"}},{"kind":"Field","name":{"kind":"Name","value":"nutrients"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"nutrient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<EditNutritionLabelMutation, EditNutritionLabelMutationVariables>;
export const CreateRecipeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createRecipe"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RecipeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createRecipe"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"recipe"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"RecipeFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RecipeIngredientFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RecipeIngredient"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sentence"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}},{"kind":"Field","name":{"kind":"Name","value":"mealPrepIngredient"}},{"kind":"Field","name":{"kind":"Name","value":"baseIngredient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"unit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}},{"kind":"Field","name":{"kind":"Name","value":"group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"recipe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NutritionLabelFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NutritionLabel"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"ingredientGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"servingSize"}},{"kind":"Field","name":{"kind":"Name","value":"servingSizeUnit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}},{"kind":"Field","name":{"kind":"Name","value":"servings"}},{"kind":"Field","name":{"kind":"Name","value":"servingsUsed"}},{"kind":"Field","name":{"kind":"Name","value":"nutrients"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"nutrient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RecipeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Recipe"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"cuisine"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"cookTime"}},{"kind":"Field","name":{"kind":"Name","value":"course"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"directions"}},{"kind":"Field","name":{"kind":"Name","value":"leftoverFridgeLife"}},{"kind":"Field","name":{"kind":"Name","value":"leftoverFreezerLife"}},{"kind":"Field","name":{"kind":"Name","value":"marinadeTime"}},{"kind":"Field","name":{"kind":"Name","value":"ingredientText"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"photos"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"prepTime"}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"ingredientGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ingredients"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"RecipeIngredientFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nutritionLabels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NutritionLabelFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"aggregateLabel"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"alcohol"}},{"kind":"Field","name":{"kind":"Name","value":"servings"}},{"kind":"Field","name":{"kind":"Name","value":"totalCalories"}},{"kind":"Field","name":{"kind":"Name","value":"carbs"}},{"kind":"Field","name":{"kind":"Name","value":"fat"}},{"kind":"Field","name":{"kind":"Name","value":"protein"}},{"kind":"Field","name":{"kind":"Name","value":"servingSize"}},{"kind":"Field","name":{"kind":"Name","value":"servingSizeUnit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nutrients"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"nutrient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CreateRecipeMutation, CreateRecipeMutationVariables>;
export const GetRecipeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getRecipe"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recipe"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"recipeId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"RecipeFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RecipeIngredientFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RecipeIngredient"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sentence"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}},{"kind":"Field","name":{"kind":"Name","value":"mealPrepIngredient"}},{"kind":"Field","name":{"kind":"Name","value":"baseIngredient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"unit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}},{"kind":"Field","name":{"kind":"Name","value":"group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"recipe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NutritionLabelFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NutritionLabel"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"ingredientGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"servingSize"}},{"kind":"Field","name":{"kind":"Name","value":"servingSizeUnit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}},{"kind":"Field","name":{"kind":"Name","value":"servings"}},{"kind":"Field","name":{"kind":"Name","value":"servingsUsed"}},{"kind":"Field","name":{"kind":"Name","value":"nutrients"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"nutrient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RecipeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Recipe"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"cuisine"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"cookTime"}},{"kind":"Field","name":{"kind":"Name","value":"course"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"directions"}},{"kind":"Field","name":{"kind":"Name","value":"leftoverFridgeLife"}},{"kind":"Field","name":{"kind":"Name","value":"leftoverFreezerLife"}},{"kind":"Field","name":{"kind":"Name","value":"marinadeTime"}},{"kind":"Field","name":{"kind":"Name","value":"ingredientText"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"photos"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"prepTime"}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"ingredientGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ingredients"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"RecipeIngredientFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nutritionLabels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NutritionLabelFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"aggregateLabel"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"alcohol"}},{"kind":"Field","name":{"kind":"Name","value":"servings"}},{"kind":"Field","name":{"kind":"Name","value":"totalCalories"}},{"kind":"Field","name":{"kind":"Name","value":"carbs"}},{"kind":"Field","name":{"kind":"Name","value":"fat"}},{"kind":"Field","name":{"kind":"Name","value":"protein"}},{"kind":"Field","name":{"kind":"Name","value":"servingSize"}},{"kind":"Field","name":{"kind":"Name","value":"servingSizeUnit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nutrients"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"nutrient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetRecipeQuery, GetRecipeQueryVariables>;
export const EditRecipeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"editRecipe"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"recipe"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RecipeInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"editRecipe"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"recipeId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"recipe"},"value":{"kind":"Variable","name":{"kind":"Name","value":"recipe"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"RecipeFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RecipeIngredientFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RecipeIngredient"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sentence"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}},{"kind":"Field","name":{"kind":"Name","value":"mealPrepIngredient"}},{"kind":"Field","name":{"kind":"Name","value":"baseIngredient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"unit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}},{"kind":"Field","name":{"kind":"Name","value":"group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"recipe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NutritionLabelFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NutritionLabel"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"ingredientGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"servingSize"}},{"kind":"Field","name":{"kind":"Name","value":"servingSizeUnit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}},{"kind":"Field","name":{"kind":"Name","value":"servings"}},{"kind":"Field","name":{"kind":"Name","value":"servingsUsed"}},{"kind":"Field","name":{"kind":"Name","value":"nutrients"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"nutrient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RecipeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Recipe"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"cuisine"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"cookTime"}},{"kind":"Field","name":{"kind":"Name","value":"course"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"directions"}},{"kind":"Field","name":{"kind":"Name","value":"leftoverFridgeLife"}},{"kind":"Field","name":{"kind":"Name","value":"leftoverFreezerLife"}},{"kind":"Field","name":{"kind":"Name","value":"marinadeTime"}},{"kind":"Field","name":{"kind":"Name","value":"ingredientText"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"photos"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"prepTime"}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"ingredientGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ingredients"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"RecipeIngredientFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nutritionLabels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NutritionLabelFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"aggregateLabel"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"alcohol"}},{"kind":"Field","name":{"kind":"Name","value":"servings"}},{"kind":"Field","name":{"kind":"Name","value":"totalCalories"}},{"kind":"Field","name":{"kind":"Name","value":"carbs"}},{"kind":"Field","name":{"kind":"Name","value":"fat"}},{"kind":"Field","name":{"kind":"Name","value":"protein"}},{"kind":"Field","name":{"kind":"Name","value":"servingSize"}},{"kind":"Field","name":{"kind":"Name","value":"servingSizeUnit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nutrients"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"nutrient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]} as unknown as DocumentNode<EditRecipeMutation, EditRecipeMutationVariables>;
export const GetRecipeBaiscInfoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getRecipeBaiscInfo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recipe"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"recipeId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"cookTime"}},{"kind":"Field","name":{"kind":"Name","value":"directions"}},{"kind":"Field","name":{"kind":"Name","value":"leftoverFridgeLife"}},{"kind":"Field","name":{"kind":"Name","value":"leftoverFreezerLife"}},{"kind":"Field","name":{"kind":"Name","value":"marinadeTime"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}},{"kind":"Field","name":{"kind":"Name","value":"ingredients"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"RecipeIngredientFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"photos"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"aggregateLabel"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"servings"}},{"kind":"Field","name":{"kind":"Name","value":"totalCalories"}},{"kind":"Field","name":{"kind":"Name","value":"protein"}},{"kind":"Field","name":{"kind":"Name","value":"fat"}},{"kind":"Field","name":{"kind":"Name","value":"carbs"}},{"kind":"Field","name":{"kind":"Name","value":"alcohol"}}]}},{"kind":"Field","name":{"kind":"Name","value":"prepTime"}},{"kind":"Field","name":{"kind":"Name","value":"source"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RecipeIngredientFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RecipeIngredient"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sentence"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}},{"kind":"Field","name":{"kind":"Name","value":"mealPrepIngredient"}},{"kind":"Field","name":{"kind":"Name","value":"baseIngredient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"unit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}},{"kind":"Field","name":{"kind":"Name","value":"group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"recipe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<GetRecipeBaiscInfoQuery, GetRecipeBaiscInfoQueryVariables>;
export const GetRecipeLabelsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getRecipeLabels"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recipe"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"recipeId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"nutritionLabels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"ingredientGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"servingSize"}},{"kind":"Field","name":{"kind":"Name","value":"servingSizeUnit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}},{"kind":"Field","name":{"kind":"Name","value":"servings"}},{"kind":"Field","name":{"kind":"Name","value":"servingsUsed"}},{"kind":"Field","name":{"kind":"Name","value":"nutrients"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"nutrient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetRecipeLabelsQuery, GetRecipeLabelsQueryVariables>;
export const SearchRecipesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"searchRecipes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filters"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RecipeFilter"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recipes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filters"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}}]}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cursor"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"RecipeSearchFields"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RecipeSearchFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Recipe"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}},{"kind":"Field","name":{"kind":"Name","value":"ingredients"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sentence"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"aggregateLabel"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"totalCalories"}},{"kind":"Field","name":{"kind":"Name","value":"protein"}},{"kind":"Field","name":{"kind":"Name","value":"fat"}},{"kind":"Field","name":{"kind":"Name","value":"carbs"}},{"kind":"Field","name":{"kind":"Name","value":"alcohol"}},{"kind":"Field","name":{"kind":"Name","value":"servings"}}]}},{"kind":"Field","name":{"kind":"Name","value":"photos"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]} as unknown as DocumentNode<SearchRecipesQuery, SearchRecipesQueryVariables>;
export const ParseIngredientsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"parseIngredients"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lines"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tagIngredients"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ingredientTxt"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lines"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"sentence"}},{"kind":"Field","name":{"kind":"Name","value":"unit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ingredient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<ParseIngredientsQuery, ParseIngredientsQueryVariables>;
export const GetRecipeIngredientsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getRecipeIngredients"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recipe"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"recipeId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"ingredients"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"RecipeIngredientFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RecipeIngredientFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RecipeIngredient"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sentence"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}},{"kind":"Field","name":{"kind":"Name","value":"mealPrepIngredient"}},{"kind":"Field","name":{"kind":"Name","value":"baseIngredient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"unit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}},{"kind":"Field","name":{"kind":"Name","value":"group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"recipe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<GetRecipeIngredientsQuery, GetRecipeIngredientsQueryVariables>;
export const CreateRecipeIngredientDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createRecipeIngredient"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"recipeId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ingredient"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"groupId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addRecipeIngredientsFromTxt"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"recipeId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"recipeId"}}},{"kind":"Argument","name":{"kind":"Name","value":"text"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ingredient"}}},{"kind":"Argument","name":{"kind":"Name","value":"groupId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"groupId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"RecipeIngredientFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RecipeIngredientFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RecipeIngredient"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sentence"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}},{"kind":"Field","name":{"kind":"Name","value":"mealPrepIngredient"}},{"kind":"Field","name":{"kind":"Name","value":"baseIngredient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"unit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}},{"kind":"Field","name":{"kind":"Name","value":"group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"recipe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateRecipeIngredientMutation, CreateRecipeIngredientMutationVariables>;
export const EditRecipeIngredientDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"editRecipeIngredient"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EditRecipeIngredientsInput"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"editRecipeIngredients"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ingredients"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"RecipeIngredientFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RecipeIngredientFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RecipeIngredient"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sentence"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}},{"kind":"Field","name":{"kind":"Name","value":"mealPrepIngredient"}},{"kind":"Field","name":{"kind":"Name","value":"baseIngredient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"unit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}},{"kind":"Field","name":{"kind":"Name","value":"group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"recipe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<EditRecipeIngredientMutation, EditRecipeIngredientMutationVariables>;
export const DeleteRecipeIngredientDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteRecipeIngredient"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteRecipeIngredient"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ingredientId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<DeleteRecipeIngredientMutation, DeleteRecipeIngredientMutationVariables>;
export const CreateIngredientGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createIngredientGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"recipeId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createIngredientGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"recipeId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"recipeId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"recipe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ingredients"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<CreateIngredientGroupMutation, CreateIngredientGroupMutationVariables>;
export const DeleteIngredientGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteIngredientGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"groupId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteRecipeIngredientGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"groupId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"groupId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<DeleteIngredientGroupMutation, DeleteIngredientGroupMutationVariables>;
export const EditIngredientGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"editIngredientGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"groupId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"editRecipeIngredientGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"groupId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"groupId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"recipe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ingredients"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<EditIngredientGroupMutation, EditIngredientGroupMutationVariables>;