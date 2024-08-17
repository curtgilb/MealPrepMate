import { cn } from "@/lib/utils";

interface TagListProps extends React.HTMLAttributes<HTMLUListElement> {
  list: { id: string; name: string }[] | undefined;
  variant: "dark" | "light";
}

export function TagList({ list, variant, ...attributes }: TagListProps) {
  return (
    <ul className="flex flex-wrap gap-1.5 max-w-96" {...attributes}>
      {list?.map((item) => (
        <li
          className={cn("px-2 py-1.5 rounded-lg text-xs inline-block", {
            "bg-primary text-primary-foreground": variant === "dark",
            "bg-primary/10": variant === "light",
          })}
          key={item.id}
        >
          {item.name}
        </li>
      ))}
    </ul>
  );
}
