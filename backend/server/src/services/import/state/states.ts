import {
  Import,
  ImportRecord,
  ImportType,
  Prisma,
  RecordStatus,
} from "@prisma/client";
import { db, DbTransactionClient } from "../../../db.js";
import { RecordWithImport } from "../../../types/CustomTypes.js";
import { CronometerImport } from "../CronometerImport.js";
import { RecipeKeeperImport } from "../RecipeKeeperImport.js";
import { ImportService } from "../ImportService.js";

interface Operations {
  toImport(): Promise<void>;
  toIgnore(): Promise<void>;
  toDuplicate(): Promise<void>;
  toUpdate(): Promise<void>;
  updateMatches(recipeId?: string, labelId?: string): Promise<void>;
}

type RecordQuery = {
  include?: Prisma.ImportRecordInclude | undefined;
  select?: Prisma.ImportRecordSelect | undefined;
};

type RecordUpdate = {
  recipeId?: string;
  labelId?: string;
  status: RecordStatus;
};

const recipeTypes = new Set(ImportType.RECIPE_KEEPER);

enum EntityType {
  "RECIPE",
  "LABEL",
}

function importServiceFactory(importRecord: Import) {
  switch (importRecord.type) {
    case ImportType.CRONOMETER:
      return new CronometerImport(importRecord);
    case ImportType.RECIPE_KEEPER:
      return new RecipeKeeperImport(importRecord);
    default:
      throw new Error("No importer exists");
  }
}

class Context {
  public record: ImportRecord;
  public importRecord: Import;
  private state: RecordImportState;
  public importType: ImportType;
  public entityType: EntityType;
  public importService: ImportService;

  constructor(record: RecordWithImport) {
    this.importType = record.import.type;
    this.importRecord = record.import;
    this.record = record;
    this.importService = importServiceFactory(record.import);
    this.entityType = recipeTypes.has(this.importType)
      ? EntityType.RECIPE
      : EntityType.LABEL;

    switch (this.record.status) {
      case RecordStatus.IMPORTED:
        this.state = new ImportedState(this);
        break;
      case RecordStatus.DUPLICATE:
        this.state = new DuplicateState(this);
        break;
      case RecordStatus.IGNORED:
        this.state = new IgnoredState(this);
        break;
      case RecordStatus.UPDATED:
        this.state = new UpdateState(this);
        break;
      default:
        throw new Error("Record not in an acceptable state");
    }
  }

  public async updateMatches(recipeId?: string, labelId?: string) {
    await this.state.updateMatches(recipeId, labelId);
  }

  public async transitionTo(action: RecordStatus): Promise<void> {
    switch (action) {
      case RecordStatus.IMPORTED:
        await this.state.toImport();
        this.state = new ImportedState(this);
        break;
      case RecordStatus.DUPLICATE:
        await this.state.toDuplicate();
        this.state = new DuplicateState(this);
        break;
      case RecordStatus.IGNORED:
        await this.state.toIgnore();
        this.state = new IgnoredState(this);
        break;
      case RecordStatus.UPDATED:
        await this.state.toUpdate();
        this.state = new UpdateState(this);
        break;
      default:
        throw new Error("Record not in an acceptable state");
    }
  }
}

abstract class RecordImportState implements Operations {
  protected context: Context;

  constructor(context: Context) {
    this.context = context;
  }

  public toImport(): Promise<void> {
    return new Promise((resolve) => {
      console.log("Import transition not supported");
      resolve();
    });
  }
  public toIgnore(): Promise<void> {
    return new Promise((resolve) => {
      console.log("Ignore transition not supported");
      resolve();
    });
  }
  public toDuplicate(): Promise<void> {
    return new Promise((resolve) => {
      console.log("Duplicate transition not supported");
      resolve();
    });
  }
  public toUpdate(): Promise<void> {
    return new Promise((resolve) => {
      console.log("Update transition not supported");
      resolve();
    });
  }
  public updateMatches(): Promise<void> {
    return new Promise((resolve) => {
      console.log("Update matches is not supported");
      resolve();
    });
  }
  protected async deleteDraft(update?: RecordUpdate) {
    if (this.context.entityType === EntityType.RECIPE) {
      await db.recipe.delete({
        where: { id: this.context.record.draftId ?? undefined },
      });
      await db.importRecord.update({
        where: { id: this.context.record.id },
        data: {
          recipe: { connect: { id: update?.recipeId } },
          nutritionLabel: { connect: { id: update?.labelId } },
          status: update?.status,
        },
      });
    } else if (this.context.entityType === EntityType.LABEL) {
      await db.nutritionLabel.delete({
        where: { id: this.context.record.draftId ?? undefined },
      });
    }
  }
}

class ImportedState extends RecordImportState {
  async toDuplicate() {}
  async toImport() {}
  async toIgnore() {}
  async toUpdate() {}
  async updateMatches(
    recipeId?: string | undefined,
    labelId?: string | undefined
  ): Promise<void> {
    const type = this.context.entityType;
    // if recipe and recipe type, delete draft, re-create, update match and draftID and status
    if (type === EntityType.RECIPE && recipeId) {
      await db.importRecord.update({
        where: { id: this.context.record.id },
        data: {
          recipe: { connect: { id: recipeId } },
          nutritionLabel: { connect: { id: labelId } },
        },
      });
    }
    // Update the label
  }
}

class DuplicateState extends RecordImportState {
  async toDuplicate() {}
  async toImport() {}
  async toIgnore() {}
  async toUpdate() {}
  async updateMatches() {}
}

class IgnoredState extends RecordImportState {
  async toDuplicate() {}
  async toImport() {}
  async toIgnore() {}
  async toUpdate() {}
  async updateMatches() {}
}

class UpdateState extends RecordImportState {
  async toDuplicate() {}
  async toImport() {}
  async toIgnore() {}
  async toUpdate() {}
  async updateMatches() {}
}
