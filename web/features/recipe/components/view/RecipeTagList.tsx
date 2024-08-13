import { toTitleCase } from "@/utils/utils";

interface RecipeTagListProps {
  tags: { id: string; name: string }[];
}

export function RecipeTagList({ tags }: RecipeTagListProps) {
  return (
    <ul className="flex gap-2 text-sm">
      {tags.map((tag) => (
        <li
          className="bg-primary text-primary-foreground px-2 py-0.5 rounded-md"
          key={tag.id}
        >
          {toTitleCase(tag.name)}
        </li>
      ))}
    </ul>
  );
}
