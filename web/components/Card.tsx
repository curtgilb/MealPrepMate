import React, { ReactNode } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Link from "next/link";

export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  image: {
    urls: string[] | null | undefined;
    altText: string;
    placeholderUrl: string;
    grid: boolean;
  };

  href?: string;
  vertical: boolean;
}

export const Card = React.forwardRef<
  HTMLAnchorElement | HTMLDivElement,
  CardProps
>(function Card(props, forwardedRef) {
  const { children, image, vertical, href, ...rest } = props;
  const { className, ...additionalProps } = rest;
  const baseStyle = cn(
    "border rounded-md overflow-hidden bg-card group ring-primary focus-visible:ring outline-none",
    {
      block: href,
      "w-80": vertical,
      flex: !vertical,
      className,
    }
  );

  const content = (
    <>
      <CardImage images={image} verticalOrientation={vertical} />
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
  images: CardProps["image"];
  verticalOrientation: boolean;
}

function CardImage({ images, verticalOrientation }: CardImageProps) {
  const url =
    images.urls && images.urls.length > 0
      ? images.urls[0]
      : images.placeholderUrl;

  return (
    <div
      className={cn("overflow-hidden relative", {
        "w-80 h-72": verticalOrientation,
        "w-16 h-16": !verticalOrientation,
      })}
    >
      <Image
        className="group-hover:scale-105 transition-transform"
        src={url}
        alt={images.altText}
        sizes="100vw"
        fill
        style={{
          objectFit: "cover", // cover, contain, none
        }}
      />
    </div>
  );
}
