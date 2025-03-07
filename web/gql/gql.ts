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
    "\n  fragment PhotoFields on Photo {\n    id\n    isPrimary\n    url\n  }\n": types.PhotoFieldsFragmentDoc,
    "\n  mutation uploadPhoto($file: File!) {\n    uploadPhoto(photo: $file, isPrimary: false) {\n      id\n      url\n      isPrimary\n    }\n  }\n": types.UploadPhotoDocument,
    "\n  query fetchUnits {\n    units {\n      id\n      name\n      symbol\n    }\n  }\n": types.FetchUnitsDocument,
    "\n  mutation createUnit($unit: CreateUnitInput!) {\n    createUnit(input: $unit) {\n      id\n      name\n      symbol\n    }\n  }\n": types.CreateUnitDocument,
    "\n  fragment ExpirationRuleFields on ExpirationRule {\n    id\n    name\n    variation\n    defrostTime\n    perishable\n    tableLife\n    fridgeLife\n    freezerLife\n  }\n": types.ExpirationRuleFieldsFragmentDoc,
    "\n  query GetExpirationRules {\n    expirationRules {\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n      edges {\n        node {\n          ...ExpirationRuleFields\n        }\n      }\n    }\n  }\n": types.GetExpirationRulesDocument,
    "\n    mutation CreateExpirationRule($input: ExpirationRuleInput!) {\n      createExpirationRule(rule: $input) {\n        ...ExpirationRuleFields\n      }\n    }\n  ": types.CreateExpirationRuleDocument,
    "\n    mutation EditExpirationRule($id: ID!, $input: ExpirationRuleInput!) {\n      editExpirationRule(ruleId: $id, expirationRule: $input) {\n        ...ExpirationRuleFields\n      }\n    }\n  ": types.EditExpirationRuleDocument,
    "\n    mutation DeleteRule($id: ID!) {\n      deleteExpirationRule(expirationRuleId: $id) {\n        success\n        message\n      }\n    }\n  ": types.DeleteRuleDocument,
    "\n  query getGroceryStores($search: String, $after: String, $first: Int) {\n    stores(search: $search, after: $after, first: $first) {\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n      edges {\n        node {\n          id\n          name\n        }\n      }\n    }\n  }\n": types.GetGroceryStoresDocument,
    "\n  mutation createStore($name: String!) {\n    createGroceryStore(name: $name) {\n      id\n      name\n    }\n  }\n": types.CreateStoreDocument,
    "\n  fragment IngredientFields on Ingredient {\n    id\n    name\n    alternateNames\n    storageInstructions\n    category {\n      id\n      name\n    }\n    expiration {\n      ...ExpirationRuleFields\n    }\n    priceHistory {\n      id\n      date\n      foodType\n      groceryStore {\n        id\n        name\n      }\n      price\n      pricePerUnit\n      quantity\n      unit {\n        id\n        name\n        symbol\n        conversionName\n        measurementSystem\n        type\n      }\n    }\n  }\n": types.IngredientFieldsFragmentDoc,
    "\n  query GetIngredient($id: ID!) {\n    ingredient(ingredientId: $id) {\n      ...IngredientFields\n    }\n  }\n": types.GetIngredientDocument,
    "\n  query GetIngredients($search: String, $after: String, $first: Int) {\n    ingredients(search: $search, after: $after, first: $first) {\n      totalCount\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n      edges {\n        node {\n          id\n          name\n        }\n      }\n    }\n  }\n": types.GetIngredientsDocument,
    "\n  query GetAllIngredients {\n    allIngredients {\n      id\n      name\n      category {\n        id\n        name\n      }\n      expiration {\n        id\n        perishable\n        tableLife\n        fridgeLife\n        freezerLife\n        longestLife\n      }\n    }\n  }\n": types.GetAllIngredientsDocument,
    "\n    mutation EditIngredient($id: ID!, $input: IngredientInput!) {\n      editIngredient(id: $id, ingredient: $input) {\n        ...IngredientFields\n      }\n    }\n  ": types.EditIngredientDocument,
    "\n  mutation CreateIngredient($input: IngredientInput!) {\n    createIngredient(ingredient: $input) {\n      ...IngredientFields\n    }\n  }\n": types.CreateIngredientDocument,
    "\n  mutation deleteIngredient($id: ID!) {\n    deleteIngredient(ingredientId: $id) {\n      message\n      success\n    }\n  }\n": types.DeleteIngredientDocument,
    "\n  query GetIngredientCategory {\n    ingredientCategories {\n      id\n      name\n    }\n  }\n": types.GetIngredientCategoryDocument,
    "\n  fragment MealRecipeFields on MealPlanRecipe {\n    id\n    totalServings\n    factor\n    servingsOnPlan\n    originalRecipe {\n      id\n      name\n      photos {\n        id\n        url\n        isPrimary\n      }\n      ingredientFreshness\n      ingredients {\n        id\n        quantity\n        sentence\n        baseIngredient {\n          id\n          name\n        }\n        unit {\n          id\n          name\n          symbol\n        }\n      }\n      aggregateLabel {\n        id\n        totalCalories\n        fat\n        alcohol\n        carbs\n        protein\n        nutrients {\n          id\n          perServing\n          value\n          nutrient {\n            id\n          }\n        }\n        servings\n        servingSize\n        servingSizeUnit {\n          id\n          name\n          symbol\n        }\n      }\n    }\n  }\n": types.MealRecipeFieldsFragmentDoc,
    "\n  query GetMealPlan($mealPlanId: ID!) {\n    mealPlan(id: $mealPlanId) {\n      id\n      name\n      mealPrepInstructions\n    }\n  }\n": types.GetMealPlanDocument,
    "\n  query GetMealPlanInfo($mealPlanId: ID!) {\n    mealPlan(id: $mealPlanId) {\n      id\n      name\n      mealPrepInstructions\n    }\n  }\n": types.GetMealPlanInfoDocument,
    "\n  mutation createMealPlan($input: CreateMealPlanInput!) {\n    createMealPlan(mealPlan: $input) {\n      id\n    }\n  }\n": types.CreateMealPlanDocument,
    "\n  mutation editMealPlan($id: ID!, $mealPlan: EditMealPlanInput!) {\n    editMealPlan(id: $id, mealPlan: $mealPlan) {\n      id\n      name\n      mealPrepInstructions\n    }\n  }\n": types.EditMealPlanDocument,
    "\n  query GetMealPlans {\n    mealPlans {\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n      edges {\n        node {\n          id\n          name\n          planRecipes {\n            id\n            originalRecipe {\n              id\n              name\n              photos {\n                id\n                url\n                isPrimary\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n": types.GetMealPlansDocument,
    "\n  fragment MealPlanRecipeFields on MealPlanRecipe {\n    id\n    totalServings\n    mealPlan {\n      id\n    }\n    factor\n    servingsOnPlan\n    originalRecipe {\n      id\n      name\n      directions\n      notes\n      source\n      leftoverFridgeLife\n      leftoverFreezerLife\n      prepTime\n      marinadeTime\n      cookTime\n      photos {\n        id\n        url\n        isPrimary\n      }\n      ingredientFreshness\n      ingredients {\n        ...RecipeIngredientFields\n      }\n      aggregateLabel {\n        id\n        totalCalories\n        fat\n        alcohol\n        carbs\n        protein\n        servings\n        servingSize\n        servingSizeUnit {\n          id\n          name\n          symbol\n        }\n      }\n    }\n  }\n": types.MealPlanRecipeFieldsFragmentDoc,
    "\n  fragment BasicPlanRecipeFields on MealPlanRecipe {\n    id\n    mealPlan {\n      id\n    }\n    totalServings\n    servingsOnPlan\n    originalRecipe {\n      id\n      name\n      photos {\n        id\n        url\n        isPrimary\n      }\n    }\n  }\n": types.BasicPlanRecipeFieldsFragmentDoc,
    "\n  fragment PlanNutritionFields on MealPlanRecipe {\n    id\n    totalServings\n    mealPlan {\n      id\n    }\n    factor\n    originalRecipe {\n      id\n      aggregateLabel {\n        id\n        totalCalories\n        fat\n        alcohol\n        carbs\n        protein\n        nutrients {\n          id\n          perServing\n          value\n          nutrient {\n            id\n          }\n        }\n      }\n    }\n  }\n": types.PlanNutritionFieldsFragmentDoc,
    "\n  query GetBasicPlanRecipeInfo($mealPlanId: ID!) {\n    mealPlanRecipes(mealPlanId: $mealPlanId) {\n      ...BasicPlanRecipeFields\n    }\n  }\n": types.GetBasicPlanRecipeInfoDocument,
    "\n  query GetMealPlanRecipes($mealPlanId: ID!) {\n    mealPlanRecipes(mealPlanId: $mealPlanId) {\n      ...MealPlanRecipeFields\n    }\n  }\n": types.GetMealPlanRecipesDocument,
    "\n  query GetMealPlanRecipeNutrition($mealPlanRecipeId: ID!) {\n    mealPlanRecipes(mealPlanId: $mealPlanRecipeId) {\n      ...PlanNutritionFields\n    }\n  }\n": types.GetMealPlanRecipeNutritionDocument,
    "\n  mutation addRecipeToPlan($mealPlanId: ID!, $recipe: AddRecipeToPlanInput!) {\n    addRecipeToMealPlan(mealPlanId: $mealPlanId, recipe: $recipe) {\n      mealPlan {\n        id\n      }\n      ...MealPlanRecipeFields\n    }\n  }\n": types.AddRecipeToPlanDocument,
    "\n  mutation editMealPlanRecipe($id: ID!, $recipe: EditMealPlanRecipeInput!) {\n    editMealPlanRecipe(id: $id, recipe: $recipe) {\n      ...MealPlanRecipeFields\n    }\n  }\n": types.EditMealPlanRecipeDocument,
    "\n  mutation removeMealPlanRecipe($id: ID!) {\n    removeMealPlanRecipe(id: $id) {\n      id\n      success\n    }\n  }\n": types.RemoveMealPlanRecipeDocument,
    "\n  fragment MealPlanServingsField on MealPlanServing {\n    id\n    day\n    meal\n    numberOfServings\n    mealPlanRecipeId\n  }\n": types.MealPlanServingsFieldFragmentDoc,
    "\n  query getServings($mealPlanId: ID!, $filter: ServingsFilterInput) {\n    mealPlanServings(mealPlanId: $mealPlanId, filter: $filter) {\n      ...MealPlanServingsField\n    }\n  }\n": types.GetServingsDocument,
    "\n  mutation addServingToPlan($serving: AddRecipeServingInput!) {\n    addRecipeServing(serving: $serving) {\n      day\n      id\n      meal\n      mealPlanRecipeId\n      numberOfServings\n      mealRecipe {\n        id\n        servingsOnPlan\n      }\n    }\n  }\n": types.AddServingToPlanDocument,
    "\n  mutation removeServing($id: ID!) {\n    deleteRecipeServing(id: $id) {\n      id\n      success\n    }\n  }\n": types.RemoveServingDocument,
    "\n  mutation editServing($id: ID!, $serving: EditRecipeServingInput!) {\n    editRecipeServing(id: $id, serving: $serving) {\n      id\n      day\n      meal\n      numberOfServings\n      mealRecipe {\n        id\n        servingsOnPlan\n      }\n    }\n  }\n": types.EditServingDocument,
    "\n  fragment NutrientTargetFields on NutrientGoal {\n    nutrientId\n    dri {\n      id\n      upperLimit\n      value\n    }\n    target {\n      id\n      nutrientTarget\n      preference\n      threshold\n    }\n  }\n": types.NutrientTargetFieldsFragmentDoc,
    "\n  query getNutrientTargets {\n    nutritionTargets {\n      alcohol {\n        ...NutrientTargetFields\n      }\n      fat {\n        ...NutrientTargetFields\n      }\n      calories {\n        ...NutrientTargetFields\n      }\n      carbs {\n        ...NutrientTargetFields\n      }\n      protein {\n        ...NutrientTargetFields\n      }\n      nutrients {\n        ...NutrientTargetFields\n      }\n    }\n  }\n": types.GetNutrientTargetsDocument,
    "\n  mutation setNutrientTarget($id: ID!, $target: NutrientTargetInput!) {\n    setNutritionTarget(nutrientId: $id, target: $target) {\n      id\n      target {\n        id\n        nutrientTarget\n        preference\n        threshold\n      }\n    }\n  }\n": types.SetNutrientTargetDocument,
    "\n    query GetIngredientCategories {\n      ingredientCategories {\n        id\n        name\n      }\n    }\n  ": types.GetIngredientCategoriesDocument,
    "\n  fragment NutrientFields on Nutrient {\n    id\n    alternateNames\n    advancedView\n    target {\n      id\n      nutrientTarget\n      preference\n      threshold\n    }\n    dri {\n      id\n      value\n      upperLimit\n    }\n    name\n    important\n    parentNutrientId\n    type\n    unit {\n      id\n      name\n      symbol\n      abbreviations\n    }\n  }\n": types.NutrientFieldsFragmentDoc,
    "\n  query getNutrients($advanced: Boolean!, $name: String, $favorites: Boolean) {\n    nutrients(search: $name, advanced: $advanced, favorites: $favorites) {\n      ...NutrientFields\n    }\n  }\n": types.GetNutrientsDocument,
    "\n  query searchNutrients($search: String) {\n    nutrients(advanced: true, search: $search) {\n      id\n      name\n      unit {\n        id\n        symbol\n      }\n      alternateNames\n    }\n  }\n": types.SearchNutrientsDocument,
    "\n  query getRankedNutrients {\n    rankedNutrients {\n      id\n      name\n      unit {\n        id\n        symbol\n      }\n      alternateNames\n    }\n  }\n": types.GetRankedNutrientsDocument,
    "\n    mutation setRankedNutrients($nutrients: [RankedNutrientInput!]!) {\n      setRankedNutrients(nutrients: $nutrients) {\n        id\n        name\n        unit {\n          id\n          symbol\n        }\n        alternateNames\n      }\n    }\n  ": types.SetRankedNutrientsDocument,
    "\n  fragment ReceiptItem on ReceiptLine {\n    id\n    totalPrice\n    description\n    quantity\n    perUnitPrice\n    unitQuantity\n    foodType\n    order\n    verified\n    ignore\n    boundingBoxes {\n      coordinates {\n        x\n        y\n      }\n    }\n    matchingUnit {\n      id\n      name\n    }\n    matchingIngredient {\n      id\n      name\n    }\n  }\n": types.ReceiptItemFragmentDoc,
    "\n  query getReceipt($id: ID!) {\n    receipt(id: $id) {\n      id\n      imagePath\n      total\n      merchantName\n      matchingStore {\n        id\n        name\n      }\n      date\n      items {\n        ...ReceiptItem\n      }\n      scanned\n      verified\n    }\n  }\n": types.GetReceiptDocument,
    "\n  query getReceipts {\n    receipts {\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n      edges {\n        node {\n          id\n          date\n          dateUploaded\n          matchingStore {\n            id\n            name\n          }\n          total\n          verified\n        }\n      }\n    }\n  }\n": types.GetReceiptsDocument,
    "\n    mutation editReceiptItem($lineId: ID!, $lineItem: ReceiptItemInput!) {\n      updateReceiptLine(lineId: $lineId, line: $lineItem) {\n        ...ReceiptItem\n      }\n    }\n  ": types.EditReceiptItemDocument,
    "\n  mutation finalizeReceipt($receiptId: ID!) {\n    finalizeReceipt(receiptId: $receiptId) {\n      id\n      imagePath\n      total\n      merchantName\n      matchingStore {\n        id\n        name\n      }\n      date\n      items {\n        ...ReceiptItem\n      }\n      scanned\n    }\n  }\n": types.FinalizeReceiptDocument,
    "\n  mutation uploadReceipt($file: File!) {\n    uploadReceipt(file: $file) {\n      id\n    }\n  }\n": types.UploadReceiptDocument,
    "\n  query getCategories($search: String) {\n    categories(search: $search) {\n      id\n      name\n    }\n  }\n": types.GetCategoriesDocument,
    "\n  mutation createCategory($name: String!) {\n    createCategory(name: $name) {\n      id\n      name\n    }\n  }\n": types.CreateCategoryDocument,
    "\n  query getCourses($search: String) {\n    courses(searchString: $search) {\n      id\n      name\n    }\n  }\n": types.GetCoursesDocument,
    "\n  mutation createCourse($name: String!) {\n    createCourse(name: $name) {\n      id\n      name\n    }\n  }\n": types.CreateCourseDocument,
    "\n  query getCuisines($search: String) {\n    cuisines(searchString: $search) {\n      id\n      name\n    }\n  }\n": types.GetCuisinesDocument,
    "\n  mutation createCuisine($name: String!) {\n    createCuisine(name: $name) {\n      id\n      name\n    }\n  }\n": types.CreateCuisineDocument,
    "\n  fragment NutritionLabelFields on NutritionLabel {\n    id\n    ingredientGroup {\n      id\n      name\n    }\n    isPrimary\n    servingSize\n    servingSizeUnit {\n      id\n      name\n      symbol\n    }\n    servings\n    servingsUsed\n    nutrients {\n      value\n      nutrient {\n        id\n      }\n    }\n  }\n": types.NutritionLabelFieldsFragmentDoc,
    "\n  mutation createNutritionLabel($input: NutritionLabelInput!) {\n    createNutritionLabel(nutritionLabel: $input) {\n      ...NutritionLabelFields\n    }\n  }\n": types.CreateNutritionLabelDocument,
    "\n  mutation editNutritionLabel($id: ID!, $label: NutritionLabelInput!) {\n    editNutritionLabel(id: $id, label: $label) {\n      ...NutritionLabelFields\n    }\n  }\n": types.EditNutritionLabelDocument,
    "\n  fragment RecipeFields on Recipe {\n    id\n    name\n    category {\n      id\n      name\n    }\n    cuisine {\n      id\n      name\n    }\n    cookTime\n    course {\n      id\n      name\n    }\n    directions\n    leftoverFridgeLife\n    leftoverFreezerLife\n    marinadeTime\n    ingredientText\n    verified\n    notes\n    photos {\n      id\n      isPrimary\n      url\n    }\n    prepTime\n    source\n    ingredientGroups {\n      id\n      name\n    }\n    ingredients {\n      ...RecipeIngredientFields\n    }\n    nutritionLabels {\n      ...NutritionLabelFields\n    }\n    aggregateLabel {\n      id\n      alcohol\n      servings\n      totalCalories\n      carbs\n      fat\n      protein\n      servingSize\n      servingSizeUnit {\n        id\n        name\n        symbol\n      }\n      nutrients {\n        id\n        value\n        nutrient {\n          id\n        }\n      }\n    }\n  }\n": types.RecipeFieldsFragmentDoc,
    "\n  mutation createRecipe($input: RecipeInput!) {\n    createRecipe(recipe: $input) {\n      ...RecipeFields\n    }\n  }\n": types.CreateRecipeDocument,
    "\n  query getRecipe($id: ID!) {\n    recipe(recipeId: $id) {\n      ...RecipeFields\n    }\n  }\n": types.GetRecipeDocument,
    "\n  mutation editRecipe($recipe: RecipeInput!, $id: ID!) {\n    editRecipe(recipeId: $id, recipe: $recipe) {\n      ...RecipeFields\n    }\n  }\n": types.EditRecipeDocument,
    "\n  query getRecipeBaiscInfo($id: ID!) {\n    recipe(recipeId: $id) {\n      id\n      name\n      cookTime\n      directions\n      leftoverFridgeLife\n      leftoverFreezerLife\n      marinadeTime\n      verified\n      ingredients {\n        ...RecipeIngredientFields\n      }\n      notes\n      photos {\n        id\n        isPrimary\n        url\n      }\n      aggregateLabel {\n        id\n        servings\n        totalCalories\n        protein\n        fat\n        carbs\n        alcohol\n      }\n      prepTime\n      source\n    }\n  }\n": types.GetRecipeBaiscInfoDocument,
    "\n  query getRecipeLabels($id: ID!) {\n    recipe(recipeId: $id) {\n      id\n      nutritionLabels {\n        id\n        ingredientGroup {\n          id\n          name\n        }\n        isPrimary\n        servingSize\n        servingSizeUnit {\n          id\n          name\n          symbol\n        }\n        servings\n        servingsUsed\n        nutrients {\n          value\n          nutrient {\n            id\n          }\n        }\n      }\n    }\n  }\n": types.GetRecipeLabelsDocument,
    "\n  fragment RecipeSearchFields on Recipe {\n    id\n    name\n    verified\n    ingredients {\n      id\n      sentence\n      quantity\n      unit {\n        id\n        name\n      }\n    }\n    aggregateLabel {\n      id\n      totalCalories\n      protein\n      fat\n      carbs\n      alcohol\n      servings\n    }\n    photos {\n      id\n      isPrimary\n      url\n    }\n  }\n": types.RecipeSearchFieldsFragmentDoc,
    "\n  query searchRecipes($filters: RecipeFilter!, $after: String, $first: Int) {\n    recipes(filter: $filters, after: $after, first: $first) {\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n      edges {\n        cursor\n        node {\n          ...RecipeSearchFields\n        }\n      }\n    }\n  }\n": types.SearchRecipesDocument,
    "\n  fragment RecipeIngredientFields on RecipeIngredient {\n    id\n    sentence\n    order\n    quantity\n    verified\n    mealPrepIngredient\n    baseIngredient {\n      id\n      name\n    }\n    unit {\n      id\n      name\n      symbol\n    }\n    group {\n      id\n      name\n    }\n    recipe {\n      id\n    }\n  }\n": types.RecipeIngredientFieldsFragmentDoc,
    "\n  query parseIngredients($lines: String!) {\n    tagIngredients(ingredientTxt: $lines) {\n      order\n      quantity\n      sentence\n      unit {\n        id\n        name\n      }\n      ingredient {\n        id\n        name\n      }\n    }\n  }\n": types.ParseIngredientsDocument,
    "\n  query getRecipeIngredients($id: ID!) {\n    recipe(recipeId: $id) {\n      id\n      ingredients {\n        ...RecipeIngredientFields\n      }\n    }\n  }\n": types.GetRecipeIngredientsDocument,
    "\n  mutation createRecipeIngredient(\n    $recipeId: ID!\n    $ingredient: String!\n    $groupId: ID\n  ) {\n    addRecipeIngredientsFromTxt(\n      recipeId: $recipeId\n      text: $ingredient\n      groupId: $groupId\n    ) {\n      ...RecipeIngredientFields\n    }\n  }\n": types.CreateRecipeIngredientDocument,
    "\n  mutation editRecipeIngredient($input: [EditRecipeIngredientsInput!]!) {\n    editRecipeIngredients(ingredients: $input) {\n      ...RecipeIngredientFields\n    }\n  }\n": types.EditRecipeIngredientDocument,
    "\n  mutation deleteRecipeIngredient($id: ID!) {\n    deleteRecipeIngredient(ingredientId: $id) {\n      success\n    }\n  }\n": types.DeleteRecipeIngredientDocument,
    "\n  mutation createIngredientGroup($name: String!, $recipeId: ID!) {\n    createIngredientGroup(name: $name, recipeId: $recipeId) {\n      id\n      name\n      recipe {\n        id\n      }\n      ingredients {\n        id\n      }\n    }\n  }\n": types.CreateIngredientGroupDocument,
    "\n  mutation deleteIngredientGroup($groupId: ID!) {\n    deleteRecipeIngredientGroup(groupId: $groupId) {\n      success\n    }\n  }\n": types.DeleteIngredientGroupDocument,
    "\n  mutation editIngredientGroup($name: String!, $groupId: ID!) {\n    editRecipeIngredientGroup(name: $name, groupId: $groupId) {\n      id\n      name\n      recipe {\n        id\n      }\n      ingredients {\n        id\n      }\n    }\n  }\n": types.EditIngredientGroupDocument,
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
export function graphql(source: "\n  fragment PhotoFields on Photo {\n    id\n    isPrimary\n    url\n  }\n"): (typeof documents)["\n  fragment PhotoFields on Photo {\n    id\n    isPrimary\n    url\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation uploadPhoto($file: File!) {\n    uploadPhoto(photo: $file, isPrimary: false) {\n      id\n      url\n      isPrimary\n    }\n  }\n"): (typeof documents)["\n  mutation uploadPhoto($file: File!) {\n    uploadPhoto(photo: $file, isPrimary: false) {\n      id\n      url\n      isPrimary\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query fetchUnits {\n    units {\n      id\n      name\n      symbol\n    }\n  }\n"): (typeof documents)["\n  query fetchUnits {\n    units {\n      id\n      name\n      symbol\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createUnit($unit: CreateUnitInput!) {\n    createUnit(input: $unit) {\n      id\n      name\n      symbol\n    }\n  }\n"): (typeof documents)["\n  mutation createUnit($unit: CreateUnitInput!) {\n    createUnit(input: $unit) {\n      id\n      name\n      symbol\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ExpirationRuleFields on ExpirationRule {\n    id\n    name\n    variation\n    defrostTime\n    perishable\n    tableLife\n    fridgeLife\n    freezerLife\n  }\n"): (typeof documents)["\n  fragment ExpirationRuleFields on ExpirationRule {\n    id\n    name\n    variation\n    defrostTime\n    perishable\n    tableLife\n    fridgeLife\n    freezerLife\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetExpirationRules {\n    expirationRules {\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n      edges {\n        node {\n          ...ExpirationRuleFields\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetExpirationRules {\n    expirationRules {\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n      edges {\n        node {\n          ...ExpirationRuleFields\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation CreateExpirationRule($input: ExpirationRuleInput!) {\n      createExpirationRule(rule: $input) {\n        ...ExpirationRuleFields\n      }\n    }\n  "): (typeof documents)["\n    mutation CreateExpirationRule($input: ExpirationRuleInput!) {\n      createExpirationRule(rule: $input) {\n        ...ExpirationRuleFields\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation EditExpirationRule($id: ID!, $input: ExpirationRuleInput!) {\n      editExpirationRule(ruleId: $id, expirationRule: $input) {\n        ...ExpirationRuleFields\n      }\n    }\n  "): (typeof documents)["\n    mutation EditExpirationRule($id: ID!, $input: ExpirationRuleInput!) {\n      editExpirationRule(ruleId: $id, expirationRule: $input) {\n        ...ExpirationRuleFields\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation DeleteRule($id: ID!) {\n      deleteExpirationRule(expirationRuleId: $id) {\n        success\n        message\n      }\n    }\n  "): (typeof documents)["\n    mutation DeleteRule($id: ID!) {\n      deleteExpirationRule(expirationRuleId: $id) {\n        success\n        message\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getGroceryStores($search: String, $after: String, $first: Int) {\n    stores(search: $search, after: $after, first: $first) {\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n      edges {\n        node {\n          id\n          name\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query getGroceryStores($search: String, $after: String, $first: Int) {\n    stores(search: $search, after: $after, first: $first) {\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n      edges {\n        node {\n          id\n          name\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createStore($name: String!) {\n    createGroceryStore(name: $name) {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  mutation createStore($name: String!) {\n    createGroceryStore(name: $name) {\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment IngredientFields on Ingredient {\n    id\n    name\n    alternateNames\n    storageInstructions\n    category {\n      id\n      name\n    }\n    expiration {\n      ...ExpirationRuleFields\n    }\n    priceHistory {\n      id\n      date\n      foodType\n      groceryStore {\n        id\n        name\n      }\n      price\n      pricePerUnit\n      quantity\n      unit {\n        id\n        name\n        symbol\n        conversionName\n        measurementSystem\n        type\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment IngredientFields on Ingredient {\n    id\n    name\n    alternateNames\n    storageInstructions\n    category {\n      id\n      name\n    }\n    expiration {\n      ...ExpirationRuleFields\n    }\n    priceHistory {\n      id\n      date\n      foodType\n      groceryStore {\n        id\n        name\n      }\n      price\n      pricePerUnit\n      quantity\n      unit {\n        id\n        name\n        symbol\n        conversionName\n        measurementSystem\n        type\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetIngredient($id: ID!) {\n    ingredient(ingredientId: $id) {\n      ...IngredientFields\n    }\n  }\n"): (typeof documents)["\n  query GetIngredient($id: ID!) {\n    ingredient(ingredientId: $id) {\n      ...IngredientFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetIngredients($search: String, $after: String, $first: Int) {\n    ingredients(search: $search, after: $after, first: $first) {\n      totalCount\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n      edges {\n        node {\n          id\n          name\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetIngredients($search: String, $after: String, $first: Int) {\n    ingredients(search: $search, after: $after, first: $first) {\n      totalCount\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n      edges {\n        node {\n          id\n          name\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetAllIngredients {\n    allIngredients {\n      id\n      name\n      category {\n        id\n        name\n      }\n      expiration {\n        id\n        perishable\n        tableLife\n        fridgeLife\n        freezerLife\n        longestLife\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetAllIngredients {\n    allIngredients {\n      id\n      name\n      category {\n        id\n        name\n      }\n      expiration {\n        id\n        perishable\n        tableLife\n        fridgeLife\n        freezerLife\n        longestLife\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation EditIngredient($id: ID!, $input: IngredientInput!) {\n      editIngredient(id: $id, ingredient: $input) {\n        ...IngredientFields\n      }\n    }\n  "): (typeof documents)["\n    mutation EditIngredient($id: ID!, $input: IngredientInput!) {\n      editIngredient(id: $id, ingredient: $input) {\n        ...IngredientFields\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateIngredient($input: IngredientInput!) {\n    createIngredient(ingredient: $input) {\n      ...IngredientFields\n    }\n  }\n"): (typeof documents)["\n  mutation CreateIngredient($input: IngredientInput!) {\n    createIngredient(ingredient: $input) {\n      ...IngredientFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation deleteIngredient($id: ID!) {\n    deleteIngredient(ingredientId: $id) {\n      message\n      success\n    }\n  }\n"): (typeof documents)["\n  mutation deleteIngredient($id: ID!) {\n    deleteIngredient(ingredientId: $id) {\n      message\n      success\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetIngredientCategory {\n    ingredientCategories {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  query GetIngredientCategory {\n    ingredientCategories {\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment MealRecipeFields on MealPlanRecipe {\n    id\n    totalServings\n    factor\n    servingsOnPlan\n    originalRecipe {\n      id\n      name\n      photos {\n        id\n        url\n        isPrimary\n      }\n      ingredientFreshness\n      ingredients {\n        id\n        quantity\n        sentence\n        baseIngredient {\n          id\n          name\n        }\n        unit {\n          id\n          name\n          symbol\n        }\n      }\n      aggregateLabel {\n        id\n        totalCalories\n        fat\n        alcohol\n        carbs\n        protein\n        nutrients {\n          id\n          perServing\n          value\n          nutrient {\n            id\n          }\n        }\n        servings\n        servingSize\n        servingSizeUnit {\n          id\n          name\n          symbol\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment MealRecipeFields on MealPlanRecipe {\n    id\n    totalServings\n    factor\n    servingsOnPlan\n    originalRecipe {\n      id\n      name\n      photos {\n        id\n        url\n        isPrimary\n      }\n      ingredientFreshness\n      ingredients {\n        id\n        quantity\n        sentence\n        baseIngredient {\n          id\n          name\n        }\n        unit {\n          id\n          name\n          symbol\n        }\n      }\n      aggregateLabel {\n        id\n        totalCalories\n        fat\n        alcohol\n        carbs\n        protein\n        nutrients {\n          id\n          perServing\n          value\n          nutrient {\n            id\n          }\n        }\n        servings\n        servingSize\n        servingSizeUnit {\n          id\n          name\n          symbol\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetMealPlan($mealPlanId: ID!) {\n    mealPlan(id: $mealPlanId) {\n      id\n      name\n      mealPrepInstructions\n    }\n  }\n"): (typeof documents)["\n  query GetMealPlan($mealPlanId: ID!) {\n    mealPlan(id: $mealPlanId) {\n      id\n      name\n      mealPrepInstructions\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetMealPlanInfo($mealPlanId: ID!) {\n    mealPlan(id: $mealPlanId) {\n      id\n      name\n      mealPrepInstructions\n    }\n  }\n"): (typeof documents)["\n  query GetMealPlanInfo($mealPlanId: ID!) {\n    mealPlan(id: $mealPlanId) {\n      id\n      name\n      mealPrepInstructions\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createMealPlan($input: CreateMealPlanInput!) {\n    createMealPlan(mealPlan: $input) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation createMealPlan($input: CreateMealPlanInput!) {\n    createMealPlan(mealPlan: $input) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation editMealPlan($id: ID!, $mealPlan: EditMealPlanInput!) {\n    editMealPlan(id: $id, mealPlan: $mealPlan) {\n      id\n      name\n      mealPrepInstructions\n    }\n  }\n"): (typeof documents)["\n  mutation editMealPlan($id: ID!, $mealPlan: EditMealPlanInput!) {\n    editMealPlan(id: $id, mealPlan: $mealPlan) {\n      id\n      name\n      mealPrepInstructions\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetMealPlans {\n    mealPlans {\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n      edges {\n        node {\n          id\n          name\n          planRecipes {\n            id\n            originalRecipe {\n              id\n              name\n              photos {\n                id\n                url\n                isPrimary\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetMealPlans {\n    mealPlans {\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n      edges {\n        node {\n          id\n          name\n          planRecipes {\n            id\n            originalRecipe {\n              id\n              name\n              photos {\n                id\n                url\n                isPrimary\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment MealPlanRecipeFields on MealPlanRecipe {\n    id\n    totalServings\n    mealPlan {\n      id\n    }\n    factor\n    servingsOnPlan\n    originalRecipe {\n      id\n      name\n      directions\n      notes\n      source\n      leftoverFridgeLife\n      leftoverFreezerLife\n      prepTime\n      marinadeTime\n      cookTime\n      photos {\n        id\n        url\n        isPrimary\n      }\n      ingredientFreshness\n      ingredients {\n        ...RecipeIngredientFields\n      }\n      aggregateLabel {\n        id\n        totalCalories\n        fat\n        alcohol\n        carbs\n        protein\n        servings\n        servingSize\n        servingSizeUnit {\n          id\n          name\n          symbol\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment MealPlanRecipeFields on MealPlanRecipe {\n    id\n    totalServings\n    mealPlan {\n      id\n    }\n    factor\n    servingsOnPlan\n    originalRecipe {\n      id\n      name\n      directions\n      notes\n      source\n      leftoverFridgeLife\n      leftoverFreezerLife\n      prepTime\n      marinadeTime\n      cookTime\n      photos {\n        id\n        url\n        isPrimary\n      }\n      ingredientFreshness\n      ingredients {\n        ...RecipeIngredientFields\n      }\n      aggregateLabel {\n        id\n        totalCalories\n        fat\n        alcohol\n        carbs\n        protein\n        servings\n        servingSize\n        servingSizeUnit {\n          id\n          name\n          symbol\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment BasicPlanRecipeFields on MealPlanRecipe {\n    id\n    mealPlan {\n      id\n    }\n    totalServings\n    servingsOnPlan\n    originalRecipe {\n      id\n      name\n      photos {\n        id\n        url\n        isPrimary\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment BasicPlanRecipeFields on MealPlanRecipe {\n    id\n    mealPlan {\n      id\n    }\n    totalServings\n    servingsOnPlan\n    originalRecipe {\n      id\n      name\n      photos {\n        id\n        url\n        isPrimary\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment PlanNutritionFields on MealPlanRecipe {\n    id\n    totalServings\n    mealPlan {\n      id\n    }\n    factor\n    originalRecipe {\n      id\n      aggregateLabel {\n        id\n        totalCalories\n        fat\n        alcohol\n        carbs\n        protein\n        nutrients {\n          id\n          perServing\n          value\n          nutrient {\n            id\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment PlanNutritionFields on MealPlanRecipe {\n    id\n    totalServings\n    mealPlan {\n      id\n    }\n    factor\n    originalRecipe {\n      id\n      aggregateLabel {\n        id\n        totalCalories\n        fat\n        alcohol\n        carbs\n        protein\n        nutrients {\n          id\n          perServing\n          value\n          nutrient {\n            id\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetBasicPlanRecipeInfo($mealPlanId: ID!) {\n    mealPlanRecipes(mealPlanId: $mealPlanId) {\n      ...BasicPlanRecipeFields\n    }\n  }\n"): (typeof documents)["\n  query GetBasicPlanRecipeInfo($mealPlanId: ID!) {\n    mealPlanRecipes(mealPlanId: $mealPlanId) {\n      ...BasicPlanRecipeFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetMealPlanRecipes($mealPlanId: ID!) {\n    mealPlanRecipes(mealPlanId: $mealPlanId) {\n      ...MealPlanRecipeFields\n    }\n  }\n"): (typeof documents)["\n  query GetMealPlanRecipes($mealPlanId: ID!) {\n    mealPlanRecipes(mealPlanId: $mealPlanId) {\n      ...MealPlanRecipeFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetMealPlanRecipeNutrition($mealPlanRecipeId: ID!) {\n    mealPlanRecipes(mealPlanId: $mealPlanRecipeId) {\n      ...PlanNutritionFields\n    }\n  }\n"): (typeof documents)["\n  query GetMealPlanRecipeNutrition($mealPlanRecipeId: ID!) {\n    mealPlanRecipes(mealPlanId: $mealPlanRecipeId) {\n      ...PlanNutritionFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation addRecipeToPlan($mealPlanId: ID!, $recipe: AddRecipeToPlanInput!) {\n    addRecipeToMealPlan(mealPlanId: $mealPlanId, recipe: $recipe) {\n      mealPlan {\n        id\n      }\n      ...MealPlanRecipeFields\n    }\n  }\n"): (typeof documents)["\n  mutation addRecipeToPlan($mealPlanId: ID!, $recipe: AddRecipeToPlanInput!) {\n    addRecipeToMealPlan(mealPlanId: $mealPlanId, recipe: $recipe) {\n      mealPlan {\n        id\n      }\n      ...MealPlanRecipeFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation editMealPlanRecipe($id: ID!, $recipe: EditMealPlanRecipeInput!) {\n    editMealPlanRecipe(id: $id, recipe: $recipe) {\n      ...MealPlanRecipeFields\n    }\n  }\n"): (typeof documents)["\n  mutation editMealPlanRecipe($id: ID!, $recipe: EditMealPlanRecipeInput!) {\n    editMealPlanRecipe(id: $id, recipe: $recipe) {\n      ...MealPlanRecipeFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation removeMealPlanRecipe($id: ID!) {\n    removeMealPlanRecipe(id: $id) {\n      id\n      success\n    }\n  }\n"): (typeof documents)["\n  mutation removeMealPlanRecipe($id: ID!) {\n    removeMealPlanRecipe(id: $id) {\n      id\n      success\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment MealPlanServingsField on MealPlanServing {\n    id\n    day\n    meal\n    numberOfServings\n    mealPlanRecipeId\n  }\n"): (typeof documents)["\n  fragment MealPlanServingsField on MealPlanServing {\n    id\n    day\n    meal\n    numberOfServings\n    mealPlanRecipeId\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getServings($mealPlanId: ID!, $filter: ServingsFilterInput) {\n    mealPlanServings(mealPlanId: $mealPlanId, filter: $filter) {\n      ...MealPlanServingsField\n    }\n  }\n"): (typeof documents)["\n  query getServings($mealPlanId: ID!, $filter: ServingsFilterInput) {\n    mealPlanServings(mealPlanId: $mealPlanId, filter: $filter) {\n      ...MealPlanServingsField\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation addServingToPlan($serving: AddRecipeServingInput!) {\n    addRecipeServing(serving: $serving) {\n      day\n      id\n      meal\n      mealPlanRecipeId\n      numberOfServings\n      mealRecipe {\n        id\n        servingsOnPlan\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation addServingToPlan($serving: AddRecipeServingInput!) {\n    addRecipeServing(serving: $serving) {\n      day\n      id\n      meal\n      mealPlanRecipeId\n      numberOfServings\n      mealRecipe {\n        id\n        servingsOnPlan\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation removeServing($id: ID!) {\n    deleteRecipeServing(id: $id) {\n      id\n      success\n    }\n  }\n"): (typeof documents)["\n  mutation removeServing($id: ID!) {\n    deleteRecipeServing(id: $id) {\n      id\n      success\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation editServing($id: ID!, $serving: EditRecipeServingInput!) {\n    editRecipeServing(id: $id, serving: $serving) {\n      id\n      day\n      meal\n      numberOfServings\n      mealRecipe {\n        id\n        servingsOnPlan\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation editServing($id: ID!, $serving: EditRecipeServingInput!) {\n    editRecipeServing(id: $id, serving: $serving) {\n      id\n      day\n      meal\n      numberOfServings\n      mealRecipe {\n        id\n        servingsOnPlan\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment NutrientTargetFields on NutrientGoal {\n    nutrientId\n    dri {\n      id\n      upperLimit\n      value\n    }\n    target {\n      id\n      nutrientTarget\n      preference\n      threshold\n    }\n  }\n"): (typeof documents)["\n  fragment NutrientTargetFields on NutrientGoal {\n    nutrientId\n    dri {\n      id\n      upperLimit\n      value\n    }\n    target {\n      id\n      nutrientTarget\n      preference\n      threshold\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getNutrientTargets {\n    nutritionTargets {\n      alcohol {\n        ...NutrientTargetFields\n      }\n      fat {\n        ...NutrientTargetFields\n      }\n      calories {\n        ...NutrientTargetFields\n      }\n      carbs {\n        ...NutrientTargetFields\n      }\n      protein {\n        ...NutrientTargetFields\n      }\n      nutrients {\n        ...NutrientTargetFields\n      }\n    }\n  }\n"): (typeof documents)["\n  query getNutrientTargets {\n    nutritionTargets {\n      alcohol {\n        ...NutrientTargetFields\n      }\n      fat {\n        ...NutrientTargetFields\n      }\n      calories {\n        ...NutrientTargetFields\n      }\n      carbs {\n        ...NutrientTargetFields\n      }\n      protein {\n        ...NutrientTargetFields\n      }\n      nutrients {\n        ...NutrientTargetFields\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation setNutrientTarget($id: ID!, $target: NutrientTargetInput!) {\n    setNutritionTarget(nutrientId: $id, target: $target) {\n      id\n      target {\n        id\n        nutrientTarget\n        preference\n        threshold\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation setNutrientTarget($id: ID!, $target: NutrientTargetInput!) {\n    setNutritionTarget(nutrientId: $id, target: $target) {\n      id\n      target {\n        id\n        nutrientTarget\n        preference\n        threshold\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query GetIngredientCategories {\n      ingredientCategories {\n        id\n        name\n      }\n    }\n  "): (typeof documents)["\n    query GetIngredientCategories {\n      ingredientCategories {\n        id\n        name\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment NutrientFields on Nutrient {\n    id\n    alternateNames\n    advancedView\n    target {\n      id\n      nutrientTarget\n      preference\n      threshold\n    }\n    dri {\n      id\n      value\n      upperLimit\n    }\n    name\n    important\n    parentNutrientId\n    type\n    unit {\n      id\n      name\n      symbol\n      abbreviations\n    }\n  }\n"): (typeof documents)["\n  fragment NutrientFields on Nutrient {\n    id\n    alternateNames\n    advancedView\n    target {\n      id\n      nutrientTarget\n      preference\n      threshold\n    }\n    dri {\n      id\n      value\n      upperLimit\n    }\n    name\n    important\n    parentNutrientId\n    type\n    unit {\n      id\n      name\n      symbol\n      abbreviations\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getNutrients($advanced: Boolean!, $name: String, $favorites: Boolean) {\n    nutrients(search: $name, advanced: $advanced, favorites: $favorites) {\n      ...NutrientFields\n    }\n  }\n"): (typeof documents)["\n  query getNutrients($advanced: Boolean!, $name: String, $favorites: Boolean) {\n    nutrients(search: $name, advanced: $advanced, favorites: $favorites) {\n      ...NutrientFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query searchNutrients($search: String) {\n    nutrients(advanced: true, search: $search) {\n      id\n      name\n      unit {\n        id\n        symbol\n      }\n      alternateNames\n    }\n  }\n"): (typeof documents)["\n  query searchNutrients($search: String) {\n    nutrients(advanced: true, search: $search) {\n      id\n      name\n      unit {\n        id\n        symbol\n      }\n      alternateNames\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getRankedNutrients {\n    rankedNutrients {\n      id\n      name\n      unit {\n        id\n        symbol\n      }\n      alternateNames\n    }\n  }\n"): (typeof documents)["\n  query getRankedNutrients {\n    rankedNutrients {\n      id\n      name\n      unit {\n        id\n        symbol\n      }\n      alternateNames\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation setRankedNutrients($nutrients: [RankedNutrientInput!]!) {\n      setRankedNutrients(nutrients: $nutrients) {\n        id\n        name\n        unit {\n          id\n          symbol\n        }\n        alternateNames\n      }\n    }\n  "): (typeof documents)["\n    mutation setRankedNutrients($nutrients: [RankedNutrientInput!]!) {\n      setRankedNutrients(nutrients: $nutrients) {\n        id\n        name\n        unit {\n          id\n          symbol\n        }\n        alternateNames\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ReceiptItem on ReceiptLine {\n    id\n    totalPrice\n    description\n    quantity\n    perUnitPrice\n    unitQuantity\n    foodType\n    order\n    verified\n    ignore\n    boundingBoxes {\n      coordinates {\n        x\n        y\n      }\n    }\n    matchingUnit {\n      id\n      name\n    }\n    matchingIngredient {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  fragment ReceiptItem on ReceiptLine {\n    id\n    totalPrice\n    description\n    quantity\n    perUnitPrice\n    unitQuantity\n    foodType\n    order\n    verified\n    ignore\n    boundingBoxes {\n      coordinates {\n        x\n        y\n      }\n    }\n    matchingUnit {\n      id\n      name\n    }\n    matchingIngredient {\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getReceipt($id: ID!) {\n    receipt(id: $id) {\n      id\n      imagePath\n      total\n      merchantName\n      matchingStore {\n        id\n        name\n      }\n      date\n      items {\n        ...ReceiptItem\n      }\n      scanned\n      verified\n    }\n  }\n"): (typeof documents)["\n  query getReceipt($id: ID!) {\n    receipt(id: $id) {\n      id\n      imagePath\n      total\n      merchantName\n      matchingStore {\n        id\n        name\n      }\n      date\n      items {\n        ...ReceiptItem\n      }\n      scanned\n      verified\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getReceipts {\n    receipts {\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n      edges {\n        node {\n          id\n          date\n          dateUploaded\n          matchingStore {\n            id\n            name\n          }\n          total\n          verified\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query getReceipts {\n    receipts {\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n      edges {\n        node {\n          id\n          date\n          dateUploaded\n          matchingStore {\n            id\n            name\n          }\n          total\n          verified\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation editReceiptItem($lineId: ID!, $lineItem: ReceiptItemInput!) {\n      updateReceiptLine(lineId: $lineId, line: $lineItem) {\n        ...ReceiptItem\n      }\n    }\n  "): (typeof documents)["\n    mutation editReceiptItem($lineId: ID!, $lineItem: ReceiptItemInput!) {\n      updateReceiptLine(lineId: $lineId, line: $lineItem) {\n        ...ReceiptItem\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation finalizeReceipt($receiptId: ID!) {\n    finalizeReceipt(receiptId: $receiptId) {\n      id\n      imagePath\n      total\n      merchantName\n      matchingStore {\n        id\n        name\n      }\n      date\n      items {\n        ...ReceiptItem\n      }\n      scanned\n    }\n  }\n"): (typeof documents)["\n  mutation finalizeReceipt($receiptId: ID!) {\n    finalizeReceipt(receiptId: $receiptId) {\n      id\n      imagePath\n      total\n      merchantName\n      matchingStore {\n        id\n        name\n      }\n      date\n      items {\n        ...ReceiptItem\n      }\n      scanned\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation uploadReceipt($file: File!) {\n    uploadReceipt(file: $file) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation uploadReceipt($file: File!) {\n    uploadReceipt(file: $file) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getCategories($search: String) {\n    categories(search: $search) {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  query getCategories($search: String) {\n    categories(search: $search) {\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createCategory($name: String!) {\n    createCategory(name: $name) {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  mutation createCategory($name: String!) {\n    createCategory(name: $name) {\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getCourses($search: String) {\n    courses(searchString: $search) {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  query getCourses($search: String) {\n    courses(searchString: $search) {\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createCourse($name: String!) {\n    createCourse(name: $name) {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  mutation createCourse($name: String!) {\n    createCourse(name: $name) {\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getCuisines($search: String) {\n    cuisines(searchString: $search) {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  query getCuisines($search: String) {\n    cuisines(searchString: $search) {\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createCuisine($name: String!) {\n    createCuisine(name: $name) {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  mutation createCuisine($name: String!) {\n    createCuisine(name: $name) {\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment NutritionLabelFields on NutritionLabel {\n    id\n    ingredientGroup {\n      id\n      name\n    }\n    isPrimary\n    servingSize\n    servingSizeUnit {\n      id\n      name\n      symbol\n    }\n    servings\n    servingsUsed\n    nutrients {\n      value\n      nutrient {\n        id\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment NutritionLabelFields on NutritionLabel {\n    id\n    ingredientGroup {\n      id\n      name\n    }\n    isPrimary\n    servingSize\n    servingSizeUnit {\n      id\n      name\n      symbol\n    }\n    servings\n    servingsUsed\n    nutrients {\n      value\n      nutrient {\n        id\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createNutritionLabel($input: NutritionLabelInput!) {\n    createNutritionLabel(nutritionLabel: $input) {\n      ...NutritionLabelFields\n    }\n  }\n"): (typeof documents)["\n  mutation createNutritionLabel($input: NutritionLabelInput!) {\n    createNutritionLabel(nutritionLabel: $input) {\n      ...NutritionLabelFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation editNutritionLabel($id: ID!, $label: NutritionLabelInput!) {\n    editNutritionLabel(id: $id, label: $label) {\n      ...NutritionLabelFields\n    }\n  }\n"): (typeof documents)["\n  mutation editNutritionLabel($id: ID!, $label: NutritionLabelInput!) {\n    editNutritionLabel(id: $id, label: $label) {\n      ...NutritionLabelFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment RecipeFields on Recipe {\n    id\n    name\n    category {\n      id\n      name\n    }\n    cuisine {\n      id\n      name\n    }\n    cookTime\n    course {\n      id\n      name\n    }\n    directions\n    leftoverFridgeLife\n    leftoverFreezerLife\n    marinadeTime\n    ingredientText\n    verified\n    notes\n    photos {\n      id\n      isPrimary\n      url\n    }\n    prepTime\n    source\n    ingredientGroups {\n      id\n      name\n    }\n    ingredients {\n      ...RecipeIngredientFields\n    }\n    nutritionLabels {\n      ...NutritionLabelFields\n    }\n    aggregateLabel {\n      id\n      alcohol\n      servings\n      totalCalories\n      carbs\n      fat\n      protein\n      servingSize\n      servingSizeUnit {\n        id\n        name\n        symbol\n      }\n      nutrients {\n        id\n        value\n        nutrient {\n          id\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment RecipeFields on Recipe {\n    id\n    name\n    category {\n      id\n      name\n    }\n    cuisine {\n      id\n      name\n    }\n    cookTime\n    course {\n      id\n      name\n    }\n    directions\n    leftoverFridgeLife\n    leftoverFreezerLife\n    marinadeTime\n    ingredientText\n    verified\n    notes\n    photos {\n      id\n      isPrimary\n      url\n    }\n    prepTime\n    source\n    ingredientGroups {\n      id\n      name\n    }\n    ingredients {\n      ...RecipeIngredientFields\n    }\n    nutritionLabels {\n      ...NutritionLabelFields\n    }\n    aggregateLabel {\n      id\n      alcohol\n      servings\n      totalCalories\n      carbs\n      fat\n      protein\n      servingSize\n      servingSizeUnit {\n        id\n        name\n        symbol\n      }\n      nutrients {\n        id\n        value\n        nutrient {\n          id\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createRecipe($input: RecipeInput!) {\n    createRecipe(recipe: $input) {\n      ...RecipeFields\n    }\n  }\n"): (typeof documents)["\n  mutation createRecipe($input: RecipeInput!) {\n    createRecipe(recipe: $input) {\n      ...RecipeFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getRecipe($id: ID!) {\n    recipe(recipeId: $id) {\n      ...RecipeFields\n    }\n  }\n"): (typeof documents)["\n  query getRecipe($id: ID!) {\n    recipe(recipeId: $id) {\n      ...RecipeFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation editRecipe($recipe: RecipeInput!, $id: ID!) {\n    editRecipe(recipeId: $id, recipe: $recipe) {\n      ...RecipeFields\n    }\n  }\n"): (typeof documents)["\n  mutation editRecipe($recipe: RecipeInput!, $id: ID!) {\n    editRecipe(recipeId: $id, recipe: $recipe) {\n      ...RecipeFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getRecipeBaiscInfo($id: ID!) {\n    recipe(recipeId: $id) {\n      id\n      name\n      cookTime\n      directions\n      leftoverFridgeLife\n      leftoverFreezerLife\n      marinadeTime\n      verified\n      ingredients {\n        ...RecipeIngredientFields\n      }\n      notes\n      photos {\n        id\n        isPrimary\n        url\n      }\n      aggregateLabel {\n        id\n        servings\n        totalCalories\n        protein\n        fat\n        carbs\n        alcohol\n      }\n      prepTime\n      source\n    }\n  }\n"): (typeof documents)["\n  query getRecipeBaiscInfo($id: ID!) {\n    recipe(recipeId: $id) {\n      id\n      name\n      cookTime\n      directions\n      leftoverFridgeLife\n      leftoverFreezerLife\n      marinadeTime\n      verified\n      ingredients {\n        ...RecipeIngredientFields\n      }\n      notes\n      photos {\n        id\n        isPrimary\n        url\n      }\n      aggregateLabel {\n        id\n        servings\n        totalCalories\n        protein\n        fat\n        carbs\n        alcohol\n      }\n      prepTime\n      source\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getRecipeLabels($id: ID!) {\n    recipe(recipeId: $id) {\n      id\n      nutritionLabels {\n        id\n        ingredientGroup {\n          id\n          name\n        }\n        isPrimary\n        servingSize\n        servingSizeUnit {\n          id\n          name\n          symbol\n        }\n        servings\n        servingsUsed\n        nutrients {\n          value\n          nutrient {\n            id\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query getRecipeLabels($id: ID!) {\n    recipe(recipeId: $id) {\n      id\n      nutritionLabels {\n        id\n        ingredientGroup {\n          id\n          name\n        }\n        isPrimary\n        servingSize\n        servingSizeUnit {\n          id\n          name\n          symbol\n        }\n        servings\n        servingsUsed\n        nutrients {\n          value\n          nutrient {\n            id\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment RecipeSearchFields on Recipe {\n    id\n    name\n    verified\n    ingredients {\n      id\n      sentence\n      quantity\n      unit {\n        id\n        name\n      }\n    }\n    aggregateLabel {\n      id\n      totalCalories\n      protein\n      fat\n      carbs\n      alcohol\n      servings\n    }\n    photos {\n      id\n      isPrimary\n      url\n    }\n  }\n"): (typeof documents)["\n  fragment RecipeSearchFields on Recipe {\n    id\n    name\n    verified\n    ingredients {\n      id\n      sentence\n      quantity\n      unit {\n        id\n        name\n      }\n    }\n    aggregateLabel {\n      id\n      totalCalories\n      protein\n      fat\n      carbs\n      alcohol\n      servings\n    }\n    photos {\n      id\n      isPrimary\n      url\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query searchRecipes($filters: RecipeFilter!, $after: String, $first: Int) {\n    recipes(filter: $filters, after: $after, first: $first) {\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n      edges {\n        cursor\n        node {\n          ...RecipeSearchFields\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query searchRecipes($filters: RecipeFilter!, $after: String, $first: Int) {\n    recipes(filter: $filters, after: $after, first: $first) {\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n      edges {\n        cursor\n        node {\n          ...RecipeSearchFields\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment RecipeIngredientFields on RecipeIngredient {\n    id\n    sentence\n    order\n    quantity\n    verified\n    mealPrepIngredient\n    baseIngredient {\n      id\n      name\n    }\n    unit {\n      id\n      name\n      symbol\n    }\n    group {\n      id\n      name\n    }\n    recipe {\n      id\n    }\n  }\n"): (typeof documents)["\n  fragment RecipeIngredientFields on RecipeIngredient {\n    id\n    sentence\n    order\n    quantity\n    verified\n    mealPrepIngredient\n    baseIngredient {\n      id\n      name\n    }\n    unit {\n      id\n      name\n      symbol\n    }\n    group {\n      id\n      name\n    }\n    recipe {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query parseIngredients($lines: String!) {\n    tagIngredients(ingredientTxt: $lines) {\n      order\n      quantity\n      sentence\n      unit {\n        id\n        name\n      }\n      ingredient {\n        id\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  query parseIngredients($lines: String!) {\n    tagIngredients(ingredientTxt: $lines) {\n      order\n      quantity\n      sentence\n      unit {\n        id\n        name\n      }\n      ingredient {\n        id\n        name\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getRecipeIngredients($id: ID!) {\n    recipe(recipeId: $id) {\n      id\n      ingredients {\n        ...RecipeIngredientFields\n      }\n    }\n  }\n"): (typeof documents)["\n  query getRecipeIngredients($id: ID!) {\n    recipe(recipeId: $id) {\n      id\n      ingredients {\n        ...RecipeIngredientFields\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createRecipeIngredient(\n    $recipeId: ID!\n    $ingredient: String!\n    $groupId: ID\n  ) {\n    addRecipeIngredientsFromTxt(\n      recipeId: $recipeId\n      text: $ingredient\n      groupId: $groupId\n    ) {\n      ...RecipeIngredientFields\n    }\n  }\n"): (typeof documents)["\n  mutation createRecipeIngredient(\n    $recipeId: ID!\n    $ingredient: String!\n    $groupId: ID\n  ) {\n    addRecipeIngredientsFromTxt(\n      recipeId: $recipeId\n      text: $ingredient\n      groupId: $groupId\n    ) {\n      ...RecipeIngredientFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation editRecipeIngredient($input: [EditRecipeIngredientsInput!]!) {\n    editRecipeIngredients(ingredients: $input) {\n      ...RecipeIngredientFields\n    }\n  }\n"): (typeof documents)["\n  mutation editRecipeIngredient($input: [EditRecipeIngredientsInput!]!) {\n    editRecipeIngredients(ingredients: $input) {\n      ...RecipeIngredientFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation deleteRecipeIngredient($id: ID!) {\n    deleteRecipeIngredient(ingredientId: $id) {\n      success\n    }\n  }\n"): (typeof documents)["\n  mutation deleteRecipeIngredient($id: ID!) {\n    deleteRecipeIngredient(ingredientId: $id) {\n      success\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createIngredientGroup($name: String!, $recipeId: ID!) {\n    createIngredientGroup(name: $name, recipeId: $recipeId) {\n      id\n      name\n      recipe {\n        id\n      }\n      ingredients {\n        id\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation createIngredientGroup($name: String!, $recipeId: ID!) {\n    createIngredientGroup(name: $name, recipeId: $recipeId) {\n      id\n      name\n      recipe {\n        id\n      }\n      ingredients {\n        id\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation deleteIngredientGroup($groupId: ID!) {\n    deleteRecipeIngredientGroup(groupId: $groupId) {\n      success\n    }\n  }\n"): (typeof documents)["\n  mutation deleteIngredientGroup($groupId: ID!) {\n    deleteRecipeIngredientGroup(groupId: $groupId) {\n      success\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation editIngredientGroup($name: String!, $groupId: ID!) {\n    editRecipeIngredientGroup(name: $name, groupId: $groupId) {\n      id\n      name\n      recipe {\n        id\n      }\n      ingredients {\n        id\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation editIngredientGroup($name: String!, $groupId: ID!) {\n    editRecipeIngredientGroup(name: $name, groupId: $groupId) {\n      id\n      name\n      recipe {\n        id\n      }\n      ingredients {\n        id\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;