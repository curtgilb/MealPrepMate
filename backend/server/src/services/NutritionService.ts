import {
  NutrientType,
  NutritionLabel,
  NutritionLabelNutrient,
  Prisma,
} from "@prisma/client";
import { db } from "../db.js";
import { NumericalComparison, NutritionFilter } from "../types/gql.js";

type NutrientPerServing = NutritionLabelNutrient & {
  valuePerServing: number;
};

const nutritionLabelWithNutrients =
  Prisma.validator<Prisma.NutritionLabelDefaultArgs>()({
    include: {
      nutrients: true,
      servingSizeUnit: true,
    },
  });

type LabelWithNutrients = Prisma.NutritionLabelGetPayload<
  typeof nutritionLabelWithNutrients
>;

const nutrientWithUnit = Prisma.validator<Prisma.NutrientDefaultArgs>()({
  include: {
    subNutrients: { include: { subNutrients: true, unit: true } },
    unit: true,
  },
});

type NutrientWithUnit = Prisma.NutrientGetPayload<typeof nutrientWithUnit>;

type NutrientTest = {
  name: string;
  value: number;
  unit: string;
  perServing: number;
  children: NutrientTest[];
};

// Argument of whether or not you want advanced view
type FullNutritionLabel = {
  calories: number;
  caloriesPerServing: number;
  servings: number;
  servingsUsed?: number;
  servingSize?: number;
  servingUnit?: string;
  general: NutrientTest[];
  carbohydrates: NutrientTest[];
  fats: NutrientTest[];
  proteins: NutrientTest[];
  minerals: NutrientTest[];
  vitamins: NutrientTest[];
};

type AggregateNutritionLabelParameters = {
  recipeId: string;
  scaleFactor: number;
  totalServings: number;
};

type ServingInfo = {
  servings: number;
  servingsUsed?: number;
  servingUnit?: string;
  servingSize?: number;
};

// Use Cases
//  Get nutrition for a recipe in a meal plan  | aggreagte
//  Get total nutrition for a day on a meal plan | aggreagte
//  Get total nutrition for a recipe | aggregate
//  Filter recipe list by nutrition filter ?|aggreate
//  Get all nutrition labels associated with a recipe in aggregate form |

async function getRecipeAggreagteLabel(recipeId: string, advanced = false) {
  const labels = await db.nutritionLabel.findMany({
    where: { recipeId: recipeId },
    include: { nutrients: true, servingSizeUnit: true },
  });
  const baseLabel = labels.find((item) => !item.ingredientGroupId);
  const scaledNutrients = labels.map((label) => {
    return scaleNutrients(baseLabel?.servingSize ?? 1, 1, label.nutrients);
  });
  const summed = sumNutrients(scaledNutrients);
  return toLabel(summed, advanced, {
    servings: baseLabel?.servings ?? 1,
    servingsUsed: baseLabel?.servingsUsed ?? 1,
    servingSize: baseLabel?.servingSize ?? 1,
    servingUnit: baseLabel?.servingSizeUnit?.name ?? "unit",
  });
}

async function convertToLabel(
  inputLabels: LabelWithNutrients[],
  advanced = false
): Promise<FullNutritionLabel[]> {
  return await Promise.all(
    inputLabels.map(async (label) => {
      const scaledNutrients = scaleNutrients(
        label?.servingSize ?? 1,
        1,
        label.nutrients
      );

      const summed = sumNutrients([scaledNutrients]);
      return await toLabel(summed, advanced, {
        servings: label?.servings ?? 1,
        servingsUsed: label?.servingsUsed ?? 1,
        servingSize: label?.servingSize ?? 1,
        servingUnit: label?.servingSizeUnit?.name ?? "unit",
      });
    })
  );
}

// NutrientId: -> {value: number; perServing: number}
type NutrientValue = { value: number; valuePerServing: number };
type NutrientMap = Map<string, NutrientValue>;

function scaleNutrients(
  totalServings: number,
  scaleFactor: number,
  nutrients: NutritionLabelNutrient[],
  servings: number = 1,
  servingsUsed: number = 1
): NutrientMap {
  const newNutrientValues = new Map<
    string,
    { value: number; valuePerServing: number }
  >();
  for (const nutrient of nutrients) {
    const servingRatio = servingsUsed / servings;
    const newValue = nutrient.value * scaleFactor * servingRatio;
    const perValue = newValue / totalServings;
    newNutrientValues.set(nutrient.nutrientId, {
      value: newValue,
      valuePerServing: perValue,
    });
  }
  return newNutrientValues;
}

function sumNutrients(nutrients: NutrientMap[]): NutrientMap {
  const combinedNutrients = new Map<
    string,
    { value: number; valuePerServing: number }
  >();
  for (const nutrientList of nutrients) {
    for (const [nutritionId, values] of nutrientList.entries()) {
      if (combinedNutrients.has(nutritionId)) {
        const existing = combinedNutrients.get(nutritionId);
        if (existing) {
          combinedNutrients.set(nutritionId, {
            value: values.value + existing.value,
            valuePerServing: values.valuePerServing + existing.valuePerServing,
          });
        }
      } else {
        combinedNutrients.set(nutritionId, {
          value: values.value,
          valuePerServing: values.valuePerServing,
        });
      }
    }
  }
  return combinedNutrients;
}

