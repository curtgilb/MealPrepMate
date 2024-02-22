import { builder } from "../builder.js";
import { db } from "../../db.js";
import { PrismaImportType, importStatus, recordStatus } from "./EnumSchema.js";
import { offsetPagination } from "./UtilitySchema.js";
import { Import, ImportRecord, ImportType } from "@prisma/client";
import { storage } from "../../storage.js";
import { FileUploadQueue } from "../../test.js";
import { fileTypeFromBuffer } from "file-type";
import { v4 as uuidv4 } from "uuid";
import { Context } from "../../services/import/state/states.js";
import { queryFromInfo } from "@pothos/plugin-prisma";

// ============================================ Types ===================================
const Import = builder.prismaObject("Import", {
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

const ImportRecord = builder.prismaObject("ImportRecord", {
  fields: (t) => ({
    name: t.exposeString("name"),
    status: t.field({ type: recordStatus, resolve: (parent) => parent.status }),
    recipe: t.relation("recipe", { nullable: true }),
    nutritionLabel: t.relation("nutritionLabel", { nullable: true }),
  }),
});

const ImportsQuery = builder
  .objectRef<{
    nextOffset: number | null;
    itemsRemaining: number;
    imports: Import[];
  }>("ImportsQuery")
  .implement({
    fields: (t) => ({
      nextOffset: t.exposeInt("nextOffset", { nullable: true }),
      itemsRemaining: t.exposeInt("itemsRemaining"),
      imports: t.field({
        type: [Import],
        resolve: (result) => result.imports,
      }),
    }),
  });

const ImportRecordsQuery = builder
  .objectRef<{
    nextOffset: number;
    itemsRemaining: number;
    imports: ImportRecord[];
  }>("ImportRecordsQuery")
  .implement({
    fields: (t) => ({
      nextOffset: t.exposeInt("nextOffset"),
      itemsRemaining: t.exposeInt("itemsRemaining"),
      imports: t.field({
        type: [ImportRecord],
        resolve: (result) => result.imports,
      }),
    }),
  });
// ============================================ Inputs ==================================

// ============================================ Queries =================================
builder.queryFields((t) => ({
  getImport: t.prismaField({
    type: "Import",
    args: {
      importId: t.arg.string({ required: true }),
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

      let nextOffset: number | null = data.length + args.pagination.offset;
      if (nextOffset >= count) nextOffset = null;
      const itemsRemaining = count - (args.pagination.offset + data.length);
      return { imports: data, nextOffset, itemsRemaining };
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
        type: ImportType,
        required: true,
      }),
    },
    resolve: async (query, root, args) => {
      const fileBuffer = Buffer.from(await args.file.arrayBuffer());
      const meta = await fileTypeFromBuffer(fileBuffer);
      const renamedFile = `${uuidv4()}.${meta?.ext ?? ".zip"}`;

      const parentImport = await db.import.create({
        data: {
          fileName: args.file.name,
          type: args.type,
          status: "PENDING",
          storagePath: renamedFile,
        },
        ...query,
      });

      await storage.putObject("imports", renamedFile, fileBuffer, {
        "Content-Type": meta?.mime,
      });

      await FileUploadQueue.add(parentImport.id, {
        fileName: renamedFile,
        type: args.type,
        id: parentImport.id,
      });
      console.log(parentImport);
      return parentImport;
    },
  }),
  changeRecordStatus: t.prismaField({
    type: "ImportRecord",
    args: {
      recordId: t.arg.string({ required: true }),
      status: t.arg({ type: recordStatus, required: true }),
    },
    resolve: async (query, root, args) => {
      const importParent = await db.importRecord.findUniqueOrThrow({
        where: { id: args.recordId },
        include: { import: true },
      });
      const context = new Context(importParent);
      await context.transitionTo(args.status);
      return await db.importRecord.findUniqueOrThrow({
        where: { id: args.recordId },
        ...query,
      });
    },
  }),
  updateMatches: t.prismaField({
    type: "ImportRecord",
    args: {
      recordId: t.arg.string({ required: true }),
      recipeId: t.arg.string(),
      labelId: t.arg.string(),
    },
    resolve: async (query, root, args) => {
      const importRecord = await db.importRecord.findUniqueOrThrow({
        where: { id: args.recordId },
        include: { import: true },
      });
      const context = new Context(importRecord);
      await context.updateMatches(
        args.recipeId ?? undefined,
        args.labelId ?? undefined
      );
      return await db.importRecord.findUniqueOrThrow({
        where: { id: args.recordId },
        ...query,
      });
    },
  }),
  finalize: t.prismaField({
    type: "ImportRecord",
    args: {
      recordId: t.arg.string({ required: true }),
    },
    resolve: async (query, root, args) => {
      const importRecord = await db.importRecord.findUniqueOrThrow({
        where: { id: args.recordId },
        include: { import: true },
      });
      const context = new Context(importRecord);
      await context.finalize();
      return await db.importRecord.findUniqueOrThrow({
        where: { id: args.recordId },
        ...query,
      });
    },
  }),
}));
