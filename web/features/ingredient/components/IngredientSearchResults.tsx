import { Card } from "@/components/Card";
import { InfiniteScroll } from "@/components/infinite_scroll/InfiniteScroll";
import { getIngredientsQuery } from "@/features/ingredient/api/Ingredient";
import { GetIngredientsQuery } from "@/gql/graphql";

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
      className="grid grid-cols-autofit-horizontal gap-y-6 gap-x-4"
      query={getIngredientsQuery}
      variables={{ search: search }}
      renderItem={(item: IngredientSearchItem) => {
        return [
          <IngredientSearchItem key={item.id} ingredient={item} />,
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

interface IngredientSearchItemProps {
  ingredient: IngredientSearchItem;
}

function IngredientSearchItem({ ingredient }: IngredientSearchItemProps) {
  return (
    <Card
      image={{
        urls: [],
        placeholderUrl: "/placeholder_ingredient.jpg",
        altText: `Image of ${ingredient.name}`,
        grid: false,
      }}
      vertical={false}
      href={`/ingredients/${ingredient.id}`}
    >
      <p>{ingredient.name}</p>
    </Card>
  );
}
