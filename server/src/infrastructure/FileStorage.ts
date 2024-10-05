import { fileTypeFromBuffer } from "file-type";
import { v4 as uuidv4 } from "uuid";
import { storage } from "../../infrastructure/storage.js";
import { openFileBuffer } from "./Readers.js";
import path from "path";

async function checkFileType(buffer: Buffer, acceptedFileExtension: string[]) {
  const meta = await fileTypeFromBuffer(buffer);
  if (!meta || !acceptedFileExtension.includes(meta.ext)) {
    throw new Error("Unaccepted file format");
  }
  return meta;
}

function generateFileName(ext: string) {
  return `${uuidv4()}.${ext}`;
}

type FileUploadResponse = {
  mime: string;
  ext: string;
  newFileName: string;
  bucketPath: string;
};

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

async function uploadFileToBucket(
  file: File | string | ArrayBuffer | Buffer,
  acceptedFileTypes: string[],
  bucket: string
): Promise<FileUploadResponse> {
  const convertedFile = await convertFile(file);

  const meta = await checkFileType(convertedFile, acceptedFileTypes);
  const newFileName = generateFileName(meta.ext);
  await storage.putObject(bucket, newFileName, convertedFile, {
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

function downloadFileFromBucket(bucketPath: string): Promise<File> {
  const { name, path } = getObjectPathAndName(bucketPath);
  const file = new Promise<File>((resolve, reject) => {
    const chunks: Buffer[] = [];

    storage.getObject(path, name, (err, dataStream) => {
      if (err) {
        reject(err);
      }
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
  });
  return file;
}

function getObjectPathAndName(fullBucketItemPath: string) {
  const parsedPath = path.parse(fullBucketItemPath);
  return {
    name: `${parsedPath.name}${parsedPath.ext}`,
    path: parsedPath.dir,
  };
}

export { uploadFileToBucket, downloadFileFromBucket, getObjectPathAndName };
