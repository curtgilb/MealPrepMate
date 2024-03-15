import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
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
  freezerLife?: InputMaybe<Scalars['Int']['input']>;
  fridgeLife?: InputMaybe<Scalars['Int']['input']>;
  ingredientId?: InputMaybe<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
  perishable?: InputMaybe<Scalars['Boolean']['input']>;
  tableLife?: InputMaybe<Scalars['Int']['input']>;
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
  servings?: InputMaybe<Scalars['Float']['input']>;
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

export enum Gender {
  Female = 'FEMALE',
  Male = 'MALE'
}

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
  matchingLabel?: Maybe<NutritionLabel>;
  matchingRecipe?: Maybe<Recipe>;
  name: Scalars['String']['output'];
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

export enum Meal {
  Breakfast = 'BREAKFAST',
  Dinner = 'DINNER',
  Lunch = 'LUNCH',
  Snack = 'SNACK'
}

export type MeasurementUnit = {
  __typename?: 'MeasurementUnit';
  abbreviations: Array<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  symbol?: Maybe<Scalars['String']['output']>;
  type?: Maybe<SpecialCondition>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addCategoryToRecipe: Recipe;
  addPriceHistory: IngredientPrice;
  addRecipeCourse: Recipe;
  addRecipePhotos: Recipe;
  changeRecipeCuisine: Recipe;
  changeRecordStatus: ImportRecord;
  connectExpirationRule: Ingredient;
  createCategory: Array<Category>;
  createCourse: Array<Course>;
  createCuisine: Array<Cuisine>;
  createExpirationRule: ExpirationRule;
  createIngredient: Ingredient;
  createNutritionLabels: NutritionLabel;
  createRecipe: Recipe;
  deleteCategory: Array<Category>;
  deleteCourse: Array<Course>;
  deleteCuisine: Array<Cuisine>;
  deleteExpirationRule: Array<ExpirationRule>;
  deleteIngredient: Array<Ingredient>;
  deleteNutritionLabel: Array<NutritionLabel>;
  deletePriceHistory: Array<IngredientPrice>;
  deleteRecipes: Array<Recipe>;
  editExpirationRule: ExpirationRule;
  editIngredient: Ingredient;
  editNutritionLabel: NutritionLabel;
  editPriceHistory: IngredientPrice;
  finalize: ImportRecord;
  mergeIngredients: Ingredient;
  removeCategoryFromRecipe: Recipe;
  removeCourseFromRecipe: Recipe;
  removeRecipeCuisine: Recipe;
  removeRecipePhotos: Recipe;
  updateMatches: ImportRecord;
  updateRecipe: Recipe;
  updateRecipeIngredients: Array<RecipeIngredients>;
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
  ingredientId?: InputMaybe<Scalars['String']['input']>;
  rule: CreateExpirationRule;
};


export type MutationCreateIngredientArgs = {
  ingredient: CreateIngredientInput;
};