async function toLabel(
  nutrients: NutrientMap,
  advanced: boolean,
  servings: ServingInfo
): Promise<FullNutritionLabel> {
  const newLabel: FullNutritionLabel = {
    calories: 0,
    caloriesPerServing: 0,
    servings: servings.servings,
    general: [],
    carbohydrates: [],
    fats: [],
    proteins: [],
    minerals: [],
    vitamins: [],
  };

  // Get nutrients in order
  const allNutrients = await db.nutrient.findMany({
    where: { parentNutrientId: null, advancedView: advanced },
    include: {
      subNutrients: { include: { subNutrients: true, unit: true } },
      unit: true,
    },
    orderBy: { order: "asc" },
  });

  for (const baseNutrient of allNutrients) {
    if (nutrients.has(baseNutrient.id)) {
      const inputNutrient = nutrients.get(baseNutrient.id);

      if (baseNutrient.name === "Calories") {
        newLabel.calories = inputNutrient?.value ?? 0;
        newLabel.caloriesPerServing = inputNutrient?.valuePerServing ?? 0;
      } else if (inputNutrient) {
        getCategoryList(baseNutrient, newLabel).push({
          value: inputNutrient?.value,
          perServing: inputNutrient?.valuePerServing,
          unit: baseNutrient.unit.name,
          name: baseNutrient.name,
          children: getChildNutrients(baseNutrient, nutrients),
        });
      }
    }
  }
  return {
    ...servings,
    ...newLabel,
  };
}

function getCategoryList(
  baseNutrient: NutrientWithUnit,
  label: FullNutritionLabel
): NutrientTest[] {
  let list;
  switch (baseNutrient.type) {
    case NutrientType.GENERAL:
      list = label.general;
      break;
    case NutrientType.CARBOHYDRATE:
      list = label.carbohydrates;
      break;
    case NutrientType.FAT:
      list = label.fats;
      break;
    case NutrientType.PROTEIN:
      list = label.proteins;
      break;
    case NutrientType.VITAMIN:
      list = label.vitamins;
      break;
    case NutrientType.MINERAL:
      list = label.minerals;
      break;
    default:
      list = label.general;
  }
  return list;
}

function getChildNutrients(
  baseNutrient: NutrientWithUnit,
  nutrientMapping: NutrientMap
): NutrientTest[] {
  const list: NutrientTest[] = [];
  if (baseNutrient.subNutrients) {
    for (const childNutrient of baseNutrient.subNutrients) {
      if (nutrientMapping.has(childNutrient.id)) {
        const nutrientToAdd = nutrientMapping.get(childNutrient.id);
        if (nutrientToAdd) {
          list.push({
            value: nutrientToAdd?.value,
            perServing: nutrientToAdd?.valuePerServing,
            unit: baseNutrient.unit.name,
            name: baseNutrient.name,
            children: getChildNutrients(
              childNutrient as NutrientWithUnit,
              nutrientMapping
            ),
          });
        }
      }
    }
  }
  return list;
}

// RecipeID ->
type RecipeNutritionFilter = Map<string, NutritionFilterResult>;
type NutritionFilterResult = {
  baseLabel: LabelWithNutrients;
  nutrients: NutrientMap;
};
async function filterRecipesByNutrition(
  nutritionFilter: NutritionFilter[] | undefined | null,
  servingsFilter: NumericalComparison | undefined | null,
  recipeIds?: string[]
): Promise<RecipeNutritionFilter> {
  const results: RecipeNutritionFilter = new Map<
    string,
    NutritionFilterResult
  >();

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
  for (const [recipeId, labels] of recipeAgg) {
    const baseLabel = labels[0];
    const totalServings = baseLabel.servings ?? 1;
    const scaledNutrients = labels.map((label) => {
      const { servings, servingsUsed } = label;
      return scaleNutrients(
        totalServings,
        1,
        label.nutrients,
        servings ?? 1,
        servingsUsed ?? 1
      );
    });

    const summedNutrients = sumNutrients(scaledNutrients);
    try {
      filterNutrition(
        totalServings,
        summedNutrients,
        nutritionFilter,
        servingsFilter
      );
      results.set(recipeId, {
        baseLabel: baseLabel,
        nutrients: summedNutrients,
      });
    } catch (error) {
      if (error instanceof FilterError) {
        console.log(error.message);
      } else {
        throw error;
      }
    }
  }
  return results;
}

function filterNutrition(
  totalservings: number,
  nutrients: NutrientMap,
  nutritionFilter: NutritionFilter[] | undefined | null,
  servingsFilter: NumericalComparison | undefined | null
) {
  if (servingsFilter && !passFilter(totalservings, servingsFilter)) {
    throw new FilterError("Servings filter did not pass");
  }
  if (nutritionFilter) {
    for (const filter of nutritionFilter) {
      const matchedNutrient = nutrients.get(filter.nutrientID);
      if (!matchedNutrient)
        throw new FilterError(`Nutrient ${filter.nutrientID} not on recipe`);
      if (
        !filter.perServing &&
        !passFilter(matchedNutrient.value, filter.target)
      )
        throw new FilterError("Nutrient does not match target");
      if (
        filter.perServing &&
        !passFilter(matchedNutrient.valuePerServing, filter.target)
      )
        throw new FilterError(
          `Nutrient ${filter.nutrientID} does not match perserving target`
        );
    }
  }
}

function passFilter(
  value: number,
  filter: NumericalComparison | null | undefined
) {
  if (!filter) {
    return true;
  }

  if (!Number.isNaN(filter.eq)) {
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

// Define a custom error class
class FilterError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FilterError";
  }
}

export {
  passFilter as compareValues,
  convertToLabel,
  NutrientPerServing,
  FullNutritionLabel,
  NutrientTest,
};
