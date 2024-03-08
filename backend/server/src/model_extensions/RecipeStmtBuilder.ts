import { Prisma } from "@prisma/client";
import { RecipeIngredientInput, RecipeInput } from "../types/gql.js";

interface RecipeArgs {
  recipe: RecipeInput;
  verifed: boolean;
}

interface CreateRecipeArgs extends RecipeArgs {
  nutritionLabels?: Prisma.NutritionLabelCreateNestedManyWithoutRecipeInput;
  ingredients?: Prisma.RecipeIngredientCreateNestedManyWithoutRecipesInput;
}

Prisma.RecipeUpdateInput;

function buildCreateRecipeStmt(
  input: CreateRecipeArgs
): Prisma.RecipeCreateInput {
  const { recipe, nutritionLabels, ingredients, verifed } = input;
  return {
    name: recipe.title,
    source: recipe.source,
    preparationTime: recipe.prepTime,
    cookingTime: recipe.cookTime,
    marinadeTime: recipe.marinadeTime,
    directions: recipe.directions,
    notes: recipe.notes,
    photos: createConnectManyStmt(recipe.photoIds),
    isFavorite: recipe.isFavorite ?? false,
    course: createConnectManyStmt(recipe.courseIds),
    category: createConnectManyStmt(recipe.categoryIds),
    cuisine: createConnectManyStmt(recipe.cuisineId),
    ingredients,
    nutritionLabels,
    leftoverFreezerLife: recipe.leftoverFreezerLife,
    leftoverFridgeLife: recipe.leftoverFridgeLife,
    isVerified: verifed,
  };
}

type ConnectStmt = {
  connect: { id: string }[];
};

function createConnectManyStmt(
  ids: string[] | undefined | null
): ConnectStmt | undefined {
  if (!ids || ids.length > 0) return undefined;
  return {
    connect: ids.map((id) => ({ id: id })),
  };
}

type SetStmt = {
  set: { id: string }[];
};

function createSetManyStmt(
  ids: string[] | undefined | null
): SetStmt | undefined {
  if (!ids || ids.length > 0) return undefined;
  return {
    set: ids.map((id) => ({ id: id })),
  };
}

function buildUpdateRecipeStmt(input: RecipeArgs): Prisma.RecipeUpdateInput {
  const { recipe, verifed } = input;
  return {
    name: recipe.title,
    source: recipe.source,
    preparationTime: recipe.prepTime,
    cookingTime: recipe.cookTime,
    marinadeTime: recipe.marinadeTime,
    directions: recipe.directions,
    notes: recipe.notes,
    photos: createSetManyStmt(recipe.photoIds),
    isFavorite: recipe.isFavorite ?? false,
    course: createSetManyStmt(recipe.courseIds),
    category: createSetManyStmt(recipe.categoryIds),
    cuisine: createSetManyStmt(recipe.cuisineId),
    leftoverFreezerLife: recipe.leftoverFreezerLife,
    leftoverFridgeLife: recipe.leftoverFridgeLife,
    isVerified: verifed,
  };
}

function buildCreateRecipeIngredientStmt(
  ingredient: RecipeIngredientInput,
  update = false
) {
  if (!ingredient.order || !ingredient.sentence)
    throw "Must have order and sentence";
  return {
    order: ingredient.order,
    sentence: ingredient.sentence,
    quantity: ingredient.quantity,
    unitId: ingredient.unitId
      ? { connect: { id: ingredient.unitId } }
      : undefined,
    ingredientId: ingredient.ingredientId
      ? { connect: { id: ingredient.ingredientId } }
      : undefined,
    groupId: ingredient.groupId
      ? { connect: { id: ingredient.groupId } }
      : undefined,
  };
}

function buildUpdateRecipeIngredientStmt(
  ingredient: RecipeIngredientInput
): Prisma.RecipeIngredientUpdateInput {
  return {
    order: ingredient.order,
    sentence: ingredient.sentence,
    quantity: ingredient.quantity,
    unit: ingredient.unitId
      ? { connect: { id: ingredient.unitId } }
      : undefined,
    ingredient: ingredient.ingredientId
      ? { connect: { id: ingredient.ingredientId } }
      : undefined,
    group: ingredient.groupId
      ? { connect: { id: ingredient.groupId } }
      : undefined,
  };
}
