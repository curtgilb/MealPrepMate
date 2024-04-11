import { graphql } from "@/gql";
import { getClient } from "@/ssrGraphqlClient";
import { Checkbox } from "@/components/ui/checkbox";

const categoryQuery = graphql(/* GraphQL */ `
  query getCategories {
    categories {
      id
      name
    }
  }
`);
export default async function CategoryFilter() {
  const result = await getClient().query(categoryQuery, {});
  return (
    <div>
      {result.data?.categories.map((category) => (
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
