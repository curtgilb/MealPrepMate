import { DbTransactionClient } from "@/infrastructure/repository/db.js";

export type CreateNutrientInput = {
  nutrientId: string;
  value: string;
};

export type CreateNutritionLabelInput = {
  servings: number;
  servingSize: number | undefined | null;
  servingSizeUnitId: string | undefined | null;
  servingsUsed: number | undefined | null;
  isPrimary: boolean;
  nutrients: CreateNutrientInput[];
  ingredientGroupId: string | undefined | null;
};

async function createNutritionLabel(
  label: CreateNutrientInput,
  recipeId: string | undefined = undefined,
  tx?: DbTransactionClient
) {}

async function editNutritionLabel() {}

async function deleteNutritionLabel() {}

async function updateAggregateLabel(
  recipeId: string,
  tx?: DbTransactionClient
) {}

export type EditNutritionLabelInput = {};
