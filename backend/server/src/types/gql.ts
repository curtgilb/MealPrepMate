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
  connectingId?: InputMaybe<Scalars['String']['input']>;
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

export type DailyReferenceIntake = {
  __typename?: 'DailyReferenceIntake';
  ageMax: Scalars['Int']['output'];
  ageMin: Scalars['Int']['output'];
  gender: Gender;
  id: Scalars['String']['output'];
  nutrient: Nutrient;
  specialCondition: SpecialCondition;
  value: Scalars['Float']['output'];
};

export enum DayOfWeek {
  Friday = 'FRIDAY',
  Monday = 'MONDAY',
  Saturday = 'SATURDAY',
  Sunday = 'SUNDAY',
  Thursday = 'THURSDAY',
  Tuesday = 'TUESDAY',
  Wednesday = 'WEDNESDAY'
}

export type EditNutrientInput = {
  nutrientId: Scalars['String']['input'];
  nutritionLabelId: Scalars['String']['input'];
  value: Scalars['Float']['input'];
};

export type EditNutritionLabelInput = {
  id: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  nutrientsToAdd?: InputMaybe<Array<CreateNutrientInput>>;
  nutrientsToDeleteIds?: InputMaybe<Array<Scalars['String']['input']>>;
  nutrientsToEdit?: InputMaybe<Array<EditNutrientInput>>;
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

export type HealthProfile = {
  __typename?: 'HealthProfile';
  activityLevel: Scalars['Float']['output'];
  age: Scalars['Int']['output'];
  bodyFatPercentage: Scalars['Float']['output'];
  gender: Scalars['String']['output'];
  height: Scalars['Float']['output'];
  id: Scalars['String']['output'];
  targetCarbsGrams?: Maybe<Scalars['Float']['output']>;
  targetCarbsPercentage?: Maybe<Scalars['Float']['output']>;
  targetFatGrams?: Maybe<Scalars['Float']['output']>;
  targetFatPercentage?: Maybe<Scalars['Float']['output']>;
  targetProteinGrams?: Maybe<Scalars['Float']['output']>;
  targetProteinPecentage?: Maybe<Scalars['Float']['output']>;
  weight: Scalars['Float']['output'];
};

export type Import = {
  __typename?: 'Import';
  createdAt: Scalars['DateTime']['output'];
  fileName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  records: Array<ImportRecord>;
  recordsCount: Scalars['Int']['output'];
  status: Scalars['String']['output'];
  type: Scalars['String']['output'];
};

export type ImportRecord = {
  __typename?: 'ImportRecord';
  name: Scalars['String']['output'];
  nutritionLabel: NutritionLabel;
  recipe: Recipe;
  status: Scalars['String']['output'];
};

export enum ImportStatus {
  Completed = 'COMPLETED',
  Pending = 'PENDING'
}

export enum ImportType {
  Cronometer = 'CRONOMETER',
  MyFitnessPal = 'MY_FITNESS_PAL',
  RecipeKeeper = 'RECIPE_KEEPER'
}

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
  unit: Unit;
};

export type Mutation = {
  __typename?: 'Mutation';
  addCategoryToRecipe: Recipe;
  addPriceHistory: IngredientPrice;
  addRecipeCourse: Recipe;
  addRecipePhotos: Recipe;
  changeRecipeCuisine: Recipe;
  connectExpirationRule: Ingredient;
  connectNutritionLabelToIngredientGroup: RecipeIngredientGroup;
  connectNutritionLabeltoRecipe: Recipe;
  createCategory: Array<Category>;
  createCourse: Array<Course>;
  createCuisine: Array<Cuisine>;
  createExpirationRule: ExpirationRule;
  createIngredient: Ingredient;
  createProfile: HealthProfile;
  createRecipe: Recipe;
  deleteCategory: Array<Category>;
  deleteCourse: Array<Course>;
  deleteCuisine: Array<Cuisine>;
  deleteExpirationRule: Array<ExpirationRule>;
  deleteIngredient: Array<Ingredient>;
  deleteNutritionLabel: Array<NutritionLabel>;
  deletePriceHistory: Array<IngredientPrice>;
  disconnectNutritionLabelFromIngredientGroup: RecipeIngredientGroup;
  disconnectNutritionLabelFromRecipe: Recipe;
  editExpirationRule: ExpirationRule;
  editIngredient: Ingredient;
  editPriceHistory: IngredientPrice;
  editProfile: HealthProfile;
  importRecipeKeeper: Import;
  markImportAsComplete: Import;
  mergeIngredients: Ingredient;
  removeCategoryFromRecipe: Recipe;
  removeCourseFromRecipe: Recipe;
  removeRecipeCuisine: Recipe;
  removeRecipePhotos: Recipe;
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
  cuisineId: Scalars['String']['input'];
  recipeId: Scalars['String']['input'];
};


