import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface TagListProps<T> {
  id: keyof T;
  label: keyof T;
  items: T[];
  editable: boolean;
  removeItem: (id: string) => void;
}

export function TagList<T>({ items, editable, id, label }: TagListProps<T>) {
  return (
    <div className="flex flex-wrap gap-1">
      {items.map((item) => {
        return (
          <Badge key={item[id] as string}>
            {item[label] as string}
            {editable && <X className="h-4 w-4 ml-2 stroke-1" />}
          </Badge>
        );
      })}
    </div>
  );
}
