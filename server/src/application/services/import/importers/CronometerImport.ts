// import { Import, ImportItem, RecordStatus } from "@prisma/client";
// import { db } from "../../../db.js";
// import { CreateNutritionLabelInput } from "../../../types/gql.js";
// import { NutritionLabelValidation } from "../../../validations/RecipeValidation.js";
// import { LabelImportMatcher, MatchedLabel } from "../matchers/LabelMatcher.js";
// import {
//   CronometerParsedRecord,
//   CronometerParser,
// } from "../parsers/CronometerParser.js";
// import { Importer, ImportServiceInput } from "./Import.js";

// // Cronometer Import Strategy

// // 1. Match by previous hash
// //     Check if each row can be updated, if it can mark as update, otherwise a duplicate.
// //     If update, create a new nutrition label and connect it to recipe. However, mark it as non-verified
// // 2. Match by previous import id
// //     Check if row can be updated, if it can mark as update, otherwise a duplicate.
// //     If update, create a new nutrition label and connect it to recipe. However, mark it as non-verified
// // 3. Match by recipe name and ingredient group
// //     If there is a match, connect to recipe as non-verified
// // 4. No match
// //     Create new recipe with label as non-verified on label and recipe.

// // Statuses
// //     Imported - newly created created, didn't exist before, draft
// //     Duplicate - Previously imported, no draft
// //     Ignore - do not import, no draft
// //     Update - existing record can be updated, draft

// // Finalize
// //     Delete the old match if status was update
// //     Replace with new import and mark as verified
// //     On the import record, update the match with the draft id
// //     Update the aggregate label for the recipe

// // DraftId will be a recipe ID if the record was newly created. Otherwise it will be the id of the nutrition label.

// class CronometerImport extends Importer {
//   constructor(input: ImportServiceInput | Import) {
//     super(input);
//   }

//   async createDraft(record: ImportItem, newStatus: RecordStatus) {
//     const parsedData = record.parsedFormat as CreateNutritionLabelInput;
//     await db.nutritionLabel.createNutritionLabel(
//       parsedData,
//       record.recipeId,
//       record.ingredientGroupId
//     );
//     await db.importItem.update({
//       where: { id: record.id },
//       data: { status: newStatus },
//     });
//   }

//   async deleteDraft(
//     importRecord: ImportItem,
//     newStatus: RecordStatus
//   ): Promise<void> {
//     await db.$transaction(async (tx) => {
//       if (importRecord.status === "IMPORTED" && importRecord.recipeId) {
//         await tx.recipe.delete({
//           where: { id: importRecord.recipeId },
//         });
//       } else if (importRecord.draftId) {
//         await tx.nutritionLabel.delete({
//           where: { id: importRecord.draftId },
//         });
//       }
//       await tx.importItem.update({
//         where: { id: importRecord.id },
//         data: { status: newStatus, draftId: null },
//       });
//     });
//   }

//   async finalize(record: ImportItem): Promise<void> {
//     if (record.draftId) {
//       const createdRecipe = await db.nutritionLabel.findUniqueOrThrow({
//         where: { id: record.draftId },
//         select: { recipeId: true },
//       });

//       if (record.status === "IMPORTED") {
//         await db.$transaction([
//           db.nutritionLabel.update({
//             where: { id: record.draftId },
//             data: {
//               verified: true,
//             },
//           }),
//           db.recipe.update({
//             where: { id: createdRecipe.recipeId },
//             data: { verified: true },
//           }),
//           db.importItem.update({
//             where: { id: record.importId },
//             data: { nutritionLabelId: record.draftId, verified: true },
//           }),
//         ]);
//       }

//       // if (record.status === "UPDATED") {
//       // }
//     }

//     await db.$transaction(async (tx) => {
//       if (
//         record.draftId &&
//         (record.status === RecordStatus.IMPORTED ||
//           record.status === RecordStatus.UPDATED)
//       ) {
//         const draftLabel = await tx.nutritionLabel.findUniqueOrThrow({
//           where: { id: record.draftId },
//         });

//         // Get or create recipe id
//         const recipeId = draftLabel.recipeId
//           ? draftLabel.recipeId
//           : (
//               await tx.recipe.create({
//                 data: { name: draftLabel.name ?? "", verified: true },
//               })
//             ).id;

//         // Update the newly verified label
//         await tx.nutritionLabel.update({
//           where: { id: record.draftId },
//           data: {
//             recipe: { connect: { id: recipeId } },
//             ingredientGroup: record.ingredientGroupId
//               ? { connect: { id: record.ingredientGroupId } }
//               : undefined,
//             verified: true,
//           },
//         });

//         // Delete existing label if needed
//         if (record.nutritionLabelId) {
//           await tx.nutritionLabel.delete({
//             where: { id: record.nutritionLabelId },
//           });
//         }

//         // Replace it with the existing
//         await tx.importItem.update({
//           where: { id: record.id },
//           data: {
//             recipeId,
//             nutritionLabelId: draftLabel.id,
//             draftId: null,
//             verified: true,
//           },
//         });
//       }
//     });
//   }

//   async matchLabels(items: CronometerParsedRecord[]): Promise<MatchedLabel[]> {
//     const matcher = new LabelImportMatcher();
//     return await Promise.all(
//       items.map(async (record) => {
//         return await matcher.match(
//           record.getRecordHash(),
//           record.getExternalId(),
//           record.getParsedData().name,
//           await record.transform(NutritionLabelValidation)
//         );
//       })
//     );
//   }

//   async processImport(): Promise<void> {
//     const parser = new CronometerParser(this.input.source);
//     const output = await parser.parse();
//     const matchedRecords = await this.matchLabels(output.records);
//     await db.nutritionLabel.bulkImportLabels(
//       this.input.import.id,
//       matchedRecords
//     );
//   }
// }

// export { CronometerImport };

// // await db.$transaction(async (tx) => {
// //   for (const { record, match, dbStmt } of matchedRecords) {
// //     let draftId;
// //     if (dbStmt) {
// //       draftId = (
// //         await tx.nutritionLabel.create({
// //           data: dbStmt,
// //           select: { id: true },
// //         })
// //       ).id;
// //     }

// //     await tx.importRecord.create({
// //       data: {
// //         import: { connect: { id: this.input.import.id } },
// //         hash: record.getRecordHash(),
// //         externalId: record.getExternalId(),
// //         name: record.getParsedData().name,
// //         parsedFormat: record.getParsedData() as Prisma.JsonObject,
// //         status: match.status,
// //         verified: false,
// //         recipe: match.recipeMatchId
// //           ? { connect: { id: match.recipeMatchId } }
// //           : undefined,
// //         nutritionLabel: match.labelMatchId
// //           ? { connect: { id: match.labelMatchId } }
// //           : undefined,
// //         ingredientGroup: match.ingredientGroupId
// //           ? { connect: { id: match.ingredientGroupId } }
// //           : undefined,
// //         draftId: draftId,
// //       },
// //     });
// //   }
// //   await this.updateImport(
// //     {
// //       fileHash: output.hash,
// //       status: "REVIEW",
// //     },
// //     tx
// //   );
// // });
