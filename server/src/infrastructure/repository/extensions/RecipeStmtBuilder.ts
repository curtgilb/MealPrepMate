import { Prisma } from "@prisma/client";
import { RecipeIngredientInput, RecipeInput } from "@/types/gql.js";
import { MatchedNlpResponse } from "@/domain/extensions/IngredientParser.js";

interface RecipeArgs {
  recipe: RecipeInput;
  verified: boolean | undefined;
  nutritionLabel?: Prisma.NutritionLabelCreateWithoutRecipeInput;
  ingredients?: Prisma.RecipeIngredientCreateNestedManyWithoutRecipeInput;
}

function buildRecipeStmt<B extends boolean>(
  args: RecipeArgs,
  update: B
): B extends true ? Prisma.RecipeUpdateInput : Prisma.RecipeCreateInput;

function buildRecipeStmt(
  args: RecipeArgs,
  update: boolean
): Prisma.RecipeUpdateInput | Prisma.RecipeCreateInput {
  const { recipe, nutritionLabel, ingredients, verified } = args;

  const stmt: Prisma.RecipeUpdateInput | Prisma.RecipeCreateInput = {
    name: recipe.title,
    source: recipe.source,
    preparationTime: recipe.prepTime,
    cookingTime: recipe.cookTime,
    marinadeTime: recipe.marinadeTime,
    directions: recipe.directions,
    notes: recipe.notes,
    ingredientsTxt: recipe.ingredients,
    photos: createConnectManyStmt(recipe.photoIds, update),
    isFavorite: recipe.isFavorite ?? false,
    course: createConnectManyStmt(recipe.courseIds, update),
    category: createConnectManyStmt(recipe.categoryIds, update),
    cuisine: createConnectManyStmt(recipe.cuisineIds, update),
    leftoverFreezerLife: recipe.leftoverFreezerLife,
    leftoverFridgeLife: recipe.leftoverFridgeLife,
    verified: verified,
  };

  if (update) {
    return stmt;
  } else {
    stmt.ingredients = ingredients ? ingredients : undefined;
    stmt.nutritionLabels = nutritionLabel
      ? { create: nutritionLabel }
      : undefined;
    return stmt as Prisma.RecipeCreateInput;
  }
}

type ConnectManyStmt =
  | {
      connect: { id: string }[];
    }
  | undefined;

type SetManyStmt =
  | {
      set: { id: string }[];
    }
  | undefined;

function createConnectManyStmt<B extends boolean>(
  ids: string[] | undefined | null,
  update: B
): B extends true ? SetManyStmt : ConnectManyStmt;

function createConnectManyStmt(
  ids: string[] | undefined | null,
  update: boolean
): ConnectManyStmt | undefined {
  if (!ids || ids.length === 0) return undefined;
  const idObjs = ids.map((id) => ({ id: id }));
  if (update) {
    return { connect: idObjs };
  }
  return {
    connect: idObjs,
  };
}

function buildRecipeIngredientNestedCreateMany(
  input: MatchedNlpResponse[]
): Prisma.RecipeIngredientCreateNestedManyWithoutRecipeInput {
  return {
    createMany: {
      data: input.map((ingredient) => ({
        sentence: ingredient.sentence,
        quantity: ingredient.quantity,
        name: ingredient.name,
        order: ingredient.order,
        measurementUnitId: ingredient.unitId ?? undefined,
        ingredientId: ingredient.ingredientId ?? undefined,
      })),
    },
  };
}

function getRecipeIngredientGroupUniqueInput(
  input: RecipeIngredientInput,
  recipeId: string
):
  | Prisma.RecipeIngredientGroupCreateNestedOneWithoutIngredientsInput
  | undefined {
  if (!input.groupId || !input.groupName) return undefined;

  let connectCriteria: Prisma.RecipeIngredientGroupWhereUniqueInput;
  if (input.groupId) {
    connectCriteria = { id: input.groupId };
  } else {
    connectCriteria = {
      ingredientGroup: { recipeId: recipeId, name: input.groupName },
    };
  }
  return {
    connectOrCreate: {
      where: connectCriteria,
      create: {
        recipeId: recipeId,
        name: input.groupName,
      },
    },
  };
}

function buildRecipeIngredientStmt<B extends boolean>(
  args: RecipeIngredientInput,
  recipeId: string,
  update: B
): B extends true
  ? Prisma.RecipeIngredientUpdateInput
  : Prisma.RecipeIngredientCreateInput;

function buildRecipeIngredientStmt(
  args: RecipeIngredientInput,
  recipeId: string,
  update: boolean
): Prisma.RecipeIngredientUpdateInput | Prisma.RecipeIngredientCreateInput {
  const data: Prisma.RecipeIngredientUpdateInput = {
    order: args.order ?? undefined,
    sentence: args.sentence ?? undefined,
    quantity: args.quantity,
    name: args.name,
    unit: args.unitId ? { connect: { id: args.unitId } } : undefined,
    ingredient: args.ingredientId
      ? { connect: { id: args.ingredientId } }
      : undefined,
    group: getRecipeIngredientGroupUniqueInput(args, recipeId),
  };

  if (update) {
    return data;
  } else {
    if (data.order === undefined || args.sentence === undefined) {
      throw new Error(
        "Order and sentence are required for creating a recipe ingredient"
      );
    }
    return data as Prisma.RecipeIngredientCreateInput;
  }
}

export {
  buildRecipeStmt,
  buildRecipeIngredientNestedCreateMany,
  buildRecipeIngredientStmt,
};
