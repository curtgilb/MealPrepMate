import SingleColumnCentered from '@/components/layouts/single-column-centered';
import { expirationRuleFragment } from '@/features/ingredient/api/ExpirationRule';
import { getIngredientQuery, ingredientFieldsFragment } from '@/features/ingredient/api/Ingredient';
import { PriceHistoryGroup } from '@/features/ingredient/components/PriceHistoryGroup';
import { ExpirationRule } from '@/features/ingredient/components/view/ExpirationRule';
import { ExpirationRuleTable } from '@/features/ingredient/components/view/ExpirationRuleTable';
import { getFragmentData } from '@/gql';
import { FoodType, MeasurementSystem, UnitType } from '@/gql/graphql';
import { getClient } from '@/ssrGraphqlClient';

export default async function IngredientPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const { data, error } = await getClient().query(getIngredientQuery, {
    id: decodeURIComponent(id),
  });
  const ingredient = getFragmentData(
    ingredientFieldsFragment,
    data?.ingredient
  );

  const expirationRule = getFragmentData(
    expirationRuleFragment,
    ingredient?.expiration
  );

  return (
    <SingleColumnCentered condensed={true}>
      <div className="mb-12">
        <h1 className="font-serif text-4xl font-extrabold mb-2">
          {ingredient?.name}
        </h1>
        <p className="font-light uppercase tracking-[.25em]">
          {ingredient?.category?.name}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-20">
        <div>
          <div>
            <h2 className="text-2xl font-serif font-bold mb-2">
              Alternate Names
            </h2>
            <ul className="min-h-14">
              {ingredient?.alternateNames.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-serif font-bold mb-2">
              Storage Instructions
            </h2>
            <p className="font-light">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
              iaculis, ante eu fringilla scelerisque, elit tellus pulvinar arcu,
              id mattis est ante et lorem. Vestibulum non sem ut lacus maximus
              euismod in id tellus. Nulla accumsan ac turpis ut lacinia. Cras et
              neque at libero lacinia bibendum non a neque. Duis et accumsan
              nisi. Ut felis risus, ultricies ac massa vel, tincidunt sodales
              ligula. Nullam in pulvinar purus, eu convallis lectus.
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-serif font-bold mb-2">Expiration</h2>
          <ExpirationRuleTable edit={false} rule={expirationRule} />
        </div>

        <div className="col-span-2">
          <PriceHistoryGroup prices={dataPoints} />
        </div>
      </div>
    </SingleColumnCentered>
  );
}

