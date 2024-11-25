import { Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { PhotoFieldsFragment } from "@/gql/graphql";
import { cn } from "@/lib/utils";
import { getImageUrl } from "@/utils/utils";

import { ImageUploadForm } from "./ImageUpload";
import { ProgramticModalDrawer } from "./ModalDrawerProgramatic";
import { ModalDrawerWithTrigger } from "./ModalDrawerWithTrigger";

interface ImagePickerProps {
  images: PhotoFieldsFragment[];
  setImages: (images: PhotoFieldsFragment[]) => void;
}

export function ImagePicker({ images, setImages }: ImagePickerProps) {
  const [viewOpen, setViewOpen] = useState<boolean>(false);
  const [uploadOpen, setUploadOpen] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] =
    useState<PhotoFieldsFragment | null>(null);

  let primaryPhoto = images?.find((photo) => photo.isPrimary);
  if (!primaryPhoto) {
    if (images.length > 0) {
      primaryPhoto = images[0];
    } else {
      primaryPhoto = {
        id: "default",
        isPrimary: true,
        url: "/placeholder.jpg",
      };
    }
  }
  const isDefault = primaryPhoto.id === "default";

  return (
    <div className="grid gap-2 border rounded-md p-4">
      <div
        className={cn("bg-white overflow-hidden rounded-md w-full", {
          "cursor-pointer": isDefault,
        })}
        onClick={() => {
          if (!isDefault) {
            setSelectedImage(primaryPhoto);
            setViewOpen(true);
          }
        }}
      >
        <Image
          alt="Recipe image"
          className="aspect-square w-full object-cover"
          height="300"
          src={
            primaryPhoto ? getImageUrl(primaryPhoto.url) : "/placeholder.jpg"
          }
          width="300"
        />
      </div>

      <ScrollArea>
        <div className="flex gap-2 px-0 py-4">
          {images
            ?.filter((photo) => photo.id !== primaryPhoto?.id)
            .map((photo) => (
              <div
                key={photo.id}
                className="rounded-md overflow-hidden relative w-28 h-28 cursor-pointer"
                onClick={() => {
                  setSelectedImage(photo);
                  setViewOpen(true);
                }}
              >
                <Image
                  src={getImageUrl(photo.url)}
                  alt="Recipe image"
                  sizes="84px"
                  fill
                  style={{
                    objectFit: "cover",
                  }}
                />
              </div>
            ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <ProgramticModalDrawer
        title="Recipe Image"
        description="View the selected image"
        open={viewOpen}
        setOpen={setViewOpen}
        showCloseButton={false}
        className="sm:max-w-4xl"
        content={
          selectedImage && (
            <>
              <div className="relative w-full h-[56rem]">
                <Image
                  className="overflow-hidden rounded-md"
                  src={getImageUrl(selectedImage.url)}
                  alt="Recipe image"
                  sizes="384px"
                  fill
                  style={{
                    objectFit: "cover",
                  }}
                />
              </div>
              <div className="flex justify-end gap-4">
                {/* <Button variant="default">
                  <Trash2 />
                  Make primary photo
                </Button> */}
                <Button
                  variant="destructive"
                  onClick={() => {
                    setImages(
                      images.filter((image) => image.id !== selectedImage.id)
                    );
                    setViewOpen(false);
                  }}
                >
                  <Trash2 />
                  Delete
                </Button>
              </div>
            </>
          )
        }
      />

      <ModalDrawerWithTrigger
        title="Upload photo"
        open={uploadOpen}
        setOpen={setUploadOpen}
        content={
          <ImageUploadForm
            onUploadedPhoto={(photo) => {
              setImages([...images, photo]);
              setUploadOpen(false);
            }}
          />
        }
        trigger={
          <Button className="w-full" variant="secondary">
            <Upload />
            Upload Photo
          </Button>
        }
      ></ModalDrawerWithTrigger>
    </div>
  );
}
