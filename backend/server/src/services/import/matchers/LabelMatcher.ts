// Matching Strategy
// 1. Check for a previous import record that had the same hash or extenal ID
// 2. Check nutrition label for an exact match on the name (ignoring case)
// 3. Check for matching recipe name
// 4. Check for a matching ingredientGroup

import { Prisma, Recipe, RecordStatus } from "@prisma/client";
import { db } from "../../../db.js";
import { CreateNutritionLabelInput } from "../../../types/gql.js";
import { compareTwoStrings } from "../../../util/utils.js";

interface Match {
  recipeMatchId?: string | undefined | null;
  status: RecordStatus;
  hash: string;
  externalId: string | undefined | null;
  name: string;
}

export interface MatchedLabel extends Match {
  labelMatchId?: string | undefined | null;
  ingredientGroupId?: string | undefined | null;
  label: CreateNutritionLabelInput;
}

class FoundMatch {}

const importRecordWithLabel =
  Prisma.validator<Prisma.ImportRecordDefaultArgs>()({
    include: {
      nutritionLabel: {
        include: { nutrients: true },
      },
    },
  });

type ImportWithLabel = Prisma.ImportRecordGetPayload<
  typeof importRecordWithLabel
>;

const nutritionLabelWithNutrients =
  Prisma.validator<Prisma.NutritionLabelDefaultArgs>()({
    include: {
      nutrients: true,
    },
  });

type LabelWithNutrients = Prisma.NutritionLabelGetPayload<
  typeof nutritionLabelWithNutrients
>;

const groupWithNutrients =
  Prisma.validator<Prisma.RecipeIngredientGroupDefaultArgs>()({
    include: {
      nutritionLabel: { include: { nutrients: true } },
    },
  });

type RecipeGroupWithNutrients = Prisma.RecipeIngredientGroupGetPayload<
  typeof groupWithNutrients
>;

type RecipeNameComparison = {
  percentMatch: number;
  recipe: Recipe | undefined;
};

type GroupNameComparison = {
  percentMatch: number;
  group: RecipeGroupWithNutrients | undefined;
};

class LabelImportMatcher {
  getRecipeNameAndGroup(name: string) {
    const found = name.match(/(.*)?\(([^)]+)\)$/m);
    const recipeName = found ? found[1].trim() : name;
    const ingredientGroup = found ? found[2] : undefined;
    return {
      recipeName,
      ingredientGroup,
    };
  }

  findBestMatch(name: string, recipes: Recipe[]) {
    return recipes.reduce(
      (bestMatchSoFar, recipe) => {
        const percentMatch = compareTwoStrings(
          recipe.name.toLowerCase(),
          name.toLowerCase()
        );
        if (percentMatch > bestMatchSoFar.percentMatch) {
          return { percentMatch, recipe } as RecipeNameComparison;
        }
        return bestMatchSoFar;
      },
      { percentMatch: 0 } as RecipeNameComparison
    );
  }

  async searchExistingRecords(
    hash: string,
    externalId: string | undefined,
    name: string,
    group: string | undefined
  ) {
    return await db.$transaction([
      db.importRecord.findFirst({
        where: {
          OR: [{ hash: hash }, { externalId: externalId }],
        },
        include: {
          nutritionLabel: {
            include: { nutrients: true },
          },
        },
      }),
      db.recipe.findMany({
        where: {
          name: {
            contains: name,
            mode: "insensitive",
          },
        },
      }),
      db.recipeIngredientGroup.findMany({
        where: {
          name: {
            contains: group,
            mode: "insensitive",
          },
          recipe: {
            name: { contains: name, mode: "insensitive" },
          },
        },
        include: {
          nutritionLabel: { include: { nutrients: true } },
        },
      }),
    ]);
  }

  compareLabelValues(
    original: LabelWithNutrients | null,
    incoming: CreateNutritionLabelInput
  ) {
    if (!original) return false;
    if (original.servings !== incoming.servings) {
      return false;
    }

    if (original.nutrients.length !== incoming.nutrients?.length) {
      return false;
    }

    const nutrientMap = original.nutrients.reduce((acc, nutrient) => {
      acc.set(nutrient.nutrientId, nutrient.value);
      return acc;
    }, new Map<string, number>());

    let matchingNutrients = true;
    for (const nutrient of incoming.nutrients) {
      if (nutrientMap.get(nutrient.nutrientId) !== nutrient.value) {
        matchingNutrients = false;
        break;
      }
    }

    return matchingNutrients;
  }

  checkForPreviousImport(
    importRecord: ImportWithLabel | null,
    label: CreateNutritionLabelInput,
    match: MatchedLabel
  ) {
    if (importRecord) {
      match.recipeMatchId = importRecord.recipeId;
      match.status = "DUPLICATE";
      match.labelMatchId = importRecord.nutritionLabelId;
      match.ingredientGroupId = importRecord.ingredientGroupId;

      if (importRecord.status === RecordStatus.IGNORED) {
        match.status = "IGNORED";
        throw new FoundMatch();
      }

      if (!this.compareLabelValues(importRecord.nutritionLabel, label)) {
        match.status = "UPDATED";
      }

      throw new FoundMatch();
    }
  }

  checkForExistingMatch(
    name: string,
    groupName: string | undefined,
    label: CreateNutritionLabelInput,
    recipes: Recipe[],
    groups: RecipeGroupWithNutrients[] | null,
    match: MatchedLabel
  ) {
    const bestRecipeMatch = this.findBestMatch(name, recipes);
    const matchingRecipeId = bestRecipeMatch.recipe?.id;
    if (matchingRecipeId) {
      match.status = "IMPORTED";
      match.recipeMatchId = matchingRecipeId;

      // TODO: match with nutrition label already on the main

      if (groups && groupName) {
        const groupsOnMatchingRecipe = groups
          .filter((group) => group.recipeId === matchingRecipeId)
          .reduce(
            (bestMatchSoFar, group) => {
              const percentMatch = compareTwoStrings(groupName, group.name);
              if (percentMatch > bestMatchSoFar.percentMatch) {
                return { percentMatch, group } as GroupNameComparison;
              }
              return bestMatchSoFar;
            },
            { percentMatch: 0 } as GroupNameComparison
          );

        if (groupsOnMatchingRecipe?.group) {
          match.ingredientGroupId = groupsOnMatchingRecipe.group.id;
          match.labelMatchId = groupsOnMatchingRecipe.group.nutritionLabel?.id;
        }
      }
      throw new FoundMatch();
    }
  }

  async match(
    hash: string,
    externalId: string | undefined,
    name: string,
    label: CreateNutritionLabelInput
  ): Promise<MatchedLabel> {
    const match: MatchedLabel = {
      label,
      hash,
      externalId,
      name,
      status: "IMPORTED",
    };

    const { recipeName, ingredientGroup } = this.getRecipeNameAndGroup(name);
    const [importRecord, matchingRecipe, recipeIngredientGroup] =
      await this.searchExistingRecords(
        hash,
        externalId,
        recipeName,
        ingredientGroup
      );
    try {
      this.checkForPreviousImport(importRecord, label, match);
      this.checkForExistingMatch(
        recipeName,
        ingredientGroup,
        label,
        matchingRecipe,
        recipeIngredientGroup,
        match
      );
    } catch (error) {
      if (error instanceof FoundMatch) {
        return match;
      } else {
        throw error;
      }
    }
    return match;
  }
}

export { LabelImportMatcher };
