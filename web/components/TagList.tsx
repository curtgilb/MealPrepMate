interface TagListProps extends React.HTMLAttributes<HTMLUListElement> {
  list: { id: string; name: string }[];
}

export function TagList({ list, ...attributes }: TagListProps) {
  return (
    <ul className="flex flex-wrap gap-1.5 max-w-96" {...attributes}>
      {list.map((item) => (
        <li
          className="bg-primary text-primary-foreground px-2 py-1.5 rounded-lg text-xs inline-block"
          key={item.id}
        >
          {item.name}
        </li>
      ))}
    </ul>
  );
}
