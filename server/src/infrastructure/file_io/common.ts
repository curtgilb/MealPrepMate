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

function findProjectRoot(startDir = process.cwd()) {
  let currentDir = startDir;

  // Loop continues until we reach the root of the file system
  while (currentDir !== path.parse(currentDir).root) {
    // Check if 'package.json' exists in the current directory
    if (fs.existsSync(path.join(currentDir, "package.json"))) {
      return currentDir;
    }
    // Move up to the parent directory
    currentDir = path.dirname(currentDir);
  }

  throw new Error(
    "Project root not found. Make sure package.json exists in the project root."
  );
}

const project_root = findProjectRoot();
console.log(project_root);

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
  const fullPath = path.join(project_root, filePath);
  // Attempt to normalize the path to check for validity
  const normalizedPath = path.normalize(fullPath);
  fs.existsSync(normalizedPath);
  return normalizedPath;
}

export { getPath, hash, getFileMetadata, project_root };
