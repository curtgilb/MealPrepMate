import { Queue } from "bullmq";
import { Worker } from "bullmq";
import { storage } from "./storage.js";
import { db } from "./db.js";
import { Import, ImportType } from "@prisma/client";
import { CronometerImport } from "./services/import/CronometerImport.js";
import { RecipeKeeperImport } from "./services/import/RecipeKeeperImport.js";

const connection = {
  connection: {
    host: "localhost",
    port: 6379,
  },
};

interface FileUploadJob {
  fileName: string;
  type: ImportType;
  id: string;
}

const FileUploadQueue = new Queue<FileUploadJob>("uploads", connection);

function readBufferStream(
  bucketFolder: string,
  fileName: string
): Promise<File> {
  const file = new Promise<File>((resolve, reject) => {
    const chunks: Buffer[] = [];

    storage.getObject(bucketFolder, fileName, (err, dataStream) => {
      if (err) {
        reject(err);
      }
      dataStream.on("data", (chunk) => {
        if (chunk instanceof Buffer) chunks.push(chunk);
      });
      dataStream.on("end", () => {
        const buffer = Buffer.concat(chunks);
        const blob = new Blob([buffer]);
        resolve(new File([blob], fileName));
      });
      dataStream.on("error", (err) => {
        reject(err);
      });
    });
  });
  return file;
}

function importServiceFactory(importJob: Import, file: File, type: ImportType) {
  switch (type) {
    case ImportType.CRONOMETER:
      return new CronometerImport({ source: file, import: importJob });
    case ImportType.RECIPE_KEEPER:
      return new RecipeKeeperImport({ source: file, import: importJob });
    default:
      throw new Error("There is no import service for specified import type");
  }
}

const worker = new Worker(
  "uploads",
  // eslint-disable-next-line @typescript-eslint/require-await
  async (job) => {
    console.log(job.data);
    const importJob = await db.import.findUniqueOrThrow({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      where: { id: job.data.id as string },
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    const file = await readBufferStream("imports", job.data.fileName);
    const importService = importServiceFactory(importJob, file, importJob.type);
    await importService.processImport();
  },
  connection
);

worker.on("failed", (job, err) => {
  console.log(err);
});

export { FileUploadQueue };
