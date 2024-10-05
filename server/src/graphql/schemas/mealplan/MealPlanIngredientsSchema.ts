import { queryFromInfo } from "@pothos/plugin-prisma";
import { Ingredient, MeasurementUnit, Prisma, UnitType } from "@prisma/client";
import { merge } from "lodash-es";
import { db } from "@/infrastructure/repository/db.js";
import { builder } from "@/graphql/builder.js";
import { ingredient } from "@/graphql/schemas/ingredient/IngredientSchema.js";
import { measurementUnit } from "@/graphql/schemas/common/MeasurementUnitSchema.js";
import { recipeIngredient } from "@/graphql/schemas/recipe/RecipeIngredientSchema.js";
import { convert } from "convert";
import { Unit, BestKind } from "convert";

// ============================================ Types ===================================

const recipeWithIngredient =
  Prisma.validator<Prisma.MealPlanRecipeDefaultArgs>()({
    include: {
      recipe: {
        include: { ingredients: { include: { unit: true, ingredient: true } } },
      },
    },
  });

type RecipeWithIngredient = Prisma.MealPlanRecipeGetPayload;

type RecipeIngredientInclude = {
  include?: Prisma.RecipeIngredientInclude | undefined;
};

type IngredientTotal = {
  qty: number;
  unit: MeasurementUnit | null | undefined;
};

type ScaledRecipeIngredient = {
  recipeId: string;
  factor: number;
  name: string;
  recipeIngredient: RecipeWithIngredient["recipe"]["ingredients"][number];
};

type PreAggregateIngredients = Omit & {
  ingredientsByUnitType: Map;
};
// baseIngredientId -> unitType -> unitId -> list of ingredients

type AggregatedRecipeIngredient = {
  baseIngredient: Ingredient | null | undefined;
  total: IngredientTotal[];
  recipeIngredients: ScaledRecipeIngredient[];
};

const total = builder.objectRef<IngredientTotal>("IngredientTotal").implement({
  fields: (t) => ({
    qty: t.exposeFloat("qty"),
    unit: t.field({
      type: measurementUnit,
      nullable: true,
      resolve: (result) => result.unit,
    }),
  }),
});

const scaledRecipeIngredient = builder
  .objectRef<ScaledRecipeIngredient>("ScaledRecipeIngredient")
  .implement({
    fields: (t) => ({
      recipeId: t.exposeString("recipeId"),
      name: t.exposeString("name"),
      factor: t.exposeFloat("factor"),
      recipeIngredient: t.field({
        type: recipeIngredient,
        resolve: (result) => result.recipeIngredient,
      }),
    }),
  });

const MealPlanIngredient = builder
  .objectRef<AggregatedRecipeIngredient>("MealPlanIngredient")
  .implement({
    fields: (t) => ({
      baseIngredient: t.field({
        type: ingredient,
        nullable: true,
        resolve: (parent) => parent.baseIngredient,
      }),
      total: t.field({
        type: [total],
        resolve: (parent) => parent.total,
      }),
      recipeIngredients: t.field({
        type: [scaledRecipeIngredient],
        resolve: (result) => result.recipeIngredients,
      }),
    }),
  });

// ============================================ Queries =================================
builder.queryFields((t) => ({
  mealPlanIngredients: t.field({
    type: [MealPlanIngredient],
    args: {
      mealPlanId: t.arg.string({ required: true }),
    },
    resolve: async (parent, args, context, info) => {
      const ingredientQuery = queryFromInfo({
        context,
        info,
        path: ["baseIngredient"],
      });
      const recipeIngredientQuery = queryFromInfo({
        context,
        info,
        path: ["recipeIngredients", "recipeIngredient"],
      });

      const recipeIngredientInclude: RecipeIngredientInclude = {
        include: { ingredient: true, unit: true },
        // include: { ingredient: { include: { expirationRule: true } } },
      };
      if ("include" in ingredientQuery && recipeIngredientInclude.include) {
        recipeIngredientInclude.include.ingredient = {
          include: ingredientQuery.include,
        };
      }

      if ("include" in recipeIngredientQuery) {
        recipeIngredientInclude.include = merge(
          recipeIngredientQuery.include,
          recipeIngredientInclude.include
        );
      }

      //   const recipeIngredientInclude = merge()
      const recipes = (await db.mealPlanRecipe.findMany({
        where: { mealPlanId: args.mealPlanId },
        include: {
          recipe: {
            include: { ingredients: recipeIngredientInclude },
          },
        },
      })) as RecipeWithIngredient[];

      const groupedIngredients = recipes.reduce((groups, mealPlanRecipe) => {
        const factor = mealPlanRecipe.factor;
        const { id, name, ingredients } = mealPlanRecipe.recipe;

        for (const ingredient of ingredients) {
          const baseId = ingredient.ingredient?.id ?? "NONE";
          const scaledIngredient: ScaledRecipeIngredient = {
            recipeId: id,
            name: name,
            factor: factor,
            recipeIngredient: ingredient,
          };

          //   Add base ingredient id to list
          if (!groups.has(baseId)) {
            groups.set(baseId, {
              ingredientsByUnitType: new Map<UnitType | "NONE", Map>(),
              baseIngredient: ingredient.ingredient,
              total: [],
            });
          }

          //   Set the unit type
          const unitType = ingredient.unit?.type ?? "NONE";
          if (!groups.get(baseId)?.ingredientsByUnitType.get(unitType)) {
            groups
              .get(baseId)
              ?.ingredientsByUnitType.set(
                unitType,
                new Map<string, ScaledRecipeIngredient[]>()
              );
          }

          //   Set the unit id
          const unitId = ingredient.unit?.id ?? "NONE";
          if (
            !groups
              .get(baseId)
              ?.ingredientsByUnitType.get(unitType)
              ?.get(unitId)
          ) {
            groups
              .get(baseId)
              ?.ingredientsByUnitType.get(unitType)
              ?.set(unitId, []);
          }

          //   Then add the recipe ingredient
          groups
            .get(baseId)
            ?.ingredientsByUnitType.get(unitType)
            ?.get(unitId)
            ?.push(scaledIngredient);
        }

        return groups;
      }, new Map<string, PreAggregateIngredients>());

      const unitMap = await createUnitMap();
      // This loops over the base ingredient
      const finalReturnValues: AggregatedRecipeIngredient[] = [];
      for (const ingredientGroup of groupedIngredients.values()) {
        const result = condenseUnits(
          ingredientGroup.ingredientsByUnitType,
          unitMap
        );
        finalReturnValues.push({
          baseIngredient: ingredientGroup.baseIngredient,
          total: result.total,
          recipeIngredients: result.ingredients,
        });
      }

      return finalReturnValues;
    },
  }),
}));

