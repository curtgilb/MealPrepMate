import { Dispatch, SetStateAction } from "react";

import { QueryVariables } from "@/components/infinite_scroll/InfiniteScroll";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { TypedDocumentNode, useQuery } from "@urql/next";

export interface CheckboxFilterProps<TQuery, TData> {
  query: TypedDocumentNode<TQuery>; // URQL query type
  render: (item: TData) => { label: string; id: string };
  getList: (data: TQuery | undefined) => TData[] | undefined;
  className?: string;
  selectedIds: string[];
  setSelectedIds: Dispatch<SetStateAction<string[]>>;
  title?: string;
}

export function CheckboxFilter<TQuery, TData>({
  query,
  render,
  getList,
  className,
  selectedIds,
  setSelectedIds,
}: CheckboxFilterProps<TQuery, TData>) {
  const [results] = useQuery({
    query: query,
    variables: {},
  });

  if (results.data) {
    const list = getList(results.data);
    const length = list?.length ?? 0;
    const rowsNeeded = Math.ceil(length / 2); // For 2 columns

    return (
      <div
        className={cn("grid gap-2.5 grid-flow-col", className)}
        style={{ gridTemplateRows: `repeat(${rowsNeeded}, minmax(0, 1fr))` }}
      >
        {list &&
          list.map((listItem) => {
            const item = render(listItem);
            return (
              <div key={item.id} className="flex items-center space-x-2">
                <Checkbox
                  id={item.id}
                  checked={selectedIds.includes(item.id)}
                  onCheckedChange={(state) => {
                    if (state) {
                      setSelectedIds([...selectedIds, item.id]);
                    } else {
                      setSelectedIds(
                        selectedIds.filter((id) => id !== item.id)
                      );
                    }
                  }}
                />
                <label
                  htmlFor={item.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {item.label}
                </label>
              </div>
            );
          })}
      </div>
    );
  }

  return null;
}
