import { builder } from "../builder.js";
import { processRecipeKeeperImport } from "../../services/import/RecipeKeeperImport.js";
import { processCronometerImport } from "../../services/import/CronometerImport.js";
import { ExternalImportType } from "./EnumSchema.js";
import { db } from "../../db.js";
import {
  PrismaImportType,
  externalImportType,
  importStatus,
  recordStatus,
} from "./EnumSchema.js";

// ============================================ Types ===================================
builder.prismaObject("Import", {
  fields: (t) => ({
    id: t.exposeID("id"),
    fileName: t.exposeString("fileName", { nullable: true }),
    type: t.field({ type: PrismaImportType, resolve: (parent) => parent.type }),
    status: t.field({ type: importStatus, resolve: (parent) => parent.status }),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    records: t.relation("importRecords"),
    recordsCount: t.relationCount("importRecords"),
  }),
});

builder.prismaObject("ImportRecord", {
  fields: (t) => ({
    name: t.exposeString("name"),
    status: t.field({ type: recordStatus, resolve: (parent) => parent.status }),
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
        where: { importId: args.importId },
        ...query,
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
        type: externalImportType,
        required: true,
      }),
    },
    resolve: async (query, root, args) => {
      switch (args.type) {
        case ExternalImportType.CRONOMETER:
          return await processCronometerImport(args.file, query);
        case ExternalImportType.RECIPE_KEEPER:
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
  // changeRecordStatus: t.prismaField({
  //   type: ["ImportRecord"],
  //   args: {
  //     id: t.arg.string({ required: true }),
  //     args: t.arg({
  //       type: ImportType,
  //       required: true,
  //     }),
  //   },
  //   resolve: async (query, root, args) => {},
  // }),
}));
