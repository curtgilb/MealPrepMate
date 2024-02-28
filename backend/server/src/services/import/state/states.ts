import { Import, ImportRecord, ImportType, RecordStatus } from "@prisma/client";
import { RecordWithImport } from "../../../types/CustomTypes.js";
import { CronometerImport } from "../CronometerImport.js";
import { RecipeKeeperImport } from "../RecipeKeeperImport.js";
import { ImportService } from "../ImportService.js";
import { db } from "../../../db.js";

interface Operations {
  toImport(): Promise<void>;
  toIgnore(): Promise<void>;
  toDuplicate(): Promise<void>;
  toUpdate(): Promise<void>;
  updateMatches(recipeId?: string, labelId?: string): Promise<void>;
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
  public importRecord: ImportRecord;
  public parentImport: Import;
  private state: RecordImportState;
  public importService: ImportService;

  constructor(record: RecordWithImport) {
    this.parentImport = record.import;
    this.importRecord = record;
    this.importService = importServiceFactory(record.import);

    switch (this.importRecord.status) {
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

  public async updateMatches(
    recipeId: string | undefined,
    labelId: string | undefined
  ) {
    await this.state.updateMatches(recipeId, labelId);
  }

  public async finalize() {
    await this.importService.finalize(this.importRecord);
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
  async updateMatches(
    recipeId?: string | undefined,
    labelId?: string | undefined
  ) {
    await db.$transaction(async (tx) => {
      const importRecord = await this.context.importService.updateMatch({
        record: this.context.importRecord,
        matchingRecipeId: recipeId,
        matchingLabelId: labelId,
        createDraft: true,
        tx,
      });
      this.context.importRecord = importRecord;
    });
  }
}

class ImportedState extends RecordImportState {
  async toDuplicate() {
    // Delete Draft
    await db.$transaction(async (tx) => {
      const record = this.context.importRecord;
      await this.context.importService.deleteDraft(record.draftId, tx);
      this.context.importRecord = await tx.importRecord.update({
        where: { id: record.id },
        data: { status: "DUPLICATE", draftId: null },
      });
    });
  }
  async toIgnore() {
    await db.$transaction(async (tx) => {
      const record = this.context.importRecord;
      await this.context.importService.deleteDraft(record.draftId, tx);
      this.context.importRecord = await tx.importRecord.update({
        where: { id: record.id },
        data: { status: "IGNORED", draftId: null },
      });
    });
  }
  async toUpdate() {
    await db.$transaction(async (tx) => {
      const record = this.context.importRecord;
      await this.context.importService.updateMatch({
        createDraft: true,
        matchingLabelId: record.nutritionLabelId ?? undefined,
        matchingRecipeId: record.recipeId ?? undefined,
        record,
      });
      this.context.importRecord = await tx.importRecord.update({
        where: { id: record.id },
        data: { status: "UPDATED" },
      });
    });
  }
}

class DuplicateState extends RecordImportState {
  async toImport() {
    // Create draft
    await db.$transaction(async (tx) => {
      const record = this.context.importRecord;
      const draftId = await this.context.importService.createDraft(record, tx);
      this.context.importRecord = await tx.importRecord.update({
        where: { id: record.id },
        data: { status: "IMPORTED", draftId },
      });
    });
  }

  async toIgnore() {
    await db.$transaction(async (tx) => {
      const record = this.context.importRecord;
      await this.context.importService.deleteDraft(record.draftId, tx);
      this.context.importRecord = await tx.importRecord.update({
        where: { id: record.id },
        data: { status: "IGNORED", draftId: null },
      });
    });
  }

  async toUpdate() {
    await db.$transaction(async (tx) => {
      const record = this.context.importRecord;
      const draftId = await this.context.importService.createDraft(record, tx);
      this.context.importRecord = await tx.importRecord.update({
        where: { id: record.id },
        data: { status: "UPDATED", draftId },
      });
    });
  }
}

class IgnoredState extends RecordImportState {
  async toDuplicate() {
    await db.$transaction(async (tx) => {
      const record = this.context.importRecord;
      await this.context.importService.deleteDraft(record.draftId, tx);
      this.context.importRecord = await tx.importRecord.update({
        where: { id: record.id },
        data: { status: "DUPLICATE", draftId: null },
      });
    });
  }
  async toImport() {
    await db.$transaction(async (tx) => {
      const record = this.context.importRecord;
      const draftId = await this.context.importService.createDraft(record, tx);
      this.context.importRecord = await tx.importRecord.update({
        where: { id: record.id },
        data: { status: "IMPORTED", draftId },
      });
    });
  }
  async toUpdate() {
    await db.$transaction(async (tx) => {
      const record = this.context.importRecord;
      const draftId = await this.context.importService.createDraft(record, tx);
      this.context.importRecord = await tx.importRecord.update({
        where: { id: record.id },
        data: { status: "UPDATED", draftId },
      });
    });
  }
}

class UpdateState extends RecordImportState {
  async toDuplicate() {
    await db.$transaction(async (tx) => {
      const record = this.context.importRecord;
      await this.context.importService.deleteDraft(record.draftId, tx);
      this.context.importRecord = await tx.importRecord.update({
        where: { id: record.id },
        data: { status: "DUPLICATE", draftId: null },
      });
    });
  }
  async toImport() {
    await db.$transaction(async (tx) => {
      const record = this.context.importRecord;
      this.context.importRecord = await tx.importRecord.update({
        where: { id: record.id },
        data: { status: "IMPORTED" },
      });
    });
  }
  async toIgnore() {
    await db.$transaction(async (tx) => {
      const record = this.context.importRecord;
      await this.context.importService.deleteDraft(record.draftId, tx);
      this.context.importRecord = await tx.importRecord.update({
        where: { id: record.id },
        data: { status: "IGNORED", draftId: null },
      });
    });
  }
}

export { Context };