const dataPoints = [
  // {
  //   id: "1",
  //   date: new Date("2021-01-15"),
  //   foodType: FoodType.Fresh,
  //   price: 2.99,
  //   pricePerUnit: 2.99,
  //   quantity: 1,
  //   groceryStore: { id: "store1", name: "FreshMart" },
  //   unit: {
  //     id: "unit1",
  //     name: "kilogram",
  //     symbol: "kg",
  //     measurementSystem: MeasurementSystem.Metric,
  //     type: UnitType.Weight,
  //   },
  // },
  // {
  //   id: "2",
  //   date: new Date("2023-02-01"),
  //   foodType: FoodType.Packaged,
  //   price: 3.49,
  //   pricePerUnit: 3.49,
  //   quantity: 1,
  //   groceryStore: { id: "store1", name: "FreshMart" },
  //   unit: { id: "unit7", name: "piece", symbol: "pc", type: UnitType.Count },
  // },
  // {
  //   id: "3",
  //   date: new Date("2023-02-15"),
  //   foodType: FoodType.Frozen,
  //   price: 4.99,
  //   pricePerUnit: 4.99,
  //   quantity: 1,
  //   groceryStore: { id: "store1", name: "FreshMart" },
  //   unit: { id: "unit6", name: "piece", symbol: "pc", type: UnitType.Count },
  // },
  // {
  //   id: "4",
  //   date: new Date("2023-03-01"),
  //   foodType: FoodType.Fresh,
  //   price: 1.99,
  //   pricePerUnit: 1.99,
  //   quantity: 1,
  //   groceryStore: { id: "store1", name: "FreshMart" },
  //   unit: {
  //     id: "unit1",
  //     name: "kilogram",
  //     symbol: "kg",
  //     measurementSystem: MeasurementSystem.Metric,
  //     type: UnitType.Weight,
  //   },
  // },
  // {
  //   id: "5",
  //   date: new Date("2023-03-15"),
  //   foodType: FoodType.Canned,
  //   price: 1.49,
  //   pricePerUnit: 1.49,
  //   quantity: 1,
  //   groceryStore: { id: "store1", name: "FreshMart" },
  //   unit: { id: "unit7", name: "piece", symbol: "pc", type: UnitType.Count },
  // },
  // {
  //   id: "6",
  //   date: new Date("2023-04-01"),
  //   foodType: FoodType.Fresh,
  //   price: 3.29,
  //   pricePerUnit: 3.29,
  //   quantity: 1,
  //   groceryStore: { id: "store1", name: "FreshMart" },
  //   unit: {
  //     id: "unit1",
  //     name: "kilogram",
  //     symbol: "kg",
  //     measurementSystem: MeasurementSystem.Metric,
  //     type: UnitType.Weight,
  //   },
  // },
  // {
  //   id: "7",
  //   date: new Date("2023-04-15"),
  //   foodType: FoodType.Packaged,
  //   price: 2.79,
  //   pricePerUnit: 2.79,
  //   quantity: 1,
  //   groceryStore: { id: "store1", name: "FreshMart" },
  //   unit: { id: "unit7", name: "piece", symbol: "pc", type: UnitType.Count },
  // },
  // {
  //   id: "8",
  //   date: new Date("2023-05-01"),
  //   foodType: FoodType.Frozen,
  //   price: 5.49,
  //   pricePerUnit: 5.49,
  //   quantity: 1,
  //   groceryStore: { id: "store1", name: "FreshMart" },
  //   unit: { id: "unit6", name: "piece", symbol: "pc", type: UnitType.Count },
  // },
  // {
  //   id: "9",
  //   date: new Date("2023-05-15"),
  //   foodType: FoodType.Fresh,
  //   price: 2.19,
  //   pricePerUnit: 2.19,
  //   quantity: 1,
  //   groceryStore: { id: "store1", name: "FreshMart" },
  //   unit: {
  //     id: "unit1",
  //     name: "kilogram",
  //     symbol: "kg",
  //     measurementSystem: MeasurementSystem.Metric,
  //     type: UnitType.Weight,
  //   },
  // },
  // {
  //   id: "10",
  //   date: new Date("2023-06-01"),
  //   foodType: FoodType.Canned,
  //   price: 1.59,
  //   pricePerUnit: 1.59,
  //   quantity: 1,
  //   groceryStore: { id: "store1", name: "FreshMart" },
  //   unit: { id: "unit7", name: "piece", symbol: "pc", type: UnitType.Count },
  // },
  // {
  //   id: "11",
  //   date: new Date("2023-06-15"),
  //   foodType: FoodType.Fresh,
  //   price: 3.39,
  //   pricePerUnit: 3.39,
  //   quantity: 1,
  //   groceryStore: { id: "store1", name: "FreshMart" },
  //   unit: {
  //     id: "unit1",
  //     name: "kilogram",
  //     symbol: "kg",
  //     measurementSystem: MeasurementSystem.Metric,
  //     type: UnitType.Weight,
  //   },
  // },
  // {
  //   id: "12",
  //   date: new Date("2023-07-01"),
  //   foodType: FoodType.Packaged,
  //   price: 2.89,
  //   pricePerUnit: 2.89,
  //   quantity: 1,
  //   groceryStore: { id: "store1", name: "FreshMart" },
  //   unit: { id: "unit7", name: "piece", symbol: "pc", type: UnitType.Count },
  // },
  // {
  //   id: "13",
  //   date: new Date("2023-07-15"),
  //   foodType: FoodType.Frozen,
  //   price: 5.29,
  //   pricePerUnit: 5.29,
  //   quantity: 1,
  //   groceryStore: { id: "store1", name: "FreshMart" },
  //   unit: { id: "unit6", name: "piece", symbol: "pc", type: UnitType.Count },
  // },
  // {
  //   id: "14",
  //   date: new Date("2023-08-01"),
  //   foodType: FoodType.Fresh,
  //   price: 2.09,
  //   pricePerUnit: 2.09,
  //   quantity: 1,
  //   groceryStore: { id: "store1", name: "FreshMart" },
  //   unit: {
  //     id: "unit1",
  //     name: "kilogram",
  //     symbol: "kg",
  //     measurementSystem: MeasurementSystem.Metric,
  //     type: UnitType.Weight,
  //   },
  // },
  // {
  //   id: "15",
  //   date: new Date("2023-08-15"),
  //   foodType: FoodType.Canned,
  //   price: 1.69,
  //   pricePerUnit: 1.69,
  //   quantity: 1,
  //   groceryStore: { id: "store1", name: "FreshMart" },
  //   unit: { id: "unit7", name: "piece", symbol: "pc", type: UnitType.Count },
  // },
  // {
  //   id: "16",
  //   date: new Date("2023-09-01"),
  //   foodType: FoodType.Fresh,
  //   price: 3.49,
  //   pricePerUnit: 3.49,
  //   quantity: 1,
  //   groceryStore: { id: "store1", name: "FreshMart" },
  //   unit: {
  //     id: "unit1",
  //     name: "kilogram",
  //     symbol: "kg",
  //     measurementSystem: MeasurementSystem.Metric,
  //     type: UnitType.Weight,
  //   },
  // },
  // {
  //   id: "17",
  //   date: new Date("2023-09-15"),
  //   foodType: FoodType.Packaged,
  //   price: 2.99,
  //   pricePerUnit: 2.99,
  //   quantity: 1,
  //   groceryStore: { id: "store1", name: "FreshMart" },
  //   unit: { id: "unit7", name: "piece", symbol: "pc", type: UnitType.Count },
  // },
  // {
  //   id: "18",
  //   date: new Date("2023-10-01"),
  //   foodType: FoodType.Frozen,
  //   price: 5.39,
  //   pricePerUnit: 5.39,
  //   quantity: 1,
  //   groceryStore: { id: "store1", name: "FreshMart" },
  //   unit: { id: "unit6", name: "piece", symbol: "pc", type: UnitType.Count },
  // },
  // {
  //   id: "19",
  //   date: new Date("2023-10-15"),
  //   foodType: FoodType.Fresh,
  //   price: 2.29,
  //   pricePerUnit: 2.29,
  //   quantity: 1,
  //   groceryStore: { id: "store1", name: "FreshMart" },
  //   unit: {
  //     id: "unit1",
  //     name: "kilogram",
  //     symbol: "kg",
  //     measurementSystem: MeasurementSystem.Metric,
  //     type: UnitType.Weight,
  //   },
  // },
  // {
  //   id: "20",
  //   date: new Date("2023-11-01"),
  //   foodType: FoodType.Canned,
  //   price: 1.79,
  //   pricePerUnit: 1.79,
  //   quantity: 1,
  //   groceryStore: { id: "store1", name: "FreshMart" },
  //   unit: { id: "unit7", name: "piece", symbol: "pc", type: UnitType.Count },
  // },
  // {
  //   id: "21",
  //   date: new Date("2023-11-15"),
  //   foodType: FoodType.Fresh,
  //   price: 3.59,
  //   pricePerUnit: 3.59,
  //   quantity: 1,
  //   groceryStore: { id: "store1", name: "FreshMart" },
  //   unit: {
  //     id: "unit1",
  //     name: "kilogram",
  //     symbol: "kg",
  //     measurementSystem: MeasurementSystem.Metric,
  //     type: UnitType.Weight,
  //   },
  // },
  // {
  //   id: "22",
  //   date: new Date("2023-12-01"),
  //   foodType: FoodType.Packaged,
  //   price: 3.09,
  //   pricePerUnit: 3.09,
  //   quantity: 1,
  //   groceryStore: { id: "store1", name: "FreshMart" },
  //   unit: { id: "unit7", name: "piece", symbol: "pc", type: UnitType.Count },
  // },
  // {
  //   id: "23",
  //   date: new Date("2023-12-15"),
  //   foodType: FoodType.Frozen,
  //   price: 5.49,
  //   pricePerUnit: 5.49,
  //   quantity: 1,
  //   groceryStore: { id: "store1", name: "FreshMart" },
  //   unit: { id: "unit6", name: "piece", symbol: "pc", type: UnitType.Count },
  // },
  // {
  //   id: "24",
  //   date: new Date("2024-08-01"),
  //   foodType: FoodType.Fresh,
  //   price: 2.39,
  //   pricePerUnit: 2.39,
  //   quantity: 1,
  //   groceryStore: { id: "store1", name: "FreshMart" },
  //   unit: {
  //     id: "unit1",
  //     name: "kilogram",
  //     symbol: "kg",
  //     measurementSystem: MeasurementSystem.Metric,
  //     type: UnitType.Weight,
  //   },
  // },
  // {
  //   id: "25",
  //   date: new Date("2024-08-15"),
  //   foodType: FoodType.Canned,
  //   price: 1.89,
  //   pricePerUnit: 1.89,
  //   quantity: 1,
  //   groceryStore: { id: "store1", name: "FreshMart" },
  //   unit: { id: "unit7", name: "piece", symbol: "pc", type: UnitType.Count },
  // },
  // {
  //   id: "26",
  //   date: new Date("2024-09-01"),
  //   foodType: FoodType.Fresh,
  //   price: 3.69,
  //   pricePerUnit: 3.69,
  //   quantity: 1,
  //   groceryStore: { id: "store1", name: "FreshMart" },
  //   unit: {
  //     id: "unit1",
  //     name: "kilogram",
  //     symbol: "kg",
  //     measurementSystem: MeasurementSystem.Metric,
  //     type: UnitType.Weight,
  //   },
  // },
  // {
  //   id: "27",
  //   date: new Date("2024-09-15"),
  //   foodType: FoodType.Packaged,
  //   price: 3.19,
  //   pricePerUnit: 3.19,
  //   quantity: 1,
  //   groceryStore: { id: "store1", name: "FreshMart" },
  //   unit: { id: "unit7", name: "piece", symbol: "pc", type: UnitType.Count },
  // },
  {
    id: "26",
    date: new Date("2024-10-01"),
    foodType: FoodType.Canned,
    price: 1,
    pricePerUnit: 0.2,
    quantity: 1,
    groceryStore: { id: "store1", name: "FreshMart" },
    unit: { id: "unit6", name: "piece", symbol: "pc", type: UnitType.Weight },
  },
  {
    id: "27",
    date: new Date("2024-11-01"),
    foodType: FoodType.Canned,
    price: 1.2,
    pricePerUnit: 0.3,
    quantity: 1,
    groceryStore: { id: "store1", name: "FreshMart" },
    unit: { id: "unit6", name: "piece", symbol: "pc", type: UnitType.Weight },
  },
  {
    id: "28",
    date: new Date("2024-10-01"),
    foodType: FoodType.Fresh,
    price: 5.59,
    pricePerUnit: 2.59,
    quantity: 1,
    groceryStore: { id: "store1", name: "FreshMart" },
    unit: { id: "unit6", name: "piece", symbol: "pc", type: UnitType.Weight },
  },
  {
    id: "29",
    date: new Date("2024-10-15"),
    foodType: FoodType.Fresh,
    price: 2.49,
    pricePerUnit: 0.49,
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
    id: "30",
    date: new Date("2024-11-01"),
    foodType: FoodType.Fresh,
    price: 1.99,
    pricePerUnit: 0.99,
    quantity: 1,
    groceryStore: { id: "store1", name: "FreshMart" },
    unit: { id: "unit7", name: "piece", symbol: "pc", type: UnitType.Weight },
  },
  {
    id: "31",
    date: new Date("2024-11-15"),
    foodType: FoodType.Fresh,
    price: 3.79,
    pricePerUnit: 0.79,
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
