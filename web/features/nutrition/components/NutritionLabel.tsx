import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FragmentType, graphql, useFragment } from "@/gql";
import { NutrientFieldsFragment } from "@/gql/graphql";

import { isNumeric, toTitleCase } from "@/utils/utils";
import { useQuery } from "urql";
import { Input } from "../../../components/ui/input";
import { useState } from "react";
import {
  NutrientMap,
  useCategorizedNutrients,
} from "@/hooks/use-categorized-nutrients";
import { Progress } from "../../../components/ui/progress";
import { SummedNutrients } from "@/utils/nutrients";
import { useMediaQuery } from "@/hooks/use-media-query";

interface NutritionLabelProps {
  nutrientValues: SummedNutrients;
}

export function NutritionLabel({ nutrientValues }: NutritionLabelProps) {
  const { categorized: categorized, childNutrients } =
    useCategorizedNutrients(true);
  const isDesktop = useMediaQuery("(min-width: 480px)");
  const LabelSection: React.FC<NutritionLabelLayoutProps> = isDesktop
    ? NutritionLabelTable
    : NutritionLabelCards;

  return (
    <section className="flex flex-col gap-6 items-center">
      {categorized &&
        Object.entries(categorized).map(([category, nutrients]) => {
          return (
            <LabelSection
              key={category}
              sectionTitle={toTitleCase(category)}
              nuturientValue={nutrientValues}
              nutrientList={nutrients}
              childNutrients={childNutrients}
            />
          );
        })}
    </section>
  );
}

interface NutritionLabelItemProps {
  nutrientValue: SummedNutrients;
  nutrient: NutrientFieldsFragment;
  childNutrients: NutrientMap;
  depth: number;
}

interface NutritionLabelLayoutProps {
  sectionTitle: string;
  nuturientValue: SummedNutrients;
  nutrientList: NutrientFieldsFragment[];
  childNutrients: NutrientMap;
}

function NutritionLabelTable({
  sectionTitle,
  nuturientValue,
  nutrientList,
  childNutrients,
}: NutritionLabelLayoutProps) {
  return (
    <Table className="bg-white">
      <TableHeader>
        <TableRow>
          <TableHead>{sectionTitle}</TableHead>
          <TableHead>{sectionTitle}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {nutrientList.map((nutrient) => {
          return (
            <NutritionTableRow
              key={nutrient.id}
              nutrientValue={nuturientValue}
              nutrient={nutrient}
              childNutrients={childNutrients}
              depth={1}
            />
          );
        })}
      </TableBody>
    </Table>
  );
}

function NutritionTableRow({
  nutrientValue,
  nutrient,
  childNutrients,
  depth,
}: NutritionLabelItemProps) {
  const padding = {
    1: "ps-4",
    2: "ps-8",
    3: "ps-12",
    4: "ps-14",
  } as { [key: number]: string };
  const children =
    nutrient.id in childNutrients ? childNutrients[nutrient.id] : [];
  const value = nutrientValue.nutrients.get(nutrient.id) ?? 0;
  const target = nutrient.customTarget ?? nutrient.dri?.value;
  const percentage = Math.round(
    (target ? value / target : value / value) * 100
  );

  return (
    <>
      <TableRow>
        <TableCell>
          <p className={padding[depth]}>{nutrient.name}</p>
        </TableCell>
        <TableCell>
          <div className="flex justify-between">
            <p>{`${Math.round(value)} ${nutrient.unit.symbol}`}</p>
            <Progress value={percentage} />
            <p>{target ? `${percentage}%` : "n/a"}</p>
          </div>
        </TableCell>
      </TableRow>
      {children.length > 0 &&
        children.map((childNutrient) => {
          return (
            <NutritionTableRow
              key={nutrient.id}
              nutrientValue={nutrientValue}
              nutrient={childNutrient}
              childNutrients={childNutrients}
              depth={depth + 1}
            />
          );
        })}
    </>
  );
}

function NutritionLabelCards({
  sectionTitle,
  nuturientValue: nutrients,
  childNutrients: lookup,
}: NutritionLabelLayoutProps) {
  return <div>hello</div>;
}
