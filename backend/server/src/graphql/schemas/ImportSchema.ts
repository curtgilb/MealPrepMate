import { builder } from "../builder.js";
import { db } from "../../db.js";
import { PrismaImportType, importStatus, recordStatus } from "./EnumSchema.js";
import { nextPageInfo, offsetPagination } from "./UtilitySchema.js";
import { Import, ImportRecord, ImportType, RecordStatus } from "@prisma/client";
import { queryFromInfo } from "@pothos/plugin-prisma";
import {
  changeRecordStatus,
  finalizeImportRecord,
  updateMatches,
  uploadImportFile,
} from "../../services/import/ImportService.js";
import { nutritionLabel } from "./NutritionSchema.js";
import { recipe, recipeIngredient } from "./RecipeSchema.js";
import { z } from "zod";
import { offsetPaginationValidation } from "../../validations/graphql/UtilityValidation.js";

// ============================================ Types ===================================
const Draft = builder.unionType("Draft", {
  types: [recipe, nutritionLabel],
  resolveType: (draft) => {
    if (draft.type === "LABEL") {
      return nutritionLabel;
    } else {
      return recipe;
    }
  },
});

const ImportJob = builder.prismaObject("Import", {
  fields: (t) => ({
    id: t.exposeID("id"),
    fileName: t.exposeString("fileName", { nullable: true }),
    type: t.field({ type: PrismaImportType, resolve: (parent) => parent.type }),
    status: t.field({ type: importStatus, resolve: (parent) => parent.status }),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    records: t.relation("importRecords", { nullable: true }),
    recordsCount: t.relationCount("importRecords"),
  }),
});

const ImportJobRecord = builder.prismaObject("ImportRecord", {
  fields: (t) => ({
    id: t.exposeString("id"),
    name: t.exposeString("name"),
    status: t.field({ type: recordStatus, resolve: (parent) => parent.status }),
    verifed: t.exposeBoolean("verifed"),
    draft: t.field({
      type: Draft,
      nullable: true,
      resolve: async (importRecord) => {
        if (importRecord.draftId) {
          const [recipe, label] = await db.$transaction([
            db.recipe.findUnique({ where: { id: importRecord.draftId } }),
            db.nutritionLabel.findUnique({
              where: { id: importRecord.draftId },
            }),
          ]);
          return recipe ?? label;
        }
        return null;
      },
    }),
  }),
});

const ImportsQuery = builder
  .objectRef<{
    nextOffset: number | null;
    itemsRemaining: number;
    importJobs: Import[];
  }>("ImportsQuery")
  .implement({
    fields: (t) => ({
      nextOffset: t.exposeInt("nextOffset", { nullable: true }),
      itemsRemaining: t.exposeInt("itemsRemaining"),
      importJobs: t.field({
        type: [ImportJob],
        resolve: (result) => result.importJobs,
      }),
    }),
  });

const ImportRecordsQuery = builder
  .objectRef<{
    nextOffset: number | null;
    itemsRemaining: number;
    records: ImportRecord[];
  }>("ImportRecordsQuery")
  .implement({
    fields: (t) => ({
      nextOffset: t.exposeInt("nextOffset", { nullable: true }),
      itemsRemaining: t.exposeInt("itemsRemaining"),
      records: t.field({
        type: [ImportJobRecord],
        resolve: (result) => result.records,
      }),
    }),
  });
// ============================================ Inputs ==================================

// ============================================ Queries =================================
builder.queryFields((t) => ({
  import: t.prismaField({
    type: "Import",
    args: {
      importId: t.arg.string({ required: true }),
    },
    validate: {
      schema: z.object({ importId: z.string().cuid() }),
    },
    resolve: async (query, root, args) => {
      return await db.import.findUniqueOrThrow({
        where: { id: args.importId },
        ...query,
      });
    },
  }),
  imports: t.field({
    type: ImportsQuery,
    args: {
      pagination: t.arg({
        type: offsetPagination,
        required: true,
      }),
    },
    validate: {
      schema: z.object({ pagination: offsetPaginationValidation }),
    },
    resolve: async (parent, args, context, info) => {
      const [data, count] = await db.$transaction([
        db.import.findMany({
          ...queryFromInfo({ context, info, path: ["imports"] }),
          take: args.pagination.take,
          skip: args.pagination.offset,
          orderBy: { createdAt: "asc" },
        }),
        db.import.count(),
      ]);

      const { itemsRemaining, nextOffset } = nextPageInfo(
        data.length,
        args.pagination.offset,
        count
      );
      return { importJobs: data, nextOffset, itemsRemaining };
    },
  }),
  importRecord: t.prismaField({
    type: "ImportRecord",
    args: {
      id: t.arg.string({ required: true }),
    },
    validate: {
      schema: z.object({ id: z.string().cuid() }),
    },
    resolve: async (query, root, args) => {
      return await db.importRecord.findUniqueOrThrow({
        where: { id: args.id },
      });
    },
  }),
  importRecords: t.field({
    type: ImportRecordsQuery,
    args: {
      importId: t.arg.string({ required: true }),
      pagination: t.arg({
        type: offsetPagination,
        required: true,
      }),
    },
    validate: {
      schema: z.object({
        importId: z.string().cuid(),
        pagination: offsetPaginationValidation,
      }),
    },
    resolve: async (root, args, context, info) => {
      const [data, count] = await db.$transaction([
        db.importRecord.findMany({
          take: args.pagination.take,
          skip: args.pagination.offset,
          where: { importId: args.importId },
          orderBy: { createdAt: "asc" },
          ...queryFromInfo({ context, info, path: ["importRecords"] }),
        }),
        db.importRecord.count({ where: { importId: args.importId } }),
      ]);
      const { itemsRemaining, nextOffset } = nextPageInfo(
        data.length,
        args.pagination.offset,
        count
      );
      return { records: data, itemsRemaining, nextOffset };
    },
  }),
}));
// ============================================ Mutations ===============================

builder.mutationFields((t) => ({
  uploadImport: t.prismaField({
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
      return await uploadImportFile({
        file: args.file,
        type: args.type,
        query,
      });
    },
  }),
  changeRecordStatus: t.prismaField({
    type: "ImportRecord",
    args: {
      id: t.arg.string({ required: true }),
      status: t.arg({ type: recordStatus, required: true }),
    },
    validate: {
      schema: z.object({
        id: z.string().cuid(),
        status: z.nativeEnum(RecordStatus),
      }),
    },
    resolve: async (query, root, args) => {
      return await changeRecordStatus(args.id, args.status, query);
    },
  }),
  updateMatches: t.prismaField({
    type: "ImportRecord",
    args: {
      recordId: t.arg.string({ required: true }),
      recipeId: t.arg.string(),
      labelId: t.arg.string(),
      groupId: t.arg.string(),
    },
    validate: {
      schema: z.object({
        recordId: z.string().cuid(),
        recipeId: z.string().cuid().optional(),
        labelId: z.string().cuid().optional(),
        groupId: z.string().cuid().optional(),
      }),
    },
    resolve: async (query, root, args) => {
      return await updateMatches({
        id: args.recordId,
        labelId: args.labelId,
        recipeId: args.recipeId,
        groupId: args.groupId,
        query,
      });
    },
  }),
  finalize: t.prismaField({
    type: "ImportRecord",
    args: {
      recordId: t.arg.string({ required: true }),
    },
    validate: {
      schema: z.object({
        recordId: z.string().cuid(),
      }),
    },
    resolve: async (query, root, args) => {
      return await finalizeImportRecord(args.recordId, query);
    },
  }),
}));
