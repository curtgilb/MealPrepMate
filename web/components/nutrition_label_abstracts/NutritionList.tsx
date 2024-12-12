import { Fragment, FunctionComponent } from "react";

import { GetRecipeQuery, NutrientFieldsFragment } from "@/gql/graphql";
import {
  NutrientMap,
  NutrientWithChildren,
  NutritionDisplayMode,
  useNutrients,
} from "@/hooks/use-nutrients";

export type NutrientItemProps = {
  nutrient: NutrientFieldsFragment;
  value: number | undefined | null;
  depth: number;
};

interface NutritionListProps {
  groupComponent: FunctionComponent<{
    name: string;
    children: React.ReactNode;
  }>;
  nutrientComponent: FunctionComponent<NutrientItemProps>;
  nutrientIdToValue: { [key: string]: number | undefined | null };
  mode: NutritionDisplayMode;
}

interface RecursiveItemProps {
  component: FunctionComponent<NutrientItemProps>;
  nutrientIdToValue: { [key: string]: number | undefined | null };
  depth: number;
  nutrient: NutrientWithChildren;
}

function RecursiveItem({
  component: Nutrient,
  nutrient,
  nutrientIdToValue: values,
  depth = 1,
}: RecursiveItemProps) {
  const children = nutrient.children ?? [];

  return (
    <Fragment key={nutrient.id}>
      <Nutrient
        key={nutrient.id}
        value={values[nutrient.id]}
        nutrient={nutrient}
        depth={depth}
      />
      {children.map((child) => {
        return (
          <Nutrient
            key={child.id}
            value={values[child.id]}
            nutrient={child}
            depth={depth + 1}
          />
        );
      })}
    </Fragment>
  );
}

export function NutritionList({
  groupComponent: Group,
  nutrientComponent: Nutrient,
  nutrientIdToValue: values,
  mode,
}: NutritionListProps) {
  const { grouped: nutrients } = useNutrients(mode);

  return (
    <>
      {nutrients &&
        Object.entries(nutrients).map(([category, nutrients]) => {
          return (
            <Group key={category} name={category}>
              {nutrients.map((nutrient) => {
                return (
                  <RecursiveItem
                    key={nutrient.id}
                    component={Nutrient}
                    nutrient={nutrient}
                    nutrientIdToValue={values}
                    depth={1}
                  ></RecursiveItem>
                );
              })}
            </Group>
          );
        })}
    </>
  );
}
