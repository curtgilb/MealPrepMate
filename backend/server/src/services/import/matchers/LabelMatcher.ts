// Matching Strategy
// 1. Check for a previous import record that had the same hash or extenal ID
// 2. Check nutrition label for an exact match on the name (ignoring case)
// 3. Check for matching recipe name
// 4. Check for a matching ingredientGroup

import { db } from "../../../db.js";
import { MatchManager } from "../importers/Import.js";

class LabelImportMatcher {
  async match(hash: string, externalId: string | undefined, name: string) {
    const found = name.match(/(.*)?\(([^)]+)\)$/m);
    const recipeName = found ? found[1].trim() : name;
    const ingredientGroup = found ? found[2] : undefined;
    const match = new MatchManager({ status: "IMPORTED" });
    const [importRecord, matchingLabel, matchingRecipe, recipeIngredientGroup] =
      await db.$transaction([
        db.importRecord.findFirst({
          where: {
            OR: [{ hash: hash }, { externalId: externalId }],
          },
        }),
        db.nutritionLabel.findFirst({
          where: {
            name: {
              contains: name,
              mode: "insensitive",
            },
          },
        }),
        db.recipe.findFirst({
          where: {
            name: {
              contains: recipeName,
              mode: "insensitive",
            },
          },
        }),
        db.recipeIngredientGroup.findFirst({
          where: {
            name: {
              contains: ingredientGroup,
              mode: "insensitive",
            },
            recipe: {
              name: { contains: recipeName, mode: "insensitive" },
            },
          },
          include: {
            nutritionLabel: true,
          },
        }),
      ]);
    if (importRecord) {
      const ignore = importRecord.status === "IGNORED";
      if (importRecord.hash === hash && hash) {
        match.setMatch({
          status: ignore ? "IGNORED" : "DUPLICATE",
        });
      } else if (importRecord.externalId === externalId && externalId) {
        match.setMatch({
          status: "UPDATED",
        });
      }
      match.setMatch({
        labelMatchId: importRecord.nutritionLabelId ?? undefined,
        recipeMatchId: importRecord.recipeId ?? undefined,
        ingredientGroupId: importRecord.ingredientGroupId ?? undefined,
      });
      return match.getMatch();
    }
    // Check for standalone label with matching name
    if (matchingLabel) {
      match.setMatch({ labelMatchId: matchingLabel.id, status: "UPDATED" });
    }

    // Check for a recipe with matching name
    if (matchingRecipe) {
      match.setMatch({
        recipeMatchId: matchingRecipe.id,
      });
    }

    // Check for matching recipe ingredient group
    if (recipeIngredientGroup) {
      match.setMatch({ ingredientGroupId: recipeIngredientGroup.id });
    }

    return match.getMatch();
  }
}

export { LabelImportMatcher };
