import Image from 'next/image';
import { useRef, useState } from 'react';

interface Coordinate {
  x: number;
  y: number;
}

interface BoundingBox {
  id: string;
  coordinates: [Coordinate, Coordinate, Coordinate, Coordinate]; // Top-left, Top-right, Bottom-right, Bottom-left
}

interface SimpleImageProps {
  src: string;
  alt: string;
  title?: string;
  width: number;
  height: number;
  boundingBoxes?: BoundingBox[];
}

export function BoundingBoxImage({
  src,
  alt,
  title,
  width,
  height,
  boundingBoxes = [],
}: SimpleImageProps) {
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const imageRef = useRef<HTMLImageElement>(null);

  const getPolygonPoints = (coordinates: Coordinate[]) => {
    const points = coordinates
      .map((coord) => `${coord.x},${coord.y}`)
      .join(" ");
    return points;
  };

  return (
    <div className="relative w-full bg-muted/50 rounded-md border">
      <div className="relative w-full">
        <Image
          ref={imageRef}
          src={src}
          alt={alt}
          title={title}
          width={width}
          height={height}
          style={{
            width: "100%",
            height: "auto",
          }}
          unoptimized
          onLoadingComplete={({ naturalWidth, naturalHeight }) => {
            setImageSize({ width: naturalWidth, height: naturalHeight });
          }}
          priority
        />

        {/* Debug info */}
        <div className="absolute top-0 left-0 bg-black/50 text-white p-2 text-xs">
          Image Size: {imageSize.width} x {imageSize.height}
        </div>

        <svg
          className="absolute top-0 left-0 w-full h-full"
          preserveAspectRatio="none"
          viewBox={`0 0 ${imageSize.width} ${imageSize.height}`}
          style={{
            pointerEvents: "none",
            border: "2px solid red", // Debug border
          }}
        >
          {/* Debug rectangle */}
          <rect
            x="0"
            y="0"
            width={imageSize.width}
            height={imageSize.height}
            fill="none"
            stroke="green"
            strokeWidth="4"
          />

          {boundingBoxes.map((box) => (
            <polygon
              key={box.id}
              points={getPolygonPoints(box.coordinates)}
              className="fill-blue-500/20 stroke-blue-500"
              strokeWidth="4"
            />
          ))}
        </svg>
      </div>
    </div>
  );
}