export type MutationCreateNutritionLabelsArgs = {
  nutritionLabel: CreateNutritionLabelInput;
  recipeId: Scalars['String']['input'];
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


export type MutationDeleteNutritionLabelArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeletePriceHistoryArgs = {
  ingredientId: Scalars['String']['input'];
  ingredientPriceId: Array<Scalars['String']['input']>;
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


export type MutationEditNutritionLabelArgs = {
  label: EditNutritionLabelInput;
};


export type MutationEditPriceHistoryArgs = {
  price: EditPriceHistoryInput;
  priceId: Scalars['String']['input'];
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


export type MutationRemoveRecipeCuisineArgs = {
  cuisineId: Scalars['String']['input'];
  recipeId: Scalars['String']['input'];
};


export type MutationRemoveRecipePhotosArgs = {
  photoIds: Array<Scalars['String']['input']>;
  recipeId: Scalars['String']['input'];
};


export type MutationUpdateMatchesArgs = {
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
  importRecord?: Maybe<Array<ImportRecord>>;
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

export type Query = {
  __typename?: 'Query';
  categories: Array<Category>;
  courses: Array<Course>;
  cuisines: Array<Cuisine>;
  dailyReferenceIntake: Array<Nutrient>;
  expirationRule: ExpirationRule;
  import: Import;
  importRecord: ImportRecord;
  importRecords: ImportRecordsQuery;
  imports: ImportsQuery;
  ingredient: Ingredient;
  ingredientPrice: IngredientPrice;
  ingredients: Array<Ingredient>;
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
  limit?: InputMaybe<Scalars['Int']['input']>;
  searchString?: InputMaybe<Scalars['String']['input']>;
  start?: InputMaybe<Scalars['Int']['input']>;
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

export enum SpecialCondition {
  Count = 'COUNT',
  Energy = 'ENERGY',
  Volume = 'VOLUME',
  Weight = 'WEIGHT'
}



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

/** Mapping of union types */
export type ResolversUnionTypes<RefType extends Record<string, unknown>> = {
  Draft: ( NutritionLabel ) | ( Recipe );
};


/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AggregateLabel: ResolverTypeWrapper<AggregateLabel>;
  AggregateNutrient: ResolverTypeWrapper<AggregateNutrient>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Category: ResolverTypeWrapper<Category>;
  Course: ResolverTypeWrapper<Course>;
  CreateExpirationRule: CreateExpirationRule;
  CreateIngredientInput: CreateIngredientInput;
  CreateNutrientInput: CreateNutrientInput;
  CreateNutritionLabelInput: CreateNutritionLabelInput;
  CreatePriceHistoryInput: CreatePriceHistoryInput;
  Cuisine: ResolverTypeWrapper<Cuisine>;
  CursorPagination: CursorPagination;
  DailyReferenceIntake: ResolverTypeWrapper<DailyReferenceIntake>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  Draft: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['Draft']>;
  EditNutritionLabelInput: EditNutritionLabelInput;
  EditPriceHistoryInput: EditPriceHistoryInput;
  ExpirationRule: ResolverTypeWrapper<ExpirationRule>;
  File: ResolverTypeWrapper<Scalars['File']['output']>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  Gender: Gender;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Import: ResolverTypeWrapper<Import>;
  ImportRecord: ResolverTypeWrapper<Omit<ImportRecord, 'draft'> & { draft?: Maybe<ResolversTypes['Draft']> }>;
  ImportRecordsQuery: ResolverTypeWrapper<ImportRecordsQuery>;
  ImportStatus: ImportStatus;
  ImportType: ImportType;
  ImportsQuery: ResolverTypeWrapper<ImportsQuery>;
  Ingredient: ResolverTypeWrapper<Ingredient>;
  IngredientFilter: IngredientFilter;
  IngredientPrice: ResolverTypeWrapper<IngredientPrice>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Meal: Meal;
  MeasurementUnit: ResolverTypeWrapper<MeasurementUnit>;
  Mutation: ResolverTypeWrapper<{}>;
  NumericalComparison: NumericalComparison;
  Nutrient: ResolverTypeWrapper<Nutrient>;
  NutrientTarget: ResolverTypeWrapper<NutrientTarget>;
  NutrientType: NutrientType;
  NutritionFilter: NutritionFilter;
  NutritionLabel: ResolverTypeWrapper<NutritionLabel>;
  OffsetPagination: OffsetPagination;
  Photo: ResolverTypeWrapper<Photo>;
  PrismaImportType: PrismaImportType;
  Query: ResolverTypeWrapper<{}>;
  Recipe: ResolverTypeWrapper<Recipe>;
  RecipeFilter: RecipeFilter;
  RecipeIngredientGroup: ResolverTypeWrapper<RecipeIngredientGroup>;
  RecipeIngredientInput: RecipeIngredientInput;
  RecipeIngredientUpdateInput: RecipeIngredientUpdateInput;
  RecipeIngredients: ResolverTypeWrapper<RecipeIngredients>;
  RecipeInput: RecipeInput;
  RecipesQuery: ResolverTypeWrapper<RecipesQuery>;
  RecordStatus: RecordStatus;
  SpecialCondition: SpecialCondition;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AggregateLabel: AggregateLabel;
  AggregateNutrient: AggregateNutrient;
  Boolean: Scalars['Boolean']['output'];
  Category: Category;
  Course: Course;
  CreateExpirationRule: CreateExpirationRule;
  CreateIngredientInput: CreateIngredientInput;
  CreateNutrientInput: CreateNutrientInput;
  CreateNutritionLabelInput: CreateNutritionLabelInput;
  CreatePriceHistoryInput: CreatePriceHistoryInput;
  Cuisine: Cuisine;
  CursorPagination: CursorPagination;
  DailyReferenceIntake: DailyReferenceIntake;
  DateTime: Scalars['DateTime']['output'];
  Draft: ResolversUnionTypes<ResolversParentTypes>['Draft'];
  EditNutritionLabelInput: EditNutritionLabelInput;
  EditPriceHistoryInput: EditPriceHistoryInput;
  ExpirationRule: ExpirationRule;
  File: Scalars['File']['output'];
  Float: Scalars['Float']['output'];
  ID: Scalars['ID']['output'];
  Import: Import;
  ImportRecord: Omit<ImportRecord, 'draft'> & { draft?: Maybe<ResolversParentTypes['Draft']> };
  ImportRecordsQuery: ImportRecordsQuery;
  ImportsQuery: ImportsQuery;
  Ingredient: Ingredient;
  IngredientFilter: IngredientFilter;
  IngredientPrice: IngredientPrice;
  Int: Scalars['Int']['output'];
  MeasurementUnit: MeasurementUnit;
  Mutation: {};
  NumericalComparison: NumericalComparison;
  Nutrient: Nutrient;
  NutrientTarget: NutrientTarget;
  NutritionFilter: NutritionFilter;
  NutritionLabel: NutritionLabel;
  OffsetPagination: OffsetPagination;
  Photo: Photo;
  Query: {};
  Recipe: Recipe;
  RecipeFilter: RecipeFilter;
  RecipeIngredientGroup: RecipeIngredientGroup;
  RecipeIngredientInput: RecipeIngredientInput;
  RecipeIngredientUpdateInput: RecipeIngredientUpdateInput;
  RecipeIngredients: RecipeIngredients;
  RecipeInput: RecipeInput;
  RecipesQuery: RecipesQuery;
  String: Scalars['String']['output'];
};

export type AggregateLabelResolvers<ContextType = any, ParentType extends ResolversParentTypes['AggregateLabel'] = ResolversParentTypes['AggregateLabel']> = {
  calories?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  caloriesPerServing?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  carbPercentage?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  fatPercentage?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  nutrients?: Resolver<Array<ResolversTypes['AggregateNutrient']>, ParentType, ContextType>;
  proteinPercentage?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  servingSize?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  servingUnit?: Resolver<Maybe<ResolversTypes['MeasurementUnit']>, ParentType, ContextType>;
  servings?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  servingsUsed?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AggregateNutrientResolvers<ContextType = any, ParentType extends ResolversParentTypes['AggregateNutrient'] = ResolversParentTypes['AggregateNutrient']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  perServing?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  target?: Resolver<Maybe<ResolversTypes['NutrientTarget']>, ParentType, ContextType>;
  unit?: Resolver<ResolversTypes['MeasurementUnit'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
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
  nutrient?: Resolver<ResolversTypes['Nutrient'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type DraftResolvers<ContextType = any, ParentType extends ResolversParentTypes['Draft'] = ResolversParentTypes['Draft']> = {
  __resolveType: TypeResolveFn<'NutritionLabel' | 'Recipe', ParentType, ContextType>;
};

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

export interface FileScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['File'], any> {
  name: 'File';
}

export type ImportResolvers<ContextType = any, ParentType extends ResolversParentTypes['Import'] = ResolversParentTypes['Import']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  fileName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  records?: Resolver<Maybe<Array<ResolversTypes['ImportRecord']>>, ParentType, ContextType>;
  recordsCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['ImportStatus'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['PrismaImportType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ImportRecordResolvers<ContextType = any, ParentType extends ResolversParentTypes['ImportRecord'] = ResolversParentTypes['ImportRecord']> = {
  draft?: Resolver<Maybe<ResolversTypes['Draft']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  matchingLabel?: Resolver<Maybe<ResolversTypes['NutritionLabel']>, ParentType, ContextType>;
  matchingRecipe?: Resolver<Maybe<ResolversTypes['Recipe']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['RecordStatus'], ParentType, ContextType>;
  verifed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ImportRecordsQueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['ImportRecordsQuery'] = ResolversParentTypes['ImportRecordsQuery']> = {
  itemsRemaining?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  nextOffset?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  records?: Resolver<Array<ResolversTypes['ImportRecord']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ImportsQueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['ImportsQuery'] = ResolversParentTypes['ImportsQuery']> = {
  importJobs?: Resolver<Array<ResolversTypes['Import']>, ParentType, ContextType>;
  itemsRemaining?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  nextOffset?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IngredientResolvers<ContextType = any, ParentType extends ResolversParentTypes['Ingredient'] = ResolversParentTypes['Ingredient']> = {
  alternateNames?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  expiration?: Resolver<ResolversTypes['ExpirationRule'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  priceHistory?: Resolver<Array<ResolversTypes['IngredientPrice']>, ParentType, ContextType>;
  storageInstructions?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IngredientPriceResolvers<ContextType = any, ParentType extends ResolversParentTypes['IngredientPrice'] = ResolversParentTypes['IngredientPrice']> = {
  price?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  pricePerUnit?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  quantity?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  retailer?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  unit?: Resolver<ResolversTypes['MeasurementUnit'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MeasurementUnitResolvers<ContextType = any, ParentType extends ResolversParentTypes['MeasurementUnit'] = ResolversParentTypes['MeasurementUnit']> = {
  abbreviations?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  symbol?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes['SpecialCondition']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  addCategoryToRecipe?: Resolver<ResolversTypes['Recipe'], ParentType, ContextType, RequireFields<MutationAddCategoryToRecipeArgs, 'category' | 'recipeId'>>;
  addPriceHistory?: Resolver<ResolversTypes['IngredientPrice'], ParentType, ContextType, RequireFields<MutationAddPriceHistoryArgs, 'price'>>;
  addRecipeCourse?: Resolver<ResolversTypes['Recipe'], ParentType, ContextType, RequireFields<MutationAddRecipeCourseArgs, 'course' | 'recipeId'>>;
  addRecipePhotos?: Resolver<ResolversTypes['Recipe'], ParentType, ContextType, RequireFields<MutationAddRecipePhotosArgs, 'photoId' | 'recipeId'>>;
  changeRecipeCuisine?: Resolver<ResolversTypes['Recipe'], ParentType, ContextType, RequireFields<MutationChangeRecipeCuisineArgs, 'cuisineId' | 'recipeId'>>;
  changeRecordStatus?: Resolver<ResolversTypes['ImportRecord'], ParentType, ContextType, RequireFields<MutationChangeRecordStatusArgs, 'id' | 'status'>>;
  connectExpirationRule?: Resolver<ResolversTypes['Ingredient'], ParentType, ContextType, RequireFields<MutationConnectExpirationRuleArgs, 'expirationRuleId' | 'ingredientId'>>;
  createCategory?: Resolver<Array<ResolversTypes['Category']>, ParentType, ContextType, RequireFields<MutationCreateCategoryArgs, 'name'>>;
  createCourse?: Resolver<Array<ResolversTypes['Course']>, ParentType, ContextType, RequireFields<MutationCreateCourseArgs, 'name'>>;
  createCuisine?: Resolver<Array<ResolversTypes['Cuisine']>, ParentType, ContextType, RequireFields<MutationCreateCuisineArgs, 'name'>>;
  createExpirationRule?: Resolver<ResolversTypes['ExpirationRule'], ParentType, ContextType, RequireFields<MutationCreateExpirationRuleArgs, 'rule'>>;
  createIngredient?: Resolver<ResolversTypes['Ingredient'], ParentType, ContextType, RequireFields<MutationCreateIngredientArgs, 'ingredient'>>;
  createNutritionLabels?: Resolver<ResolversTypes['NutritionLabel'], ParentType, ContextType, RequireFields<MutationCreateNutritionLabelsArgs, 'nutritionLabel' | 'recipeId'>>;
  createRecipe?: Resolver<ResolversTypes['Recipe'], ParentType, ContextType, RequireFields<MutationCreateRecipeArgs, 'recipe'>>;
  deleteCategory?: Resolver<Array<ResolversTypes['Category']>, ParentType, ContextType, RequireFields<MutationDeleteCategoryArgs, 'categoryId'>>;
  deleteCourse?: Resolver<Array<ResolversTypes['Course']>, ParentType, ContextType, RequireFields<MutationDeleteCourseArgs, 'courseId'>>;
  deleteCuisine?: Resolver<Array<ResolversTypes['Cuisine']>, ParentType, ContextType, RequireFields<MutationDeleteCuisineArgs, 'cuisineId'>>;
  deleteExpirationRule?: Resolver<Array<ResolversTypes['ExpirationRule']>, ParentType, ContextType, RequireFields<MutationDeleteExpirationRuleArgs, 'expirationRuleId'>>;
  deleteIngredient?: Resolver<Array<ResolversTypes['Ingredient']>, ParentType, ContextType, RequireFields<MutationDeleteIngredientArgs, 'ingredientToDeleteId'>>;
  deleteNutritionLabel?: Resolver<Array<ResolversTypes['NutritionLabel']>, ParentType, ContextType, RequireFields<MutationDeleteNutritionLabelArgs, 'id'>>;
  deletePriceHistory?: Resolver<Array<ResolversTypes['IngredientPrice']>, ParentType, ContextType, RequireFields<MutationDeletePriceHistoryArgs, 'ingredientId' | 'ingredientPriceId'>>;
  deleteRecipes?: Resolver<Array<ResolversTypes['Recipe']>, ParentType, ContextType, RequireFields<MutationDeleteRecipesArgs, 'recipeIds'>>;
  editExpirationRule?: Resolver<ResolversTypes['ExpirationRule'], ParentType, ContextType, RequireFields<MutationEditExpirationRuleArgs, 'expirationRule' | 'expirationRuleId'>>;
  editIngredient?: Resolver<ResolversTypes['Ingredient'], ParentType, ContextType, RequireFields<MutationEditIngredientArgs, 'ingredient' | 'ingredientId'>>;
  editNutritionLabel?: Resolver<ResolversTypes['NutritionLabel'], ParentType, ContextType, RequireFields<MutationEditNutritionLabelArgs, 'label'>>;
  editPriceHistory?: Resolver<ResolversTypes['IngredientPrice'], ParentType, ContextType, RequireFields<MutationEditPriceHistoryArgs, 'price' | 'priceId'>>;
  finalize?: Resolver<ResolversTypes['ImportRecord'], ParentType, ContextType, RequireFields<MutationFinalizeArgs, 'recordId'>>;
  mergeIngredients?: Resolver<ResolversTypes['Ingredient'], ParentType, ContextType, RequireFields<MutationMergeIngredientsArgs, 'ingredientIdToDelete' | 'ingredientIdToKeep'>>;
  removeCategoryFromRecipe?: Resolver<ResolversTypes['Recipe'], ParentType, ContextType, RequireFields<MutationRemoveCategoryFromRecipeArgs, 'categoryId' | 'recipeId'>>;
  removeCourseFromRecipe?: Resolver<ResolversTypes['Recipe'], ParentType, ContextType, RequireFields<MutationRemoveCourseFromRecipeArgs, 'courseId' | 'recipeId'>>;
  removeRecipeCuisine?: Resolver<ResolversTypes['Recipe'], ParentType, ContextType, RequireFields<MutationRemoveRecipeCuisineArgs, 'cuisineId' | 'recipeId'>>;
  removeRecipePhotos?: Resolver<ResolversTypes['Recipe'], ParentType, ContextType, RequireFields<MutationRemoveRecipePhotosArgs, 'photoIds' | 'recipeId'>>;
  updateMatches?: Resolver<ResolversTypes['ImportRecord'], ParentType, ContextType, RequireFields<MutationUpdateMatchesArgs, 'recordId'>>;
  updateRecipe?: Resolver<ResolversTypes['Recipe'], ParentType, ContextType, RequireFields<MutationUpdateRecipeArgs, 'recipe' | 'recipeId'>>;
  updateRecipeIngredients?: Resolver<Array<ResolversTypes['RecipeIngredients']>, ParentType, ContextType, RequireFields<MutationUpdateRecipeIngredientsArgs, 'ingredient'>>;
  uploadImport?: Resolver<ResolversTypes['Import'], ParentType, ContextType, RequireFields<MutationUploadImportArgs, 'file' | 'type'>>;
  uploadPhoto?: Resolver<ResolversTypes['Photo'], ParentType, ContextType, RequireFields<MutationUploadPhotoArgs, 'photo'>>;
};

export type NutrientResolvers<ContextType = any, ParentType extends ResolversParentTypes['Nutrient'] = ResolversParentTypes['Nutrient']> = {
  advancedView?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  alternateNames?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  customTarget?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  dri?: Resolver<Array<ResolversTypes['DailyReferenceIntake']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  subNutrients?: Resolver<Array<ResolversTypes['Nutrient']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  unit?: Resolver<ResolversTypes['MeasurementUnit'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NutrientTargetResolvers<ContextType = any, ParentType extends ResolversParentTypes['NutrientTarget'] = ResolversParentTypes['NutrientTarget']> = {
  customTarget?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  dri?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NutritionLabelResolvers<ContextType = any, ParentType extends ResolversParentTypes['NutritionLabel'] = ResolversParentTypes['NutritionLabel']> = {
  aggregateLabel?: Resolver<Maybe<ResolversTypes['AggregateLabel']>, ParentType, ContextType, Partial<NutritionLabelAggregateLabelArgs>>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  importRecord?: Resolver<Maybe<Array<ResolversTypes['ImportRecord']>>, ParentType, ContextType>;
  ingredientGroup?: Resolver<ResolversTypes['RecipeIngredientGroup'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  recipe?: Resolver<Maybe<ResolversTypes['Recipe']>, ParentType, ContextType>;
  servingSize?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  servings?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  servingsUsed?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
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
  dailyReferenceIntake?: Resolver<Array<ResolversTypes['Nutrient']>, ParentType, ContextType>;
  expirationRule?: Resolver<ResolversTypes['ExpirationRule'], ParentType, ContextType, RequireFields<QueryExpirationRuleArgs, 'expirationRuleId'>>;
  import?: Resolver<ResolversTypes['Import'], ParentType, ContextType, RequireFields<QueryImportArgs, 'importId'>>;
  importRecord?: Resolver<ResolversTypes['ImportRecord'], ParentType, ContextType, RequireFields<QueryImportRecordArgs, 'id'>>;
  importRecords?: Resolver<ResolversTypes['ImportRecordsQuery'], ParentType, ContextType, RequireFields<QueryImportRecordsArgs, 'importId' | 'pagination'>>;
  imports?: Resolver<ResolversTypes['ImportsQuery'], ParentType, ContextType, RequireFields<QueryImportsArgs, 'pagination'>>;
  ingredient?: Resolver<ResolversTypes['Ingredient'], ParentType, ContextType, RequireFields<QueryIngredientArgs, 'ingredientId'>>;
  ingredientPrice?: Resolver<ResolversTypes['IngredientPrice'], ParentType, ContextType, RequireFields<QueryIngredientPriceArgs, 'ingredientPriceId'>>;
  ingredients?: Resolver<Array<ResolversTypes['Ingredient']>, ParentType, ContextType, Partial<QueryIngredientsArgs>>;
  nutritionLabel?: Resolver<ResolversTypes['NutritionLabel'], ParentType, ContextType, RequireFields<QueryNutritionLabelArgs, 'labelId'>>;
  priceHistory?: Resolver<Array<ResolversTypes['IngredientPrice']>, ParentType, ContextType, RequireFields<QueryPriceHistoryArgs, 'ingredientId'>>;
  recipe?: Resolver<ResolversTypes['Recipe'], ParentType, ContextType, RequireFields<QueryRecipeArgs, 'recipeId'>>;
  recipes?: Resolver<ResolversTypes['RecipesQuery'], ParentType, ContextType, RequireFields<QueryRecipesArgs, 'pagination'>>;
};

export type RecipeResolvers<ContextType = any, ParentType extends ResolversParentTypes['Recipe'] = ResolversParentTypes['Recipe']> = {
  aggregateLabel?: Resolver<Maybe<ResolversTypes['AggregateLabel']>, ParentType, ContextType, Partial<RecipeAggregateLabelArgs>>;
  category?: Resolver<Array<ResolversTypes['Category']>, ParentType, ContextType>;
  cookTime?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  course?: Resolver<Array<ResolversTypes['Course']>, ParentType, ContextType>;
  cuisine?: Resolver<Array<ResolversTypes['Cuisine']>, ParentType, ContextType>;
  directions?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  ingredientFreshness?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  ingredients?: Resolver<Array<ResolversTypes['RecipeIngredients']>, ParentType, ContextType>;
  isFavorite?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  leftoverFridgeLife?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  marinadeTime?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  notes?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  photos?: Resolver<Array<ResolversTypes['Photo']>, ParentType, ContextType>;
  prepTime?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
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
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  order?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  quantity?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  recipe?: Resolver<ResolversTypes['Recipe'], ParentType, ContextType>;
  sentence?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  unit?: Resolver<ResolversTypes['MeasurementUnit'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RecipesQueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['RecipesQuery'] = ResolversParentTypes['RecipesQuery']> = {
  itemsRemaining?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  nextOffset?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  recipes?: Resolver<Array<ResolversTypes['Recipe']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  AggregateLabel?: AggregateLabelResolvers<ContextType>;
  AggregateNutrient?: AggregateNutrientResolvers<ContextType>;
  Category?: CategoryResolvers<ContextType>;
  Course?: CourseResolvers<ContextType>;
  Cuisine?: CuisineResolvers<ContextType>;
  DailyReferenceIntake?: DailyReferenceIntakeResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  Draft?: DraftResolvers<ContextType>;
  ExpirationRule?: ExpirationRuleResolvers<ContextType>;
  File?: GraphQLScalarType;
  Import?: ImportResolvers<ContextType>;
  ImportRecord?: ImportRecordResolvers<ContextType>;
  ImportRecordsQuery?: ImportRecordsQueryResolvers<ContextType>;
  ImportsQuery?: ImportsQueryResolvers<ContextType>;
  Ingredient?: IngredientResolvers<ContextType>;
  IngredientPrice?: IngredientPriceResolvers<ContextType>;
  MeasurementUnit?: MeasurementUnitResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Nutrient?: NutrientResolvers<ContextType>;
  NutrientTarget?: NutrientTargetResolvers<ContextType>;
  NutritionLabel?: NutritionLabelResolvers<ContextType>;
  Photo?: PhotoResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Recipe?: RecipeResolvers<ContextType>;
  RecipeIngredientGroup?: RecipeIngredientGroupResolvers<ContextType>;
  RecipeIngredients?: RecipeIngredientsResolvers<ContextType>;
  RecipesQuery?: RecipesQueryResolvers<ContextType>;
};

