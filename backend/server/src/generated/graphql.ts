import { GraphQLResolveInfo } from 'graphql';
import { MyContext } from '../index';
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
};

export enum Course {
  Breakfast = 'BREAKFAST',
  Dessert = 'DESSERT',
  Dinner = 'DINNER',
  Drink = 'DRINK',
  Lunch = 'LUNCH',
  Other = 'OTHER',
  Snack = 'SNACK'
}

export type Import = {
  __typename?: 'Import';
  date: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  source: Scalars['String']['output'];
};

export type Ingredient = {
  __typename?: 'Ingredient';
  alternateNames?: Maybe<Array<Scalars['String']['output']>>;
  category?: Maybe<Scalars['String']['output']>;
  freezerLife?: Maybe<Scalars['Int']['output']>;
  frideLife?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  perishable?: Maybe<Scalars['Boolean']['output']>;
  priceHistory?: Maybe<Array<PriceHistory>>;
  primaryName: Scalars['String']['output'];
  storageInstructions?: Maybe<Scalars['String']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addNutritionFacts: NutritionFact;
  addRecipePhoto: Photo;
  createCategory: Scalars['String']['output'];
  createCollection: Scalars['String']['output'];
  createRecipe: Recipe;
  deleteRecipe: Scalars['Boolean']['output'];
  deleteRecipeIngredient: Array<RecipeIngredient>;
  importRecipes: Array<Recipe>;
  setNutrientTarget: Nutrient;
  updateNutrientFact: Nutrient;
  updateNutritionFact: Nutrient;
  updateRecipe: Recipe;
};


