import { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

interface StackedListProps extends HTMLAttributes<HTMLUListElement> {
  items: {
    id: string;
    top: string | number;
    bottom: string;
    icon?: ReactNode;
  }[];
}

export function StackedList({ items, className, ...props }: StackedListProps) {
  return (
    <ul className={cn("flex gap-8", className)} {...props}>
      {items.map((item) => (
        <li key={item.id} className="flex gap-2 items-center">
          {item.icon && item.icon}
          <div>
            <p className="font-medium">{item.top}</p>
            <p className="text-xs font-light">{item.bottom}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
