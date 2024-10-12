import path from "path";
import fs from "fs";
import { createHash } from "crypto";
import { fileTypeFromBuffer, FileTypeResult } from "file-type";

type FileMetaData = {
  path: {
    path: string | undefined;
    name: string | undefined;
    ext: string | undefined;
  };
  auto: FileTypeResult | undefined;
};

async function getFileMetadata(
  buffer: Buffer,
  path?: string
): Promise<FileMetaData> {
  const meta = await fileTypeFromBuffer(buffer);

  const pathSplit = path?.split("/");
  const name = pathSplit?.pop() as string;
  const ext = name?.substring(name.lastIndexOf(".") + 1);

  return {
    path: {
      path,
      name,
      ext,
    },
    auto: meta,
  };
}

function hash(input: Buffer | string): string {
  const hash = createHash("sha256");
  hash.update(input);
  return hash.digest("hex");
}

function getPath(filePath: string) {
  // Attempt to normalize the path to check for validity
  const normalizedPath = path.normalize(filePath);
  fs.existsSync(normalizedPath);

  return normalizedPath;
}

export { getPath, hash, getFileMetadata };
