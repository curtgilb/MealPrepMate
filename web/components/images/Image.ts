export type ImageSize = "xs" | "sm" | "md" | "lg" | "xl";

export const sizeToPixels: Record<
  ImageSize,
  { pixels: number; height: string; width: string }
> = {
  xs: { pixels: 56, height: "h-14", width: "w-14" },
  sm: { pixels: 96, height: "h-24", width: "w-24" },
  md: { pixels: 176, height: "h-44", width: "w-44" },
  lg: { pixels: 224, height: "h-56", width: "w-56" },
  xl: { pixels: 384, height: "h-96", width: "w-96" },
};