export type MutationAddNutritionFactsArgs = {
  nutrition: NutritionInput;
  recipeId?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationAddRecipePhotoArgs = {
  fileName: Scalars['String']['input'];
  isPrimary: Scalars['Boolean']['input'];
  recipeId?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationCreateCategoryArgs = {
  name: Scalars['String']['input'];
};


export type MutationCreateCollectionArgs = {
  name: Scalars['String']['input'];
};


export type MutationCreateRecipeArgs = {
  recipe: RecipeInput;
};


export type MutationDeleteRecipeArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteRecipeIngredientArgs = {
  ingredientId: Scalars['ID']['input'];
  recipeID: Scalars['ID']['input'];
};


export type MutationImportRecipesArgs = {
  recipes: Array<RecipeInput>;
};


export type MutationSetNutrientTargetArgs = {
  nutrientId: Scalars['ID']['input'];
  value: Scalars['Float']['input'];
};


export type MutationUpdateNutrientFactArgs = {
  nutrientId: Scalars['ID']['input'];
  recipeId: Scalars['ID']['input'];
  value: Scalars['Float']['input'];
};


export type MutationUpdateNutritionFactArgs = {
  nutrientId: Scalars['ID']['input'];
  recipeId: Scalars['ID']['input'];
  value: Scalars['Float']['input'];
};


export type MutationUpdateRecipeArgs = {
  id: Scalars['ID']['input'];
  recipe: RecipeInput;
};

export type Nutrient = {
  __typename?: 'Nutrient';
  alternateName?: Maybe<Scalars['String']['output']>;
  amount?: Maybe<Scalars['Float']['output']>;
  name: Scalars['String']['output'];
  target?: Maybe<Scalars['Float']['output']>;
  unit: Scalars['String']['output'];
  unitAbbreviation: Scalars['String']['output'];
};

export type NutrientGroup = {
  __typename?: 'NutrientGroup';
  name: Scalars['String']['output'];
  nutrients: Array<Nutrient>;
  total: Scalars['Float']['output'];
  unit: Scalars['String']['output'];
  unitAbbreviation: Scalars['String']['output'];
};

export type NutritionFact = {
  __typename?: 'NutritionFact';
  alchohol: Array<Nutrient>;
  calories?: Maybe<Scalars['Float']['output']>;
  carbohydrates?: Maybe<NutrientGroup>;
  fat?: Maybe<NutrientGroup>;
  minerals: Array<Nutrient>;
  other: Array<Nutrient>;
  protein?: Maybe<NutrientGroup>;
  vitmains: Array<Nutrient>;
};

export type NutritionInput = {
  alchohol?: InputMaybe<Scalars['Float']['input']>;
  amount?: InputMaybe<Scalars['Float']['input']>;
  caffiene?: InputMaybe<Scalars['Float']['input']>;
  calcium?: InputMaybe<Scalars['Float']['input']>;
  carbs?: InputMaybe<Scalars['Float']['input']>;
  category?: InputMaybe<Scalars['String']['input']>;
  cholesterol?: InputMaybe<Scalars['Float']['input']>;
  cobalamin?: InputMaybe<Scalars['Float']['input']>;
  copper?: InputMaybe<Scalars['Float']['input']>;
  cystine?: InputMaybe<Scalars['Float']['input']>;
  energy?: InputMaybe<Scalars['Float']['input']>;
  fat?: InputMaybe<Scalars['Float']['input']>;
  fiber?: InputMaybe<Scalars['Float']['input']>;
  folate?: InputMaybe<Scalars['Float']['input']>;
  foodName?: InputMaybe<Scalars['Float']['input']>;
  histidine?: InputMaybe<Scalars['Float']['input']>;
  iron?: InputMaybe<Scalars['Float']['input']>;
  isoleucine?: InputMaybe<Scalars['Float']['input']>;
  leucine?: InputMaybe<Scalars['Float']['input']>;
  lysine?: InputMaybe<Scalars['Float']['input']>;
  magnesium?: InputMaybe<Scalars['Float']['input']>;
  manganese?: InputMaybe<Scalars['Float']['input']>;
  methionine?: InputMaybe<Scalars['Float']['input']>;
  monounsaturated?: InputMaybe<Scalars['Float']['input']>;
  netCarbs?: InputMaybe<Scalars['Float']['input']>;
  niacin?: InputMaybe<Scalars['Float']['input']>;
  omega3?: InputMaybe<Scalars['Float']['input']>;
  omega6?: InputMaybe<Scalars['Float']['input']>;
  pantothenicAcid?: InputMaybe<Scalars['Float']['input']>;
  phenylalanine?: InputMaybe<Scalars['Float']['input']>;
  phosphorus?: InputMaybe<Scalars['Float']['input']>;
  polyunsaturated?: InputMaybe<Scalars['Float']['input']>;
  potassium?: InputMaybe<Scalars['Float']['input']>;
  protein?: InputMaybe<Scalars['Float']['input']>;
  pyridoxine?: InputMaybe<Scalars['Float']['input']>;
  riboflavin?: InputMaybe<Scalars['Float']['input']>;
  saturated?: InputMaybe<Scalars['Float']['input']>;
  selenium?: InputMaybe<Scalars['Float']['input']>;
  sodium?: InputMaybe<Scalars['Float']['input']>;
  starch?: InputMaybe<Scalars['Float']['input']>;
  sugars?: InputMaybe<Scalars['Float']['input']>;
  thiamine?: InputMaybe<Scalars['Float']['input']>;
  threonine?: InputMaybe<Scalars['Float']['input']>;
  transFat?: InputMaybe<Scalars['Float']['input']>;
  tryptophan?: InputMaybe<Scalars['Float']['input']>;
  tyrosine?: InputMaybe<Scalars['Float']['input']>;
  valine?: InputMaybe<Scalars['Float']['input']>;
  vitaminA?: InputMaybe<Scalars['Float']['input']>;
  vitaminD?: InputMaybe<Scalars['Float']['input']>;
  vitaminE?: InputMaybe<Scalars['Float']['input']>;
  vitaminK?: InputMaybe<Scalars['Float']['input']>;
  vitmainC?: InputMaybe<Scalars['Float']['input']>;
  water?: InputMaybe<Scalars['Float']['input']>;
  zinc?: InputMaybe<Scalars['Float']['input']>;
};

export type Photo = {
  __typename?: 'Photo';
  id: Scalars['ID']['output'];
  isPrimary: Scalars['Boolean']['output'];
  isUploaded: Scalars['Boolean']['output'];
  url: Scalars['String']['output'];
};

export type PriceHistory = {
  __typename?: 'PriceHistory';
  date: Scalars['String']['output'];
  price: Scalars['Float']['output'];
  pricePerUnit: Scalars['Float']['output'];
  quantity: Scalars['Float']['output'];
  quantityUnit: Scalars['String']['output'];
  retailer: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  categories: Array<Scalars['String']['output']>;
  collections: Array<Scalars['String']['output']>;
  ingredients: Array<Ingredient>;
  parseIngredient?: Maybe<Array<RecipeIngredient>>;
  recipe?: Maybe<Recipe>;
  recipeIngredients?: Maybe<Array<RecipeIngredient>>;
  recipes: Array<Recipe>;
};


export type QueryCategoriesArgs = {
  name?: InputMaybe<Scalars['String']['input']>;
};


export type QueryCollectionsArgs = {
  name?: InputMaybe<Scalars['String']['input']>;
};


export type QueryIngredientsArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};


export type QueryParseIngredientArgs = {
  sentance: Scalars['String']['input'];
};


export type QueryRecipeArgs = {
  id: Scalars['ID']['input'];
};


export type QueryRecipeIngredientsArgs = {
  recipeId: Scalars['ID']['input'];
  searchForMatch?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryRecipesArgs = {
  filters: RecipeFilterInput;
};

export type Recipe = {
  __typename?: 'Recipe';
  category?: Maybe<Array<Scalars['String']['output']>>;
  cookingTime?: Maybe<Scalars['Int']['output']>;
  course?: Maybe<Scalars['String']['output']>;
  cuisines?: Maybe<Array<Scalars['String']['output']>>;
  directions?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  ingredients?: Maybe<Array<Scalars['String']['output']>>;
  isFavorite?: Maybe<Scalars['Boolean']['output']>;
  notes?: Maybe<Scalars['String']['output']>;
  nutritionFacts?: Maybe<NutritionFact>;
  photo?: Maybe<Array<Photo>>;
  preparationTime?: Maybe<Scalars['Int']['output']>;
  servings: Scalars['Int']['output'];
  source?: Maybe<Scalars['String']['output']>;
  stars?: Maybe<Scalars['Int']['output']>;
  title: Scalars['String']['output'];
};

export type RecipeFilterInput = {
  category?: InputMaybe<Array<Scalars['String']['input']>>;
  collection?: InputMaybe<Array<Scalars['String']['input']>>;
  cookTime?: InputMaybe<Scalars['Int']['input']>;
  course?: InputMaybe<Scalars['String']['input']>;
  ingredients?: InputMaybe<Array<Scalars['String']['input']>>;
  isFavorite?: InputMaybe<Scalars['Boolean']['input']>;
  preparationTime?: InputMaybe<Scalars['Int']['input']>;
  servings?: InputMaybe<Scalars['Int']['input']>;
  source?: InputMaybe<Scalars['String']['input']>;
  stars?: InputMaybe<Scalars['Int']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type RecipeIngredient = {
  __typename?: 'RecipeIngredient';
  comment?: Maybe<Scalars['String']['output']>;
  maxQuantity?: Maybe<Scalars['Float']['output']>;
  minQty?: Maybe<Scalars['Float']['output']>;
  order?: Maybe<Scalars['Int']['output']>;
  quantity: Scalars['Float']['output'];
  sentence: Scalars['String']['output'];
  unit?: Maybe<Scalars['String']['output']>;
};

export type RecipeInput = {
  calories?: InputMaybe<Scalars['Float']['input']>;
  category?: InputMaybe<Array<Scalars['ID']['input']>>;
  categoryNames?: InputMaybe<Array<Scalars['String']['input']>>;
  collectionNames?: InputMaybe<Array<Scalars['String']['input']>>;
  cookingTime?: InputMaybe<Scalars['Int']['input']>;
  course: Course;
  cuisine?: InputMaybe<Scalars['ID']['input']>;
  dietaryFiber?: InputMaybe<Scalars['Float']['input']>;
  directions?: InputMaybe<Scalars['String']['input']>;
  ingredients?: InputMaybe<Scalars['String']['input']>;
  isFavorite: Scalars['Boolean']['input'];
  leftOverFreezerLife?: InputMaybe<Scalars['Int']['input']>;
  leftOverFridgeLife?: InputMaybe<Scalars['Int']['input']>;
  marinateTime?: InputMaybe<Scalars['Int']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  photos?: InputMaybe<Array<Scalars['String']['input']>>;
  preparationTime?: InputMaybe<Scalars['Int']['input']>;
  protein?: InputMaybe<Scalars['Float']['input']>;
  recipeKeeperId?: InputMaybe<Scalars['ID']['input']>;
  saturatedFat?: InputMaybe<Scalars['Float']['input']>;
  servings: Scalars['Int']['input'];
  servingsText?: InputMaybe<Scalars['String']['input']>;
  sodium?: InputMaybe<Scalars['Float']['input']>;
  source?: InputMaybe<Scalars['String']['input']>;
  stars?: InputMaybe<Scalars['Int']['input']>;
  sugars?: InputMaybe<Scalars['Float']['input']>;
  title: Scalars['String']['input'];
  totalCarbs?: InputMaybe<Scalars['Float']['input']>;
  totalFat?: InputMaybe<Scalars['Float']['input']>;
};

export type VerfiedIngredientInput = {
  comment?: InputMaybe<Scalars['String']['input']>;
  ingredientId: Scalars['ID']['input'];
  isIngredient: Scalars['Boolean']['input'];
  maxQty?: InputMaybe<Scalars['Float']['input']>;
  minQty?: InputMaybe<Scalars['Float']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  orderIndex: Scalars['Int']['input'];
  other?: InputMaybe<Scalars['String']['input']>;
  quantity?: InputMaybe<Scalars['Float']['input']>;
  recipeIngredient: Scalars['ID']['input'];
  sentence: Scalars['String']['input'];
  unit?: InputMaybe<Scalars['String']['input']>;
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

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
export type ResolversTypes = ResolversObject<{
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Course: Course;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Import: ResolverTypeWrapper<Import>;
  Ingredient: ResolverTypeWrapper<Ingredient>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  Nutrient: ResolverTypeWrapper<Nutrient>;
  NutrientGroup: ResolverTypeWrapper<NutrientGroup>;
  NutritionFact: ResolverTypeWrapper<NutritionFact>;
  NutritionInput: NutritionInput;
  Photo: ResolverTypeWrapper<Photo>;
  PriceHistory: ResolverTypeWrapper<PriceHistory>;
  Query: ResolverTypeWrapper<{}>;
  Recipe: ResolverTypeWrapper<Recipe>;
  RecipeFilterInput: RecipeFilterInput;
  RecipeIngredient: ResolverTypeWrapper<RecipeIngredient>;
  RecipeInput: RecipeInput;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  verfiedIngredientInput: VerfiedIngredientInput;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Boolean: Scalars['Boolean']['output'];
  Float: Scalars['Float']['output'];
  ID: Scalars['ID']['output'];
  Import: Import;
  Ingredient: Ingredient;
  Int: Scalars['Int']['output'];
  Mutation: {};
  Nutrient: Nutrient;
  NutrientGroup: NutrientGroup;
  NutritionFact: NutritionFact;
  NutritionInput: NutritionInput;
  Photo: Photo;
  PriceHistory: PriceHistory;
  Query: {};
  Recipe: Recipe;
  RecipeFilterInput: RecipeFilterInput;
  RecipeIngredient: RecipeIngredient;
  RecipeInput: RecipeInput;
  String: Scalars['String']['output'];
  verfiedIngredientInput: VerfiedIngredientInput;
}>;

export type ImportResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['Import'] = ResolversParentTypes['Import']> = ResolversObject<{
  date?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  source?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type IngredientResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['Ingredient'] = ResolversParentTypes['Ingredient']> = ResolversObject<{
  alternateNames?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  category?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  freezerLife?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  frideLife?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  perishable?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  priceHistory?: Resolver<Maybe<Array<ResolversTypes['PriceHistory']>>, ParentType, ContextType>;
  primaryName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  storageInstructions?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  addNutritionFacts?: Resolver<ResolversTypes['NutritionFact'], ParentType, ContextType, RequireFields<MutationAddNutritionFactsArgs, 'nutrition'>>;
  addRecipePhoto?: Resolver<ResolversTypes['Photo'], ParentType, ContextType, RequireFields<MutationAddRecipePhotoArgs, 'fileName' | 'isPrimary'>>;
  createCategory?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationCreateCategoryArgs, 'name'>>;
  createCollection?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationCreateCollectionArgs, 'name'>>;
  createRecipe?: Resolver<ResolversTypes['Recipe'], ParentType, ContextType, RequireFields<MutationCreateRecipeArgs, 'recipe'>>;
  deleteRecipe?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteRecipeArgs, 'id'>>;
  deleteRecipeIngredient?: Resolver<Array<ResolversTypes['RecipeIngredient']>, ParentType, ContextType, RequireFields<MutationDeleteRecipeIngredientArgs, 'ingredientId' | 'recipeID'>>;
  importRecipes?: Resolver<Array<ResolversTypes['Recipe']>, ParentType, ContextType, RequireFields<MutationImportRecipesArgs, 'recipes'>>;
  setNutrientTarget?: Resolver<ResolversTypes['Nutrient'], ParentType, ContextType, RequireFields<MutationSetNutrientTargetArgs, 'nutrientId' | 'value'>>;
  updateNutrientFact?: Resolver<ResolversTypes['Nutrient'], ParentType, ContextType, RequireFields<MutationUpdateNutrientFactArgs, 'nutrientId' | 'recipeId' | 'value'>>;
  updateNutritionFact?: Resolver<ResolversTypes['Nutrient'], ParentType, ContextType, RequireFields<MutationUpdateNutritionFactArgs, 'nutrientId' | 'recipeId' | 'value'>>;
  updateRecipe?: Resolver<ResolversTypes['Recipe'], ParentType, ContextType, RequireFields<MutationUpdateRecipeArgs, 'id' | 'recipe'>>;
}>;

export type NutrientResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['Nutrient'] = ResolversParentTypes['Nutrient']> = ResolversObject<{
  alternateName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  amount?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  target?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  unit?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  unitAbbreviation?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type NutrientGroupResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['NutrientGroup'] = ResolversParentTypes['NutrientGroup']> = ResolversObject<{
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nutrients?: Resolver<Array<ResolversTypes['Nutrient']>, ParentType, ContextType>;
  total?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  unit?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  unitAbbreviation?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type NutritionFactResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['NutritionFact'] = ResolversParentTypes['NutritionFact']> = ResolversObject<{
  alchohol?: Resolver<Array<ResolversTypes['Nutrient']>, ParentType, ContextType>;
  calories?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  carbohydrates?: Resolver<Maybe<ResolversTypes['NutrientGroup']>, ParentType, ContextType>;
  fat?: Resolver<Maybe<ResolversTypes['NutrientGroup']>, ParentType, ContextType>;
  minerals?: Resolver<Array<ResolversTypes['Nutrient']>, ParentType, ContextType>;
  other?: Resolver<Array<ResolversTypes['Nutrient']>, ParentType, ContextType>;
  protein?: Resolver<Maybe<ResolversTypes['NutrientGroup']>, ParentType, ContextType>;
  vitmains?: Resolver<Array<ResolversTypes['Nutrient']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PhotoResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['Photo'] = ResolversParentTypes['Photo']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isPrimary?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  isUploaded?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PriceHistoryResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['PriceHistory'] = ResolversParentTypes['PriceHistory']> = ResolversObject<{
  date?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  price?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  pricePerUnit?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  quantity?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  quantityUnit?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  retailer?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  categories?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType, Partial<QueryCategoriesArgs>>;
  collections?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType, Partial<QueryCollectionsArgs>>;
  ingredients?: Resolver<Array<ResolversTypes['Ingredient']>, ParentType, ContextType, Partial<QueryIngredientsArgs>>;
  parseIngredient?: Resolver<Maybe<Array<ResolversTypes['RecipeIngredient']>>, ParentType, ContextType, RequireFields<QueryParseIngredientArgs, 'sentance'>>;
  recipe?: Resolver<Maybe<ResolversTypes['Recipe']>, ParentType, ContextType, RequireFields<QueryRecipeArgs, 'id'>>;
  recipeIngredients?: Resolver<Maybe<Array<ResolversTypes['RecipeIngredient']>>, ParentType, ContextType, RequireFields<QueryRecipeIngredientsArgs, 'recipeId'>>;
  recipes?: Resolver<Array<ResolversTypes['Recipe']>, ParentType, ContextType, RequireFields<QueryRecipesArgs, 'filters'>>;
}>;

export type RecipeResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['Recipe'] = ResolversParentTypes['Recipe']> = ResolversObject<{
  category?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  cookingTime?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  course?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  cuisines?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  directions?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  ingredients?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  isFavorite?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  notes?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  nutritionFacts?: Resolver<Maybe<ResolversTypes['NutritionFact']>, ParentType, ContextType>;
  photo?: Resolver<Maybe<Array<ResolversTypes['Photo']>>, ParentType, ContextType>;
  preparationTime?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  servings?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  source?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  stars?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type RecipeIngredientResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['RecipeIngredient'] = ResolversParentTypes['RecipeIngredient']> = ResolversObject<{
  comment?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  maxQuantity?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  minQty?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  order?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  quantity?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  sentence?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  unit?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = MyContext> = ResolversObject<{
  Import?: ImportResolvers<ContextType>;
  Ingredient?: IngredientResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Nutrient?: NutrientResolvers<ContextType>;
  NutrientGroup?: NutrientGroupResolvers<ContextType>;
  NutritionFact?: NutritionFactResolvers<ContextType>;
  Photo?: PhotoResolvers<ContextType>;
  PriceHistory?: PriceHistoryResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Recipe?: RecipeResolvers<ContextType>;
  RecipeIngredient?: RecipeIngredientResolvers<ContextType>;
}>;

