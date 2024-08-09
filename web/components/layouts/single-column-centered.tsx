import { cn } from "@/lib/utils";
import React from "react";

export default function SingleColumnCentered({
  locked = false,
  children,
}: {
  locked?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn("max-w-screen-2xl w-full px-8 pt-6 mx-auto", {
        "h-main-full pb-6 overflow-hidden": locked,
      })}
    >
      {children}
    </div>
  );
}
