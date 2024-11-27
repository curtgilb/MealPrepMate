import { MealPlanServingsFieldFragment } from "@/gql/graphql";
import { RecipeNutrientLookup } from "@/hooks/usePlanRecipeLabels";

export type SummedNutrients = {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  alcohol: number;
  servings: number;
  nutrients: Map<string, number>;
};

export function sumNutrients(
  servings: MealPlanServingsFieldFragment[],
  lookup: RecipeNutrientLookup
): SummedNutrients {
  return servings.reduce(
    (acc, serving) => {
      const recipeNutrients = lookup.get(serving.mealPlanRecipeId);
      if (recipeNutrients !== undefined) {
        acc.calories =
          acc.calories +
          recipeNutrients.calories.perServing * serving.numberOfServings;

        acc.protein =
          acc.protein +
          recipeNutrients.protein.perServing * serving.numberOfServings;

        acc.fat =
          acc.fat + recipeNutrients.fat.perServing * serving.numberOfServings;

        acc.carbs =
          acc.carbs +
          recipeNutrients.carbs.perServing * serving.numberOfServings;

        acc.alcohol =
          acc.alcohol +
          recipeNutrients.alcohol.perServing * serving.numberOfServings;

        acc.servings = acc.servings + serving.numberOfServings;

        for (const [nutrientId, value] of recipeNutrients.nutrients.entries()) {
          const prevValue = acc.nutrients.get(nutrientId) ?? 0;
          acc.nutrients.set(
            nutrientId,
            prevValue + value.perServing * serving.numberOfServings
          );
        }
      }

      return acc;
    },
    {
      calories: 0,
      protein: 0,
      fat: 0,
      carbs: 0,
      alcohol: 0,
      servings: 0,
      nutrients: new Map<string, number>(),
    }
  );
}

export function averageNutrients(
  nutrients: SummedNutrients,
  divisor: number
): SummedNutrients {
  const averaged = new Map<string, number>();
  for (const [id, value] of nutrients.nutrients) {
    averaged.set(id, Math.round(value / divisor));
  }

  return {
    calories: Math.round(nutrients.calories / divisor),
    protein: Math.round(nutrients.protein / divisor),
    fat: Math.round(nutrients.fat / divisor),
    carbs: Math.round(nutrients.carbs / divisor),
    alcohol: Math.round(nutrients.alcohol / divisor),
    servings: nutrients.servings,
    nutrients: averaged,
  };
}

function getDayTotal() {}

function getWeekTotal() {}
