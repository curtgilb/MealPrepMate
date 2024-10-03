import { ReactNode } from "react";

interface StackedListProps {
  items: {
    id: string;
    top: string | number;
    bottom: string;
    icon?: ReactNode;
  }[];
}

export function StackedList({ items }: StackedListProps) {
  return (
    <ul className="flex gap-8">
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
