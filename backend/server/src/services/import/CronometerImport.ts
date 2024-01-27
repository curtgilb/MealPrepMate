import { Import, ImportRecord, Prisma } from "@prisma/client";
import { getFileMetaData } from "./ImportService.js";
import { hash } from "./ImportService.js";
import { db } from "../../db.js";
import { Match } from "./RecipeKeeperImport.js";
import { CronometerParser } from "../parse/CronometerParser.js";
import { CronometerNutrition } from "../../types/CustomTypes.js";
import { ImportQuery } from "../../types/CustomTypes.js";
// Does hashing the buffer or string result in a different hash

export async function processCronometerImport(
  source: File,
  query: ImportQuery
): Promise<Import> {
  const fileMeta = getFileMetaData(source.name);
  const fileHash = hash(await source.text());
  // const bufferHash = hash(Buffer.from(await source.arrayBuffer()));

  // Take hash of file to compare to existing imports
  // If hash already exists, do not import
  const lastImport = await db.import.findFirst({
    where: { type: "CRONOMETER" },
    orderBy: { createdAt: "desc" },
  });

  if (lastImport?.fileHash === fileHash) {
    throw Error("No changes made since the last import");
  }

  // const records = await readCSV(await source.text(), false);
  const parsedRecords = await new CronometerParser().parse(await source.text());
  const matches = await findCronometerLabelMatches(parsedRecords);

  for (const [index, record] of parsedRecords.entries()) {
    if (matches[index].importStatus === "IMPORTED") {
      const label =
        await db.nutritionLabel.createCronometerNutritionLabel(record);
      matches[index].matchingLabelId = label.id;
    }
  }

  return await db.import.create({
    data: {
      fileName: fileMeta.name,
      fileHash: fileHash,
      type: "CRONOMETER",
      status: "PENDING",
      importRecords: {
        createMany: {
          data: parsedRecords.map((record, index) => ({
            rawInput: record.rawInput,
            name: record.foodName,
            parsedFormat: record as unknown as Prisma.JsonObject,
            status: matches[index].importStatus,
            recipeId: matches[index].matchingRecipeId,
            nutritionLabelId: matches[index].matchingLabelId,
          })),
        },
      },
    },
    ...query,
  });
}

async function findCronometerLabelMatches(
  data: CronometerNutrition[]
): Promise<Match[]> {
  const matches: Match[] = [];
  const importRecords = await db.importRecord.findMany({
    where: { import: { type: "CRONOMETER" } },
    orderBy: { createdAt: "desc" },
    select: {
      rawInput: true,
      id: true,
      nutritionLabel: { select: { id: true, name: true } },
    },
  });
  // Lookup map rawInput -> nutritionLabelId
  // and name --> nutritionLabelId
  const labelLookup = importRecords.reduce(
    (aggregation: Map<string, string>, record) => {
      if (!aggregation.has(record.rawInput) && record.nutritionLabel?.id) {
        aggregation.set(record.rawInput, record.nutritionLabel.id);
      }
      if (
        record.nutritionLabel?.name &&
        !aggregation.has(record.nutritionLabel.name)
      ) {
        aggregation.set(record.nutritionLabel.name, record.nutritionLabel.id);
      }
      return aggregation;
    },
    new Map()
  );

  for (const row of data) {
    // Search for a recipe match
    const recipe = await db.recipe.findFirst({
      where: { title: { contains: row.foodName, mode: "insensitive" } },
    });

    // Check for exact match
    if (labelLookup.has(row.rawInput)) {
      matches.push({
        matchingLabelId: labelLookup.get(row.rawInput) as string,
        matchingRecipeId: recipe?.id,
        importStatus: "DUPLICATE",
      });
      continue;
    }

    // Check for approximate match
    if (labelLookup.has(row.foodName)) {
      matches.push({
        matchingLabelId: labelLookup.get(row.foodName) as string,
        matchingRecipeId: recipe?.id,
        importStatus: "PENDING",
      });
      continue;
    }

    matches.push({
      matchingLabelId: undefined,
      matchingRecipeId: recipe?.id,
      importStatus: "IMPORTED",
    });
  }
  return matches;
}
