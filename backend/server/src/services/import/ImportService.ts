import { ImportType, RecordStatus } from "@prisma/client";
import { fileTypeFromBuffer } from "file-type";
import { v4 as uuidv4 } from "uuid";
import { db } from "../../db.js";
import { storage } from "../../storage.js";
import { openFile } from "../io/Readers.js";
import { Prisma, Import } from "@prisma/client";
import { FileUploadQueue } from "./ProcessImportJob.js";
import { ImportRecordManager } from "./import_records/RecordImportManger.js";
import { CronometerImport } from "./importers/CronometerImport.js";
import { RecipeKeeperImport } from "./importers/RecipeKeeperImport.js";
import { ImportServiceInput } from "./importers/Import.js";
import { getFileMetaData } from "../../util/utils.js";

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
  const openedFile = openFile(file);
  const fileBuffer = Buffer.from(await openedFile.arrayBuffer());
  const meta = await fileTypeFromBuffer(fileBuffer);
  const renamedFile = `${uuidv4()}.${meta?.ext ?? ".zip"}`;

  await storage.putObject("imports", renamedFile, fileBuffer, {
    "Content-Type": meta?.mime,
  });

  const parentImport = await db.import.create({
    data: {
      fileName: getFileMetaData(openedFile.name).name,
      type: type,
      status: "PENDING",
      storagePath: renamedFile,
    },
    ...query,
  });

  await FileUploadQueue.add(parentImport.id, {
    fileName: renamedFile,
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
  const recordManager = new ImportRecordManager(importParent);
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
  const recordManager = new ImportRecordManager(importRecord);
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
  const recordManager = new ImportRecordManager(importRecord);
  await recordManager.finalize();
  return await db.importRecord.findUniqueOrThrow({
    where: { id: id },
    ...query,
  });
}

export {
  updateMatches,
  changeRecordStatus,
  uploadImportFile,
  finalizeImportRecord,
  importServiceFactory,
};