// LIst of all units assoicated with an ingredient. Cross type and and cross unit.
function condenseUnits(
  unitsByType: PreAggregateIngredients["ingredientsByUnitType"],
  unitMap: Map
): { total: IngredientTotal[]; ingredients: ScaledRecipeIngredient[] } {
  const total: IngredientTotal[] = [];
  const recipeIngredients: ScaledRecipeIngredient[][] = [];

  for (const ingredientsByUnitName of unitsByType.values()) {
    const indiviudalUnits = [...ingredientsByUnitName.values()];
    const targetConversionName = identifyTargetUnit(ingredientsByUnitName);
    total.push(
      ...getTotalForMeasurementType(
        indiviudalUnits,
        unitMap,
        targetConversionName
      )
    );

    recipeIngredients.push(...indiviudalUnits);
  }
  return {
    total,
    ingredients: recipeIngredients.flat(),
  };
}

async function createUnitMap() {
  const units = await db.measurementUnit.findMany({});
  return units.reduce((map, unit) => {
    if (unit.conversionName) {
      map.set(unit.conversionName, unit);
    }
    return map;
  }, new Map<string, MeasurementUnit>());
}

// i.e, will be pass in ingredients that are all weight, or volume, etc. Identify which is the most common unit
function identifyTargetUnit(unitsByType: Map) {
  const largetUnit = [...unitsByType.values()].sort(
    (a, b) => b.length - a.length
  )[0][0];

  return largetUnit.recipeIngredient.unit?.conversionName as
    | Unit
    | null
    | undefined;
}

// i.e, will be pass in ingredients that are all weight, or volume, etc
function getTotalForMeasurementType(
  ingredientByUnitName: ScaledRecipeIngredient[][],
  unitMap: Map,
  target?: Unit | null | undefined
): IngredientTotal[] {
  const unitTotals = ingredientByUnitName.map((ingredientsWithSameName) =>
    // This is the total for all teaspons, or tablespons, etc
    sumIngredientsWithSameUnitName(ingredientsWithSameName)
  );

  // If the units can be converted
  if (unitTotals.at(0)?.unit?.conversionName && target) {
    const targetMeasurementSystem = unitTotals.at(0)?.unit?.system;
    const grandTotal = unitTotals.reduce((grandTotal, unitNameTotal) => {
      // Convert each item (a summation of tsp, or tablespoon) to the target or most common unit and add them together.

      let qtyToAdd = unitNameTotal.total;
      if (unitNameTotal.unit?.conversionName && target) {
        qtyToAdd = convert(
          unitNameTotal.total,
          unitNameTotal.unit.conversionName as Unit
        ).to(target);
      }
      grandTotal = grandTotal + qtyToAdd;
      return grandTotal;
    }, 0);

    // Now convert to the best unit
    const bestUnit = convert(grandTotal, target).to(
      "best",
      (targetMeasurementSystem?.toLowerCase() as BestKind) ?? undefined
    );
    const newUnit = unitMap.get(bestUnit.unit);
    if (newUnit) {
      return [
        {
          qty: bestUnit.quantity,
          unit: newUnit,
        },
      ];
    } else {
      return [
        {
          qty: grandTotal,
          unit: unitMap.get(target),
        },
      ];
    }
  }

  return unitTotals.map((total) => ({ unit: total.unit, qty: total.total }));
}

// Will be passed in ingredients that have the same unit
function sumIngredientsWithSameUnitName(
  ingredentsWithSameUnitName: ScaledRecipeIngredient[]
) {
  let currentUnit: MeasurementUnit | undefined | null;
  const unitTotal = ingredentsWithSameUnitName.reduce((total, ingredient) => {
    if (!currentUnit) {
      currentUnit = ingredient.recipeIngredient.unit;
    }
    return (
      total + ingredient.factor * (ingredient.recipeIngredient.quantity ?? 1)
    );
  }, 0);

  return {
    total: unitTotal,
    unit: currentUnit,
  };
}
