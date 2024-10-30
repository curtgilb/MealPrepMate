import { cn } from "@/lib/utils";
import React from "react";

interface SingleColumnCenteredProps
  extends React.HTMLAttributes<HTMLDivElement> {
  condensed?: boolean;
  locked?: boolean;
  children: React.ReactNode;
}

export default function SingleColumnCentered({
  locked = false,
  children,
  condensed,
  className,
  ...rest
}: SingleColumnCenteredProps) {
  return (
    <div
      className={cn(
        "max-w-screen-2xl w-full px-8 py-6 mx-auto border curt",
        {
          "h-main-full overflow-hidden": locked,
          "max-w-screen-xl": condensed,
        },
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
