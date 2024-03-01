import { NutrientType, NutritionLabelNutrient, Prisma } from "@prisma/client";
import { db } from "../../db.js";
import { NumericalComparison, NutritionFilter } from "../../types/gql.js";

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
  id: string;
  name: string;
  value: number;
  unit: string;
  perServing: number;
  children: NutrientTest[];
};

// Argument of whether or not you want advanced view
type AggreagtedNutritionLabel = {
  calories: number;
  caloriesPerServing?: number;
  carbPercentage: number;
  proteinPercentage: number;
  fatPercentage: number;
  general: NutrientTest[];
  carbohydrates: NutrientTest[];
  fats: NutrientTest[];
  proteins: NutrientTest[];
  minerals: NutrientTest[];
  vitamins: NutrientTest[];
};

type ServingInfo = {
  servings?: number;
  servingsUsed?: number;
  servingUnit?: string;
  servingSize?: number;
};

type FullNutritionLabel = AggreagtedNutritionLabel & ServingInfo;

type AggregateLabelInput = {
  recipeId: string;
  totalServings?: number;
  scaleFactor?: number;
  totalServingsUsed?: number;
};

type GroupAggreagteLabelInput = {
  recipes: AggregateLabelInput[];
  advanced: boolean;
};

async function getAggregateLabel(input: GroupAggreagteLabelInput) {
  const scaledNutrients: NutrientMap[] = [];
  for (const recipe of input.recipes) {
    const labels = await db.nutritionLabel.findMany({
      where: { recipeId: recipe.recipeId },
      include: { nutrients: true, servingSizeUnit: true },
    });

    const baseLabel = labels.find(
      (item) => !item.ingredientGroupId && item.isPrimary
    );

    const totalServings = [recipe?.totalServings, baseLabel?.servings, 1].find(
      (number) => !Number.isNaN(number) && number !== 0
    ) as number;

    labels.forEach((label) => {
      scaledNutrients.push(
        scaleNutrients(label.nutrients, {
          totalServings: totalServings,
          servings: baseLabel?.servings ?? 1,
          scaleFactor: recipe.scaleFactor ?? 1,
          servingsUsed: label.servingsUsed ?? 1,
          totalServingsUsed: recipe.totalServingsUsed,
        })
      );
    });
  }

  const summed = sumNutrients(scaledNutrients);
  return toLabel(summed, input.advanced);
}

async function convertToLabel(
  inputLabels: LabelWithNutrients[],
  advanced = false
): Promise<FullNutritionLabel[]> {
  return await Promise.all(
    inputLabels.map(async (label) => {
      const servings = label?.servings ?? 1;
      const scaledNutrients = scaleNutrients(label.nutrients, {
        servings: servings,
        servingsUsed: label?.servingsUsed ?? servings,
      });

      const summed = sumNutrients([scaledNutrients]);
      return await toLabel(summed, advanced, {
        servings: servings,
        servingsUsed: label?.servingsUsed ?? servings,
        servingSize: label?.servingSize ?? 1,
        servingUnit: label?.servingSizeUnit?.name ?? "unit",
      });
    })
  );
}

// NutrientId: -> {value: number; perServing: number}
type NutrientValue = { value: number; valuePerServing: number };
type NutrientMap = Map<string, NutrientValue>;

type ScalingAdjustementsInput = {
  totalServings?: number;
  scaleFactor?: number;
  servings: number;
  servingsUsed?: number;
  totalServingsUsed?: number;
};

function scaleNutrients(
  nutrients: NutritionLabelNutrient[],
  scale: ScalingAdjustementsInput
): NutrientMap {
  const newNutrientValues: NutrientMap = new Map<
    string,
    { value: number; valuePerServing: number }
  >();
  for (const nutrient of nutrients) {
    const servingRatio = scale.servingsUsed
      ? scale.servingsUsed / scale.servings
      : 1;
    const scaleFactor = scale?.scaleFactor ?? 1;
    const totalServings = scale?.totalServings ?? scale.servings;
    let value = nutrient.value * scaleFactor * servingRatio;
    const perValue = value / totalServings;
    if (scale.totalServingsUsed) {
      value = value * scale.totalServingsUsed;
    }
    newNutrientValues.set(nutrient.nutrientId, {
      value: value,
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
  servings?: ServingInfo
): Promise<FullNutritionLabel> {
  const newLabel: FullNutritionLabel = {
    calories: 0,
    caloriesPerServing: 0,
    carbPercentage: 0,
    proteinPercentage: 0,
    fatPercentage: 0,
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

      switch (baseNutrient.name) {
        case "Calories":
          newLabel.calories = inputNutrient?.value ?? 0;
          newLabel.caloriesPerServing = inputNutrient?.valuePerServing ?? 0;
          break;
        case "Total Carbohydrates":
          newLabel.carbPercentage = inputNutrient?.value ?? 0;
          break;
        case "Total Fat":
          newLabel.fatPercentage = inputNutrient?.value ?? 0;
          break;
        case "Protein":
          newLabel.proteinPercentage = inputNutrient?.value ?? 0;
          break;
      }

      getCategoryList(baseNutrient, newLabel).push({
        id: baseNutrient.id,
        value: inputNutrient?.value ?? 0,
        perServing: inputNutrient?.valuePerServing ?? 0,
        unit: baseNutrient.unit.name,
        name: baseNutrient.name,
        children: getChildNutrients(baseNutrient, nutrients),
      });
    }
  }
  newLabel.carbPercentage = (newLabel.carbPercentage * 4) / newLabel.calories;
  newLabel.fatPercentage = (newLabel.fatPercentage * 9) / newLabel.calories;
  newLabel.proteinPercentage =
    (newLabel.proteinPercentage * 4) / newLabel.calories;
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
            id: childNutrient.id,
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
    include: { nutrients: true, servingSizeUnit: true },
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
      let { servings } = label;
      servings = servings ?? 1;
      return scaleNutrients(label.nutrients, {
        servings,
        servingsUsed: label?.servingsUsed ?? servings,
      });
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
  passFilter,
  getAggregateLabel,
  convertToLabel,
  NutrientPerServing,
  FullNutritionLabel,
  NutrientTest,
  filterRecipesByNutrition,
  FilterError,
};
