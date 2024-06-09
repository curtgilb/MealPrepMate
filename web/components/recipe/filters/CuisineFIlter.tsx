"use client";
import { graphql } from "@/gql";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery } from "@urql/next";

const cuisinesQuery = graphql(/* GraphQL */ `
  query getCuisines {
    cuisines {
      id
      name
    }
  }
`);
export function CuisineFilter() {
  const [result, retry] = useQuery({ query: cuisinesQuery });
  return (
    <div>
      {result.data?.cuisines.map((cuisine) => (
        <div key={cuisine.id} className="flex items-center space-x-2">
          <Checkbox id={cuisine.id} />
          <label
            htmlFor={cuisine.id}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {cuisine.name}
          </label>
        </div>
      ))}
    </div>
  );
}