export type MutationConnectExpirationRuleArgs = {
  expirationRuleId: Scalars['String']['input'];
  ingredientId: Scalars['String']['input'];
};


export type MutationConnectNutritionLabelToIngredientGroupArgs = {
  groupId: Scalars['String']['input'];
  labelId: Scalars['String']['input'];
  recipeId: Scalars['String']['input'];
};


export type MutationConnectNutritionLabeltoRecipeArgs = {
  labelId: Scalars['String']['input'];
  recipeId: Scalars['String']['input'];
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


export type MutationDeleteNutritionLabelArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeletePriceHistoryArgs = {
  ingredientId: Scalars['String']['input'];
  ingredientPriceId: Array<Scalars['String']['input']>;
};


export type MutationDisconnectNutritionLabelFromIngredientGroupArgs = {
  deleteLabel: Scalars['Boolean']['input'];
  groupId: Scalars['String']['input'];
  labelId: Scalars['String']['input'];
  recipeId: Scalars['String']['input'];
};


export type MutationDisconnectNutritionLabelFromRecipeArgs = {
  labelId: Scalars['String']['input'];
  recipeId: Scalars['String']['input'];
};


export type MutationEditExpirationRuleArgs = {
  expirationRule: CreateExpirationRule;
  expirationRuleId: Scalars['String']['input'];
};


export type MutationEditIngredientArgs = {
  ingredient: CreateIngredientInput;
  ingredientId: Scalars['String']['input'];
};


export type MutationEditPriceHistoryArgs = {
  price: EditPriceHistoryInput;
  priceId: Scalars['String']['input'];
};


export type MutationEditProfileArgs = {
  id: Scalars['String']['input'];
  profile: ProfileInput;
};


export type MutationImportRecipeKeeperArgs = {
  file: Scalars['File']['input'];
  type: ImportType;
};


export type MutationMarkImportAsCompleteArgs = {
  id: Scalars['String']['input'];
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

export type NumericalComparison = {
  eq?: InputMaybe<Scalars['Int']['input']>;
  gte?: InputMaybe<Scalars['Int']['input']>;
  lte?: InputMaybe<Scalars['Int']['input']>;
};

export type Nutrient = {
  __typename?: 'Nutrient';
  childNutrients: Array<Nutrient>;
  customTarget?: Maybe<Scalars['Float']['output']>;
  dailyReferenceIntakeValue: Scalars['Float']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  otherNames: Array<Scalars['String']['output']>;
  type: Scalars['String']['output'];
  unit: Unit;
};


export type NutrientDailyReferenceIntakeValueArgs = {
  age: Scalars['Int']['input'];
  gender: Gender;
  specialCondition: SpecialCondition;
};

export enum NutrientType {
  Alcohol = 'ALCOHOL',
  Carbohydrate = 'CARBOHYDRATE',
  Fat = 'FAT',
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
  id: Scalars['ID']['output'];
  importRecord?: Maybe<ImportRecord>;
  ingredientGroup: RecipeIngredientGroup;
  name?: Maybe<Scalars['String']['output']>;
  nutrients: Array<NutritionLabelNutrient>;
  recipe?: Maybe<Recipe>;
  servingSize?: Maybe<Scalars['Float']['output']>;
  servings?: Maybe<Scalars['Float']['output']>;
  servingsUsed?: Maybe<Scalars['Float']['output']>;
};

export type NutritionLabelNutrient = {
  __typename?: 'NutritionLabelNutrient';
  nutrient: Nutrient;
  value: Scalars['Float']['output'];
  valuePerServing?: Maybe<Scalars['Float']['output']>;
};

export type NutritionLabelsInput = {
  baseLabel: CreateNutritionLabelInput;
  ingredientGroupLabels?: InputMaybe<Array<CreateNutritionLabelInput>>;
};

export type Photo = {
  __typename?: 'Photo';
  id: Scalars['ID']['output'];
  isPrimary: Scalars['Boolean']['output'];
  url: Scalars['String']['output'];
};

export type ProfileInput = {
  activityLevel: Scalars['Float']['input'];
  birthYear: Scalars['Int']['input'];
  bodyFatPercentage: Scalars['Float']['input'];
  gender: Gender;
  height: Scalars['Float']['input'];
  targetCarbsGrams?: InputMaybe<Scalars['Float']['input']>;
  targetCarbsPercentage?: InputMaybe<Scalars['Float']['input']>;
  targetFatGrams?: InputMaybe<Scalars['Float']['input']>;
  targetFatPercentage?: InputMaybe<Scalars['Float']['input']>;
  targetProteinGrams?: InputMaybe<Scalars['Float']['input']>;
  targetProteinPecentage?: InputMaybe<Scalars['Float']['input']>;
  weight: Scalars['Float']['input'];
};

export type Query = {
  __typename?: 'Query';
  categories: Array<Category>;
  courses: Array<Course>;
  cuisines: Array<Cuisine>;
  expirationRule: ExpirationRule;
  importRecords: Array<ImportRecord>;
  imports: Array<Import>;
  ingredient: Ingredient;
  ingredientPrice: IngredientPrice;
  ingredients: Array<Ingredient>;
  priceHistory: Array<IngredientPrice>;
  profile: HealthProfile;
  recipe: Recipe;
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


export type QueryImportRecordsArgs = {
  importId: Scalars['String']['input'];
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


export type QueryPriceHistoryArgs = {
  ingredientId: Scalars['String']['input'];
  retailer?: InputMaybe<Scalars['String']['input']>;
};


export type QueryRecipeArgs = {
  recipeId: Scalars['String']['input'];
};

export type Recipe = {
  __typename?: 'Recipe';
  category: Array<Category>;
  cookTime?: Maybe<Scalars['Int']['output']>;
  course: Array<Course>;
  cuisine: Cuisine;
  directions?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  ingredients: Array<RecipeIngredients>;
  isFavorite: Scalars['Boolean']['output'];
  isVerified?: Maybe<Scalars['Boolean']['output']>;
  leftoverFridgeLife?: Maybe<Scalars['Int']['output']>;
  marinadeTime?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  photos: Array<Photo>;
  prepTime?: Maybe<Scalars['Int']['output']>;
  stars?: Maybe<Scalars['Int']['output']>;
};

export type RecipeFilter = {
  categoryIds?: InputMaybe<Array<Scalars['String']['input']>>;
  cookTime?: InputMaybe<NumericalComparison>;
  courseIds?: InputMaybe<Array<Scalars['String']['input']>>;
  cuisineIds?: InputMaybe<Array<Scalars['String']['input']>>;
  ingredientFilter?: InputMaybe<Array<IngredientFilter>>;
  isFavorite?: InputMaybe<Scalars['Boolean']['input']>;
  marinadeTime?: InputMaybe<NumericalComparison>;
  numOfServings?: InputMaybe<NumericalComparison>;
  nutrientFilters?: InputMaybe<Array<NutritionFilter>>;
  prepTime?: InputMaybe<NumericalComparison>;
  searchString?: InputMaybe<Scalars['String']['input']>;
  totalPrepTime?: InputMaybe<NumericalComparison>;
};

export type RecipeIngredientGroup = {
  __typename?: 'RecipeIngredientGroup';
  name: Scalars['String']['output'];
  nutritionLabel?: Maybe<NutritionLabel>;
  servings?: Maybe<Scalars['Int']['output']>;
  servingsInRecipe?: Maybe<Scalars['Int']['output']>;
};

export type RecipeIngredients = {
  __typename?: 'RecipeIngredients';
  baseIngredient?: Maybe<Ingredient>;
  comment?: Maybe<Scalars['String']['output']>;
  maxQuantity?: Maybe<Scalars['Float']['output']>;
  minQuantity?: Maybe<Scalars['Float']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  order: Scalars['Int']['output'];
  other?: Maybe<Scalars['String']['output']>;
  quantity?: Maybe<Scalars['Float']['output']>;
  recipes: Recipe;
  sentence: Scalars['String']['output'];
  unit: Unit;
};

export type RecipeInput = {
  categoryIds?: InputMaybe<Array<Scalars['String']['input']>>;
  cookTime?: InputMaybe<Scalars['Int']['input']>;
  courseIds?: InputMaybe<Array<Scalars['String']['input']>>;
  cuisineId?: InputMaybe<Scalars['String']['input']>;
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

export enum RecordStatus {
  Duplicate = 'DUPLICATE',
  Ignored = 'IGNORED',
  Imported = 'IMPORTED',
  Pending = 'PENDING',
  Updated = 'UPDATED',
  Verified = 'VERIFIED'
}

export enum SpecialCondition {
  Lactating = 'LACTATING',
  None = 'NONE',
  Pregnant = 'PREGNANT'
}

export type Unit = {
  __typename?: 'Unit';
  abbreviations: Array<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  symbol?: Maybe<Scalars['String']['output']>;
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
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Category: ResolverTypeWrapper<Category>;
  Course: ResolverTypeWrapper<Course>;
  CreateExpirationRule: CreateExpirationRule;
  CreateIngredientInput: CreateIngredientInput;
  CreateNutrientInput: CreateNutrientInput;
  CreateNutritionLabelInput: CreateNutritionLabelInput;
  CreatePriceHistoryInput: CreatePriceHistoryInput;
  Cuisine: ResolverTypeWrapper<Cuisine>;
  DailyReferenceIntake: ResolverTypeWrapper<DailyReferenceIntake>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  DayOfWeek: DayOfWeek;
  EditNutrientInput: EditNutrientInput;
  EditNutritionLabelInput: EditNutritionLabelInput;
  EditPriceHistoryInput: EditPriceHistoryInput;
  ExpirationRule: ResolverTypeWrapper<ExpirationRule>;
  File: ResolverTypeWrapper<Scalars['File']['output']>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  Gender: Gender;
  HealthProfile: ResolverTypeWrapper<HealthProfile>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Import: ResolverTypeWrapper<Import>;
  ImportRecord: ResolverTypeWrapper<ImportRecord>;
  ImportStatus: ImportStatus;
  ImportType: ImportType;
  Ingredient: ResolverTypeWrapper<Ingredient>;
  IngredientFilter: IngredientFilter;
  IngredientPrice: ResolverTypeWrapper<IngredientPrice>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  NumericalComparison: NumericalComparison;
  Nutrient: ResolverTypeWrapper<Nutrient>;
  NutrientType: NutrientType;
  NutritionFilter: NutritionFilter;
  NutritionLabel: ResolverTypeWrapper<NutritionLabel>;
  NutritionLabelNutrient: ResolverTypeWrapper<NutritionLabelNutrient>;
  NutritionLabelsInput: NutritionLabelsInput;
  Photo: ResolverTypeWrapper<Photo>;
  ProfileInput: ProfileInput;
  Query: ResolverTypeWrapper<{}>;
  Recipe: ResolverTypeWrapper<Recipe>;
  RecipeFilter: RecipeFilter;
  RecipeIngredientGroup: ResolverTypeWrapper<RecipeIngredientGroup>;
  RecipeIngredients: ResolverTypeWrapper<RecipeIngredients>;
  RecipeInput: RecipeInput;
  RecordStatus: RecordStatus;
  SpecialCondition: SpecialCondition;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Unit: ResolverTypeWrapper<Unit>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean']['output'];
  Category: Category;
  Course: Course;
  CreateExpirationRule: CreateExpirationRule;
  CreateIngredientInput: CreateIngredientInput;
  CreateNutrientInput: CreateNutrientInput;
  CreateNutritionLabelInput: CreateNutritionLabelInput;
  CreatePriceHistoryInput: CreatePriceHistoryInput;
  Cuisine: Cuisine;
  DailyReferenceIntake: DailyReferenceIntake;
  DateTime: Scalars['DateTime']['output'];
  EditNutrientInput: EditNutrientInput;
  EditNutritionLabelInput: EditNutritionLabelInput;
  EditPriceHistoryInput: EditPriceHistoryInput;
  ExpirationRule: ExpirationRule;
  File: Scalars['File']['output'];
  Float: Scalars['Float']['output'];
  HealthProfile: HealthProfile;
  ID: Scalars['ID']['output'];
  Import: Import;
  ImportRecord: ImportRecord;
  Ingredient: Ingredient;
  IngredientFilter: IngredientFilter;
  IngredientPrice: IngredientPrice;
  Int: Scalars['Int']['output'];
  Mutation: {};
  NumericalComparison: NumericalComparison;
  Nutrient: Nutrient;
  NutritionFilter: NutritionFilter;
  NutritionLabel: NutritionLabel;
  NutritionLabelNutrient: NutritionLabelNutrient;
  NutritionLabelsInput: NutritionLabelsInput;
  Photo: Photo;
  ProfileInput: ProfileInput;
  Query: {};
  Recipe: Recipe;
  RecipeFilter: RecipeFilter;
  RecipeIngredientGroup: RecipeIngredientGroup;
  RecipeIngredients: RecipeIngredients;
  RecipeInput: RecipeInput;
  String: Scalars['String']['output'];
  Unit: Unit;
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
  ageMax?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  ageMin?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  gender?: Resolver<ResolversTypes['Gender'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nutrient?: Resolver<ResolversTypes['Nutrient'], ParentType, ContextType>;
  specialCondition?: Resolver<ResolversTypes['SpecialCondition'], ParentType, ContextType>;
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

export interface FileScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['File'], any> {
  name: 'File';
}

export type HealthProfileResolvers<ContextType = any, ParentType extends ResolversParentTypes['HealthProfile'] = ResolversParentTypes['HealthProfile']> = {
  activityLevel?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  age?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  bodyFatPercentage?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  gender?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  height?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  targetCarbsGrams?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  targetCarbsPercentage?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  targetFatGrams?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  targetFatPercentage?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  targetProteinGrams?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  targetProteinPecentage?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  weight?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ImportResolvers<ContextType = any, ParentType extends ResolversParentTypes['Import'] = ResolversParentTypes['Import']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  fileName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  records?: Resolver<Array<ResolversTypes['ImportRecord']>, ParentType, ContextType>;
  recordsCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ImportRecordResolvers<ContextType = any, ParentType extends ResolversParentTypes['ImportRecord'] = ResolversParentTypes['ImportRecord']> = {
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nutritionLabel?: Resolver<ResolversTypes['NutritionLabel'], ParentType, ContextType>;
  recipe?: Resolver<ResolversTypes['Recipe'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
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
  unit?: Resolver<ResolversTypes['Unit'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  addCategoryToRecipe?: Resolver<ResolversTypes['Recipe'], ParentType, ContextType, RequireFields<MutationAddCategoryToRecipeArgs, 'category' | 'recipeId'>>;
  addPriceHistory?: Resolver<ResolversTypes['IngredientPrice'], ParentType, ContextType, RequireFields<MutationAddPriceHistoryArgs, 'price'>>;
  addRecipeCourse?: Resolver<ResolversTypes['Recipe'], ParentType, ContextType, RequireFields<MutationAddRecipeCourseArgs, 'course' | 'recipeId'>>;
  addRecipePhotos?: Resolver<ResolversTypes['Recipe'], ParentType, ContextType, RequireFields<MutationAddRecipePhotosArgs, 'photoId' | 'recipeId'>>;
  changeRecipeCuisine?: Resolver<ResolversTypes['Recipe'], ParentType, ContextType, RequireFields<MutationChangeRecipeCuisineArgs, 'cuisineId' | 'recipeId'>>;
  connectExpirationRule?: Resolver<ResolversTypes['Ingredient'], ParentType, ContextType, RequireFields<MutationConnectExpirationRuleArgs, 'expirationRuleId' | 'ingredientId'>>;
  connectNutritionLabelToIngredientGroup?: Resolver<ResolversTypes['RecipeIngredientGroup'], ParentType, ContextType, RequireFields<MutationConnectNutritionLabelToIngredientGroupArgs, 'groupId' | 'labelId' | 'recipeId'>>;
  connectNutritionLabeltoRecipe?: Resolver<ResolversTypes['Recipe'], ParentType, ContextType, RequireFields<MutationConnectNutritionLabeltoRecipeArgs, 'labelId' | 'recipeId'>>;
  createCategory?: Resolver<Array<ResolversTypes['Category']>, ParentType, ContextType, RequireFields<MutationCreateCategoryArgs, 'name'>>;
  createCourse?: Resolver<Array<ResolversTypes['Course']>, ParentType, ContextType, RequireFields<MutationCreateCourseArgs, 'name'>>;
  createCuisine?: Resolver<Array<ResolversTypes['Cuisine']>, ParentType, ContextType, RequireFields<MutationCreateCuisineArgs, 'name'>>;
  createExpirationRule?: Resolver<ResolversTypes['ExpirationRule'], ParentType, ContextType, RequireFields<MutationCreateExpirationRuleArgs, 'rule'>>;
  createIngredient?: Resolver<ResolversTypes['Ingredient'], ParentType, ContextType, RequireFields<MutationCreateIngredientArgs, 'ingredient'>>;
  createProfile?: Resolver<ResolversTypes['HealthProfile'], ParentType, ContextType, RequireFields<MutationCreateProfileArgs, 'profile'>>;
  createRecipe?: Resolver<ResolversTypes['Recipe'], ParentType, ContextType, RequireFields<MutationCreateRecipeArgs, 'recipe'>>;
  deleteCategory?: Resolver<Array<ResolversTypes['Category']>, ParentType, ContextType, RequireFields<MutationDeleteCategoryArgs, 'categoryId'>>;
  deleteCourse?: Resolver<Array<ResolversTypes['Course']>, ParentType, ContextType, RequireFields<MutationDeleteCourseArgs, 'courseId'>>;
  deleteCuisine?: Resolver<Array<ResolversTypes['Cuisine']>, ParentType, ContextType, RequireFields<MutationDeleteCuisineArgs, 'cuisineId'>>;
  deleteExpirationRule?: Resolver<Array<ResolversTypes['ExpirationRule']>, ParentType, ContextType, RequireFields<MutationDeleteExpirationRuleArgs, 'expirationRuleId'>>;
  deleteIngredient?: Resolver<Array<ResolversTypes['Ingredient']>, ParentType, ContextType, RequireFields<MutationDeleteIngredientArgs, 'ingredientToDeleteId'>>;
  deleteNutritionLabel?: Resolver<Array<ResolversTypes['NutritionLabel']>, ParentType, ContextType, RequireFields<MutationDeleteNutritionLabelArgs, 'id'>>;
  deletePriceHistory?: Resolver<Array<ResolversTypes['IngredientPrice']>, ParentType, ContextType, RequireFields<MutationDeletePriceHistoryArgs, 'ingredientId' | 'ingredientPriceId'>>;
  disconnectNutritionLabelFromIngredientGroup?: Resolver<ResolversTypes['RecipeIngredientGroup'], ParentType, ContextType, RequireFields<MutationDisconnectNutritionLabelFromIngredientGroupArgs, 'deleteLabel' | 'groupId' | 'labelId' | 'recipeId'>>;
  disconnectNutritionLabelFromRecipe?: Resolver<ResolversTypes['Recipe'], ParentType, ContextType, RequireFields<MutationDisconnectNutritionLabelFromRecipeArgs, 'labelId' | 'recipeId'>>;
  editExpirationRule?: Resolver<ResolversTypes['ExpirationRule'], ParentType, ContextType, RequireFields<MutationEditExpirationRuleArgs, 'expirationRule' | 'expirationRuleId'>>;
  editIngredient?: Resolver<ResolversTypes['Ingredient'], ParentType, ContextType, RequireFields<MutationEditIngredientArgs, 'ingredient' | 'ingredientId'>>;
  editPriceHistory?: Resolver<ResolversTypes['IngredientPrice'], ParentType, ContextType, RequireFields<MutationEditPriceHistoryArgs, 'price' | 'priceId'>>;
  editProfile?: Resolver<ResolversTypes['HealthProfile'], ParentType, ContextType, RequireFields<MutationEditProfileArgs, 'id' | 'profile'>>;
  importRecipeKeeper?: Resolver<ResolversTypes['Import'], ParentType, ContextType, RequireFields<MutationImportRecipeKeeperArgs, 'file' | 'type'>>;
  markImportAsComplete?: Resolver<ResolversTypes['Import'], ParentType, ContextType, RequireFields<MutationMarkImportAsCompleteArgs, 'id'>>;
  mergeIngredients?: Resolver<ResolversTypes['Ingredient'], ParentType, ContextType, RequireFields<MutationMergeIngredientsArgs, 'ingredientIdToDelete' | 'ingredientIdToKeep'>>;
  removeCategoryFromRecipe?: Resolver<ResolversTypes['Recipe'], ParentType, ContextType, RequireFields<MutationRemoveCategoryFromRecipeArgs, 'categoryId' | 'recipeId'>>;
  removeCourseFromRecipe?: Resolver<ResolversTypes['Recipe'], ParentType, ContextType, RequireFields<MutationRemoveCourseFromRecipeArgs, 'courseId' | 'recipeId'>>;
  removeRecipeCuisine?: Resolver<ResolversTypes['Recipe'], ParentType, ContextType, RequireFields<MutationRemoveRecipeCuisineArgs, 'cuisineId' | 'recipeId'>>;
  removeRecipePhotos?: Resolver<ResolversTypes['Recipe'], ParentType, ContextType, RequireFields<MutationRemoveRecipePhotosArgs, 'photoIds' | 'recipeId'>>;
};

export type NutrientResolvers<ContextType = any, ParentType extends ResolversParentTypes['Nutrient'] = ResolversParentTypes['Nutrient']> = {
  childNutrients?: Resolver<Array<ResolversTypes['Nutrient']>, ParentType, ContextType>;
  customTarget?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  dailyReferenceIntakeValue?: Resolver<ResolversTypes['Float'], ParentType, ContextType, RequireFields<NutrientDailyReferenceIntakeValueArgs, 'age' | 'gender' | 'specialCondition'>>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  otherNames?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  unit?: Resolver<ResolversTypes['Unit'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NutritionLabelResolvers<ContextType = any, ParentType extends ResolversParentTypes['NutritionLabel'] = ResolversParentTypes['NutritionLabel']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  importRecord?: Resolver<Maybe<ResolversTypes['ImportRecord']>, ParentType, ContextType>;
  ingredientGroup?: Resolver<ResolversTypes['RecipeIngredientGroup'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  nutrients?: Resolver<Array<ResolversTypes['NutritionLabelNutrient']>, ParentType, ContextType>;
  recipe?: Resolver<Maybe<ResolversTypes['Recipe']>, ParentType, ContextType>;
  servingSize?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  servings?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  servingsUsed?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NutritionLabelNutrientResolvers<ContextType = any, ParentType extends ResolversParentTypes['NutritionLabelNutrient'] = ResolversParentTypes['NutritionLabelNutrient']> = {
  nutrient?: Resolver<ResolversTypes['Nutrient'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  valuePerServing?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
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
  importRecords?: Resolver<Array<ResolversTypes['ImportRecord']>, ParentType, ContextType, RequireFields<QueryImportRecordsArgs, 'importId'>>;
  imports?: Resolver<Array<ResolversTypes['Import']>, ParentType, ContextType>;
  ingredient?: Resolver<ResolversTypes['Ingredient'], ParentType, ContextType, RequireFields<QueryIngredientArgs, 'ingredientId'>>;
  ingredientPrice?: Resolver<ResolversTypes['IngredientPrice'], ParentType, ContextType, RequireFields<QueryIngredientPriceArgs, 'ingredientPriceId'>>;
  ingredients?: Resolver<Array<ResolversTypes['Ingredient']>, ParentType, ContextType, Partial<QueryIngredientsArgs>>;
  priceHistory?: Resolver<Array<ResolversTypes['IngredientPrice']>, ParentType, ContextType, RequireFields<QueryPriceHistoryArgs, 'ingredientId'>>;
  profile?: Resolver<ResolversTypes['HealthProfile'], ParentType, ContextType>;
  recipe?: Resolver<ResolversTypes['Recipe'], ParentType, ContextType, RequireFields<QueryRecipeArgs, 'recipeId'>>;
};

export type RecipeResolvers<ContextType = any, ParentType extends ResolversParentTypes['Recipe'] = ResolversParentTypes['Recipe']> = {
  category?: Resolver<Array<ResolversTypes['Category']>, ParentType, ContextType>;
  cookTime?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  course?: Resolver<Array<ResolversTypes['Course']>, ParentType, ContextType>;
  cuisine?: Resolver<ResolversTypes['Cuisine'], ParentType, ContextType>;
  directions?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  ingredients?: Resolver<Array<ResolversTypes['RecipeIngredients']>, ParentType, ContextType>;
  isFavorite?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  isVerified?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  leftoverFridgeLife?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  marinadeTime?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  notes?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  photos?: Resolver<Array<ResolversTypes['Photo']>, ParentType, ContextType>;
  prepTime?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  stars?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RecipeIngredientGroupResolvers<ContextType = any, ParentType extends ResolversParentTypes['RecipeIngredientGroup'] = ResolversParentTypes['RecipeIngredientGroup']> = {
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nutritionLabel?: Resolver<Maybe<ResolversTypes['NutritionLabel']>, ParentType, ContextType>;
  servings?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  servingsInRecipe?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RecipeIngredientsResolvers<ContextType = any, ParentType extends ResolversParentTypes['RecipeIngredients'] = ResolversParentTypes['RecipeIngredients']> = {
  baseIngredient?: Resolver<Maybe<ResolversTypes['Ingredient']>, ParentType, ContextType>;
  comment?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  maxQuantity?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  minQuantity?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  order?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  other?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  quantity?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  recipes?: Resolver<ResolversTypes['Recipe'], ParentType, ContextType>;
  sentence?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  unit?: Resolver<ResolversTypes['Unit'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UnitResolvers<ContextType = any, ParentType extends ResolversParentTypes['Unit'] = ResolversParentTypes['Unit']> = {
  abbreviations?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  symbol?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Category?: CategoryResolvers<ContextType>;
  Course?: CourseResolvers<ContextType>;
  Cuisine?: CuisineResolvers<ContextType>;
  DailyReferenceIntake?: DailyReferenceIntakeResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  ExpirationRule?: ExpirationRuleResolvers<ContextType>;
  File?: GraphQLScalarType;
  HealthProfile?: HealthProfileResolvers<ContextType>;
  Import?: ImportResolvers<ContextType>;
  ImportRecord?: ImportRecordResolvers<ContextType>;
  Ingredient?: IngredientResolvers<ContextType>;
  IngredientPrice?: IngredientPriceResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Nutrient?: NutrientResolvers<ContextType>;
  NutritionLabel?: NutritionLabelResolvers<ContextType>;
  NutritionLabelNutrient?: NutritionLabelNutrientResolvers<ContextType>;
  Photo?: PhotoResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Recipe?: RecipeResolvers<ContextType>;
  RecipeIngredientGroup?: RecipeIngredientGroupResolvers<ContextType>;
  RecipeIngredients?: RecipeIngredientsResolvers<ContextType>;
  Unit?: UnitResolvers<ContextType>;
};

