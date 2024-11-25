import { useFormContext } from "react-hook-form";
import { z } from "zod";

import { Checkbox } from "@/components/ui/checkbox";
import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { FilterValidationType } from "@/features/recipe/components/RecipeFilter";
import { cn } from "@/lib/utils";
import { TypedDocumentNode, useQuery } from "@urql/next";

type BasicItemKeys<T> = {
  [K in keyof T]: T[K] extends z.infer<typeof basicItemSchema> ? K : never;
}[keyof T] &
  string;

export interface CheckboxFilterProps<TQuery, TData> {
  query: TypedDocumentNode<TQuery>;
  render: (item: TData) => { label: string; id: string };
  getList: (data: TQuery | undefined) => TData[] | undefined;
  className?: string;
  title?: string;
  name: BasicItemKeys<FilterValidationType>;
}

export const basicItemSchema = z
  .object({
    id: z.string(),
    label: z.string(),
  })
  .array();

export type CheckboxFilterItem = z.infer<typeof basicItemSchema>;

export function CheckboxFilter<TQuery, TData>({
  query,
  render,
  getList,
  className,
  title,
  name,
}: CheckboxFilterProps<TQuery, TData>) {
  const form = useFormContext<FilterValidationType>();

  const [results] = useQuery({
    query: query,
    variables: {},
  });

  if (results.data) {
    const list = getList(results.data);
    const length = list?.length ?? 0;
    const rowsNeeded = Math.ceil(length / 2); // For 2 columns

    return (
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => {
          return (
            <FormItem>
              {title && <FormLabel>{title}</FormLabel>}
              <ul
                className={cn(
                  "grid gap-2.5 grid-flow-col justify-items-between",
                  className
                )}
                style={{
                  gridTemplateRows: `repeat(${rowsNeeded}, minmax(0, 1fr))`,
                }}
              >
                {list &&
                  list.map((listItem) => {
                    const item = render(listItem);
                    const isChecked =
                      field.value.findIndex(
                        (oldItem) => oldItem.id === item.id
                      ) !== -1;
                    return (
                      <li key={item.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={item.id}
                          checked={isChecked}
                          onCheckedChange={(state) => {
                            console.log(state);
                            if (state) {
                              field.onChange([...field.value, item]);
                            } else {
                              field.onChange(
                                field.value.filter(
                                  (oldItem) => oldItem.id !== item.id
                                )
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
                      </li>
                    );
                  })}
              </ul>
            </FormItem>
          );
        }}
      ></FormField>
    );
  }
}
