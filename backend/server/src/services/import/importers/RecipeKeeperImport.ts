import {
  RecipeKeeperParser,
  RecipeKeeperRecord,
} from "../parsers/RecipeKeeperParser.js";
import { Prisma, RecordStatus, ImportRecord, Import } from "@prisma/client";
import { db } from "../../../db.js";
import { Match, RecipeKeeperRecipe } from "../../../types/CustomTypes.js";
import {
  NutritionLabelValidation,
  RecipeInputValidation,
} from "../../../validations/RecipeValidation.js";
import { createRecipeCreateStmt } from "../../../models/RecipeExtension.js";
import { Importer, ImportServiceInput } from "./Import.js";
import { IngredientMatcher } from "../../../models/IngredientMatcher.js";
import { RecipeImportMatcher } from "../matchers/RecipeImportMatcher.js";

type MatchedData = {
  record: RecipeKeeperRecord;
  match: Match;
  dbStmt?: Prisma.RecipeCreateInput;
};

class RecipeKeeperImport extends Importer {
  constructor(input: ImportServiceInput | Import) {
    super(input);
  }

  async processImport(): Promise<void> {
    // 1. unzip file and get the last import to compare against (if it is the same hash, it will not import)
    const recipeKeeperUpload = new RecipeKeeperParser(this.input.source);
    const output = await recipeKeeperUpload.parse();
    const isDuplicate = await this.isDuplicateImport(output?.hash);
    if (isDuplicate) return;

    //  3. Search for any matching recipes already in the database.
    const preparedData = await this.matchRecipes(
      output.records,
      output.imageMapping
    );

    //  4. Save the data to the database
    await db.$transaction(
      async (tx) => {
        const importRecordIds: string[] = [];
        for (const item of preparedData) {
          let draftId: undefined | string;
          if (item.dbStmt) {
            draftId = (
              await tx.recipe.create({
                data: item.dbStmt,
                select: { id: true },
              })
            ).id;
          }
          const recordId = await tx.importRecord.create({
            data: {
              import: { connect: { id: this.input.import.id } },
              name: item.record.getTitle(),
              hash: item.record.getRecordHash(),
              status: item.match.status || "IMPORTED",
              parsedFormat: item.record.getParsedObject() as Prisma.JsonObject,
              externalId: item.record.getExternalId(),
              recipe: item.match.recipeMatchId
                ? { connect: { id: item.match.recipeMatchId } }
                : undefined,
              nutritionLabel: item.match.labelMatchId
                ? { connect: { id: item.match.labelMatchId } }
                : undefined,
              draftId: draftId,
            },
            select: { id: true },
          });

          importRecordIds.push(recordId.id);
        }
        await this.updateImport(
          {
            fileHash: output.hash,
            status: "REVIEW",
            imageMapping: Object.fromEntries(output.imageMapping.entries()),
            importRecords: {
              set: importRecordIds.map((id) => ({
                id,
              })),
            },
          },
          tx
        );
      },
      { timeout: 10000 }
    );
  }

  async matchRecipes(
    recipes: RecipeKeeperRecord[],
    images: Map<string, string> | undefined
  ): Promise<MatchedData[]> {
    const matchedRecipes: MatchedData[] = [];
    const ingredientMatcher = new IngredientMatcher();
    const matcher = new RecipeImportMatcher();
    for (const record of recipes) {
      const match = await matcher.match(
        record.getRecordHash(),
        record.getExternalId(),
        record.getParsedObject().name
      );
      const recipeInput = await record.transform(RecipeInputValidation, images);
      const labelInput = await record.toNutritionLabel(
        NutritionLabelValidation
      );
      const item: MatchedData = { record, match };
      if (
        match.status === RecordStatus.UPDATED ||
        match.status === RecordStatus.IMPORTED
      ) {
        const stmt = await createRecipeCreateStmt({
          recipe: recipeInput,
          nutritionLabel: labelInput,
          matchingRecipeId: match.recipeMatchId,
          update: false,
          verified: false,
          ingredientMatcher,
        });
        item.dbStmt = stmt;
      }
      matchedRecipes.push(item);
    }
    return matchedRecipes;
  }

  async deleteDraft(
    recordId: string,
    draftId: string | null,
    newStatus: RecordStatus
  ): Promise<void> {
    await db.$transaction(async (tx) => {
      if (draftId) {
        await tx.recipe.delete({ where: { id: draftId } });
      }

      await tx.importRecord.update({
        where: { id: recordId },
        data: { status: newStatus, draftId: null },
      });
    });
  }

  async finalize(record: ImportRecord): Promise<void> {
    await db.$transaction(async (tx) => {
      if (
        record.draftId &&
        (record.status === RecordStatus.IMPORTED ||
          record.status === RecordStatus.UPDATED)
      ) {
        if (record.status === RecordStatus.UPDATED && !record.recipeId) {
          throw new Error("Record must have a matching recipe to update");
        }

        // Update the newly verified recipe
        await tx.recipe.update({
          where: { id: record.draftId },
          data: {
            nutritionLabels: record.nutritionLabelId
              ? { connect: { id: record.nutritionLabelId } }
              : {},
            verified: true,
          },
        });

        // Delete existing recipe if needed
        if (record.recipeId) {
          await tx.recipe.delete({
            where: { id: record.recipeId },
          });
        }
      }
      await tx.importRecord.update({
        where: { id: record.id },
        data: { verified: true, recipeId: record.draftId, draftId: null },
      });
    });
  }

  async createDraft(
    record: ImportRecord,
    newStatus: RecordStatus
  ): Promise<void> {
    await db.$transaction(async (tx) => {
      const recipe = record.parsedFormat as Prisma.JsonObject;
      const rehydrated = new RecipeKeeperRecord(
        "",
        recipe as RecipeKeeperRecipe
      );
      const imageMapping = this.getImageMapping();

      const matchedRecipe = await this.matchRecipes([rehydrated], imageMapping);

      let id;
      if (matchedRecipe[0].dbStmt) {
        id = (await tx.recipe.create({ data: matchedRecipe[0].dbStmt })).id;
      }

      await tx.importRecord.update({
        where: { id: record.id },
        data: {
          draftId: id,
          recipeId: matchedRecipe[0].match.recipeMatchId,
          nutritionLabelId: matchedRecipe[0].match.labelMatchId,
          status: newStatus,
        },
      });
    });
  }
}

export { RecipeKeeperImport };
