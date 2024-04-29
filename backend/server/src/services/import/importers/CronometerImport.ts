import { Prisma, ImportRecord, Import, RecordStatus } from "@prisma/client";
import { db } from "../../../db.js";
import {
  CronometerParser,
  CronometerParsedRecord,
} from "../parsers/CronometerParser.js";
import { NutritionLabelValidation } from "../../../validations/RecipeValidation.js";
import { Importer, ImportServiceInput } from "./Import.js";
import { createNutritionLabelStmt } from "../../../models/NutritionExtension.js";
import { Match } from "../../../types/CustomTypes.js";
import { LabelImportMatcher } from "../matchers/LabelMatcher.js";

// Attempt to find match and create nutrition label if needed
type MatchedData = {
  record: CronometerParsedRecord;
  match: Match;
  dbStmt?: Prisma.NutritionLabelCreateInput;
};

class CronometerImport extends Importer {
  constructor(input: ImportServiceInput | Import) {
    super(input);
  }

  async createDraft(record: ImportRecord, newStatus: RecordStatus) {
    const label = record.parsedFormat as Prisma.JsonObject;
    const rehydrated = new CronometerParsedRecord(JSON.stringify(label));
    const matchedLabel = await this.matchLabels([rehydrated]);

    await db.$transaction(async (tx) => {
      let newLabelId;
      if (matchedLabel[0].dbStmt) {
        const newLabel = await tx.nutritionLabel.create({
          data: matchedLabel[0].dbStmt,
        });
        newLabelId = newLabel.id;
      }
      const { match } = matchedLabel[0];
      await tx.importRecord.update({
        where: { id: record.id },
        data: {
          status: newStatus,
          recipeId: match.recipeMatchId,
          ingredientGroupId: match.ingredientGroupId,
          nutritionLabelId: match.labelMatchId,
          draftId: newLabelId,
        },
      });
    });
  }

  async deleteDraft(
    recordId: string,
    draftId: string | null,
    newStatus: RecordStatus
  ): Promise<void> {
    if (draftId) {
      await db.$transaction(async (tx) => {
        await tx.nutritionLabel.delete({ where: { id: draftId } });
        await tx.importRecord.update({
          where: { id: recordId },
          data: { status: newStatus, draftId: null },
        });
      });
    }
  }

  async finalize(record: ImportRecord): Promise<void> {
    await db.$transaction(async (tx) => {
      if (
        record.draftId &&
        (record.status === RecordStatus.IMPORTED ||
          record.status === RecordStatus.UPDATED)
      ) {
        const draftLabel = await tx.nutritionLabel.findUniqueOrThrow({
          where: { id: record.draftId },
        });

        // Get or create recipe id
        const recipeId = draftLabel.recipeId
          ? draftLabel.recipeId
          : (
              await tx.recipe.create({
                data: { name: draftLabel.name ?? "", isVerified: true },
              })
            ).id;

        // Update the newly verified label
        await tx.nutritionLabel.update({
          where: { id: record.draftId },
          data: {
            recipe: { connect: { id: recipeId } },
            ingredientGroup: record.ingredientGroupId
              ? { connect: { id: record.ingredientGroupId } }
              : undefined,
            verifed: true,
          },
        });

        // Delete existing label if needed
        if (record.nutritionLabelId) {
          await tx.nutritionLabel.delete({
            where: { id: record.nutritionLabelId },
          });
        }

        // Replace it with the existing
        await tx.importRecord.update({
          where: { id: record.id },
          data: {
            recipeId,
            nutritionLabelId: draftLabel.id,
            draftId: null,
            verifed: true,
          },
        });
      }
    });
  }

  async matchLabels(items: CronometerParsedRecord[]): Promise<MatchedData[]> {
    const matcher = new LabelImportMatcher();
    return await Promise.all(
      items.map(async (record) => {
        const match = await matcher.match(
          record.getRecordHash(),
          record.getExternalId(),
          record.getParsedData().name
        );
        let dbStmt: Prisma.NutritionLabelCreateInput | undefined = undefined;
        if (match.status === "IMPORTED" || match.status === "UPDATED") {
          const nutritionLabel = await record.transform(
            NutritionLabelValidation
          );

          dbStmt = createNutritionLabelStmt(
            { label: nutritionLabel, verifed: false, createRecipe: false },
            false
          );
        }
        return { record, match, dbStmt } as MatchedData;
      })
    );
  }

  async processImport(): Promise<void> {
    const parser = new CronometerParser(this.input.source);
    const output = await parser.parse();
    const isDuplicate = await this.isDuplicateImport(output?.hash);
    if (isDuplicate) return;

    const matchedRecords = await this.matchLabels(output.records);

    await db.$transaction(async (tx) => {
      for (const { record, match, dbStmt } of matchedRecords) {
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
            hash: record.getRecordHash(),
            externalId: record.getExternalId(),
            name: record.getParsedData().name,
            parsedFormat: record.getParsedData() as Prisma.JsonObject,
            status: match.status,
            verifed: false,
            recipe: match.recipeMatchId
              ? { connect: { id: match.recipeMatchId } }
              : undefined,
            nutritionLabel: match.labelMatchId
              ? { connect: { id: match.labelMatchId } }
              : undefined,
            ingredientGroup: match.ingredientGroupId
              ? { connect: { id: match.ingredientGroupId } }
              : undefined,
            draftId: draftId,
          },
        });
      }
      await this.updateImport(
        {
          fileHash: output.hash,
          status: "REVIEW",
        },
        tx
      );
    });
  }
}

export { CronometerImport };
