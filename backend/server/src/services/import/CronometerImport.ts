import { Import, Prisma } from "@prisma/client";
import { db } from "../../db.js";
import { ImportQuery } from "../../types/CustomTypes.js";
import {
  CronometerParser,
  CronometerRecord,
} from "./parsers/CronometerParser.js";
import { NutritionLabelValidation } from "../../validations/graphqlValidation.js";

export async function processCronometerImport(
  source: File | string,
  query: ImportQuery
): Promise<Import> {
  const parser = new CronometerParser(source);
  const output = await parser.parse();

  const lastImport = await db.import.findFirst({
    where: { type: "CRONOMETER" },
    orderBy: { createdAt: "desc" },
  });

  if (lastImport?.fileHash === output.recordHash) {
    return await db.import.create({
      data: {
        fileName: output.fileName,
        fileHash: output.recordHash,
        type: "CRONOMETER",
        status: "DUPLICATE",
      },
      ...query,
    });
  }

  // Attempt to find match and create nutrition label if needed
  for (const record of output.records) {
    await findCronometerLabelMatches(record);
    if (record.getMatch()?.status === "IMPORTED") {
      const matchingRecipe = await db.recipe.findFirst({
        where: {
          title: { contains: record.getParsedData().name, mode: "insensitive" },
        },
      });
      const nutritionLabel = await record.transform(
        NutritionLabelValidation,
        output.imageMapping,
        matchingRecipe?.id ?? undefined
      );
      const createdLabel = await db.nutritionLabel.createNutritionLabel({
        baseLabel: nutritionLabel,
      });
      record.setMatch({ matchId: createdLabel[0].id, status: "IMPORTED" });
      record.setMatchingRecipeId(matchingRecipe?.id);
    }
  }

  return await db.import.create({
    data: {
      fileName: output.fileName,
      fileHash: output.recordHash,
      type: "CRONOMETER",
      status: "PENDING",
      importRecords: {
        createMany: {
          data: output.records.map((record) => ({
            rawInput: record.getRawInput(),
            hash: record.getRecordHash(),
            name: record.getParsedData().name,
            parsedFormat:
              record.getParsedData() as unknown as Prisma.JsonObject,
            status: record.getMatch()?.status || "PENDING",
            recipeId: record.getMatchingRecipeId(),
            nutritionLabelId: record.getMatch()?.matchId,
          })),
        },
      },
    },
    ...query,
  });
}

async function findCronometerLabelMatches(label: CronometerRecord) {
  const importRecord = await db.importRecord.findFirst({
    where: {
      OR: [
        { hash: label.getRecordHash() },
        { externalId: label.getExternalId() },
      ],
    },
  });
  if (importRecord) {
    if (importRecord.hash === label.getRecordHash()) {
      label.setMatch({ matchId: importRecord.id, status: "DUPLICATE" });
    } else if (importRecord.externalId === label.getExternalId()) {
      label.setMatch({ matchId: importRecord.id, status: "UPDATED" });
    }
  }

  const matchingName = await db.nutritionLabel.findFirst({
    where: { name: label.getParsedData().name },
  });

  matchingName &&
    label.setMatch({ matchId: matchingName.id, status: "PENDING" });

  label.setMatch({ matchId: undefined, status: "IMPORTED" });
}
