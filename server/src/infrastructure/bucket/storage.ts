import { Client } from "minio";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { fileTypeFromBuffer } from "file-type";

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

async function checkFileType(buffer: Buffer, acceptedFileExtension: string[]) {
  const meta = await fileTypeFromBuffer(buffer);
  if (!meta || !acceptedFileExtension.includes(meta.ext)) {
    throw new Error("Unaccepted file format");
  }
  return meta;
}

async function uploadFile(
  file: File | string | ArrayBuffer | Buffer,
  acceptedFileTypes: string[],
  bucket: string
) {
  const buffer = await convertFile(file);

  const meta = await checkFileType(buffer, acceptedFileTypes);
  const newFileName = generateFileName(meta.ext);
  await storage.putObject(bucket, newFileName, buffer, buffer.byteLength, {
    "Content-Type": meta?.mime,
  });
  const seperator = bucket.endsWith("/") ? "" : "/";
  const bucketPath = [bucket, seperator, newFileName].join("");

  return {
    mime: meta.mime,
    ext: meta.ext,
    newFileName,
    bucketPath,
  };
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
