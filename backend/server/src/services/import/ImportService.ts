import { Import, ImportType, Prisma, RecordStatus } from "@prisma/client";
import { db } from "../../db.js";
import { uploadFileToBucket } from "../io/FileStorage.js";
import { FileUploadQueue } from "./ProcessImportJob.js";
import { ImportRecordStateManager } from "./import_records/ImportRecordStateManager.js";
import { CronometerImport } from "./importers/CronometerImport.js";
import { ImportServiceInput } from "./importers/Import.js";
import { RecipeKeeperImport } from "./importers/RecipeKeeperImport.js";

type ImportQuery = {
  include?: Prisma.ImportInclude | undefined;
  select?: Prisma.ImportSelect | undefined;
};

type ImportRecordQuery = {
  include?: Prisma.ImportRecordInclude | undefined;
  select?: Prisma.ImportRecordSelect | undefined;
};

type UploadImportArgs = {
  file: File | string;
  type: ImportType;
  query?: ImportQuery;
};

function importServiceFactory(
  importRecord: ImportServiceInput | Import,
  type: ImportType
) {
  switch (type) {
    case ImportType.CRONOMETER:
      return new CronometerImport(importRecord);
    case ImportType.RECIPE_KEEPER:
      return new RecipeKeeperImport(importRecord);
    default:
      throw new Error("No importer exists");
  }
}

async function uploadImportFile({ file, type, query }: UploadImportArgs) {
  const uploadedFile = await uploadFileToBucket(file, ["zip"], "imports");

  const parentImport = await db.import.create({
    data: {
      fileName: uploadedFile.newFileName,
      type: type,
      status: "PENDING",
      storagePath: uploadedFile.bucketPath,
    },
    ...query,
  });

  await FileUploadQueue.add(parentImport.id, {
    fileName: uploadedFile.bucketPath,
    type: type,
    id: parentImport.id,
  });

  return parentImport;
}

async function changeRecordStatus(
  id: string,
  status: RecordStatus,
  query?: ImportRecordQuery
) {
  const importParent = await db.importRecord.findUniqueOrThrow({
    where: { id: id },
    include: { import: true },
  });
  const recordManager = new ImportRecordStateManager(importParent);
  await recordManager.transitionTo(status);
  return await db.importRecord.findUniqueOrThrow({
    where: { id: id },
    ...query,
  });
}

type UpdateMatchesArgs = {
  id: string;
  recipeId?: string | null;
  labelId?: string | null;
  groupId?: string | null;
  query?: ImportRecordQuery;
};

async function updateMatches({
  id,
  recipeId,
  labelId,
  groupId,
  query,
}: UpdateMatchesArgs) {
  const importRecord = await db.importRecord.findUniqueOrThrow({
    where: { id: id },
    include: { import: true },
  });
  const recordManager = new ImportRecordStateManager(importRecord);
  await recordManager.updateMatches({ recipeId, labelId, groupId });
  return await db.importRecord.findUniqueOrThrow({
    where: { id: id },
    ...query,
  });
}

async function finalizeImportRecord(id: string, query?: ImportRecordQuery) {
  const importRecord = await db.importRecord.findUniqueOrThrow({
    where: { id: id },
    include: { import: true },
  });
  const recordManager = new ImportRecordStateManager(importRecord);
  await recordManager.finalize();
  return await db.importRecord.findUniqueOrThrow({
    where: { id: id },
    ...query,
  });
}

export {
  changeRecordStatus,
  finalizeImportRecord,
  importServiceFactory,
  updateMatches,
  uploadImportFile,
};
