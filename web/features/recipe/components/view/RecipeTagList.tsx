import { toTitleCase } from "@/utils/utils";

interface RecipeTagListProps {
  tags: ({ id: string; name: string } | undefined)[];
}

export function RecipeTagList({ tags }: RecipeTagListProps) {
  return (
    tags && (
      <ul className="flex gap-2 text-sm">
        {tags
          ?.filter((tag) => tag)
          .map((tag) => (
            <li
              className="bg-secondary text-secondary-foreground px-2 py-0.5 rounded-md"
              key={tag?.id}
            >
              {toTitleCase(tag?.name)}
            </li>
          ))}
      </ul>
    )
  );
}
