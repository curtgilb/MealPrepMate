interface TagListProps {
  list: { id: string; name: string }[];
}

export function TagList({ list }: TagListProps) {
  return (
    <ul className="flex flex-wrap gap-2 max-w-96">
      {list.map((item) => (
        <li
          className="bg-secondary px-3 py-2 rounded-lg text-sm inline-block"
          key={item.id}
        >
          {item.name}
        </li>
      ))}
    </ul>
  );
}
