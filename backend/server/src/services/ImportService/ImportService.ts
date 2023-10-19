import { getFileExtension } from "../../util/utils.js";
import crypto from "crypto";

export type FileMetaData = {
  path: string;
  name: string;
  ext: string;
};

export function getFileMetaData(path: string): FileMetaData {
  if (path) {
    const pathSplit = path.split("/");
    const name = pathSplit.pop() as string; // .pop() only return undefined if the array is empty. Array should not be empty if the string is not empty.
    const ext = getFileExtension(name);

    return {
      path,
      name, //: fileName.replace(fileExt, ""),
      ext,
    };
  }
  throw Error(`Path "${path}" is invalid.`);
}

export function hash(input: Buffer | string): string {
  const hash = crypto.createHash("sha256");
  hash.update(input);
  return hash.digest("hex");
}
