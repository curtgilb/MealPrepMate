import { FilledImage } from "@/components/images/FilledImage";
import { ReactNode, useMemo } from "react";

interface MultiImageCardProps {
  children?: ReactNode;
  images?: {
    id: string;
    url: string;
    altText: string;
  }[];
}

export function MultiImageCard({ children, images }: MultiImageCardProps) {
  const displayImages = useMemo(() => {
    const providedImages = images?.slice(0, 3) ?? [];
    let counter = 1;
    while (providedImages.length < 4) {
      providedImages.push({
        id: `$placeholder-${1}`,
        url: "/placeholder_recipe.jpg",
        altText: "Placeholder image",
      });
      counter++;
    }
    return providedImages;
  }, [images]);

  return (
    <div>
      <div className="grid grid-cols-2">
        {displayImages.map((image) => {
          return (
            <FilledImage
              key={image.id}
              url={image.url}
              altText={image.altText}
              squared
              targetSize="sm"
            />
          );
        })}
      </div>
      {children}
    </div>
  );
}
