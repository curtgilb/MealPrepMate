import { TagList } from "@/components/TagList";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { graphql } from "@/gql";
import { ExpirationRule } from "@/features/ingredient/components/ExpirationRule";
import { getClient } from "@/ssrGraphqlClient";
import { PriceHistory } from "@/features/ingredient/components/PriceHistory";
import SingleColumnCentered from "@/components/layouts/single-column-centered";
import { PriceHistoryGroup } from "@/features/ingredient/components/PriceHistoryGroup";
import { FoodType, MeasurementSystem, UnitType } from "@/gql/graphql";

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
          conversionName
          measurementSystem
          type
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
    <SingleColumnCentered>
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
      <div className="mb-12">
        <h1 className="text-5xl font-black mb-2">{data?.ingredient.name}</h1>
        <p className="font-light uppercase tracking-[.25em]">
          {data?.ingredient.category?.name}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-12">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Alternate Names</h2>
          <TagList list={items} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-2">Storage Instructions</h2>
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
          <h2 className="text-2xl font-semibold">Expiration</h2>
          <ExpirationRule />
        </div>

        <div className="col-span-2">
          <h2 className="text-2xl font-semibold">Price History</h2>
          <PriceHistoryGroup prices={dataPoints} />
        </div>
      </div>
    </SingleColumnCentered>
  );
}

