import { Prisma, Photo } from "@prisma/client";
import { storage } from "../storage.js";
import { hash, getFileExtension } from "../util/utils.js";
import { v4 as uuidv4 } from "uuid";
import { db } from "../db.js";

type PhotoQuery = {
  include?: Prisma.PhotoInclude | undefined;
  select?: Prisma.PhotoSelect | undefined;
};

export async function uploadPhoto(
  file: Buffer,
  fileName: string,
  query?: PhotoQuery
): Promise<Photo> {
  const hashValue = hash(file);

  // Check the DB to see if we already have it
  const record = await db.photo.findUnique({
    where: { hash: hashValue },
    ...query,
  });
  if (record) {
    return record;
  }

  const ext = getFileExtension(fileName);

  // If not, save to storage. Then return photo record.
  const name = `${uuidv4()}.${ext}`;
  await storage.putObject("images", name, file);
  return await db.photo.create({
    data: {
      path: `images/${name}`,
      hash: hashValue,
    },
    ...query,
  });
}
