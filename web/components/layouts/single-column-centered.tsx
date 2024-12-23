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
        "max-w-screen-2xl w-full py-6 mx-auto mb-14 px-6 2xl:px-0",
        {
          "h-main-full overflow-hidden mb-0": locked,
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
