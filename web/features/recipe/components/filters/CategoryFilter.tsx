"use client";
import { graphql } from "@/gql";
import { Checkbox } from "@/components/ui/checkbox";
import { useMutation, useQuery } from "@urql/next";

const categoryQuery = graphql(/* GraphQL */ `
  query getCategories {
    categories {
      id
      name
    }
  }
`);

interface CategoryFilterProps {
  selectedIds: string[];
  setSelectedIds: (selected: string[]) => void;
}

export function CategoryFilter() {
  const [result, reexecuteQuery] = useQuery({ query: categoryQuery });
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
