// import { Import, ImportItem, ImportType, RecordStatus } from "@prisma/client";
// import { RecordWithImport } from "../../../types/CustomTypes.js";
// import { CronometerImport } from "../importers/CronometerImport.js";
// import { RecipeKeeperImport } from "../importers/RecipeKeeperImport.js";
// import { Importer } from "../importers/Import.js";
// import { db } from "../../../db.js";

// type MatchUpdate = {
//   recipeId?: string | null;
//   labelId?: string | null;
//   groupId?: string | null;
// };

// interface Operations {
//   toActiveState(status: RecordStatus): Promise<void>;
//   toInactiveState(status: RecordStatus): Promise<void>;
//   updateMatches(matches: MatchUpdate): Promise<void>;
// }

// function importServiceFactory(importRecord: Import) {
//   switch (importRecord.type) {
//     case ImportType.CRONOMETER:
//       return new CronometerImport(importRecord);
//     case ImportType.RECIPE_KEEPER:
//       return new RecipeKeeperImport(importRecord);
//     default:
//       throw new Error("No importer exists");
//   }
// }

// class ImportRecordStateManager {
//   public importItem: ImportItem;
//   public parentImport: Import;
//   private state: RecordImportState;
//   public importService: CronometerImport | RecipeKeeperImport;

//   constructor(record: RecordWithImport) {
//     this.parentImport = record.import;
//     this.importItem = record;
//     this.importService = importServiceFactory(record.import);

//     if (record.status === "DUPLICATE" || record.status === "IGNORED") {
//       this.state = new InactiveDraftState(this);
//     } else if (record.status === "IMPORTED" || record.status === "UPDATED") {
//       this.state = new ActiveDraftState(this);
//     } else {
//       throw new Error("Record is not in an acceptable state");
//     }
//   }

//   public async transitionTo(action: RecordStatus): Promise<void> {
//     if (action === "DUPLICATE" || action === "IGNORED") {
//       await this.state.toInactiveState(action);
//       this.state = new InactiveDraftState(this);
//     } else if (action === "IMPORTED" || action === "UPDATED") {
//       await this.state.toActiveState(action);
//       this.state = new ActiveDraftState(this);
//     } else {
//       throw new Error("Record is not in an acceptable state");
//     }
//   }

//   public async updateMatches(matches: MatchUpdate) {
//     await this.state.updateMatches(matches);
//   }

//   public async finalize() {
//     await this.importService.finalize(this.importItem);
//   }
// }

// // Base class for states
// abstract class RecordImportState implements Operations {
//   protected context: ImportRecordStateManager;

//   constructor(context: ImportRecordStateManager) {
//     this.context = context;
//   }

//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   toActiveState(status: RecordStatus): Promise<void> {
//     return new Promise((resolve) => {
//       console.log("Import transition not supported");
//       resolve();
//     });
//   }

//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   toInactiveState(status: RecordStatus): Promise<void> {
//     return new Promise((resolve) => {
//       console.log("Import transition not supported");
//       resolve();
//     });
//   }

//   async updateMatches(matches: MatchUpdate) {
//     await db.importItem.update({
//       where: { id: this.context.importItem.id },
//       data: {
//         recipeId: matches.recipeId,
//         nutritionLabelId: matches.labelId,
//         ingredientGroupId: matches.groupId,
//       },
//     });
//   }
// }

// // For import and update states
// class ActiveDraftState extends RecordImportState {
//   async toActiveState(status: RecordStatus): Promise<void> {
//     await db.importItem.update({
//       where: { id: this.context.importItem.id },
//       data: { status },
//     });
//   }

//   async toInactiveState(status: RecordStatus): Promise<void> {
//     const draftId = this.context.importItem.draftId;
//     await this.context.importService.deleteDraft(
//       this.context.importItem,
//       status
//     );
//   }
// }

// // For duplicate and ignored
// class InactiveDraftState extends RecordImportState {
//   async toActiveState(status: RecordStatus): Promise<void> {
//     await this.context.importService.createDraft(
//       this.context.importRecord,
//       status
//     );
//   }

//   async toInactiveState(status: RecordStatus): Promise<void> {
//     await db.importItem.update({
//       where: { id: this.context.importItem.id },
//       data: { status },
//     });
//   }
// }

// export { ImportRecordStateManager };
