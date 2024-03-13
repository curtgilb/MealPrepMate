import {
  RecipeKeeperParser,
  RecipeKeeperRecord,
} from "../parsers/RecipeKeeperParser.js";
import { Prisma, RecordStatus, ImportRecord, Import } from "@prisma/client";
import { DbTransactionClient, db } from "../../../db.js";
import { Match, RecipeKeeperRecipe } from "../../../types/CustomTypes.js";
import {
  NutritionLabelValidation,
  RecipeInputValidation,
} from "../../../validations/graphql/RecipeValidation.js";
import { createRecipeCreateStmt } from "../../../model_extensions/RecipeExtension.js";
import { Importer, ImportServiceInput, MatchUpdate } from "./Import.js";
import { IngredientMatcher } from "../../../model_extensions/IngredientMatcher.js";

class RecipeKeeperImport extends Importer {
  constructor(input: ImportServiceInput | Import) {
    super(input);
  }

  async processImport(): Promise<void> {
    // 1. unzip file and get the last import to compare against (if it is the same hash, it will not import)
    const recipeKeeperUpload = new RecipeKeeperParser(this.input.source);
    const output = await recipeKeeperUpload.parse();
    const lastImport = await this.getLastImport();

    // Check if duplicate
    if (lastImport?.fileHash === output.hash) {
      await this.updateImport({
        fileHash: output.hash,
      });
    }

    //  3. Search for any matching recipes already in the database.
    type MatchedData = {
      record: RecipeKeeperRecord;
      match: Match;
      dbStmt?: Prisma.RecipeCreateInput;
    };
    const preparedData: MatchedData[] = [];
    const ingredientMatcher = new IngredientMatcher();
    for (const record of output.records) {
      const match = await this.findRecipeMatches(record);
      const recipeInput = await record.transform(
        RecipeInputValidation,
        output.imageMapping
      );
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
          verifed: false,
          ingredientMatcher,
        });
        item.dbStmt = stmt;
      }
      preparedData.push(item);
    }

    //  4. Save the data to the database
    await db.$transaction(
      async (tx) => {
        const importRecordIds: string[] = [];
        for (const item of preparedData) {
          let draftId: undefined | string = undefined;
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
                ? {
                    connect: {
                      id: item.match.recipeMatchId,
                    },
                  }
                : {},
              nutritionLabel: item.match.labelMatchId
                ? {
                    connect: {
                      id: item.match.labelMatchId,
                    },
                  }
                : {},
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
            imageMapping: Object.fromEntries(
              output.imageMapping
            ) as Prisma.JsonObject,
            recordIds: importRecordIds,
          },
          tx
        );
      },
      { timeout: 10000 }
    );
  }

  async deleteDraft(draftId: string, tx?: DbTransactionClient): Promise<void> {
    const dbClient = tx ? tx : db;
    await dbClient.recipe.delete({ where: { id: draftId } });
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
        await tx.importRecord.update({
          where: { id: record.id },
          data: { recipe: { connect: { id: record.draftId } }, draftId: null },
        });

        // Update the newly verified recipe
        await tx.recipe.update({
          where: { id: record.draftId },
          data: {
            nutritionLabel: record.nutritionLabelId
              ? { connect: { id: record.nutritionLabelId } }
              : {},
            importRecords: { connect: { id: record.id } },
            isVerified: true,
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
        data: { verifed: true },
      });
    });
  }

  async createDraft(
    record: ImportRecord,
    tx?: DbTransactionClient
  ): Promise<string> {
    const dbClient = tx ? tx : db;
    const recipe = record.parsedFormat as Prisma.JsonObject;
    const rehydrated = new RecipeKeeperRecord("", recipe as RecipeKeeperRecipe);
    const imageMapping = this.getImageMapping();

    const validatedRecipe = await rehydrated.transform(
      RecipeInputValidation,
      imageMapping
    );

    const validatedNutritionLabel = await rehydrated.toNutritionLabel(
      NutritionLabelValidation
    );
    const ingredientMatcher = new IngredientMatcher();
    const stmt = await createRecipeCreateStmt({
      recipe: validatedRecipe,
      nutritionLabel: validatedNutritionLabel,
      matchingRecipeId: record.recipeId ?? undefined,
      ingredientMatcher,
      update: false,
      verifed: false,
    });

    const { id } = await dbClient.recipe.create({ data: stmt });

    return id;
  }

  async updateMatch(update: MatchUpdate): Promise<ImportRecord> {
    const dbClient = update.tx ? update.tx : db;
    let draft;
    if (
      update.matchingRecipeId &&
      update.matchingRecipeId !== update.record.recipeId &&
      update.createDraft
    ) {
      await dbClient.recipe.delete({
        where: { id: update.record.draftId ?? undefined },
      });
      draft = await this.createDraft(update.record, dbClient);
    }
    return await dbClient.importRecord.update({
      where: { id: update.record.id },
      data: {
        recipe: { connect: { id: update.matchingRecipeId } },
        nutritionLabel: { connect: { id: update.matchingLabelId } },
        draftId: draft,
      },
    });
  }

  // Order of matches returned is important. They should align with the recipes array passed in.
  private async findRecipeMatches(recipe: RecipeKeeperRecord): Promise<Match> {
    const match: Match = { status: "IMPORTED" };
    // 1. Check for an exact match by comparing hash : DUPLICATE
    const importRecord = await db.importRecord.findFirst({
      where: {
        OR: [
          { hash: recipe.getRecordHash() },
          { externalId: recipe.getExternalId() },
        ],
      },
      select: {
        recipeId: true,
        hash: true,
        externalId: true,
        nutritionLabelId: true,
      },
    });

    if (
      importRecord?.recipeId &&
      importRecord.hash === recipe.getRecordHash()
    ) {
      return {
        labelMatchId: importRecord.nutritionLabelId ?? undefined,
        recipeMatchId: importRecord.recipeId,
        status: "DUPLICATE",
      };
    }
    // 2. Check for updateable match by comparing externalID : UPDATE
    else if (
      importRecord?.recipeId &&
      importRecord.externalId === recipe.externalId
    ) {
      return {
        recipeMatchId: importRecord.recipeId,
        labelMatchId: importRecord?.nutritionLabelId ?? undefined,
        status: "UPDATED",
      };
    }
    // 3. Check for updateable match by comparing title : UPDATE
    const recipeMatch = await db.recipe.findFirst({
      where: { title: { contains: recipe.getTitle(), mode: "insensitive" } },
      select: { id: true },
    });

    if (recipeMatch) {
      match.recipeMatchId = recipeMatch.id;
      match.status = "UPDATED";
    }

    const labelMatch = await db.nutritionLabel.findFirst({
      where: { name: { equals: recipe.getTitle(), mode: "insensitive" } },
    });
    if (labelMatch) match.labelMatchId = labelMatch.id;

    // 4. If no match is found, mark the recipe to be imported : IMPORTED
    return match;
  }
}

export { RecipeKeeperImport };
