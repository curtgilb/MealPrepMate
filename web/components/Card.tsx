import Image from "next/image";
import Link from "next/link";
import React, { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { FilledImage } from "@/components/images/FilledImage";
import { ImageSize } from "@/components/images/Image";

export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  image?: {
    id: string;
    url: string;
    altText: string;
  };
  size: ImageSize;
  imageAspectRatio?: "rec" | "sqaure";
  placeholderUrl: string;
  href?: string;
  orientation: "vertical" | "horizontal";
}

export const Card = React.forwardRef<
  HTMLAnchorElement | HTMLDivElement,
  CardProps
>(function Card(props, forwardedRef) {
  const {
    children,
    image,
    orientation,
    size,
    href,
    placeholderUrl,
    imageAspectRatio = "rec",
    ...rest
  } = props;
  const { className, ...additionalProps } = rest;
  const verticalLayout = orientation === "vertical";
  const url = image?.url
    ? process.env.NEXT_PUBLIC_STORAGE_URL + image.url
    : placeholderUrl;

  const baseStyle = cn(
    "border rounded-md overflow-hidden bg-card group ring ring-transparent hover:cursor-pointer focus:ring-primary",
    {
      block: href,
      flex: !verticalLayout,
      className,
    }
  );

  const content = (
    <>
      <FilledImage
        url={url}
        altText={image?.altText ?? "Placeholder image"}
        targetSize={size}
        squared={imageAspectRatio === "sqaure"}
        className={!verticalLayout ? "shrink-0" : ""}
      ></FilledImage>
      <div className={cn("p-2 text-left", { "px-4 py-2.5": verticalLayout })}>
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
