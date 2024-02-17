import {
  RecipeKeeperParser,
  RecipeKeeperRecord,
} from "./parsers/RecipeKeeperParser.js";
import { Prisma, RecordStatus, ImportRecord, Import } from "@prisma/client";
import { db } from "../../db.js";
import {
  Match,
  RecipeKeeperRecipe,
  RecordWithImport,
} from "../../types/CustomTypes.js";
import {
  NutritionLabelValidation,
  RecipeInputValidation,
} from "../../validations/graphqlValidation.js";
import { createRecipeCreateStmt } from "../../models/RecipeExtension.js";
import { ImportService, ImportServiceInput } from "./ImportService.js";

class RecipeKeeperImport extends ImportService {
  constructor(input: ImportServiceInput | Import) {
    super(input);
  }

  async processImport(): Promise<void> {
    // 1. unzip file and get the last import to compare against (if it is the same hash, it will not import)
    const recipeKeeperUpload = new RecipeKeeperParser(this.input.source);
    const output = await recipeKeeperUpload.parse();
    const lastImport = await this.getLastImport();

    // Check if duplicate
    if (lastImport?.fileHash === output.recordHash) {
      await this.updateImport({
        fileName: output.fileName,
        fileHash: output.recordHash,
      });
    }

    //  3. Search for any matching recipes already in the database.
    type MatchedData = {
      record: RecipeKeeperRecord;
      match: Match;
      dbStmt?: Prisma.RecipeCreateInput;
    };
    const preparedData: MatchedData[] = [];
    const units = await db.measurementUnit.findMany({});
    const ingredients = await db.ingredient.findMany({});
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
        const stmt = await createRecipeCreateStmt(
          {
            recipe: recipeInput,
            nutritionLabel: labelInput,
            matchingRecipeId: match.recipeMatchId,
          },
          units,
          ingredients
        );
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
              recipe: {
                connect: {
                  id: item.match.recipeMatchId,
                },
              },
              nutritionLabel: {
                connect: {
                  id: item.match.labelMatchId ?? undefined,
                },
              },
              draftId: draftId,
            },
            select: { id: true },
          });

          importRecordIds.push(recordId.id);
        }
        await this.updateImport(
          {
            fileName: output.fileName,
            fileHash: output.recordHash,
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

  async recreateRecord(record: ImportRecord): Promise<string> {
    const recipe = record.parsedFormat as Prisma.JsonObject;
    const rehydrated = new RecipeKeeperRecord("", recipe as RecipeKeeperRecipe);
    const imageMapping = this.getImageMapping();

    const validatedRecipe = await rehydrated.transform(
      RecipeInputValidation,
      imageMapping
    );
    const { id } = await db.recipe.createRecipe(validatedRecipe);

    const validatedNutritionLabel = await rehydrated.toNutritionLabel(
      NutritionLabelValidation,
      id
    );

    await db.nutritionLabel.createNutritionLabel({
      baseLabel: validatedNutritionLabel,
    });
    return id;
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
