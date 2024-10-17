import { Client } from "minio";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { getFileMetadata } from "@/infrastructure/file_io/common.js";
import { openFileBuffer } from "@/infrastructure/file_io/read.js";

export const storage = new Client({
  endPoint: process.env.MINIO_HOST ?? "localhost",
  port: process.env.MINIO_PORT ? parseInt(process.env.MINIO_PORT) : 9000,
  useSSL: false,
  accessKey: process.env.MINIO_ROOT_USER ?? "",
  secretKey: process.env.MINIO_ROOT_PASSWORD ?? "",
});

function generateFileName(ext: string) {
  return `${uuidv4()}.${ext}`;
}

async function uploadFile(
  file: File | string | ArrayBuffer | Buffer,
  acceptedFileTypes: string[],
  bucket: string
) {
  const buffer = await convertFile(file);

  const meta = await getFileMetadata(buffer);
  if (meta.auto?.ext && acceptedFileTypes.includes(meta.auto.ext)) {
    const newFileName = generateFileName(meta.auto?.ext);
    await storage.putObject(bucket, newFileName, buffer, buffer.byteLength, {
      "Content-Type": meta.auto.mime,
    });
    const seperator = bucket.endsWith("/") ? "" : "/";
    const bucketPath = [bucket, seperator, newFileName].join("");

    return {
      mime: meta.auto.mime,
      ext: meta.auto.ext,
      newFileName,
      bucketPath,
    };
  }
  throw Error("Could not validate file type.");
}

async function downloadFile(bucketPath: string): Promise<File> {
  const { name, path } = parseBucketPath(bucketPath);
  const file = new Promise<File>(async (resolve, reject) => {
    const chunks: Buffer[] = [];

    const dataStream = await storage.getObject(path, name);
    dataStream.on("data", (chunk) => {
      if (chunk instanceof Buffer) chunks.push(chunk);
    });
    dataStream.on("end", () => {
      const buffer = Buffer.concat(chunks);
      const blob = new Blob([buffer]);
      resolve(new File([blob], name));
    });
    dataStream.on("error", (err) => {
      reject(err);
    });
  });

  return file;
}

function parseBucketPath(fullBucketItemPath: string) {
  const parsedPath = path.parse(fullBucketItemPath);
  return {
    name: `${parsedPath.name}${parsedPath.ext}`,
    path: parsedPath.dir,
  };
}

async function convertFile(
  file: File | string | ArrayBuffer | Buffer
): Promise<Buffer> {
  if (typeof file === "string") {
    return openFileBuffer(file);
  } else if (file instanceof File) {
    return Buffer.from(await file.arrayBuffer());
  } else if (file instanceof ArrayBuffer) {
    return Buffer.from(file);
  } else {
    return file;
  }
}

export { downloadFile, uploadFile };
