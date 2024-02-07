import { builder } from "../builder.js";
import { processRecipeKeeperImport } from "../../services/import/RecipeKeeperImport.js";
import { processCronometerImport } from "../../services/import/CronometerImport.js";
import { db } from "../../db.js";

// ============================================ Types ===================================
builder.prismaObject("Import", {
  fields: (t) => ({
    id: t.exposeID("id"),
    fileName: t.exposeString("fileName", { nullable: true }),
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
enum ImportType {
  RECIPE_KEEPER,
  CRONOMETER,
}

enum RecordAction {
  REIMPORT,
  DUPLICATE,
  IGNORE,
  VERIFY,
}

builder.enumType(ImportType, {
  name: "ImportType",
});

builder.enumType(RecordAction, {
  name: "RecordAction",
});

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
  import: t.prismaField({
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
      switch (args.type) {
        case ImportType.CRONOMETER:
          return await processCronometerImport(args.file, query);
        case ImportType.RECIPE_KEEPER:
          return await processRecipeKeeperImport(args.file, query);
        default:
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
  changeRecordStatus: t.prismaField({
    type: ["ImportRecord"],
    args: {
      id: t.arg.string({ required: true }),
      args: t.arg({
        type: ImportType,
        required: true,
      }),
    },
    resolve: async (query, root, args) => {},
  }),
}));

// Actions
// Mark a record as a duplicate or to ignore
// Change the import record to a different matching recipe/nutrition label
// Verify the information was imported correctly
