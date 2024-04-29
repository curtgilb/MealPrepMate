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
    "\n  query MyQuery {\n    importRecords(\n      importId: \"clv4vp1f800wrvybbijxixn5o\"\n      pagination: { offset: 0, take: 117 }\n    ) {\n      records {\n        id\n        __typename\n        draft {\n          ... on Recipe {\n            __typename\n            id\n            name\n            photos {\n              isPrimary\n              url\n            }\n          }\n          ... on NutritionLabel {\n            __typename\n            id\n            labelName: name\n          }\n        }\n        recipe {\n          name\n          id\n        }\n        label {\n          id\n          name\n        }\n        ingredientGroup {\n          id\n          name\n        }\n        name\n        status\n        verifed\n      }\n    }\n  }\n": types.MyQueryDocument,
    "\n  query getImports {\n    imports(pagination: { offset: 0, take: 10 }) {\n      importJobs {\n        createdAt\n        fileName\n        id\n        recordsCount\n        status\n        type\n      }\n    }\n  }\n": types.GetImportsDocument,
    "\n  query getReceipt($id: String!) {\n    receipt(id: $id) {\n      id\n      imagePath\n      total\n      merchantName\n      date\n      items {\n        ...ReceiptItem\n      }\n      scanned\n    }\n  }\n": types.GetReceiptDocument,
    "\n  query getRecipe($id: String!) {\n    recipe(recipeId: $id) {\n      prepTime\n      source\n      name\n      marinadeTime\n      leftoverFridgeLife\n      isFavorite\n      ingredients {\n        ...RecipeIngredientFragment\n      }\n      photos {\n        url\n        id\n        isPrimary\n      }\n      ingredientFreshness\n      id\n      directions\n      cuisine {\n        id\n        name\n      }\n      course {\n        id\n        name\n      }\n      cookTime\n      category {\n        id\n        name\n      }\n      notes\n    }\n  }\n": types.GetRecipeDocument,
    "\n  query GroceryStores($search: String!) {\n    stores(search: $search, pagination: { offset: 0, take: 10 }) {\n      itemsRemaining\n      nextOffset\n      stores {\n        name\n        id\n      }\n    }\n  }\n": types.GroceryStoresDocument,
    "\n  fragment ExpirationRuleFields on ExpirationRule {\n    id\n    name\n    variation\n    perishable\n    tableLife\n    freezerLife\n    fridgeLife\n    defrostTime\n  }\n": types.ExpirationRuleFieldsFragmentDoc,
    "\n  query fetchIngredients($pagination: OffsetPagination!, $search: String) {\n    ingredients(pagination: $pagination, search: $search) {\n      ingredients {\n        id\n        name\n      }\n      itemsRemaining\n      nextOffset\n    }\n  }\n": types.FetchIngredientsDocument,
    "\n  fragment ReceiptItem on ReceiptLine {\n    id\n    totalPrice\n    description\n    quantity\n    perUnitPrice\n    unitQuantity\n    foodType\n    matchingUnit {\n      id\n      name\n    }\n    matchingIngredient {\n      id\n      name\n    }\n  }\n": types.ReceiptItemFragmentDoc,
    "\n  mutation uploadReceipt($file: File!) {\n    uploadReceipt(file: $file) {\n      id\n    }\n  }\n": types.UploadReceiptDocument,
    "\n  query getCategories {\n    categories {\n      id\n      name\n    }\n  }\n": types.GetCategoriesDocument,
    "\n  query getCourses {\n    courses {\n      id\n      name\n    }\n  }\n": types.GetCoursesDocument,
    "\n  query getCuisines {\n    cuisines {\n      id\n      name\n    }\n  }\n": types.GetCuisinesDocument,
    "\n  query fetchRecipe($id: String!) {\n    recipe(recipeId: $id) {\n      id\n      ingredients {\n        ...RecipeIngredientFragment\n      }\n    }\n  }\n": types.FetchRecipeDocument,
    "\n  fragment RecipeIngredientFragment on RecipeIngredients {\n    id\n    sentence\n    order\n    quantity\n    baseIngredient {\n      id\n      name\n    }\n    unit {\n      id\n      name\n      symbol\n    }\n    group {\n      id\n      name\n    }\n  }\n": types.RecipeIngredientFragmentFragmentDoc,
    "\n  query getRecipeToEdit($id: String!) {\n    recipe(recipeId: $id) {\n      id\n      name\n      category {\n        id\n        name\n      }\n      cookTime\n      course {\n        id\n        name\n      }\n      directions\n      leftoverFridgeLife\n      leftoverFreezerLife\n      marinadeTime\n      totalTime\n      verifed\n      notes\n      photos {\n        id\n        isPrimary\n        url\n      }\n      prepTime\n      source\n      ingredients {\n        ...RecipeIngredientFields\n      }\n      nutritionLabels {\n        ...NutritionLabelFields\n      }\n    }\n  }\n": types.GetRecipeToEditDocument,
    "\n  fragment RecipeIngredientFields on RecipeIngredients {\n    id\n    name\n    order\n    quantity\n    sentence\n    unit {\n      id\n      name\n      symbol\n    }\n    baseIngredient {\n      id\n      name\n      alternateNames\n    }\n    group {\n      id\n      name\n    }\n  }\n": types.RecipeIngredientFieldsFragmentDoc,
    "\n  fragment NutritionLabelFields on NutritionLabel {\n    id\n    name\n    servingSize\n    servings\n    servingsUsed\n    servingSizeUnit {\n      id\n      name\n      symbol\n    }\n  }\n": types.NutritionLabelFieldsFragmentDoc,
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
export function graphql(source: "\n  query MyQuery {\n    importRecords(\n      importId: \"clv4vp1f800wrvybbijxixn5o\"\n      pagination: { offset: 0, take: 117 }\n    ) {\n      records {\n        id\n        __typename\n        draft {\n          ... on Recipe {\n            __typename\n            id\n            name\n            photos {\n              isPrimary\n              url\n            }\n          }\n          ... on NutritionLabel {\n            __typename\n            id\n            labelName: name\n          }\n        }\n        recipe {\n          name\n          id\n        }\n        label {\n          id\n          name\n        }\n        ingredientGroup {\n          id\n          name\n        }\n        name\n        status\n        verifed\n      }\n    }\n  }\n"): (typeof documents)["\n  query MyQuery {\n    importRecords(\n      importId: \"clv4vp1f800wrvybbijxixn5o\"\n      pagination: { offset: 0, take: 117 }\n    ) {\n      records {\n        id\n        __typename\n        draft {\n          ... on Recipe {\n            __typename\n            id\n            name\n            photos {\n              isPrimary\n              url\n            }\n          }\n          ... on NutritionLabel {\n            __typename\n            id\n            labelName: name\n          }\n        }\n        recipe {\n          name\n          id\n        }\n        label {\n          id\n          name\n        }\n        ingredientGroup {\n          id\n          name\n        }\n        name\n        status\n        verifed\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getImports {\n    imports(pagination: { offset: 0, take: 10 }) {\n      importJobs {\n        createdAt\n        fileName\n        id\n        recordsCount\n        status\n        type\n      }\n    }\n  }\n"): (typeof documents)["\n  query getImports {\n    imports(pagination: { offset: 0, take: 10 }) {\n      importJobs {\n        createdAt\n        fileName\n        id\n        recordsCount\n        status\n        type\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getReceipt($id: String!) {\n    receipt(id: $id) {\n      id\n      imagePath\n      total\n      merchantName\n      date\n      items {\n        ...ReceiptItem\n      }\n      scanned\n    }\n  }\n"): (typeof documents)["\n  query getReceipt($id: String!) {\n    receipt(id: $id) {\n      id\n      imagePath\n      total\n      merchantName\n      date\n      items {\n        ...ReceiptItem\n      }\n      scanned\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getRecipe($id: String!) {\n    recipe(recipeId: $id) {\n      prepTime\n      source\n      name\n      marinadeTime\n      leftoverFridgeLife\n      isFavorite\n      ingredients {\n        ...RecipeIngredientFragment\n      }\n      photos {\n        url\n        id\n        isPrimary\n      }\n      ingredientFreshness\n      id\n      directions\n      cuisine {\n        id\n        name\n      }\n      course {\n        id\n        name\n      }\n      cookTime\n      category {\n        id\n        name\n      }\n      notes\n    }\n  }\n"): (typeof documents)["\n  query getRecipe($id: String!) {\n    recipe(recipeId: $id) {\n      prepTime\n      source\n      name\n      marinadeTime\n      leftoverFridgeLife\n      isFavorite\n      ingredients {\n        ...RecipeIngredientFragment\n      }\n      photos {\n        url\n        id\n        isPrimary\n      }\n      ingredientFreshness\n      id\n      directions\n      cuisine {\n        id\n        name\n      }\n      course {\n        id\n        name\n      }\n      cookTime\n      category {\n        id\n        name\n      }\n      notes\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GroceryStores($search: String!) {\n    stores(search: $search, pagination: { offset: 0, take: 10 }) {\n      itemsRemaining\n      nextOffset\n      stores {\n        name\n        id\n      }\n    }\n  }\n"): (typeof documents)["\n  query GroceryStores($search: String!) {\n    stores(search: $search, pagination: { offset: 0, take: 10 }) {\n      itemsRemaining\n      nextOffset\n      stores {\n        name\n        id\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ExpirationRuleFields on ExpirationRule {\n    id\n    name\n    variation\n    perishable\n    tableLife\n    freezerLife\n    fridgeLife\n    defrostTime\n  }\n"): (typeof documents)["\n  fragment ExpirationRuleFields on ExpirationRule {\n    id\n    name\n    variation\n    perishable\n    tableLife\n    freezerLife\n    fridgeLife\n    defrostTime\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query fetchIngredients($pagination: OffsetPagination!, $search: String) {\n    ingredients(pagination: $pagination, search: $search) {\n      ingredients {\n        id\n        name\n      }\n      itemsRemaining\n      nextOffset\n    }\n  }\n"): (typeof documents)["\n  query fetchIngredients($pagination: OffsetPagination!, $search: String) {\n    ingredients(pagination: $pagination, search: $search) {\n      ingredients {\n        id\n        name\n      }\n      itemsRemaining\n      nextOffset\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ReceiptItem on ReceiptLine {\n    id\n    totalPrice\n    description\n    quantity\n    perUnitPrice\n    unitQuantity\n    foodType\n    matchingUnit {\n      id\n      name\n    }\n    matchingIngredient {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  fragment ReceiptItem on ReceiptLine {\n    id\n    totalPrice\n    description\n    quantity\n    perUnitPrice\n    unitQuantity\n    foodType\n    matchingUnit {\n      id\n      name\n    }\n    matchingIngredient {\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation uploadReceipt($file: File!) {\n    uploadReceipt(file: $file) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation uploadReceipt($file: File!) {\n    uploadReceipt(file: $file) {\n      id\n    }\n  }\n"];
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
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getRecipeToEdit($id: String!) {\n    recipe(recipeId: $id) {\n      id\n      name\n      category {\n        id\n        name\n      }\n      cookTime\n      course {\n        id\n        name\n      }\n      directions\n      leftoverFridgeLife\n      leftoverFreezerLife\n      marinadeTime\n      totalTime\n      verifed\n      notes\n      photos {\n        id\n        isPrimary\n        url\n      }\n      prepTime\n      source\n      ingredients {\n        ...RecipeIngredientFields\n      }\n      nutritionLabels {\n        ...NutritionLabelFields\n      }\n    }\n  }\n"): (typeof documents)["\n  query getRecipeToEdit($id: String!) {\n    recipe(recipeId: $id) {\n      id\n      name\n      category {\n        id\n        name\n      }\n      cookTime\n      course {\n        id\n        name\n      }\n      directions\n      leftoverFridgeLife\n      leftoverFreezerLife\n      marinadeTime\n      totalTime\n      verifed\n      notes\n      photos {\n        id\n        isPrimary\n        url\n      }\n      prepTime\n      source\n      ingredients {\n        ...RecipeIngredientFields\n      }\n      nutritionLabels {\n        ...NutritionLabelFields\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment RecipeIngredientFields on RecipeIngredients {\n    id\n    name\n    order\n    quantity\n    sentence\n    unit {\n      id\n      name\n      symbol\n    }\n    baseIngredient {\n      id\n      name\n      alternateNames\n    }\n    group {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  fragment RecipeIngredientFields on RecipeIngredients {\n    id\n    name\n    order\n    quantity\n    sentence\n    unit {\n      id\n      name\n      symbol\n    }\n    baseIngredient {\n      id\n      name\n      alternateNames\n    }\n    group {\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment NutritionLabelFields on NutritionLabel {\n    id\n    name\n    servingSize\n    servings\n    servingsUsed\n    servingSizeUnit {\n      id\n      name\n      symbol\n    }\n  }\n"): (typeof documents)["\n  fragment NutritionLabelFields on NutritionLabel {\n    id\n    name\n    servingSize\n    servings\n    servingsUsed\n    servingSizeUnit {\n      id\n      name\n      symbol\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;