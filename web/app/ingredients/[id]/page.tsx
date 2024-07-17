import { graphql } from "@/gql";
import { TagList } from "@/components/TagList";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  PriceHistory,
  PriceHistoryChart,
} from "@/components/charts/PriceHistory";
import { ExpirationRule } from "@/components/ingredient/ExpirationRule";
import { Citrus } from "lucide-react";
import { PriceHistoryGroup } from "@/components/charts/PriceHistoryGroup";
import { getClient } from "@/ssrGraphqlClient";
import { useParams } from "next/navigation";

const ingredientQuery = graphql(`
  query GetIngredient($id: String!) {
    ingredient(ingredientId: $id) {
      id
      name
      alternateNames
      storageInstructions
      category {
        id
        name
      }
      expiration {
        ...ExpirationRuleFields
      }
      priceHistory {
        id
        date
        foodType
        groceryStore {
          id
          name
        }
        price
        pricePerUnit
        quantity
        unit {
          id
          name
          symbol
        }
      }
    }
  }
`);

const items = [
  { id: "1", name: "Hass Avocado" },
  { id: "2", name: "Alligator Pear" },
  { id: "3", name: "Fuerte Avocado" },
  { id: "5", name: "Reed" },
  { id: "5", name: "Reed Avocado" },
];

export default async function IngredientPage({
  params,
}: {
  params: { id: string };
}) {
  const { data, error } = await getClient().query(ingredientQuery, {
    id: params.id,
  });

  return (
    <>
      <Breadcrumb className="mb-10">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/ingredients">Ingredients</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{data?.ingredient.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="mb-8">
        <h1 className="text-5xl font-black mb-2">{data?.ingredient.name}</h1>
        <p className="font-light uppercase tracking-[.25em]">
          {data?.ingredient.category?.name}
        </p>

        <TagList list={items} />
      </div>
      <div className="flex flex-col gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-2">Storage Instructions</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut iaculis,
            ante eu fringilla scelerisque, elit tellus pulvinar arcu, id mattis
            est ante et lorem. Vestibulum non sem ut lacus maximus euismod in id
            tellus. Nulla accumsan ac turpis ut lacinia. Cras et neque at libero
            lacinia bibendum non a neque. Duis et accumsan nisi. Ut felis risus,
            ultricies ac massa vel, tincidunt sodales ligula. Nullam in pulvinar
            purus, eu convallis lectus.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Expiration</h2>
          <ExpirationRule />
        </div>
        <PriceHistory />

        {/* <div>
          <h2 className="text-xl font-semibold">Price History</h2>
          <PriceHistoryGroup />
        </div>

        <div>
          <h2 className="text-xl font-semibold">Recipes</h2>
          <SmallCard imageUrl="adf" />
        </div> */}
      </div>
    </>
  );
}
