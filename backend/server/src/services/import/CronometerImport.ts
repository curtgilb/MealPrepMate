import { Prisma, ImportRecord, Import } from "@prisma/client";
import { db } from "../../db.js";
import {
  CronometerParser,
  CronometerRecord,
} from "./parsers/CronometerParser.js";
import { NutritionLabelValidation } from "../../validations/graphqlValidation.js";
import {
  ImportService,
  ImportServiceInput,
  MatchManager,
} from "./ImportService.js";
import { createNutritionLabelStmt } from "../../models/NutritionExtension.js";
import { Match, RecordWithImport } from "../../types/CustomTypes.js";

class CronometerImport extends ImportService {
  constructor(input: ImportServiceInput | Import) {
    super(input);
  }

  async processImport(): Promise<void> {
    const parser = new CronometerParser(this.input.source);
    const output = await parser.parse();
    const lastImport = await this.getLastImport();

    if (lastImport?.fileHash === output.recordHash) {
      await this.updateImport({
        fileName: output.fileName,
        fileHash: output.recordHash,
        status: "DUPLICATE",
      });
    }

    // Attempt to find match and create nutrition label if needed
    type MatchedData = {
      record: CronometerRecord;
      match: Match;
      dbStmt?: Prisma.RecipeCreateInput;
    };

    const preparedRecords = await Promise.all(
      output.records.map(async (record) => {
        const match = await this.findCronometerLabelMatches(record);
        let dbStmt;
        if (match.status === "IMPORTED" || match.status === "UPDATED") {
          const nutritionLabel = await record.transform(
            NutritionLabelValidation
          );
          dbStmt = createNutritionLabelStmt(nutritionLabel, true);
        }
        return { record, match, dbStmt } as MatchedData;
      })
    );

    await db.$transaction(async (tx) => {
      for (const { record, match, dbStmt } of preparedRecords) {
        let draftId;
        if (dbStmt) {
          draftId = (
            await tx.nutritionLabel.create({
              data: dbStmt,
              select: { id: true },
            })
          ).id;
        }

        await tx.importRecord.create({
          data: {
            import: { connect: { id: this.input.import.id } },
            hash: output.recordHash,
            externalId: record.getExternalId(),
            name: record.getParsedData().name,
            parsedFormat: record.getParsedData() as Prisma.JsonObject,
            status: match.status,
            verifed: false,
            recipe: { connect: { id: match.recipeMatchId } },
            nutritionLabel: { connect: { id: match.labelMatchId } },
            draftId: draftId,
          },
        });

        await this.updateImport(
          {
            fileName: output.fileName,
            fileHash: output.recordHash,
            status: "REVIEW",
          },
          tx
        );
      }
    });
  }

  async recreateRecord(record: ImportRecord): Promise<string> {
    const label = record.parsedFormat as Prisma.JsonObject;
    const rehydrated = new CronometerRecord(JSON.stringify(label));
    const input = await rehydrated.transform(NutritionLabelValidation);
    const newLabel = await db.nutritionLabel.create({
      data: createNutritionLabelStmt(input, true),
    });
    return newLabel.id;
  }

  async findCronometerLabelMatches(label: CronometerRecord) {
    const match = new MatchManager({ status: "IMPORTED" });
    const [importRecord, matchingLabel, matchingRecipe] = await db.$transaction(
      [
        db.importRecord.findFirst({
          where: {
            OR: [
              { hash: label.getRecordHash() },
              { externalId: label.getExternalId() },
            ],
          },
        }),
        db.nutritionLabel.findFirst({
          where: {
            name: { contains: label.getParsedData().name, mode: "insensitive" },
          },
        }),
        db.recipe.findFirst({
          where: {
            title: {
              contains: label.getParsedData().name,
              mode: "insensitive",
            },
          },
        }),
      ]
    );

    if (importRecord) {
      const ignore = importRecord.status === "IGNORED";
      if (importRecord.hash === label.getRecordHash()) {
        match.setMatch({
          labelMatchId: importRecord.nutritionLabelId ?? undefined,
          recipeMatchId: importRecord.recipeId ?? undefined,
          status: ignore ? "IGNORED" : "DUPLICATE",
        });
      } else if (importRecord.externalId === label.getExternalId()) {
        match.setMatch({
          labelMatchId: importRecord.nutritionLabelId ?? undefined,
          recipeMatchId: importRecord.recipeId ?? undefined,
          status: "UPDATED",
        });
      }
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
        status: match.getMatch().status,
      });
    }

    return match.getMatch();
  }
}

export { CronometerImport };
