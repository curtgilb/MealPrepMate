import { getPath } from "@/infrastructure/file_io/common.js";
import fs from "fs/promises";

async function saveJSON<T>(
  path: string,
  data: T,
  encoding: BufferEncoding = "utf-8"
): Promise<void> {
  const validatedPath = getPath(path);
  const jsonData = JSON.stringify(data, null, 2); // Pretty-print with 2 spaces
  await fs.writeFile(validatedPath, jsonData, { encoding });
}

export { saveJSON };
