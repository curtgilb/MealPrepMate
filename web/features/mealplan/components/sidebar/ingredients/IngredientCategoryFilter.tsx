"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { graphql } from "@/gql";
import { useQuery } from "@urql/next";

const getIngredientCategories = graphql(
  `
    query GetIngredientCategories {
      ingredientCategories {
        id
        name
      }
    }
  `
);

export function IngredientCategoryFilter() {
  const [result] = useQuery({ query: getIngredientCategories });
  const { data, error, fetching } = result;

  return (
    <div className="grid grid-cols-2 gap-y-3 gap-x-3">
      {data?.ingredientCategories.map((category) => {
        return (
          <div key={category.id} className="flex gap-x-2">
            <Checkbox id={category.id} />
            <label
              htmlFor={category.id}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {category.name}
            </label>
          </div>
        );
      })}
    </div>
  );
}
