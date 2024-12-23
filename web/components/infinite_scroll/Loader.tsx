"use client";
import { Loader2 } from "lucide-react";
import { InView } from "react-intersection-observer";

interface LoaderProps {
  onView?: () => void;
}

export function Loader({ onView }: LoaderProps) {
  return (
    <InView
      as="div"
      className="col-span-full flex justify-center"
      onChange={(inView, entry) => {
        if (inView && onView) {
          onView();
        }
      }}
      triggerOnce={true}
    >
      <Loader2 className="animate-spin" />
    </InView>
  );
}
