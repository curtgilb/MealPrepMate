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
import { offsetPagination } from "./UtilitySchema.js";
import { Import, ImportRecord, ImportStatus } from "@prisma/client";
import { record } from "zod";

type WithCount = {
  count: number;
};

type ImportWithCount = Import & WithCount;
type ImportRecordWithCount = ImportRecord & WithCount;

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
    count: t.field({
      type: "Int",
      resolve: (parent) => {
        if (Object.prototype.hasOwnProperty.call(parent, "count")) {
          return (parent as ImportWithCount).count;
        }
        return 0;
      },
    }),
  }),
});

builder.prismaObject("ImportRecord", {
  fields: (t) => ({
    name: t.exposeString("name"),
    status: t.field({ type: recordStatus, resolve: (parent) => parent.status }),
    recipe: t.relation("recipe"),
    nutritionLabel: t.relation("nutritionLabel"),
    count: t.field({
      type: "Int",
      resolve: (parent) => {
        if (Object.prototype.hasOwnProperty.call(parent, "count")) {
          return (parent as ImportRecordWithCount).count;
        }
        return 0;
      },
    }),
  }),
});
// ============================================ Inputs ==================================

const recordEditInput = builder.inputType("RecordEditInput", {
  fields: (t) => ({
    id: t.string({ required: true }),
    status: t.field({ type: recordStatus, required: true }),
    matchingRecipeId: t.string(),
    matchingLabel: t.string(),
  }),
});

// ============================================ Queries =================================
builder.queryFields((t) => ({
  imports: t.prismaField({
    type: ["Import"],
    args: {
      pagination: t.arg({
        type: offsetPagination,
        required: true,
      }),
    },
    resolve: async (query, root, args) => {
      const [data, count] = await db.$transaction([
        db.import.findMany({
          take: args.pagination.take,
          skip: args.pagination.offset,
          orderBy: { createdAt: "asc" },
          ...query,
        }),
        db.import.count(),
      ]);
      return { ...data, count };
    },
  }),
  importRecords: t.prismaField({
    type: ["ImportRecord"],
    args: {
      importId: t.arg.string({ required: true }),
      pagination: t.arg({
        type: offsetPagination,
        required: true,
      }),
    },
    resolve: async (query, root, args) => {
      const [data, count] = await db.$transaction([
        db.importRecord.findMany({
          take: args.pagination.take,
          skip: args.pagination.offset,
          where: { importId: args.importId },
          orderBy: { createdAt: "asc" },
          ...query,
        }),
        db.importRecord.count({ where: { importId: args.importId } }),
      ]);
      return { ...data, count };
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
  // markImportAsComplete: t.prismaField({
  //   type: "Import",
  //   args: {
  //     id: t.arg.string({ required: true }),
  //   },
  //   resolve: async (query, root, args) => {
  //     const importRecords = await db.importRecord.findMany({
  //       where: { importId: args.id },
  //     });
  //     const isCompleted = importRecords.every(
  //       (record) => record.status !== "PENDING"
  //     );
  //     if (!isCompleted) {
  //       throw new Error("Import is not completed");
  //     }
  //     return await db.import.update({
  //       where: { id: args.id },
  //       data: { status: "COMPLETED" },
  //     });
  //   },
  // }),
  editRecord: t.prismaField({
    type: "ImportRecord",
    args: {
      record: t.arg({ type: recordEditInput, required: true }),
    },
    resolve: async (query, root, args) => {
      return await db.$transaction(async (tx) => {
        const parentImportStatus = await tx.import.findFirst({
          where: { importRecords: { some: { id: args.record.id } } },
        });
        if (parentImportStatus?.status === ImportStatus.COMPLETED)
          throw new Error("Import has already been completed");
        return tx.importRecord.update({
          ...query,
          where: { id: args.record.id },
          data: {
            status: args.record.status,
            nutritionLabel: {
              connect: { id: args.record.matchingLabel ?? undefined },
            },
            recipe: {
              connect: { id: args.record.matchingRecipeId ?? undefined },
            },
          },
        });
      });
    },
  }),
}));

// If there is already an existing matching record, create another record of it to replace it.
// Create a status for column for both recipe and nutrition fact

// previewChanges, if record was to be updated, what changes would be made?
// editChanges, make changes to draft copy
// FieldsToChange,

// completeImport
// verifyChanges
