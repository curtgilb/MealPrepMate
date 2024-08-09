import { NutrientFieldsFragment } from "@/gql/graphql";
import {
  NutrientMap,
  useCategorizedNutrients,
} from "@/hooks/use-categorized-nutrients";
import { FunctionComponent } from "react";

type NutrientItem = FunctionComponent<{
  nutrient: NutrientFieldsFragment;
  depth: number;
}>;

interface NutritionListProps {
  Main: FunctionComponent<{ children: React.ReactNode }>;
  Group: FunctionComponent<{ name: string; children: React.ReactNode }>;
  Nutrient: NutrientItem;
  advanced: boolean;
}

function RecursiveItem({
  Nutrient,
  item,
  childNutrients,
  depth = 1,
}: {
  Nutrient: NutrientItem;
  childNutrients: NutrientMap | undefined;
  item: NutrientFieldsFragment;
  depth: number;
}) {
  return (
    <>
      <Nutrient nutrient={item} depth={depth} />
      {childNutrients && childNutrients[item.id].length > 0 && (
        <Nutrient nutrient={item} depth={depth + 1} />
      )}
    </>
  );
}

export function NutritionList({
  Main,
  Group,
  Nutrient,
  advanced,
}: NutritionListProps) {
  const { categorized, childNutrients } = useCategorizedNutrients(advanced);

  return (
    <Main>
      {categorized &&
        Object.entries(categorized).map(([category, nutrients]) => {
          return (
            <Group key={category} name={category}>
              {nutrients.map((nutrient) => {
                return (
                  <RecursiveItem
                    key={nutrient.id}
                    Nutrient={Nutrient}
                    childNutrients={childNutrients}
                    item={nutrient}
                    depth={1}
                  ></RecursiveItem>
                );
              })}
            </Group>
          );
        })}
    </Main>
  );
}
