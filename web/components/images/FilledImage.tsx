import Image from "next/image";

import { ImageSize, sizeToPixels } from "@/components/images/Image";
import { cn } from "@/lib/utils";

import { HTMLAttributes } from "react";

interface FilledImageProps extends HTMLAttributes<HTMLDivElement> {
  altText: string;
  url: string;
  targetSize: ImageSize;
  squared?: boolean;
  rounded?: boolean;
}

export function FilledImage({
  url,
  altText,
  targetSize,
  squared = false,
  rounded = false,
  className,
  ...rest
}: FilledImageProps) {
  const size = sizeToPixels[targetSize];
  console.log("FilledImage", size.width);
  return (
    <div
      className={cn(
        `overflow-hidden relative ${size.height}`,
        squared ? size.width : "w-full",
        {
          "rounded-md": rounded,
        },
        className
      )}
      {...rest}
    >
      <Image
        src={url}
        alt={altText}
        sizes={`${size.pixels}px`}
        fill
        style={{
          objectFit: "cover",
        }}
      />
    </div>
  );
}
