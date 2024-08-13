import { GetRecipeQuery, NutrientFieldsFragment } from "@/gql/graphql";
import {
  NutrientMap,
  NutritionDisplayMode,
  useNutrients,
} from "@/hooks/use-nutrients";
import { Fragment, FunctionComponent } from "react";

export type NutrientItemProps = {
  nutrient: NutrientFieldsFragment;
  value: number | undefined | null;
  depth: number;
};

interface NutritionListProps {
  group: FunctionComponent<{ name: string; children: React.ReactNode }>;
  nutrient: FunctionComponent<NutrientItemProps>;
  values: { [key: string]: number | undefined | null };
  mode: NutritionDisplayMode;
}

interface RecursiveItemProps {
  component: FunctionComponent<NutrientItemProps>;
  childNutrients: NutrientMap | undefined;
  values: { [key: string]: number | undefined | null };
  depth: number;
  nutrient: NutrientFieldsFragment;
}

function RecursiveItem({
  component: Nutrient,
  nutrient,
  childNutrients,
  values,
  depth = 1,
}: RecursiveItemProps) {
  const children =
    childNutrients && nutrient.id in childNutrients
      ? childNutrients[nutrient.id]
      : [];
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
  group: Group,
  nutrient: Nutrient,
  values,
  mode,
}: NutritionListProps) {
  const { categorized, childNutrients } = useNutrients(mode);

  return (
    <>
      {categorized &&
        Object.entries(categorized).map(([category, nutrients]) => {
          return (
            <Group key={category} name={category}>
              {nutrients.map((nutrient) => {
                return (
                  <RecursiveItem
                    key={nutrient.id}
                    component={Nutrient}
                    childNutrients={childNutrients}
                    nutrient={nutrient}
                    values={values}
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
