import { Minus, Plus, RotateCcw } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";

import { Button } from "@/components/ui/button";

interface Coordinate {
  x: number;
  y: number;
}

export interface BoundingBox {
  name: string;
  boxList: Coordinate[][]; // Top-left, Top-right, Bottom-right, Bottom-left
}

interface ZoomableImageProps {
  src: string;
  alt: string;
  title?: string;
  width: number;
  height: number;
  highlight?: BoundingBox;
}

export function ZoomableImage({
  src,
  alt,
  title,
  width,
  height,
  highlight,
}: ZoomableImageProps) {
  const [scale, setScale] = useState(1);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const imageRef = useRef<HTMLImageElement>(null);

  const getPolygonPoints = (coordinates: Coordinate[]) => {
    const points = coordinates
      .map((coord) => `${coord.x},${coord.y}`)
      .join(" ");
    return points;
  };

  return (
    <div className="relative w-full bg-muted/50 rounded-md border overflow-hidden max-w-xl shrink">
      <TransformWrapper
        initialScale={1}
        minScale={0.5}
        maxScale={3}
        onZoom={({ state }) => setScale(state.scale)}
      >
        {({ zoomIn, zoomOut, resetTransform, setTransform }) => (
          <>
            {/* Zoom Controls */}
            <div className="absolute top-2 right-2 z-10 flex gap-2">
              <Button
                onClick={() => zoomIn()}
                size="icon"
                variant="secondary"
                title="Zoom In"
              >
                <Plus className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => zoomOut()}
                size="icon"
                variant="secondary"
                title="Zoom Out"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => resetTransform()}
                size="icon"
                variant="secondary"
                title="Reset Zoom"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>

            <TransformComponent wrapperClass="w-full" contentClass="w-full">
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
                    setImageSize({
                      width: naturalWidth,
                      height: naturalHeight,
                    });
                  }}
                  priority
                />

                {highlight && (
                  <svg
                    className="absolute top-0 left-0 w-full h-full"
                    preserveAspectRatio="none"
                    viewBox={`0 0 ${imageSize.width} ${imageSize.height}`}
                    style={{
                      pointerEvents: "none",
                    }}
                  >
                    {highlight?.boxList?.map((box, index) => (
                      <polygon
                        key={`${highlight?.name}-${index}`}
                        points={getPolygonPoints(box)}
                        className="stroke-blue-500 fill-blue-500/5"
                        strokeWidth="3"
                      />
                    ))}
                  </svg>
                )}
              </div>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
}
