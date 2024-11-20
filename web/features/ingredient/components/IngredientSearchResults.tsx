import { Card } from '@/components/Card';
import { InfiniteScroll } from '@/components/infinite_scroll/InfiniteScroll';
import { getIngredientsQuery } from '@/features/ingredient/api/Ingredient';
import { GetIngredientsQuery } from '@/gql/graphql';

interface IngredientSearchResultsProps {
  search?: string;
}

type IngredientSearchItem = NonNullable<
  GetIngredientsQuery["ingredients"]
>["edges"][number]["node"];

export function IngredientSearchResults({
  search,
}: IngredientSearchResultsProps) {
  return (
    <InfiniteScroll
      className="grid gap-4 grid-cols-autofit"
      query={getIngredientsQuery}
      variables={{ search: search }}
      renderItem={(item: IngredientSearchItem) => {
        return [
          <Card
            key={item.id}
            images={[]}
            placeholderUrl="/placeholder_ingredient.jpg"
            vertical={false}
            href={`/ingredients/${item.id}`}
          >
            <p>{item.name}</p>
          </Card>,
          item.id,
        ] as const;
      }}
      getConnection={(data) => {
        if (!data?.ingredients) return undefined;
        return data.ingredients;
      }}
    ></InfiniteScroll>
  );
}
