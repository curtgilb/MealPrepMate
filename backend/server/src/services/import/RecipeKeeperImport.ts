import {
  RecipeKeeperParser,
  RecipeKeeperRecord,
} from "./parsers/RecipeKeeperParser.js";
import { Prisma } from "@prisma/client";
import { db } from "../../db.js";
import { ImportQuery } from "../../types/CustomTypes.js";
import {
  NutritionLabelValidation,
  RecipeInputValidation,
} from "../../validations/graphqlValidation.js";

export async function processRecipeKeeperImport(
  source: string | File,
  query?: ImportQuery
) {
  // 1. unzip file and get the last import to compare against (if it is the same hash, it will not import)
  const recipeKeeperUpload = new RecipeKeeperParser(source);
  const output = await recipeKeeperUpload.parse();
  const lastImport = await db.import.findFirst({
    where: { type: "RECIPE_KEEPER" },
    orderBy: { createdAt: "desc" },
  });

  // Check if duplicate
  if (lastImport?.fileHash === output.recordHash)
    return await db.import.create({
      data: {
        fileName: output.fileName,
        fileHash: output.recordHash,
        type: "RECIPE_KEEPER",
        status: "DUPLICATE",
      },
      ...query,
    });

  //  3. Search for any matching recipes already in the database.
  for (const record of output.records) {
    await findRecipeMatches(record);
  }

  //  4. Save the data to the database
  return await db.$transaction(
    async (tx) => {
      for (const record of output.records) {
        const match = record.getMatch();
        if (!match?.matchId) {
          const recipeInput = await record.transform(
            RecipeInputValidation,
            output.imageMapping
          );
          const { id } = await tx.recipe.createRecipe(recipeInput);
          record.setMatch({ matchId: id, status: "IMPORTED" });
          const nutritionLabel = await record.toNutritionLabel(
            NutritionLabelValidation,
            id
          );
          await tx.nutritionLabel.createNutritionLabel({
            baseLabel: nutritionLabel,
          });
        }
      }
      return await tx.import.create({
        data: {
          fileName: output.fileName,
          fileHash: output.recordHash,
          type: "RECIPE_KEEPER",
          status: "PENDING",
          imageMapping: Object.fromEntries(
            output.imageMapping
          ) as Prisma.JsonObject,
          importRecords: {
            createMany: {
              data: output.records.map((record) => ({
                name: record.getTitle(),
                hash: record.getRecordHash(),
                status: record.getMatch()?.status || "PENDING",
                parsedFormat: record.getParsedObject() as Prisma.JsonObject,
                recipeId: record.getMatch()?.matchId,
                externalId: record.getExternalId(),
              })),
            },
          },
        },
        ...query,
      });
    },
    { timeout: 10000 }
  );
}

// Order of matches returned is important. They should align with the recipes array passed in.
async function findRecipeMatches(recipe: RecipeKeeperRecord) {
  // 1. Check for an exact match by comparing hash : DUPLICATE
  const importRecord = await db.importRecord.findFirst({
    where: { OR: [{ hash: recipe.getRecordHash() }, {}] },
    select: { recipeId: true, hash: true, externalId: true },
  });
  if (
    importRecord &&
    importRecord.recipeId &&
    importRecord.hash === recipe.getRecordHash()
  ) {
    recipe.setMatch({
      matchId: importRecord.recipeId,
      status: "DUPLICATE",
    });
  }
  // 2. Check for updateable match by comparing externalID : UPDATE
  else if (
    importRecord &&
    importRecord.recipeId &&
    importRecord.externalId === recipe.externalId
  ) {
    recipe.setMatch({
      matchId: importRecord.recipeId,
      status: "UPDATED",
    });
  }
  // 3. Check for updateable match by comparing title : UPDATE
  const recipeMatch = await db.recipe.findFirst({
    where: { title: { contains: recipe.getTitle(), mode: "insensitive" } },
    select: { id: true },
  });
  if (recipeMatch) {
    recipe.setMatch({ matchId: recipeMatch.id, status: "PENDING" });
  }
  // 4. If no match is found, mark the recipe to be imported : IMPORTED
  recipe.setMatch({ matchId: undefined, status: "IMPORTED" });
}

await processRecipeKeeperImport(
  "C:\\Users\\cgilb\\Documents\\Code\\mealplanner\\backend\\server\\data\\RecipeKeeper.zip"
);
