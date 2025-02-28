import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { HTMLAttributes, ReactNode } from "react";

interface SideBarProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function SideBarContainer({
  children,
  className,
  ...attributes
}: SideBarProps) {
  return (
    <div
      className={cn("flex flex-col gap-2 h-[calc(100%-3rem)]", className)}
      {...attributes}
    >
      {children}
    </div>
  );
}

export function SideBarHeader({
  children,
  className,
  ...attributes
}: SideBarProps) {
  return (
    <div className={cn("shrink-0", className)} {...attributes}>
      {children}
    </div>
  );
}

export function SideBarContent({
  children,
  className,
  ...attributes
}: SideBarProps) {
  return (
    <ScrollArea className={cn("flex-1 min-h-0 pr-4", className)}>
      {children}
    </ScrollArea>
  );
}

export function SideBarFooter({
  children,
  className,
  ...attributes
}: SideBarProps) {
  return (
    <div
      className={cn("shrink-0 flex flex-col gap-2", className)}
      {...attributes}
    >
      {children}
    </div>
  );
}

// Usage:
<SideBarContainer>
  <SideBarHeader>Header Content</SideBarHeader>
  <SideBarContent>Main Content</SideBarContent>
  <SideBarFooter>Footer Content</SideBarFooter>
</SideBarContainer>;
