import { builder } from "../builder.js";
import { processRecipeKeeperImport } from "../../services/import/RecipeKeeperImport.js";
import { processCronometerImport } from "../../services/import/CronometerImport.js";
import { ImportType } from "@prisma/client";
import { db } from "../../db.js";
import { CronometerNutrition } from "../../types/CustomTypes.js";

// ============================================ Types ===================================
builder.prismaObject("Import", {
  fields: (t) => ({
    id: t.exposeID("id"),
    fileName: t.exposeString("fileName"),
    type: t.exposeString("type"),
    status: t.exposeString("status"),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    records: t.relation("importRecords"),
    recordsCount: t.relationCount("importRecords"),
  }),
});

builder.prismaObject("ImportRecord", {
  fields: (t) => ({
    name: t.exposeString("name"),
    status: t.exposeString("status"),
    recipe: t.relation("recipe"),
    nutritionLabel: t.relation("nutritionLabel"),
  }),
});
// ============================================ Inputs ==================================

// ============================================ Queries =================================
builder.queryFields((t) => ({
  imports: t.prismaField({
    type: ["Import"],
    resolve: async (query) => {
      return await db.import.findMany({ ...query });
    },
  }),
  importRecords: t.prismaField({
    type: ["ImportRecord"],
    args: {
      importId: t.arg.string({ required: true }),
    },
    resolve: async (query, root, args) => {
      return await db.importRecord.findMany({
        ...query,
        where: { importId: args.importId },
      });
    },
  }),
}));
// ============================================ Mutations ===============================

builder.mutationFields((t) => ({
  importRecipeKeeper: t.prismaField({
    type: "Import",
    args: {
      file: t.arg({
        type: "File",
        required: true,
      }),
      type: t.arg({
        type: ImportType,
        required: true,
      }),
    },
    resolve: async (query, root, args) => {
      if (args.type === "RECIPE_KEEPER") {
        return await processRecipeKeeperImport(args.file, query);
      } else if (args.type === "CRONOMETER")
        return await processCronometerImport(args.file, query);
      else {
        throw new Error("Unsupported import type");
      }
    },
  }),
  // Verify there are not any pending records
  // Connect all import record's to their respective
  markImportAsComplete: t.prismaField({
    type: "Import",
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (query, root, args) => {
      const importRecords = await db.importRecord.findMany({
        where: { importId: args.id },
      });
      const isCompleted = importRecords.every(
        (record) => record.status !== "PENDING"
      );
      if (!isCompleted) {
        throw new Error("Import is not completed");
      }
      return await db.import.update({
        where: { id: args.id },
        data: { status: "COMPLETED" },
      });
    },
  }),
  // If a record was marked as duplicate or ignored, user can call this to reimport it
  // Need to mark status as imported
  // reimportRecord: t.prismaField({
  //   type: "ImportRecord",
  //   args: {
  //     id: t.arg.string({ required: true }),
  //   },
  //   resolve: async (query, root, args) => {
  //     const lastImport = await db.importRecord.findUniqueOrThrow({
  //       where: { id: args.id },
  //       include: { import: true },
  //     });
  //     if (lastImport.import.type === "CRONOMETER") {
  //       const cronometer =
  //         lastImport.parsedFormat as unknown as CronometerNutrition;
  //       return await db.nutritionLabel.createCronometerNutritionLabel(
  //         cronometer,
  //         lastImport.recipeId,
  //         query
  //       );
  //     }
  //   },
  // }),
}));

// Actions
// Mark a record as a duplicate or to ignore
// Change the import record to a different matching recipe/nutrition label
// Verify the information was imported correctly
