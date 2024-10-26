import { Prisma } from "@prisma/client";

export type NumericalFilter = {
  lte: number | undefined;
  equals: number | undefined;
  gte: number | undefined;
};

export type MacroFilter = {
  caloriesPerServing: NumericalFilter | undefined;
  carbPerServing: NumericalFilter | undefined;
  fatPerServing: NumericalFilter | undefined;
  proteinPerServing: NumericalFilter | undefined;
  alcoholPerServing: NumericalFilter | undefined;
};

export type NutrientFilter = {
  nutrientId: string;
  perServing: boolean;
  target: NumericalFilter;
};

export type IngredientFilter = {
  ingredientId: string;
  amount: NumericalFilter | undefined;
  unitId: string | undefined;
};

export type RecipeFilter = {
  searchTerm: string | undefined;
  numOfServings: NumericalFilter | undefined;
  courseIds: string[] | undefined;
  cuisineIds: string[] | undefined;
  categoryIds: string[] | undefined;
  prepTime: NumericalFilter | undefined;
  cookTime: NumericalFilter | undefined;
  marinadeTime: NumericalFilter | undefined;
  totalPrepTime: NumericalFilter | undefined;
  leftoverFridgeLife: NumericalFilter | undefined;
  leftoverFreezerLife: NumericalFilter | undefined;
  macroFilter: MacroFilter | undefined;
  nutrientFilters: NutrientFilter[] | undefined;
  ingredientFilters: IngredientFilter[] | undefined;
  ingredientFreshDays: NumericalFilter | undefined;
};

type RecipeQuery = {
  include?: Prisma.RecipeInclude | undefined;
  select?: Prisma.RecipeSelect | undefined;
};

export const recipeExtension = Prisma.defineExtension((client) => {
  return client.$extends({
    model: {
      recipe: {
        async search(filter: RecipeFilter | undefined, query?: RecipeQuery) {
          // @ts-ignore
          return await client.recipe.findMany({
            ...query,
            orderBy: { name: "asc" },
            where: {
              name: filter?.searchTerm,
              course: filter?.courseIds
                ? {
                    every: {
                      id: {
                        in: filter?.courseIds,
                      },
                    },
                  }
                : undefined,
              cuisine: filter?.cuisineIds
                ? {
                    every: {
                      id: {
                        in: filter?.cuisineIds,
                      },
                    },
                  }
                : undefined,
              category: filter?.categoryIds
                ? {
                    every: {
                      id: {
                        in: filter?.categoryIds,
                      },
                    },
                  }
                : undefined,
              cookingTime: filter?.cookTime,
              marinadeTime: filter?.marinadeTime,
              leftoverFridgeLife: filter?.leftoverFridgeLife,
              leftoverFreezerLife: filter?.leftoverFreezerLife,
              AND:
                filter?.ingredientFilters &&
                filter.ingredientFilters.map((ingredient) => ({
                  ingredients: {
                    some: {
                      ingredientId: ingredient.ingredientId,
                      quantity: ingredient.amount,
                      measurementUnitId: ingredient.unitId,
                    },
                  },
                })),
              aggregateLabel: {
                servings: filter?.numOfServings,
                caloriesPerServing: filter?.macroFilter?.caloriesPerServing,
                carbs: filter?.macroFilter?.carbPerServing,
                fat: filter?.macroFilter?.fatPerServing,
                alcohol: filter?.macroFilter?.alcoholPerServing,
                protein: filter?.macroFilter?.proteinPerServing,
                AND:
                  filter?.nutrientFilters &&
                  filter.nutrientFilters.map((nutrient) => {
                    const valueFilter = nutrient.perServing
                      ? { valuePerServing: nutrient.target }
                      : { value: nutrient.target };
                    return {
                      nutrients: {
                        some: { nutrientId: nutrient.nutrientId },
                        valueFilter,
                      },
                    };
                  }),
              },
            },
          });
        },
      },
    },
  });
});
