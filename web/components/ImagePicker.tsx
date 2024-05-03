import Image from "next/image";
import { Upload } from "lucide-react";
import { FragmentType, graphql, useFragment } from "@/gql";

import { ModalDrawer } from "./ModalDrawer";
import { ImageUploadForm } from "./ImageUpload";

const photoFieldsFragment = graphql(`
  fragment PhotoFields on Photo {
    id
    isPrimary
    url
  }
`);

interface ImagePickerProps {
  images?: FragmentType<typeof photoFieldsFragment>[];
}

function getFullPath(path: string) {
  return `http://localhost:9000/${path}`;
}

export function ImagePicker({ images }: ImagePickerProps) {
  const photos = useFragment(photoFieldsFragment, images);

  let primaryPhoto =
    photos?.length === 0 ? undefined : photos?.find((photo) => photo.isPrimary);

  return (
    <div className="grid gap-2">
      <Image
        alt="Product image"
        className="aspect-square w-full rounded-md object-cover"
        height="300"
        src={primaryPhoto ? getFullPath(primaryPhoto.url) : "/placeholder.jpg"}
        width="300"
      />
      <div className="grid grid-cols-3 gap-2">
        {photos
          ?.filter((photo) => {
            photo.id !== primaryPhoto?.id;
          })
          .map((photo) => {
            return (
              <Image
                key={photo.id}
                alt="Recipe Image"
                className="aspect-square w-full rounded-md object-cover"
                height="84"
                src={getFullPath(photo.url)}
                width="84"
              />
            );
          })}
        <ModalDrawer
          title="Upload photo"
          content={<ImageUploadForm />}
          trigger={
            <button className="flex aspect-square w-full items-center justify-center rounded-md border border-dashed">
              <Upload className="h-4 w-4 text-muted-foreground" />
              <span className="sr-only">Upload</span>
            </button>
          }
        ></ModalDrawer>
      </div>
    </div>
  );
}
