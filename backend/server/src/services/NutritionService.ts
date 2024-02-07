// Return ID's of recipes that fit nutrition criteria
// Load all nutrition labels that are connected to a recipe
// Produce an aggreagte nutrition label
//  Aggregate nutrition labels
//  1. Reduce any labels that have servingsUsed
//  2. Add all nutrients together
//  3. Divide by total servings to get nutrient per serving

import {
  NutritionLabel,
  NutritionLabelNutrient,
  Prisma,
  Recipe,
} from "@prisma/client";
import { db } from "../db.js";
import { NumericalComparison, NutritionFilter } from "../types/gql.js";
import { create } from "domain";

type NutrientPerServing = NutritionLabelNutrient & {
  valuePerServing: number;
};

type RecipeWithLabel = NutritionLabel & {
  nutrients: NutrientPerServing[];
};

const nutritionLabelWithNutrients =
  Prisma.validator<Prisma.NutritionLabelDefaultArgs>()({
    include: { nutrients: true },
  });
type LabelWithNutrients = Prisma.NutritionLabelGetPayload<
  typeof nutritionLabelWithNutrients
>;

async function filterRecipesByNutritionFilter(
  nutritionFilter: NutritionFilter[] | undefined,
  servingsFilter: NumericalComparison | undefined | null,
  recipeIds?: string[]
): RecipeWithLabel[] {
  // Get nutrition labels for recipes
  const nutritionLabels = await db.nutritionLabel.findMany({
    where: {
      recipeId: { in: recipeIds },
      verifed: true,
    },
    include: { nutrients: true },
  });

  // Group all the nutrition labels by recipe
  const recipeAgg = new Map<string, LabelWithNutrients[]>();
  for (const label of nutritionLabels) {
    if (label.recipeId) {
      if (!recipeAgg.has(label.recipeId)) {
        recipeAgg.set(label.recipeId, []);
      }
      if (!label.ingredientGroupId) {
        recipeAgg.get(label.recipeId)?.unshift(label);
      } else {
        recipeAgg.get(label.recipeId)?.push(label);
      }
    }
  }

  // Aggregate and filter the nutrients for every recipe's nutrition labels
  const aggregateLabels: RecipeWithLabel[] = [];
  for (const [recipeId, labels] of recipeAgg.entries()) {
    const totalNutrients = aggregateNutrients(labels);
    const baseLabel = labels[0];
    let pass = true;

    // Check servings
    const totalServings = baseLabel.servings ? baseLabel.servings : 1;
    if (servingsFilter && totalServings) {
      pass = compareValues(totalServings, servingsFilter);
      if (!pass) continue;
    }

    // Check Nutrients
    if (nutritionFilter) {
      for (const filter of nutritionFilter) {
        pass = filterNutrients(filter, totalNutrients, totalServings);
        if (!pass) break;
      }
      if (!pass) continue;
    }

    aggregateLabels.push({
      ...baseLabel,
      aggregateLabel: createAggregateLabel(
        baseLabel.id,
        totalNutrients,
        totalServings
      ),
    });
  }
}

function compareValues(
  value: number,
  filter: NumericalComparison | null | undefined
) {
  if (!filter) {
    return true;
  }
  if (filter.eq !== null && filter.eq !== undefined) {
    return value === filter.eq;
  }

  if (filter.gte || filter.lte) {
    const cleanedGte = (
      !Number.isNaN(filter.gte) ? filter.gte : -Infinity
    ) as number;
    const cleanedLte = (
      !Number.isNaN(filter.lte) ? filter.lte : Infinity
    ) as number;
    return value >= cleanedGte && value <= cleanedLte;
  }
  return true;
}

function isValidCommparison(filter: NumericalComparison | null | undefined) {
  return (
    filter &&
    (!Number.isNaN(filter.eq) ||
      !Number.isNaN(filter.gte) ||
      !Number.isNaN(filter.lte))
  );
}

function createAggregateLabel(
  labelId: string,
  nutrients: Map<string, number>,
  servings: number
): NutrientPerServing[] {
  const newNutrients: NutrientPerServing[] = [];
  for (const [nutrientId, value] of nutrients.entries()) {
    newNutrients.push({
      nutritionLabelId: labelId,
      nutrientId,
      value,
      valuePerServing: value / servings,
    });
  }
  return newNutrients;
}

function filterNutrients(
  nutritionFilter: NutritionFilter,
  nutrients: Map<string, number>,
  servings: number
): boolean {
  if (
    isValidCommparison(nutritionFilter?.target) &&
    !nutrients.has(nutritionFilter.nutrientID)
  ) {
    return false;
  }

  if (nutrients.has(nutritionFilter.nutrientID)) {
    let value = nutrients.get(nutritionFilter.nutrientID) ?? 0;
    const totalServings = servings ? servings : 1;
    value = nutritionFilter.perServing ? value / totalServings : value;
    if (nutritionFilter.perServing)
      compareValues(value, nutritionFilter?.target);
  }
  return false;
}

function aggregateNutrients(labels: LabelWithNutrients[]) {
  // nutrientId -> value
  const nutrientAgg = new Map<string, number>();

  for (const label of labels) {
    // Reduce if less than total is unsed in recipe
    for (const nutrient of label.nutrients) {
      let nutrientValue = nutrient.value;

      if (label.servingsUsed && label.servings) {
        const ratio = label.servingsUsed / label.servings;
        nutrientValue = nutrientValue * ratio;
      }

      if (nutrientAgg.has(nutrient.nutrientId)) {
        const sum = nutrientAgg.get(nutrient.nutrientId) as number;
        nutrientAgg.set(nutrient.nutrientId, sum + nutrientValue);
      } else {
        nutrientAgg.set(nutrient.nutrientId, nutrientValue);
      }
    }
  }
  return nutrientAgg;
}

export { compareValues, isValidCommparison };
