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
    "\n  query GetIngredient($id: String!) {\n    ingredient(ingredientId: $id) {\n      id\n      name\n      alternateNames\n      storageInstructions\n      category {\n        id\n        name\n      }\n      expiration {\n        ...ExpirationRuleFields\n      }\n      priceHistory {\n        id\n        date\n        foodType\n        groceryStore {\n          id\n          name\n        }\n        price\n        pricePerUnit\n        quantity\n        unit {\n          id\n          name\n          symbol\n          conversionName\n          measurementSystem\n          type\n        }\n      }\n    }\n  }\n": types.GetIngredientDocument,
    "\n  mutation createMealPlan {\n    createMealPlan(name: \"Untitled Meal Plan\") {\n      id\n    }\n  }\n": types.CreateMealPlanDocument,
    "\n  fragment PhotoFields on Photo {\n    id\n    isPrimary\n    url\n  }\n": types.PhotoFieldsFragmentDoc,
    "\n  mutation uploadPhoto($file: File!) {\n    uploadPhoto(photo: $file, isPrimary: false) {\n      id\n      url\n      isPrimary\n    }\n  }\n": types.UploadPhotoDocument,
    "\n  query GetMealPlans {\n    mealPlans {\n      id\n      name\n      planRecipes {\n        id\n        originalRecipe {\n          id\n          name\n          photos {\n            id\n            isPrimary\n            url\n          }\n        }\n      }\n    }\n  }\n": types.GetMealPlansDocument,
    "\n  query fetchCategories($search: String) {\n    categories(searchString: $search) {\n      id\n      name\n    }\n  }\n": types.FetchCategoriesDocument,
    "\n  mutation createCategory($name: String!) {\n    createCategory(name: $name) {\n      id\n      name\n    }\n  }\n": types.CreateCategoryDocument,
    "\n  query fetchCourses($search: String) {\n    courses(searchString: $search) {\n      id\n      name\n    }\n  }\n": types.FetchCoursesDocument,
    "\n  mutation createCourse($name: String!) {\n    createCourse(name: $name) {\n      id\n      name\n    }\n  }\n": types.CreateCourseDocument,
    "\n  query fetchCuisines($search: String) {\n    cuisines(searchString: $search) {\n      id\n      name\n    }\n  }\n": types.FetchCuisinesDocument,
    "\n  mutation createCuisine($name: String!) {\n    createCuisine(name: $name) {\n      id\n      name\n    }\n  }\n": types.CreateCuisineDocument,
    "\n  query getGroceryStores {\n    stores {\n      id\n      name\n    }\n  }\n": types.GetGroceryStoresDocument,
    "\n  mutation createStore($name: String!) {\n    createGroceryStore(name: $name) {\n      id\n      name\n    }\n  }\n": types.CreateStoreDocument,
    "\n  query fetchIngredientsList($search: String, $pagination: OffsetPagination!) {\n    ingredients(search: $search, pagination: $pagination) {\n      ingredients {\n        id\n        name\n      }\n      itemsRemaining\n      nextOffset\n    }\n  }\n": types.FetchIngredientsListDocument,
    "\n  mutation createIngredientInList($ingredient: CreateIngredientInput!) {\n    createIngredient(ingredient: $ingredient) {\n      id\n      name\n    }\n  }\n": types.CreateIngredientInListDocument,
    "\n  query fetchUnits {\n    units {\n      id\n      name\n      symbol\n      abbreviations\n    }\n  }\n": types.FetchUnitsDocument,
    "\n  mutation createUnit($unit: CreateUnitInput!) {\n    createUnit(input: $unit) {\n      id\n      name\n      symbol\n      abbreviations\n    }\n  }\n": types.CreateUnitDocument,
    "\n  fragment ExpirationRuleFields on ExpirationRule {\n    id\n    name\n    variation\n    perishable\n    tableLife\n    freezerLife\n    fridgeLife\n    defrostTime\n  }\n": types.ExpirationRuleFieldsFragmentDoc,
    "\n  query fetchIngredients($pagination: OffsetPagination!, $search: String) {\n    ingredients(pagination: $pagination, search: $search) {\n      ingredients {\n        id\n        name\n      }\n      itemsRemaining\n      nextOffset\n    }\n  }\n": types.FetchIngredientsDocument,
    "\n  mutation changeName($id: String!, $name: String!) {\n    editMealPlan(mealPlan: { id: $id, name: $name }) {\n      id\n      name\n    }\n  }\n": types.ChangeNameDocument,
    "\n  mutation addRecipeToPlan($recipe: AddRecipeInput!) {\n    addRecipeToMealPlan(recipe: $recipe) {\n      ...MealRecipeFields\n    }\n  }\n": types.AddRecipeToPlanDocument,
    "\n  mutation addServingToPlan($serving: AddRecipeServingInput!) {\n    addRecipeServing(serving: $serving) {\n      day\n      id\n      meal\n      mealPlanRecipeId\n      numberOfServings\n      mealRecipe {\n        id\n        servingsOnPlan\n      }\n    }\n  }\n": types.AddServingToPlanDocument,
    "\n  mutation removeServing($id: String!) {\n    deleteRecipeServing(id: $id)\n  }\n": types.RemoveServingDocument,
    "\n  mutation editServing($serving: EditRecipeServingInput!) {\n    editRecipeServing(serving: $serving) {\n      id\n      day\n      meal\n      numberOfServings\n      mealRecipe {\n        id\n        servingsOnPlan\n      }\n    }\n  }\n": types.EditServingDocument,
    "\n  query GetCombinedIngredients($mealPlanId: String!) {\n    mealPlanIngredients(mealPlanId: $mealPlanId) {\n      total {\n        qty\n        unit {\n          id\n          name\n          symbol\n        }\n      }\n      recipeIngredients {\n        name\n        factor\n        recipeIngredient {\n          id\n          name\n          quantity\n          sentence\n          unit {\n            id\n            name\n            symbol\n          }\n        }\n      }\n      baseIngredient {\n        id\n        name\n      }\n    }\n  }\n": types.GetCombinedIngredientsDocument,
    "\n    query GetIngredientCategories {\n      ingredientCategories {\n        id\n        name\n      }\n    }\n  ": types.GetIngredientCategoriesDocument,
    "\n  mutation uploadReceipt($file: File!) {\n    uploadReceipt(file: $file) {\n      id\n    }\n  }\n": types.UploadReceiptDocument,
    "\n  fragment ReceiptItem on ReceiptLine {\n    id\n    totalPrice\n    description\n    quantity\n    perUnitPrice\n    unitQuantity\n    foodType\n    order\n    matchingUnit {\n      id\n      name\n    }\n    matchingIngredient {\n      id\n      name\n    }\n  }\n": types.ReceiptItemFragmentDoc,
    "\n    mutation editReceiptItem($lineId: String!, $lineItem: UpdateReceiptItem!) {\n      updateReceiptLine(lineId: $lineId, line: $lineItem) {\n        ...ReceiptItem\n      }\n    }\n  ": types.EditReceiptItemDocument,
    "\n  mutation finalizeReceipt($receiptId: String!) {\n    finalizeReceipt(receiptId: $receiptId) {\n      id\n      imagePath\n      total\n      merchantName\n      matchingStore {\n        id\n        name\n      }\n      date\n      items {\n        ...ReceiptItem\n      }\n      scanned\n    }\n  }\n": types.FinalizeReceiptDocument,
    "\n  query fetchRecipe($id: String!) {\n    recipe(recipeId: $id) {\n      id\n      ingredients {\n        ...RecipeIngredientFragment\n      }\n    }\n  }\n": types.FetchRecipeDocument,
    "\n  query getCategories {\n    categories {\n      id\n      name\n    }\n  }\n": types.GetCategoriesDocument,
    "\n  query getCourses {\n    courses {\n      id\n      name\n    }\n  }\n": types.GetCoursesDocument,
    "\n  query getCuisines {\n    cuisines {\n      id\n      name\n    }\n  }\n": types.GetCuisinesDocument,
    "\n  query GetMealPlan($mealPlanId: String!) {\n    mealPlan(id: $mealPlanId) {\n      id\n      name\n      mealPrepInstructions\n      mealPlanServings {\n        ...MealPlanServingsField\n      }\n      planRecipes {\n        ...MealRecipeFields\n      }\n    }\n  }\n": types.GetMealPlanDocument,
    "\n  fragment MealRecipeFields on MealPlanRecipe {\n    id\n    totalServings\n    factor\n    servingsOnPlan\n    originalRecipe {\n      id\n      name\n      photos {\n        id\n        url\n        isPrimary\n      }\n      ingredientFreshness\n      ingredients {\n        id\n        quantity\n        sentence\n        baseIngredient {\n          id\n          name\n        }\n        unit {\n          id\n          name\n          symbol\n        }\n      }\n      aggregateLabel {\n        id\n        totalCalories\n        fat\n        alcohol\n        carbs\n        protein\n        nutrients {\n          id\n          perServing\n          value\n          nutrient {\n            id\n          }\n        }\n        servings\n        servingSize\n        servingSizeUnit {\n          id\n          name\n          symbol\n        }\n      }\n    }\n  }\n": types.MealRecipeFieldsFragmentDoc,
    "\n  fragment MealPlanServingsField on MealPlanServing {\n    id\n    day\n    meal\n    numberOfServings\n    mealPlanRecipeId\n  }\n": types.MealPlanServingsFieldFragmentDoc,
    "\n  fragment NutrientFields on Nutrient {\n    id\n    alternateNames\n    target {\n      id\n      nutrientTarget\n      preference\n      threshold\n    }\n    dri {\n      id\n      value\n      upperLimit\n    }\n    name\n    important\n    parentNutrientId\n    target {\n      id\n      nutrientTarget\n      preference\n      threshold\n    }\n    type\n    unit {\n      id\n      name\n      symbol\n      abbreviations\n    }\n  }\n": types.NutrientFieldsFragmentDoc,
    "\n    mutation setRankedNutrients($nutrients: [RankedNutrientInput!]!) {\n      setRankedNutrients(nutrients: $nutrients) {\n        id\n        name\n        unit {\n          id\n          symbol\n        }\n        alternateNames\n      }\n    }\n  ": types.SetRankedNutrientsDocument,
    "\n  mutation setNutrientTarget($target: NutrientTargetInput!) {\n    setNutritionTarget(target: $target) {\n      id\n      target {\n        id\n        nutrientTarget\n        preference\n        threshold\n      }\n    }\n  }\n": types.SetNutrientTargetDocument,
    "\n  query getNutrients($advanced: Boolean!, $name: String) {\n    nutrients(search: $name, advanced: $advanced) {\n      ...NutrientFields\n    }\n  }\n": types.GetNutrientsDocument,
    "\n  query searchNutrients($search: String) {\n    nutrients(advanced: true, search: $search) {\n      id\n      name\n      unit {\n        id\n        symbol\n      }\n      alternateNames\n    }\n  }\n": types.SearchNutrientsDocument,
    "\n  query getRankedNutrients {\n    getRankedNutrients {\n      id\n      name\n      unit {\n        id\n        symbol\n      }\n      alternateNames\n    }\n  }\n": types.GetRankedNutrientsDocument,
    "\n    mutation editReceipt($receiptId: String!, $receipt: UpdateReceipt!) {\n      updateReceipt(receipt: $receipt, receiptId: $receiptId) {\n        id\n        imagePath\n        total\n        merchantName\n        matchingStore {\n          id\n          name\n        }\n        date\n        items {\n          ...ReceiptItem\n        }\n        scanned\n      }\n    }\n  ": types.EditReceiptDocument,
    "\n  query getReceipt($id: String!) {\n    receipt(id: $id) {\n      id\n      imagePath\n      total\n      merchantName\n      matchingStore {\n        id\n        name\n      }\n      date\n      items {\n        ...ReceiptItem\n      }\n      scanned\n    }\n  }\n": types.GetReceiptDocument,
    "\n  fragment RecipeIngredientFragment on RecipeIngredients {\n    id\n    sentence\n    order\n    quantity\n    baseIngredient {\n      id\n      name\n    }\n    unit {\n      id\n      name\n      symbol\n    }\n    group {\n      id\n      name\n    }\n  }\n": types.RecipeIngredientFragmentFragmentDoc,
    "\n  query getRecipe($id: String!) {\n    recipe(recipeId: $id) {\n      id\n      name\n      category {\n        id\n        name\n      }\n      cuisine {\n        id\n        name\n      }\n      cookTime\n      course {\n        id\n        name\n      }\n      directions\n      leftoverFridgeLife\n      leftoverFreezerLife\n      marinadeTime\n      totalTime\n      verified\n      notes\n      photos {\n        id\n        isPrimary\n        url\n      }\n      prepTime\n      source\n      ingredients {\n        ...RecipeIngredientFragment\n      }\n    }\n  }\n": types.GetRecipeDocument,
    "\n  query getRecipeBaiscInfo($id: String!) {\n    recipe(recipeId: $id) {\n      id\n      name\n      category {\n        id\n        name\n      }\n      cuisine {\n        id\n        name\n      }\n      cookTime\n      course {\n        id\n        name\n      }\n      directions\n      leftoverFridgeLife\n      leftoverFreezerLife\n      marinadeTime\n      totalTime\n      verified\n      notes\n      photos {\n        id\n        isPrimary\n        url\n      }\n      prepTime\n      source\n    }\n  }\n": types.GetRecipeBaiscInfoDocument,
    "\n  query getRecipeIngredients($id: String!) {\n    recipe(recipeId: $id) {\n      id\n      ingredients {\n        ...RecipeIngredientFragment\n      }\n    }\n  }\n": types.GetRecipeIngredientsDocument,
    "\n  query getRecipeLabels($id: String!) {\n    recipe(recipeId: $id) {\n      id\n      nutritionLabels {\n        id\n        ingredientGroup {\n          id\n          name\n        }\n        isPrimary\n        servingSize\n        servingSizeUnit {\n          id\n          name\n          symbol\n        }\n        servings\n        servingsUsed\n        nutrients {\n          value\n          nutrient {\n            id\n          }\n        }\n      }\n    }\n  }\n": types.GetRecipeLabelsDocument,
    "\n  fragment RecipeSearchFields on Recipe {\n    id\n    name\n    verified\n    ingredients {\n      id\n      sentence\n      quantity\n      unit {\n        id\n        name\n      }\n    }\n    aggregateLabel {\n      id\n      totalCalories\n      protein\n      fat\n      carbs\n      alcohol\n      servings\n    }\n    photos {\n      id\n      isPrimary\n      url\n    }\n  }\n": types.RecipeSearchFieldsFragmentDoc,
    "\n  query searchRecipes($filters: RecipeFilter, $pagination: OffsetPagination!) {\n    recipes(filter: $filters, pagination: $pagination) {\n      itemsRemaining\n      nextOffset\n      recipes {\n        ...RecipeSearchFields\n      }\n    }\n  }\n": types.SearchRecipesDocument,
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
export function graphql(source: "\n  query GetIngredient($id: String!) {\n    ingredient(ingredientId: $id) {\n      id\n      name\n      alternateNames\n      storageInstructions\n      category {\n        id\n        name\n      }\n      expiration {\n        ...ExpirationRuleFields\n      }\n      priceHistory {\n        id\n        date\n        foodType\n        groceryStore {\n          id\n          name\n        }\n        price\n        pricePerUnit\n        quantity\n        unit {\n          id\n          name\n          symbol\n          conversionName\n          measurementSystem\n          type\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetIngredient($id: String!) {\n    ingredient(ingredientId: $id) {\n      id\n      name\n      alternateNames\n      storageInstructions\n      category {\n        id\n        name\n      }\n      expiration {\n        ...ExpirationRuleFields\n      }\n      priceHistory {\n        id\n        date\n        foodType\n        groceryStore {\n          id\n          name\n        }\n        price\n        pricePerUnit\n        quantity\n        unit {\n          id\n          name\n          symbol\n          conversionName\n          measurementSystem\n          type\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createMealPlan {\n    createMealPlan(name: \"Untitled Meal Plan\") {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation createMealPlan {\n    createMealPlan(name: \"Untitled Meal Plan\") {\n      id\n    }\n  }\n"];
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
export function graphql(source: "\n  query GetMealPlans {\n    mealPlans {\n      id\n      name\n      planRecipes {\n        id\n        originalRecipe {\n          id\n          name\n          photos {\n            id\n            isPrimary\n            url\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetMealPlans {\n    mealPlans {\n      id\n      name\n      planRecipes {\n        id\n        originalRecipe {\n          id\n          name\n          photos {\n            id\n            isPrimary\n            url\n          }\n        }\n      }\n    }\n  }\n"];
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
export function graphql(source: "\n  query getGroceryStores {\n    stores {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  query getGroceryStores {\n    stores {\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createStore($name: String!) {\n    createGroceryStore(name: $name) {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  mutation createStore($name: String!) {\n    createGroceryStore(name: $name) {\n      id\n      name\n    }\n  }\n"];
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
export function graphql(source: "\n  query fetchUnits {\n    units {\n      id\n      name\n      symbol\n      abbreviations\n    }\n  }\n"): (typeof documents)["\n  query fetchUnits {\n    units {\n      id\n      name\n      symbol\n      abbreviations\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createUnit($unit: CreateUnitInput!) {\n    createUnit(input: $unit) {\n      id\n      name\n      symbol\n      abbreviations\n    }\n  }\n"): (typeof documents)["\n  mutation createUnit($unit: CreateUnitInput!) {\n    createUnit(input: $unit) {\n      id\n      name\n      symbol\n      abbreviations\n    }\n  }\n"];
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
export function graphql(source: "\n  mutation changeName($id: String!, $name: String!) {\n    editMealPlan(mealPlan: { id: $id, name: $name }) {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  mutation changeName($id: String!, $name: String!) {\n    editMealPlan(mealPlan: { id: $id, name: $name }) {\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation addRecipeToPlan($recipe: AddRecipeInput!) {\n    addRecipeToMealPlan(recipe: $recipe) {\n      ...MealRecipeFields\n    }\n  }\n"): (typeof documents)["\n  mutation addRecipeToPlan($recipe: AddRecipeInput!) {\n    addRecipeToMealPlan(recipe: $recipe) {\n      ...MealRecipeFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation addServingToPlan($serving: AddRecipeServingInput!) {\n    addRecipeServing(serving: $serving) {\n      day\n      id\n      meal\n      mealPlanRecipeId\n      numberOfServings\n      mealRecipe {\n        id\n        servingsOnPlan\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation addServingToPlan($serving: AddRecipeServingInput!) {\n    addRecipeServing(serving: $serving) {\n      day\n      id\n      meal\n      mealPlanRecipeId\n      numberOfServings\n      mealRecipe {\n        id\n        servingsOnPlan\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation removeServing($id: String!) {\n    deleteRecipeServing(id: $id)\n  }\n"): (typeof documents)["\n  mutation removeServing($id: String!) {\n    deleteRecipeServing(id: $id)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation editServing($serving: EditRecipeServingInput!) {\n    editRecipeServing(serving: $serving) {\n      id\n      day\n      meal\n      numberOfServings\n      mealRecipe {\n        id\n        servingsOnPlan\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation editServing($serving: EditRecipeServingInput!) {\n    editRecipeServing(serving: $serving) {\n      id\n      day\n      meal\n      numberOfServings\n      mealRecipe {\n        id\n        servingsOnPlan\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetCombinedIngredients($mealPlanId: String!) {\n    mealPlanIngredients(mealPlanId: $mealPlanId) {\n      total {\n        qty\n        unit {\n          id\n          name\n          symbol\n        }\n      }\n      recipeIngredients {\n        name\n        factor\n        recipeIngredient {\n          id\n          name\n          quantity\n          sentence\n          unit {\n            id\n            name\n            symbol\n          }\n        }\n      }\n      baseIngredient {\n        id\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetCombinedIngredients($mealPlanId: String!) {\n    mealPlanIngredients(mealPlanId: $mealPlanId) {\n      total {\n        qty\n        unit {\n          id\n          name\n          symbol\n        }\n      }\n      recipeIngredients {\n        name\n        factor\n        recipeIngredient {\n          id\n          name\n          quantity\n          sentence\n          unit {\n            id\n            name\n            symbol\n          }\n        }\n      }\n      baseIngredient {\n        id\n        name\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query GetIngredientCategories {\n      ingredientCategories {\n        id\n        name\n      }\n    }\n  "): (typeof documents)["\n    query GetIngredientCategories {\n      ingredientCategories {\n        id\n        name\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation uploadReceipt($file: File!) {\n    uploadReceipt(file: $file) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation uploadReceipt($file: File!) {\n    uploadReceipt(file: $file) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ReceiptItem on ReceiptLine {\n    id\n    totalPrice\n    description\n    quantity\n    perUnitPrice\n    unitQuantity\n    foodType\n    order\n    matchingUnit {\n      id\n      name\n    }\n    matchingIngredient {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  fragment ReceiptItem on ReceiptLine {\n    id\n    totalPrice\n    description\n    quantity\n    perUnitPrice\n    unitQuantity\n    foodType\n    order\n    matchingUnit {\n      id\n      name\n    }\n    matchingIngredient {\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation editReceiptItem($lineId: String!, $lineItem: UpdateReceiptItem!) {\n      updateReceiptLine(lineId: $lineId, line: $lineItem) {\n        ...ReceiptItem\n      }\n    }\n  "): (typeof documents)["\n    mutation editReceiptItem($lineId: String!, $lineItem: UpdateReceiptItem!) {\n      updateReceiptLine(lineId: $lineId, line: $lineItem) {\n        ...ReceiptItem\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation finalizeReceipt($receiptId: String!) {\n    finalizeReceipt(receiptId: $receiptId) {\n      id\n      imagePath\n      total\n      merchantName\n      matchingStore {\n        id\n        name\n      }\n      date\n      items {\n        ...ReceiptItem\n      }\n      scanned\n    }\n  }\n"): (typeof documents)["\n  mutation finalizeReceipt($receiptId: String!) {\n    finalizeReceipt(receiptId: $receiptId) {\n      id\n      imagePath\n      total\n      merchantName\n      matchingStore {\n        id\n        name\n      }\n      date\n      items {\n        ...ReceiptItem\n      }\n      scanned\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query fetchRecipe($id: String!) {\n    recipe(recipeId: $id) {\n      id\n      ingredients {\n        ...RecipeIngredientFragment\n      }\n    }\n  }\n"): (typeof documents)["\n  query fetchRecipe($id: String!) {\n    recipe(recipeId: $id) {\n      id\n      ingredients {\n        ...RecipeIngredientFragment\n      }\n    }\n  }\n"];
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
export function graphql(source: "\n  query GetMealPlan($mealPlanId: String!) {\n    mealPlan(id: $mealPlanId) {\n      id\n      name\n      mealPrepInstructions\n      mealPlanServings {\n        ...MealPlanServingsField\n      }\n      planRecipes {\n        ...MealRecipeFields\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetMealPlan($mealPlanId: String!) {\n    mealPlan(id: $mealPlanId) {\n      id\n      name\n      mealPrepInstructions\n      mealPlanServings {\n        ...MealPlanServingsField\n      }\n      planRecipes {\n        ...MealRecipeFields\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment MealRecipeFields on MealPlanRecipe {\n    id\n    totalServings\n    factor\n    servingsOnPlan\n    originalRecipe {\n      id\n      name\n      photos {\n        id\n        url\n        isPrimary\n      }\n      ingredientFreshness\n      ingredients {\n        id\n        quantity\n        sentence\n        baseIngredient {\n          id\n          name\n        }\n        unit {\n          id\n          name\n          symbol\n        }\n      }\n      aggregateLabel {\n        id\n        totalCalories\n        fat\n        alcohol\n        carbs\n        protein\n        nutrients {\n          id\n          perServing\n          value\n          nutrient {\n            id\n          }\n        }\n        servings\n        servingSize\n        servingSizeUnit {\n          id\n          name\n          symbol\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment MealRecipeFields on MealPlanRecipe {\n    id\n    totalServings\n    factor\n    servingsOnPlan\n    originalRecipe {\n      id\n      name\n      photos {\n        id\n        url\n        isPrimary\n      }\n      ingredientFreshness\n      ingredients {\n        id\n        quantity\n        sentence\n        baseIngredient {\n          id\n          name\n        }\n        unit {\n          id\n          name\n          symbol\n        }\n      }\n      aggregateLabel {\n        id\n        totalCalories\n        fat\n        alcohol\n        carbs\n        protein\n        nutrients {\n          id\n          perServing\n          value\n          nutrient {\n            id\n          }\n        }\n        servings\n        servingSize\n        servingSizeUnit {\n          id\n          name\n          symbol\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment MealPlanServingsField on MealPlanServing {\n    id\n    day\n    meal\n    numberOfServings\n    mealPlanRecipeId\n  }\n"): (typeof documents)["\n  fragment MealPlanServingsField on MealPlanServing {\n    id\n    day\n    meal\n    numberOfServings\n    mealPlanRecipeId\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment NutrientFields on Nutrient {\n    id\n    alternateNames\n    target {\n      id\n      nutrientTarget\n      preference\n      threshold\n    }\n    dri {\n      id\n      value\n      upperLimit\n    }\n    name\n    important\n    parentNutrientId\n    target {\n      id\n      nutrientTarget\n      preference\n      threshold\n    }\n    type\n    unit {\n      id\n      name\n      symbol\n      abbreviations\n    }\n  }\n"): (typeof documents)["\n  fragment NutrientFields on Nutrient {\n    id\n    alternateNames\n    target {\n      id\n      nutrientTarget\n      preference\n      threshold\n    }\n    dri {\n      id\n      value\n      upperLimit\n    }\n    name\n    important\n    parentNutrientId\n    target {\n      id\n      nutrientTarget\n      preference\n      threshold\n    }\n    type\n    unit {\n      id\n      name\n      symbol\n      abbreviations\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation setRankedNutrients($nutrients: [RankedNutrientInput!]!) {\n      setRankedNutrients(nutrients: $nutrients) {\n        id\n        name\n        unit {\n          id\n          symbol\n        }\n        alternateNames\n      }\n    }\n  "): (typeof documents)["\n    mutation setRankedNutrients($nutrients: [RankedNutrientInput!]!) {\n      setRankedNutrients(nutrients: $nutrients) {\n        id\n        name\n        unit {\n          id\n          symbol\n        }\n        alternateNames\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation setNutrientTarget($target: NutrientTargetInput!) {\n    setNutritionTarget(target: $target) {\n      id\n      target {\n        id\n        nutrientTarget\n        preference\n        threshold\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation setNutrientTarget($target: NutrientTargetInput!) {\n    setNutritionTarget(target: $target) {\n      id\n      target {\n        id\n        nutrientTarget\n        preference\n        threshold\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getNutrients($advanced: Boolean!, $name: String) {\n    nutrients(search: $name, advanced: $advanced) {\n      ...NutrientFields\n    }\n  }\n"): (typeof documents)["\n  query getNutrients($advanced: Boolean!, $name: String) {\n    nutrients(search: $name, advanced: $advanced) {\n      ...NutrientFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query searchNutrients($search: String) {\n    nutrients(advanced: true, search: $search) {\n      id\n      name\n      unit {\n        id\n        symbol\n      }\n      alternateNames\n    }\n  }\n"): (typeof documents)["\n  query searchNutrients($search: String) {\n    nutrients(advanced: true, search: $search) {\n      id\n      name\n      unit {\n        id\n        symbol\n      }\n      alternateNames\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getRankedNutrients {\n    getRankedNutrients {\n      id\n      name\n      unit {\n        id\n        symbol\n      }\n      alternateNames\n    }\n  }\n"): (typeof documents)["\n  query getRankedNutrients {\n    getRankedNutrients {\n      id\n      name\n      unit {\n        id\n        symbol\n      }\n      alternateNames\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation editReceipt($receiptId: String!, $receipt: UpdateReceipt!) {\n      updateReceipt(receipt: $receipt, receiptId: $receiptId) {\n        id\n        imagePath\n        total\n        merchantName\n        matchingStore {\n          id\n          name\n        }\n        date\n        items {\n          ...ReceiptItem\n        }\n        scanned\n      }\n    }\n  "): (typeof documents)["\n    mutation editReceipt($receiptId: String!, $receipt: UpdateReceipt!) {\n      updateReceipt(receipt: $receipt, receiptId: $receiptId) {\n        id\n        imagePath\n        total\n        merchantName\n        matchingStore {\n          id\n          name\n        }\n        date\n        items {\n          ...ReceiptItem\n        }\n        scanned\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getReceipt($id: String!) {\n    receipt(id: $id) {\n      id\n      imagePath\n      total\n      merchantName\n      matchingStore {\n        id\n        name\n      }\n      date\n      items {\n        ...ReceiptItem\n      }\n      scanned\n    }\n  }\n"): (typeof documents)["\n  query getReceipt($id: String!) {\n    receipt(id: $id) {\n      id\n      imagePath\n      total\n      merchantName\n      matchingStore {\n        id\n        name\n      }\n      date\n      items {\n        ...ReceiptItem\n      }\n      scanned\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment RecipeIngredientFragment on RecipeIngredients {\n    id\n    sentence\n    order\n    quantity\n    baseIngredient {\n      id\n      name\n    }\n    unit {\n      id\n      name\n      symbol\n    }\n    group {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  fragment RecipeIngredientFragment on RecipeIngredients {\n    id\n    sentence\n    order\n    quantity\n    baseIngredient {\n      id\n      name\n    }\n    unit {\n      id\n      name\n      symbol\n    }\n    group {\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getRecipe($id: String!) {\n    recipe(recipeId: $id) {\n      id\n      name\n      category {\n        id\n        name\n      }\n      cuisine {\n        id\n        name\n      }\n      cookTime\n      course {\n        id\n        name\n      }\n      directions\n      leftoverFridgeLife\n      leftoverFreezerLife\n      marinadeTime\n      totalTime\n      verified\n      notes\n      photos {\n        id\n        isPrimary\n        url\n      }\n      prepTime\n      source\n      ingredients {\n        ...RecipeIngredientFragment\n      }\n    }\n  }\n"): (typeof documents)["\n  query getRecipe($id: String!) {\n    recipe(recipeId: $id) {\n      id\n      name\n      category {\n        id\n        name\n      }\n      cuisine {\n        id\n        name\n      }\n      cookTime\n      course {\n        id\n        name\n      }\n      directions\n      leftoverFridgeLife\n      leftoverFreezerLife\n      marinadeTime\n      totalTime\n      verified\n      notes\n      photos {\n        id\n        isPrimary\n        url\n      }\n      prepTime\n      source\n      ingredients {\n        ...RecipeIngredientFragment\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getRecipeBaiscInfo($id: String!) {\n    recipe(recipeId: $id) {\n      id\n      name\n      category {\n        id\n        name\n      }\n      cuisine {\n        id\n        name\n      }\n      cookTime\n      course {\n        id\n        name\n      }\n      directions\n      leftoverFridgeLife\n      leftoverFreezerLife\n      marinadeTime\n      totalTime\n      verified\n      notes\n      photos {\n        id\n        isPrimary\n        url\n      }\n      prepTime\n      source\n    }\n  }\n"): (typeof documents)["\n  query getRecipeBaiscInfo($id: String!) {\n    recipe(recipeId: $id) {\n      id\n      name\n      category {\n        id\n        name\n      }\n      cuisine {\n        id\n        name\n      }\n      cookTime\n      course {\n        id\n        name\n      }\n      directions\n      leftoverFridgeLife\n      leftoverFreezerLife\n      marinadeTime\n      totalTime\n      verified\n      notes\n      photos {\n        id\n        isPrimary\n        url\n      }\n      prepTime\n      source\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getRecipeIngredients($id: String!) {\n    recipe(recipeId: $id) {\n      id\n      ingredients {\n        ...RecipeIngredientFragment\n      }\n    }\n  }\n"): (typeof documents)["\n  query getRecipeIngredients($id: String!) {\n    recipe(recipeId: $id) {\n      id\n      ingredients {\n        ...RecipeIngredientFragment\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getRecipeLabels($id: String!) {\n    recipe(recipeId: $id) {\n      id\n      nutritionLabels {\n        id\n        ingredientGroup {\n          id\n          name\n        }\n        isPrimary\n        servingSize\n        servingSizeUnit {\n          id\n          name\n          symbol\n        }\n        servings\n        servingsUsed\n        nutrients {\n          value\n          nutrient {\n            id\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query getRecipeLabels($id: String!) {\n    recipe(recipeId: $id) {\n      id\n      nutritionLabels {\n        id\n        ingredientGroup {\n          id\n          name\n        }\n        isPrimary\n        servingSize\n        servingSizeUnit {\n          id\n          name\n          symbol\n        }\n        servings\n        servingsUsed\n        nutrients {\n          value\n          nutrient {\n            id\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment RecipeSearchFields on Recipe {\n    id\n    name\n    verified\n    ingredients {\n      id\n      sentence\n      quantity\n      unit {\n        id\n        name\n      }\n    }\n    aggregateLabel {\n      id\n      totalCalories\n      protein\n      fat\n      carbs\n      alcohol\n      servings\n    }\n    photos {\n      id\n      isPrimary\n      url\n    }\n  }\n"): (typeof documents)["\n  fragment RecipeSearchFields on Recipe {\n    id\n    name\n    verified\n    ingredients {\n      id\n      sentence\n      quantity\n      unit {\n        id\n        name\n      }\n    }\n    aggregateLabel {\n      id\n      totalCalories\n      protein\n      fat\n      carbs\n      alcohol\n      servings\n    }\n    photos {\n      id\n      isPrimary\n      url\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query searchRecipes($filters: RecipeFilter, $pagination: OffsetPagination!) {\n    recipes(filter: $filters, pagination: $pagination) {\n      itemsRemaining\n      nextOffset\n      recipes {\n        ...RecipeSearchFields\n      }\n    }\n  }\n"): (typeof documents)["\n  query searchRecipes($filters: RecipeFilter, $pagination: OffsetPagination!) {\n    recipes(filter: $filters, pagination: $pagination) {\n      itemsRemaining\n      nextOffset\n      recipes {\n        ...RecipeSearchFields\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;