"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { getCategoriesQuery } from "@/features/recipe/api/Category";
import { graphql } from "@/gql";
import { useMutation, useQuery } from "@urql/next";

interface CategoryFilterProps {
  selectedIds: string[];
  setSelectedIds: (selected: string[]) => void;
}

export function CategoryFilter() {
  const [result, reexecuteQuery] = useQuery({ query: getCategoriesQuery });
  const { data, fetching, error } = result;
  return (
    <div>
      <p>Categories</p>
      {data?.categories.map((category) => (
        <div key={category.id} className="flex items-center space-x-2">
          <Checkbox id={category.id} />
          <label
            htmlFor={category.id}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {category.name}
          </label>
        </div>
      ))}
    </div>
  );
}
