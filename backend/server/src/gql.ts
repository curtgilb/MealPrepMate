import { GraphQLResolveInfo } from 'graphql';
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

export type Cuisine = {
  __typename?: 'Cuisine';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createRecipe: Recipe;
};


export type MutationCreateRecipeArgs = {
  recipe: RecipeInput;
};

export type Query = {
  __typename?: 'Query';
  cuisines: Array<Cuisine>;
};

export type Recipe = {
  __typename?: 'Recipe';
  cookTime?: Maybe<Scalars['Int']['output']>;
  cuisine: Cuisine;
  directions?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  ingredientsTxt?: Maybe<Scalars['String']['output']>;
  isFavorite: Scalars['Boolean']['output'];
  isVerified?: Maybe<Scalars['Boolean']['output']>;
  leftoverFridgeLife?: Maybe<Scalars['Int']['output']>;
  marinadeTime?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  prepTime?: Maybe<Scalars['Int']['output']>;
  servings: Scalars['Int']['output'];
  servingsTxt?: Maybe<Scalars['String']['output']>;
  stars?: Maybe<Scalars['Int']['output']>;
};

export type RecipeInput = {
  category?: InputMaybe<Array<Scalars['ID']['input']>>;
  cookTime?: InputMaybe<Scalars['Int']['input']>;
  course?: InputMaybe<Scalars['ID']['input']>;
  cuisine?: InputMaybe<Scalars['ID']['input']>;
  directions?: InputMaybe<Scalars['String']['input']>;
  ingredients?: InputMaybe<Scalars['String']['input']>;
  isFavorite?: InputMaybe<Scalars['Boolean']['input']>;
  leftoverFreezerLife?: InputMaybe<Scalars['Int']['input']>;
  leftoverFridgeLife?: InputMaybe<Scalars['Int']['input']>;
  marinadeTime?: InputMaybe<Scalars['Int']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  photos?: InputMaybe<Array<Scalars['ID']['input']>>;
  prepTime?: InputMaybe<Scalars['Int']['input']>;
  servings: Scalars['Int']['input'];
  source?: InputMaybe<Scalars['String']['input']>;
  stars?: InputMaybe<Scalars['Int']['input']>;
  title: Scalars['String']['input'];
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
  Cuisine: ResolverTypeWrapper<Cuisine>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  Recipe: ResolverTypeWrapper<Recipe>;
  RecipeInput: RecipeInput;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean']['output'];
  Cuisine: Cuisine;
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  Mutation: {};
  Query: {};
  Recipe: Recipe;
  RecipeInput: RecipeInput;
  String: Scalars['String']['output'];
};

export type CuisineResolvers<ContextType = any, ParentType extends ResolversParentTypes['Cuisine'] = ResolversParentTypes['Cuisine']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createRecipe?: Resolver<ResolversTypes['Recipe'], ParentType, ContextType, RequireFields<MutationCreateRecipeArgs, 'recipe'>>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  cuisines?: Resolver<Array<ResolversTypes['Cuisine']>, ParentType, ContextType>;
};

export type RecipeResolvers<ContextType = any, ParentType extends ResolversParentTypes['Recipe'] = ResolversParentTypes['Recipe']> = {
  cookTime?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  cuisine?: Resolver<ResolversTypes['Cuisine'], ParentType, ContextType>;
  directions?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  ingredientsTxt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  isFavorite?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  isVerified?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  leftoverFridgeLife?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  marinadeTime?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  notes?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  prepTime?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  servings?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  servingsTxt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  stars?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Cuisine?: CuisineResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Recipe?: RecipeResolvers<ContextType>;
};

