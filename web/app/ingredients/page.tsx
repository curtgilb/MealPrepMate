"use client";
import { useQuery, gql } from "@urql/next";
import { graphql } from "@/gql";
import { Search } from "lucide-react";
import { InputWithIcon } from "@/components/ui/InputWithIcon";
import IngredientCard from "@/components/ingredient/IngredientCard";

const ingredientsListQuery = graphql(/* GraphQL */ `
  query fetchIngredients($pagination: OffsetPagination!, $search: String) {
    ingredients(pagination: $pagination, search: $search) {
      ingredients {
        id
        name
      }
      itemsRemaining
      nextOffset
    }
  }
`);

export default function IngredientsPage() {
  const [result] = useQuery({
    query: ingredientsListQuery,
    variables: { pagination: { offset: 0, take: 20 } },
  });

  const { data, fetching, error } = result;

  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;

  return (
    <div>
      <InputWithIcon className="mt-8 mb-12 w-80" startIcon={Search} />
      {data?.ingredients &&
        data.ingredients.ingredients.map((ingredient) => (
          <IngredientCard
            key={ingredient.id}
            id={ingredient.id}
            name={ingredient.name}
          />
        ))}
    </div>
  );
}
