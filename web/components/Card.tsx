import Image from "next/image";
import Link from "next/link";
import React, { ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  images?: {
    id: string;
    url: string;
    altText: string;
  }[];
  placeholderUrl: string;
  imageGrid?: boolean;
  href?: string;
  vertical: boolean;
}

export const Card = React.forwardRef<
  HTMLAnchorElement | HTMLDivElement,
  CardProps
>(function Card(props, forwardedRef) {
  const {
    children,
    images,
    vertical,
    href,
    placeholderUrl,
    imageGrid,
    ...rest
  } = props;
  const { className, ...additionalProps } = rest;
  const baseStyle = cn(
    "border rounded-md overflow-hidden bg-card group ring ring-transparent hover:cursor-pointer focus:ring-primary",
    {
      block: href,
      flex: !vertical,
      className,
    }
  );

  const content = (
    <>
      <CardImage
        images={images}
        placeholderUrl={placeholderUrl}
        imageGrid={imageGrid}
        verticalOrientation={vertical}
      />
      <div className={cn("p-2 text-left", { "px-4 py-2.5": vertical })}>
        {children}
      </div>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={baseStyle}
        ref={forwardedRef as React.Ref<HTMLAnchorElement>}
        {...additionalProps}
      >
        {content}
      </Link>
    );
  }
  return (
    <div
      className={baseStyle}
      ref={forwardedRef as React.Ref<HTMLDivElement>}
      {...additionalProps}
    >
      {content}
    </div>
  );
});

interface CardImageProps {
  images: CardProps["images"];
  placeholderUrl: string;
  imageGrid?: boolean;
  verticalOrientation: boolean;
}

function CardImage({
  images,
  placeholderUrl,
  imageGrid,
  verticalOrientation,
}: CardImageProps) {
  const isMultiple = images && images.length > 1;
  const imagesDisplayed = isMultiple && imageGrid ? 4 : 1;

  // Create array of length imagesDisplayed, fill empty spots with null
  const displayItems = Array(imagesDisplayed)
    .fill(null)
    .map((_, index) => {
      return images?.[index] || null;
    });

  return (
    <div
      className={cn("overflow-hidden relative bg-muted shrink-0", {
        "w-80 h-72": verticalOrientation,
        "w-16 h-16": !verticalOrientation,
        "grid grid-cols-2": imageGrid,
      })}
    >
      {displayItems.map((image, index) => {
        if (!image) {
          return (
            <Image
              key={placeholderUrl}
              className="group-hover:scale-105 transition-transform"
              src={placeholderUrl}
              alt={""}
              sizes="320px"
              fill
              style={{
                objectFit: "cover",
              }}
            />
          );
        }
        return (
          <Image
            key={image.url}
            className="group-hover:scale-105 transition-transform"
            src={image.url}
            alt={image.altText}
            sizes="320px"
            fill
            style={{
              objectFit: "cover",
            }}
          />
        );
      })}
    </div>
  );
}
