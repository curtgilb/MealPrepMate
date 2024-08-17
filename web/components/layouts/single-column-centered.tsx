import { cn } from "@/lib/utils";
import React from "react";

interface SingleColumnCenteredProps
  extends React.HTMLAttributes<HTMLDivElement> {
  locked?: boolean;
  children: React.ReactNode;
}

export default function SingleColumnCentered({
  locked = false,
  children,
  className,
  ...rest
}: SingleColumnCenteredProps) {
  return (
    <div
      className={cn(
        "max-w-screen-2xl w-full px-8 py-6 mx-auto",
        {
          "h-main-full overflow-hidden": locked,
        },
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
