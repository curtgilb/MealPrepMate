import { hash } from "@/infrastructure/file_io/common.js";
import { uploadFile } from "@/infrastructure/object_storage/storage.js";
import { db } from "@/infrastructure/repository/db.js";
import { Prisma } from "@prisma/client";

type PhotoQuery = {
  include?: Prisma.PhotoInclude | undefined;
  select?: Prisma.PhotoSelect | undefined;
};

const ACCEPTED_IMAGE_FILES = ["jpg", "png", "bmp", "tif", "heic"];

export async function uploadPhoto(file: Buffer, query?: PhotoQuery) {
  const hashValue = hash(file);

  // Check the DB to see if we already have it
  // @ts-ignore
  const record = await db.photo.findUnique({
    where: { hash: hashValue },
    ...query,
  });

  if (record) {
    return record;
  }

  // If not, save to storage. Then return photo record.
  const { bucketPath } = await uploadFile(file, ACCEPTED_IMAGE_FILES, "images");
  return await db.photo.create({
    data: {
      path: bucketPath,
      hash: hashValue,
    },
    ...query,
  });
}
