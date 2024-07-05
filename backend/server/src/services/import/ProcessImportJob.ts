// import { ImportType } from "@prisma/client";
// import { Queue, Worker } from "bullmq";
// import { db } from "../../db.js";
// import { downloadFileFromBucket } from "../io/FileStorage.js";
// import { importServiceFactory } from "./ImportService.js";

// const connection = {
//   connection: {
//     host: "localhost",
//     port: 6379,
//   },
// };

// interface FileUploadJob {
//   fileName: string;
//   type: ImportType;
//   id: string;
// }

// const FileUploadQueue = new Queue<FileUploadJob>("uploads", connection);

// const worker = new Worker(
//   "uploads",
//   // eslint-disable-next-line @typescript-eslint/require-await
//   async (job) => {
//     const importJob = await db.import.findUniqueOrThrow({
//       // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
//       where: { id: job.data.id as string },
//     });
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
//     const file = await downloadFileFromBucket(importJob.storagePath);
//     const importService = importServiceFactory(
//       { import: importJob, source: file },
//       importJob.type
//     );
//     await importService.processImport();
//   },
//   connection
// );

// worker.on("failed", (job, err) => {
//   console.log(err);
//   db.import
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
//     .update({ where: { id: job?.data.id }, data: { status: "FAILED" } })
//     .catch((err) => {
//       console.log(err);
//     });
// });

// export { FileUploadQueue };
