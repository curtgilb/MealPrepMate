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
    "\n  fragment NutrientFields on Nutrient {\n    id\n    alternateNames\n    customTarget\n    dri {\n      value\n    }\n    name\n    parentNutrientId\n    type\n    unit {\n      id\n      name\n      symbol\n      abbreviations\n    }\n  }\n": types.NutrientFieldsFragmentDoc,
    "\n  query getNutrients($advanced: Boolean!) {\n    nutrients(pagination: { take: 400, offset: 0 }, advanced: $advanced) {\n      items {\n        ...NutrientFields\n      }\n    }\n  }\n": types.GetNutrientsDocument,
    "\n  query GroceryStores($search: String!) {\n    stores(search: $search, pagination: { offset: 0, take: 10 }) {\n      itemsRemaining\n      nextOffset\n      stores {\n        name\n        id\n      }\n    }\n  }\n": types.GroceryStoresDocument,
    "\n  fragment PhotoFields on Photo {\n    id\n    isPrimary\n    url\n  }\n": types.PhotoFieldsFragmentDoc,
    "\n  mutation uploadPhoto($file: File!) {\n    uploadPhoto(photo: $file, isPrimary: false) {\n      id\n      url\n      isPrimary\n    }\n  }\n": types.UploadPhotoDocument,
    "\n  fragment ExpirationRuleFields on ExpirationRule {\n    id\n    name\n    variation\n    perishable\n    tableLife\n    freezerLife\n    fridgeLife\n    defrostTime\n  }\n": types.ExpirationRuleFieldsFragmentDoc,
    "\n  query fetchIngredients($pagination: OffsetPagination!, $search: String) {\n    ingredients(pagination: $pagination, search: $search) {\n      ingredients {\n        id\n        name\n      }\n      itemsRemaining\n      nextOffset\n    }\n  }\n": types.FetchIngredientsDocument,
    "\n  query fetchCategories($search: String) {\n    categories(searchString: $search) {\n      id\n      name\n    }\n  }\n": types.FetchCategoriesDocument,
    "\n  mutation createCategory($name: String!) {\n    createCategory(name: $name) {\n      id\n      name\n    }\n  }\n": types.CreateCategoryDocument,
    "\n  query fetchCourses($search: String) {\n    courses(searchString: $search) {\n      id\n      name\n    }\n  }\n": types.FetchCoursesDocument,
    "\n  mutation createCourse($name: String!) {\n    createCourse(name: $name) {\n      id\n      name\n    }\n  }\n": types.CreateCourseDocument,
    "\n  query fetchCuisines($search: String) {\n    cuisines(searchString: $search) {\n      id\n      name\n    }\n  }\n": types.FetchCuisinesDocument,
    "\n  mutation createCuisine($name: String!) {\n    createCuisine(name: $name) {\n      id\n      name\n    }\n  }\n": types.CreateCuisineDocument,
    "\n  query fetchIngredientsList($search: String, $pagination: OffsetPagination!) {\n    ingredients(search: $search, pagination: $pagination) {\n      ingredients {\n        id\n        name\n      }\n      itemsRemaining\n      nextOffset\n    }\n  }\n": types.FetchIngredientsListDocument,
    "\n  mutation createIngredientInList($ingredient: CreateIngredientInput!) {\n    createIngredient(ingredient: $ingredient) {\n      id\n      name\n    }\n  }\n": types.CreateIngredientInListDocument,
    "\n  query fetchUnits($search: String, $pagination: OffsetPagination!) {\n    units(search: $search, pagination: $pagination) {\n      items {\n        id\n        name\n        symbol\n        abbreviations\n      }\n      itemsRemaining\n      nextOffset\n    }\n  }\n": types.FetchUnitsDocument,
    "\n  mutation createUnit($unit: CreateUnitInput!) {\n    createUnit(input: $unit) {\n      id\n      name\n      symbol\n      abbreviations\n    }\n  }\n": types.CreateUnitDocument,
    "\n  mutation uploadReceipt($file: File!) {\n    uploadReceipt(file: $file) {\n      id\n    }\n  }\n": types.UploadReceiptDocument,
    "\n  fragment ReceiptItem on ReceiptLine {\n    id\n    totalPrice\n    description\n    quantity\n    perUnitPrice\n    unitQuantity\n    foodType\n    matchingUnit {\n      id\n      name\n    }\n    matchingIngredient {\n      id\n      name\n    }\n  }\n": types.ReceiptItemFragmentDoc,
    "\n  query fetchRecipe($id: String!) {\n    recipe(recipeId: $id) {\n      id\n      ingredients {\n        ...RecipeIngredientFragment\n      }\n    }\n  }\n": types.FetchRecipeDocument,
    "\n  fragment RecipeIngredientFragment on RecipeIngredients {\n    id\n    sentence\n    order\n    quantity\n    baseIngredient {\n      id\n      name\n    }\n    unit {\n      id\n      name\n      symbol\n    }\n    group {\n      id\n      name\n    }\n  }\n": types.RecipeIngredientFragmentFragmentDoc,
    "\n  fragment RecipeIngredientFields on RecipeIngredients {\n    id\n    name\n    order\n    quantity\n    sentence\n    unit {\n      id\n      name\n      symbol\n    }\n    baseIngredient {\n      id\n      name\n      alternateNames\n    }\n    group {\n      id\n      name\n    }\n  }\n": types.RecipeIngredientFieldsFragmentDoc,
    "\n  query getCategories {\n    categories {\n      id\n      name\n    }\n  }\n": types.GetCategoriesDocument,
    "\n  query getCourses {\n    courses {\n      id\n      name\n    }\n  }\n": types.GetCoursesDocument,
    "\n  query getCuisines {\n    cuisines {\n      id\n      name\n    }\n  }\n": types.GetCuisinesDocument,
    "\n  query getRecipe($id: String!) {\n    recipe(recipeId: $id) {\n      id\n      name\n      category {\n        id\n        name\n      }\n      cookTime\n      course {\n        id\n        name\n      }\n      directions\n      leftoverFridgeLife\n      leftoverFreezerLife\n      marinadeTime\n      totalTime\n      verifed\n      notes\n      photos {\n        id\n        isPrimary\n        url\n      }\n      prepTime\n      source\n      ingredients {\n        ...RecipeIngredientFields\n      }\n    }\n  }\n": types.GetRecipeDocument,
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
export function graphql(source: "\n  fragment NutrientFields on Nutrient {\n    id\n    alternateNames\n    customTarget\n    dri {\n      value\n    }\n    name\n    parentNutrientId\n    type\n    unit {\n      id\n      name\n      symbol\n      abbreviations\n    }\n  }\n"): (typeof documents)["\n  fragment NutrientFields on Nutrient {\n    id\n    alternateNames\n    customTarget\n    dri {\n      value\n    }\n    name\n    parentNutrientId\n    type\n    unit {\n      id\n      name\n      symbol\n      abbreviations\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getNutrients($advanced: Boolean!) {\n    nutrients(pagination: { take: 400, offset: 0 }, advanced: $advanced) {\n      items {\n        ...NutrientFields\n      }\n    }\n  }\n"): (typeof documents)["\n  query getNutrients($advanced: Boolean!) {\n    nutrients(pagination: { take: 400, offset: 0 }, advanced: $advanced) {\n      items {\n        ...NutrientFields\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GroceryStores($search: String!) {\n    stores(search: $search, pagination: { offset: 0, take: 10 }) {\n      itemsRemaining\n      nextOffset\n      stores {\n        name\n        id\n      }\n    }\n  }\n"): (typeof documents)["\n  query GroceryStores($search: String!) {\n    stores(search: $search, pagination: { offset: 0, take: 10 }) {\n      itemsRemaining\n      nextOffset\n      stores {\n        name\n        id\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment PhotoFields on Photo {\n    id\n    isPrimary\n    url\n  }\n"): (typeof documents)["\n  fragment PhotoFields on Photo {\n    id\n    isPrimary\n    url\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation uploadPhoto($file: File!) {\n    uploadPhoto(photo: $file, isPrimary: false) {\n      id\n      url\n      isPrimary\n    }\n  }\n"): (typeof documents)["\n  mutation uploadPhoto($file: File!) {\n    uploadPhoto(photo: $file, isPrimary: false) {\n      id\n      url\n      isPrimary\n    }\n  }\n"];
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
export function graphql(source: "\n  query fetchCategories($search: String) {\n    categories(searchString: $search) {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  query fetchCategories($search: String) {\n    categories(searchString: $search) {\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createCategory($name: String!) {\n    createCategory(name: $name) {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  mutation createCategory($name: String!) {\n    createCategory(name: $name) {\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query fetchCourses($search: String) {\n    courses(searchString: $search) {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  query fetchCourses($search: String) {\n    courses(searchString: $search) {\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createCourse($name: String!) {\n    createCourse(name: $name) {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  mutation createCourse($name: String!) {\n    createCourse(name: $name) {\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query fetchCuisines($search: String) {\n    cuisines(searchString: $search) {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  query fetchCuisines($search: String) {\n    cuisines(searchString: $search) {\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createCuisine($name: String!) {\n    createCuisine(name: $name) {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  mutation createCuisine($name: String!) {\n    createCuisine(name: $name) {\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query fetchIngredientsList($search: String, $pagination: OffsetPagination!) {\n    ingredients(search: $search, pagination: $pagination) {\n      ingredients {\n        id\n        name\n      }\n      itemsRemaining\n      nextOffset\n    }\n  }\n"): (typeof documents)["\n  query fetchIngredientsList($search: String, $pagination: OffsetPagination!) {\n    ingredients(search: $search, pagination: $pagination) {\n      ingredients {\n        id\n        name\n      }\n      itemsRemaining\n      nextOffset\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createIngredientInList($ingredient: CreateIngredientInput!) {\n    createIngredient(ingredient: $ingredient) {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  mutation createIngredientInList($ingredient: CreateIngredientInput!) {\n    createIngredient(ingredient: $ingredient) {\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query fetchUnits($search: String, $pagination: OffsetPagination!) {\n    units(search: $search, pagination: $pagination) {\n      items {\n        id\n        name\n        symbol\n        abbreviations\n      }\n      itemsRemaining\n      nextOffset\n    }\n  }\n"): (typeof documents)["\n  query fetchUnits($search: String, $pagination: OffsetPagination!) {\n    units(search: $search, pagination: $pagination) {\n      items {\n        id\n        name\n        symbol\n        abbreviations\n      }\n      itemsRemaining\n      nextOffset\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createUnit($unit: CreateUnitInput!) {\n    createUnit(input: $unit) {\n      id\n      name\n      symbol\n      abbreviations\n    }\n  }\n"): (typeof documents)["\n  mutation createUnit($unit: CreateUnitInput!) {\n    createUnit(input: $unit) {\n      id\n      name\n      symbol\n      abbreviations\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation uploadReceipt($file: File!) {\n    uploadReceipt(file: $file) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation uploadReceipt($file: File!) {\n    uploadReceipt(file: $file) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ReceiptItem on ReceiptLine {\n    id\n    totalPrice\n    description\n    quantity\n    perUnitPrice\n    unitQuantity\n    foodType\n    matchingUnit {\n      id\n      name\n    }\n    matchingIngredient {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  fragment ReceiptItem on ReceiptLine {\n    id\n    totalPrice\n    description\n    quantity\n    perUnitPrice\n    unitQuantity\n    foodType\n    matchingUnit {\n      id\n      name\n    }\n    matchingIngredient {\n      id\n      name\n    }\n  }\n"];
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
export function graphql(source: "\n  fragment RecipeIngredientFields on RecipeIngredients {\n    id\n    name\n    order\n    quantity\n    sentence\n    unit {\n      id\n      name\n      symbol\n    }\n    baseIngredient {\n      id\n      name\n      alternateNames\n    }\n    group {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  fragment RecipeIngredientFields on RecipeIngredients {\n    id\n    name\n    order\n    quantity\n    sentence\n    unit {\n      id\n      name\n      symbol\n    }\n    baseIngredient {\n      id\n      name\n      alternateNames\n    }\n    group {\n      id\n      name\n    }\n  }\n"];
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
export function graphql(source: "\n  query getRecipe($id: String!) {\n    recipe(recipeId: $id) {\n      id\n      name\n      category {\n        id\n        name\n      }\n      cookTime\n      course {\n        id\n        name\n      }\n      directions\n      leftoverFridgeLife\n      leftoverFreezerLife\n      marinadeTime\n      totalTime\n      verifed\n      notes\n      photos {\n        id\n        isPrimary\n        url\n      }\n      prepTime\n      source\n      ingredients {\n        ...RecipeIngredientFields\n      }\n    }\n  }\n"): (typeof documents)["\n  query getRecipe($id: String!) {\n    recipe(recipeId: $id) {\n      id\n      name\n      category {\n        id\n        name\n      }\n      cookTime\n      course {\n        id\n        name\n      }\n      directions\n      leftoverFridgeLife\n      leftoverFreezerLife\n      marinadeTime\n      totalTime\n      verifed\n      notes\n      photos {\n        id\n        isPrimary\n        url\n      }\n      prepTime\n      source\n      ingredients {\n        ...RecipeIngredientFields\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;