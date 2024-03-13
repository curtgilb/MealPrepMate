import { Prisma } from "@prisma/client";
import { db } from "../db.js";
import { IngredientSearch } from "../services/search/IngredientSearch.js";
import { UnitSearch } from "../services/search/UnitSearch.js";

interface IngredientMatch {
  ingredientId: string | undefined | null;
  unitId: string | undefined | null;
}

interface IngredientSearchInput {
  ingredientName?: string;
  unit?: string;
  matchingRecipeSearch?: {
    matchingRecipeId?: string;
    fullIngredientLine: string;
  };
}

const RecipeIngredient = Prisma.validator<Prisma.RecipeIngredientDefaultArgs>()(
  {
    include: {
      group: true,
    },
  }
);

type RecipeIngredientWithGroup = Prisma.RecipeIngredientGetPayload<
  typeof RecipeIngredient
>;

class IngredientMatcher {
  units: UnitSearch | undefined;
  ingredients: IngredientSearch | undefined;
  lastUsedId: string | undefined = undefined;
  matchingRecipeGroupMap: Map<string, RecipeIngredientWithGroup> | undefined;

  constructor(units?: UnitSearch, ingredients?: IngredientSearch) {
    this.units = units;
    this.ingredients = ingredients;
  }

  async getMatchingRecipeIngredients(existingRecipeId: string) {
    const ingredients = await db.recipeIngredient.findMany({
      where: { recipeId: existingRecipeId },
      include: { group: true },
    });
    return ingredients.reduce((agg, ingredient) => {
      agg.set(ingredient.sentence, ingredient);
      return agg;
    }, new Map<string, RecipeIngredientWithGroup>());
  }

  async match({
    ingredientName,
    unit,
    matchingRecipeSearch,
  }: IngredientSearchInput): Promise<IngredientMatch> {
    if (
      matchingRecipeSearch &&
      matchingRecipeSearch.matchingRecipeId &&
      matchingRecipeSearch.matchingRecipeId !== this.lastUsedId
    ) {
      this.matchingRecipeGroupMap = await this.getMatchingRecipeIngredients(
        matchingRecipeSearch.matchingRecipeId
      );
      const matchingLine = this.matchingRecipeGroupMap.get(
        matchingRecipeSearch.fullIngredientLine
      );
      if (matchingLine) {
        return {
          ingredientId: matchingLine.ingredientId,
          unitId: matchingLine.measurementUnitId,
        };
      }
    }

    if (!this.ingredients)
      this.ingredients = new IngredientSearch(await db.ingredient.findMany({}));
    if (!this.units)
      this.units = new UnitSearch(await db.measurementUnit.findMany({}));

    return {
      ingredientId: ingredientName
        ? this.ingredients.search(ingredientName)?.id
        : null,
      unitId: unit ? this.units.search(unit)?.id : null,
    };
  }
}

export { IngredientMatcher };