const dataPoints = [
  {
    id: "1",
    date: new Date("2021-01-15"),
    foodType: FoodType.Fresh,
    price: 2.99,
    pricePerUnit: 2.99,
    quantity: 1,
    groceryStore: { id: "store1", name: "FreshMart" },
    unit: {
      id: "unit1",
      name: "kilogram",
      symbol: "kg",
      measurementSystem: MeasurementSystem.Metric,
      type: UnitType.Weight,
    },
  },
  {
    id: "2",
    date: new Date("2021-02-01"),
    foodType: FoodType.Packaged,
    price: 3.49,
    pricePerUnit: 3.49,
    quantity: 1,
    groceryStore: { id: "store2", name: "SuperSaver" },
    unit: { id: "unit7", name: "piece", symbol: "pc", type: UnitType.Count },
  },
  {
    id: "3",
    date: new Date("2021-02-15"),
    foodType: FoodType.Frozen,
    price: 4.99,
    pricePerUnit: 4.99,
    quantity: 1,
    groceryStore: { id: "store3", name: "GreenGrocer" },
    unit: { id: "unit6", name: "piece", symbol: "pc", type: UnitType.Count },
  },
  {
    id: "4",
    date: new Date("2021-03-01"),
    foodType: FoodType.Fresh,
    price: 1.99,
    pricePerUnit: 1.99,
    quantity: 1,
    groceryStore: { id: "store1", name: "FreshMart" },
    unit: {
      id: "unit1",
      name: "kilogram",
      symbol: "kg",
      measurementSystem: MeasurementSystem.Metric,
      type: UnitType.Weight,
    },
  },
  {
    id: "5",
    date: new Date("2021-03-15"),
    foodType: FoodType.Canned,
    price: 1.49,
    pricePerUnit: 1.49,
    quantity: 1,
    groceryStore: { id: "store2", name: "SuperSaver" },
    unit: { id: "unit7", name: "piece", symbol: "pc", type: UnitType.Count },
  },
  {
    id: "6",
    date: new Date("2021-04-01"),
    foodType: FoodType.Fresh,
    price: 3.29,
    pricePerUnit: 3.29,
    quantity: 1,
    groceryStore: { id: "store3", name: "GreenGrocer" },
    unit: {
      id: "unit1",
      name: "kilogram",
      symbol: "kg",
      measurementSystem: MeasurementSystem.Metric,
      type: UnitType.Weight,
    },
  },
  {
    id: "7",
    date: new Date("2021-04-15"),
    foodType: FoodType.Packaged,
    price: 2.79,
    pricePerUnit: 2.79,
    quantity: 1,
    groceryStore: { id: "store1", name: "FreshMart" },
    unit: { id: "unit7", name: "piece", symbol: "pc", type: UnitType.Count },
  },
  {
    id: "8",
    date: new Date("2021-05-01"),
    foodType: FoodType.Frozen,
    price: 5.49,
    pricePerUnit: 5.49,
    quantity: 1,
    groceryStore: { id: "store2", name: "SuperSaver" },
    unit: { id: "unit6", name: "piece", symbol: "pc", type: UnitType.Count },
  },
  {
    id: "9",
    date: new Date("2021-05-15"),
    foodType: FoodType.Fresh,
    price: 2.19,
    pricePerUnit: 2.19,
    quantity: 1,
    groceryStore: { id: "store3", name: "GreenGrocer" },
    unit: {
      id: "unit1",
      name: "kilogram",
      symbol: "kg",
      measurementSystem: MeasurementSystem.Metric,
      type: UnitType.Weight,
    },
  },
  {
    id: "10",
    date: new Date("2021-06-01"),
    foodType: FoodType.Canned,
    price: 1.59,
    pricePerUnit: 1.59,
    quantity: 1,
    groceryStore: { id: "store1", name: "FreshMart" },
    unit: { id: "unit7", name: "piece", symbol: "pc", type: UnitType.Count },
  },
  {
    id: "11",
    date: new Date("2021-06-15"),
    foodType: FoodType.Fresh,
    price: 3.39,
    pricePerUnit: 3.39,
    quantity: 1,
    groceryStore: { id: "store2", name: "SuperSaver" },
    unit: {
      id: "unit1",
      name: "kilogram",
      symbol: "kg",
      measurementSystem: MeasurementSystem.Metric,
      type: UnitType.Weight,
    },
  },
  {
    id: "12",
    date: new Date("2021-07-01"),
    foodType: FoodType.Packaged,
    price: 2.89,
    pricePerUnit: 2.89,
    quantity: 1,
    groceryStore: { id: "store3", name: "GreenGrocer" },
    unit: { id: "unit7", name: "piece", symbol: "pc", type: UnitType.Count },
  },
  {
    id: "13",
    date: new Date("2021-07-15"),
    foodType: FoodType.Frozen,
    price: 5.29,
    pricePerUnit: 5.29,
    quantity: 1,
    groceryStore: { id: "store1", name: "FreshMart" },
    unit: { id: "unit6", name: "piece", symbol: "pc", type: UnitType.Count },
  },
  {
    id: "14",
    date: new Date("2021-08-01"),
    foodType: FoodType.Fresh,
    price: 2.09,
    pricePerUnit: 2.09,
    quantity: 1,
    groceryStore: { id: "store2", name: "SuperSaver" },
    unit: {
      id: "unit1",
      name: "kilogram",
      symbol: "kg",
      measurementSystem: MeasurementSystem.Metric,
      type: UnitType.Weight,
    },
  },
  {
    id: "15",
    date: new Date("2021-08-15"),
    foodType: FoodType.Canned,
    price: 1.69,
    pricePerUnit: 1.69,
    quantity: 1,
    groceryStore: { id: "store3", name: "GreenGrocer" },
    unit: { id: "unit7", name: "piece", symbol: "pc", type: UnitType.Count },
  },
  {
    id: "16",
    date: new Date("2021-09-01"),
    foodType: FoodType.Fresh,
    price: 3.49,
    pricePerUnit: 3.49,
    quantity: 1,
    groceryStore: { id: "store1", name: "FreshMart" },
    unit: {
      id: "unit1",
      name: "kilogram",
      symbol: "kg",
      measurementSystem: MeasurementSystem.Metric,
      type: UnitType.Weight,
    },
  },
  {
    id: "17",
    date: new Date("2021-09-15"),
    foodType: FoodType.Packaged,
    price: 2.99,
    pricePerUnit: 2.99,
    quantity: 1,
    groceryStore: { id: "store2", name: "SuperSaver" },
    unit: { id: "unit7", name: "piece", symbol: "pc", type: UnitType.Count },
  },
  {
    id: "18",
    date: new Date("2021-10-01"),
    foodType: FoodType.Frozen,
    price: 5.39,
    pricePerUnit: 5.39,
    quantity: 1,
    groceryStore: { id: "store3", name: "GreenGrocer" },
    unit: { id: "unit6", name: "piece", symbol: "pc", type: UnitType.Count },
  },
  {
    id: "19",
    date: new Date("2021-10-15"),
    foodType: FoodType.Fresh,
    price: 2.29,
    pricePerUnit: 2.29,
    quantity: 1,
    groceryStore: { id: "store1", name: "FreshMart" },
    unit: {
      id: "unit1",
      name: "kilogram",
      symbol: "kg",
      measurementSystem: MeasurementSystem.Metric,
      type: UnitType.Weight,
    },
  },
  {
    id: "20",
    date: new Date("2021-11-01"),
    foodType: FoodType.Canned,
    price: 1.79,
    pricePerUnit: 1.79,
    quantity: 1,
    groceryStore: { id: "store2", name: "SuperSaver" },
    unit: { id: "unit7", name: "piece", symbol: "pc", type: UnitType.Count },
  },
  {
    id: "21",
    date: new Date("2021-11-15"),
    foodType: FoodType.Fresh,
    price: 3.59,
    pricePerUnit: 3.59,
    quantity: 1,
    groceryStore: { id: "store3", name: "GreenGrocer" },
    unit: {
      id: "unit1",
      name: "kilogram",
      symbol: "kg",
      measurementSystem: MeasurementSystem.Metric,
      type: UnitType.Weight,
    },
  },
  {
    id: "22",
    date: new Date("2021-12-01"),
    foodType: FoodType.Packaged,
    price: 3.09,
    pricePerUnit: 3.09,
    quantity: 1,
    groceryStore: { id: "store1", name: "FreshMart" },
    unit: { id: "unit7", name: "piece", symbol: "pc", type: UnitType.Count },
  },
  {
    id: "23",
    date: new Date("2021-12-15"),
    foodType: FoodType.Frozen,
    price: 5.49,
    pricePerUnit: 5.49,
    quantity: 1,
    groceryStore: { id: "store2", name: "SuperSaver" },
    unit: { id: "unit6", name: "piece", symbol: "pc", type: UnitType.Count },
  },
  {
    id: "24",
    date: new Date("2022-01-01"),
    foodType: FoodType.Fresh,
    price: 2.39,
    pricePerUnit: 2.39,
    quantity: 1,
    groceryStore: { id: "store3", name: "GreenGrocer" },
    unit: {
      id: "unit1",
      name: "kilogram",
      symbol: "kg",
      measurementSystem: MeasurementSystem.Metric,
      type: UnitType.Weight,
    },
  },
  {
    id: "25",
    date: new Date("2022-01-15"),
    foodType: FoodType.Canned,
    price: 1.89,
    pricePerUnit: 1.89,
    quantity: 1,
    groceryStore: { id: "store1", name: "FreshMart" },
    unit: { id: "unit7", name: "piece", symbol: "pc", type: UnitType.Count },
  },
  {
    id: "26",
    date: new Date("2022-02-01"),
    foodType: FoodType.Fresh,
    price: 3.69,
    pricePerUnit: 3.69,
    quantity: 1,
    groceryStore: { id: "store2", name: "SuperSaver" },
    unit: {
      id: "unit1",
      name: "kilogram",
      symbol: "kg",
      measurementSystem: MeasurementSystem.Metric,
      type: UnitType.Weight,
    },
  },
  {
    id: "27",
    date: new Date("2022-02-15"),
    foodType: FoodType.Packaged,
    price: 3.19,
    pricePerUnit: 3.19,
    quantity: 1,
    groceryStore: { id: "store3", name: "GreenGrocer" },
    unit: { id: "unit7", name: "piece", symbol: "pc", type: UnitType.Count },
  },
  {
    id: "28",
    date: new Date("2022-03-01"),
    foodType: FoodType.Frozen,
    price: 5.59,
    pricePerUnit: 5.59,
    quantity: 1,
    groceryStore: { id: "store1", name: "FreshMart" },
    unit: { id: "unit6", name: "piece", symbol: "pc", type: UnitType.Count },
  },
  {
    id: "29",
    date: new Date("2022-03-15"),
    foodType: FoodType.Fresh,
    price: 2.49,
    pricePerUnit: 2.49,
    quantity: 1,
    groceryStore: { id: "store2", name: "SuperSaver" },
    unit: {
      id: "unit1",
      name: "kilogram",
      symbol: "kg",
      measurementSystem: MeasurementSystem.Metric,
      type: UnitType.Weight,
    },
  },
  {
    id: "30",
    date: new Date("2022-04-01"),
    foodType: FoodType.Canned,
    price: 1.99,
    pricePerUnit: 1.99,
    quantity: 1,
    groceryStore: { id: "store3", name: "GreenGrocer" },
    unit: { id: "unit7", name: "piece", symbol: "pc", type: UnitType.Count },
  },
  {
    id: "31",
    date: new Date("2022-04-15"),
    foodType: FoodType.Fresh,
    price: 3.79,
    pricePerUnit: 3.79,
    quantity: 1,
    groceryStore: { id: "store1", name: "FreshMart" },
    unit: {
      id: "unit1",
      name: "kilogram",
      symbol: "kg",
      measurementSystem: MeasurementSystem.Metric,
      type: UnitType.Weight,
    },
  },
];
