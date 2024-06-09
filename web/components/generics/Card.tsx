import { ReactNode } from "react";
import Image from "next/image";
import { Skeleton } from "../ui/skeleton";
import { useInView } from "react-intersection-observer";

export interface CardProps {
  children?: ReactNode;
  loading?: boolean;
  urls: string[];
  altText: string;
  vertical: boolean;
  intersection?: boolean;
}

export function Card({
  children,
  loading = false,
  urls,
  vertical = false,
}: CardProps) {
  return (
    <div
      className={
        vertical
          ? "border rounded overflow-hidden bg-card"
          : "flex border rounded overflow-hidden bg-card"
      }
    >
      <div className={vertical ? "w-52" : "w-[5rem]"}>
        {loading ? (
          <Skeleton className="h-full w-full" />
        ) : (
          <Image
            src="/pancakes.jpg"
            style={{
              width: "100%",
              height: "auto",
              objectFit: "fill",
            }}
            alt="recipe image"
            width={208}
            height={208}
          />
        )}
      </div>
      <div className="p-2">
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
}
