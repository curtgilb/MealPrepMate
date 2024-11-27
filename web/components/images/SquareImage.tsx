import Image from "next/image";

import { cn } from "@/lib/utils";

interface FilledImageProps {
  altText: string;
  url: string;
  targetSize: number;
}

export function SquareImage({ url, altText, targetSize }: FilledImageProps) {
  return (
    <div className="overflow-hidden rounded-md relative w-full">
      <Image
        src={url}
        alt={altText}
        sizes="300px"
        fill
        style={{
          objectFit: "cover",
        }}
      />
    </div>
  );
}
