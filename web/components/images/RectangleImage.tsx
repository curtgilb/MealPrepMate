import Image from "next/image";

import { cn } from "@/lib/utils";

interface FilledImageProps {
  altText: string;
  url: string;
  height?: number;
  targetWidth: number;
}

export function RectangleImage({
  url,
  altText,
  height = 224,
  targetWidth,
}: FilledImageProps) {
  return (
    <div
      className="overflow-hidden rounded-md relative w-full"
      style={{ height: `${height}px` }}
    >
      <Image
        src={url}
        alt={altText}
        sizes={`${targetWidth}px`}
        fill
        style={{
          objectFit: "cover",
        }}
      />
    </div>
  );
}
