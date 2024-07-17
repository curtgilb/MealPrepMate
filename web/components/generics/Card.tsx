import React, { ReactNode } from "react";
import Image from "next/image";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  loading?: boolean;
  image: {
    images: { url: string | null | undefined; altText: string }[];
    placeholder: string;
    grid: boolean;
  };
  vertical: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(function Card(
  props,
  forwardedRef
) {
  const { children, loading, image, vertical, ...rest } = props;
  const { className, ...additionalProps } = rest;

  return (
    <div
      {...additionalProps}
      ref={forwardedRef}
      className={cn(className, "border rounded overflow-hidden bg-card", {
        vertical: "w-64",
      })}
    >
      <div
        className={cn(
          "relative overflow-hidden",
          vertical ? "w-64 h-64" : "w-[5rem] h-[5rem]"
        )}
      >
        {loading ? (
          <Skeleton className="h-full w-full" />
        ) : (
          <CardImage images={image} />
        )}
      </div>
      <div className="p-2 text-left">
        {loading ? (
          <div>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-4 w-16" />
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
});

interface CardImageProps {
  images: CardProps["image"];
}

function CardImage({ images }: CardImageProps) {
  const showGrid = images.grid && images.images.length > 1;

  return (
    <Image
      src="/pancakes.jpg"
      alt="recipe image"
      fill
      style={{
        objectFit: "fill",
      }}
    />
  );
}
