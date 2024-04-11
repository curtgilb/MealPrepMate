/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  query fetchIngredients($pagination: OffsetPagination!, $search: String) {\n    ingredients(pagination: $pagination, search: $search) {\n      ingredients {\n        id\n        name\n      }\n      itemsRemaining\n      nextOffset\n    }\n  }\n": types.FetchIngredientsDocument,
    "\n  query getRecipe($id: String!) {\n    recipe(recipeId: $id) {\n      prepTime\n      source\n      name\n      marinadeTime\n      leftoverFridgeLife\n      isFavorite\n      ingredients {\n        ...RecipeIngredientFragment\n      }\n      photos {\n        url\n        id\n        isPrimary\n      }\n      ingredientFreshness\n      id\n      directions\n      cuisine {\n        id\n        name\n      }\n      course {\n        id\n        name\n      }\n      cookTime\n      category {\n        id\n        name\n      }\n      notes\n    }\n  }\n": types.GetRecipeDocument,
    "\n  query getCategories {\n    categories {\n      id\n      name\n    }\n  }\n": types.GetCategoriesDocument,
    "\n  query getCourses {\n    courses {\n      id\n      name\n    }\n  }\n": types.GetCoursesDocument,
    "\n  query getCuisines {\n    cuisines {\n      id\n      name\n    }\n  }\n": types.GetCuisinesDocument,
    "\n  query fetchRecipe($id: String!) {\n    recipe(recipeId: $id) {\n      id\n      ingredients {\n        ...RecipeIngredientFragment\n      }\n    }\n  }\n": types.FetchRecipeDocument,
    "\n  fragment RecipeIngredientFragment on RecipeIngredients {\n    id\n    sentence\n    order\n    quantity\n    baseIngredient {\n      id\n      name\n    }\n    unit {\n      id\n      name\n      symbol\n    }\n    group {\n      id\n      name\n    }\n  }\n": types.RecipeIngredientFragmentFragmentDoc,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query fetchIngredients($pagination: OffsetPagination!, $search: String) {\n    ingredients(pagination: $pagination, search: $search) {\n      ingredients {\n        id\n        name\n      }\n      itemsRemaining\n      nextOffset\n    }\n  }\n"): (typeof documents)["\n  query fetchIngredients($pagination: OffsetPagination!, $search: String) {\n    ingredients(pagination: $pagination, search: $search) {\n      ingredients {\n        id\n        name\n      }\n      itemsRemaining\n      nextOffset\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getRecipe($id: String!) {\n    recipe(recipeId: $id) {\n      prepTime\n      source\n      name\n      marinadeTime\n      leftoverFridgeLife\n      isFavorite\n      ingredients {\n        ...RecipeIngredientFragment\n      }\n      photos {\n        url\n        id\n        isPrimary\n      }\n      ingredientFreshness\n      id\n      directions\n      cuisine {\n        id\n        name\n      }\n      course {\n        id\n        name\n      }\n      cookTime\n      category {\n        id\n        name\n      }\n      notes\n    }\n  }\n"): (typeof documents)["\n  query getRecipe($id: String!) {\n    recipe(recipeId: $id) {\n      prepTime\n      source\n      name\n      marinadeTime\n      leftoverFridgeLife\n      isFavorite\n      ingredients {\n        ...RecipeIngredientFragment\n      }\n      photos {\n        url\n        id\n        isPrimary\n      }\n      ingredientFreshness\n      id\n      directions\n      cuisine {\n        id\n        name\n      }\n      course {\n        id\n        name\n      }\n      cookTime\n      category {\n        id\n        name\n      }\n      notes\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getCategories {\n    categories {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  query getCategories {\n    categories {\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getCourses {\n    courses {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  query getCourses {\n    courses {\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getCuisines {\n    cuisines {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  query getCuisines {\n    cuisines {\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query fetchRecipe($id: String!) {\n    recipe(recipeId: $id) {\n      id\n      ingredients {\n        ...RecipeIngredientFragment\n      }\n    }\n  }\n"): (typeof documents)["\n  query fetchRecipe($id: String!) {\n    recipe(recipeId: $id) {\n      id\n      ingredients {\n        ...RecipeIngredientFragment\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment RecipeIngredientFragment on RecipeIngredients {\n    id\n    sentence\n    order\n    quantity\n    baseIngredient {\n      id\n      name\n    }\n    unit {\n      id\n      name\n      symbol\n    }\n    group {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  fragment RecipeIngredientFragment on RecipeIngredients {\n    id\n    sentence\n    order\n    quantity\n    baseIngredient {\n      id\n      name\n    }\n    unit {\n      id\n      name\n      symbol\n    }\n    group {\n      id\n      name\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;