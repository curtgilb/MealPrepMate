import { Photo, Prisma } from "@prisma/client";
import { uploadFileToBucket } from "../services/io/FileStorage.js";
import { hash } from "../util/utils.js";

type PhotoQuery = {
  include?: Prisma.PhotoInclude | undefined;
  select?: Prisma.PhotoSelect | undefined;
};

const ACCEPTED_IMAGE_FILES = ["jpg", "png", "bmp", "tif", "heic"];

export const photoExtension = Prisma.defineExtension((client) => {
  return client.$extends({
    model: {
      photo: {
        async uploadPhoto(
          file: Buffer,
          isPrimary: boolean,
          query?: PhotoQuery
        ): Promise<Photo> {
          const hashValue = hash(file);

          // Check the DB to see if we already have it
          const record = await client.photo.findUnique({
            where: { hash: hashValue },
            ...query,
          });
          if (record) {
            return record;
          }

          // If not, save to storage. Then return photo record.
          const { bucketPath } = await uploadFileToBucket(
            file,
            ACCEPTED_IMAGE_FILES,
            "images"
          );
          return await client.photo.create({
            data: {
              path: bucketPath,
              isPrimary,
              hash: hashValue,
            },
            ...query,
          });
        },
      },
    },
  });
});
