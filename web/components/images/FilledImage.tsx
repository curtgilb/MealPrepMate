import { cn } from "@/lib/utils";
import Image from "next/image";

interface FilledImageProps {
  altText: string;
  url: string;
  imageCss?: string;
  containerCss?: string;
}

export function FilledImage({
  url,
  altText,
  imageCss,
  containerCss,
}: FilledImageProps) {
  return (
    <div className={cn("overflow-hidden relative rounded-md", containerCss)}>
      <Image
        className={imageCss}
        src={url}
        alt={altText}
        fill
        style={{
          objectFit: "cover",
        }}
      />
    </div>
  );
}
