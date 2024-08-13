"use client";
import { NutrientItemProps, NutritionList } from "@/components/NutritionList";
import { GetRecipeQuery, NutrientFieldsFragment } from "@/gql/graphql";
import { HTMLAttributes, useMemo, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { toTitleCase } from "@/utils/utils";
import { EnumSelect } from "@/components/EnumSelect";
import { NutritionDisplayMode } from "@/hooks/use-nutrients";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type NutritionValues = GetRecipeQuery["recipe"]["aggregateLabel"];
type NutrientValue = NonNullable<NutritionValues>["nutrients"];

export enum ServingSize {
  Serving = "One Serving",
  Recipe = "Whole Recipe",
}

interface NutritionLabelProps extends HTMLAttributes<HTMLDivElement> {
  label: NutritionValues;
}

function getValueLabel(
  nutrient: NutrientFieldsFragment,
  value: number | undefined | null
) {
  const nutrientValue = Math.round(value ?? 0);
  const target = nutrient.target?.nutrientTarget
    ? nutrient.target.nutrientTarget
    : nutrient.dri?.value;
  const percentage = Math.round(target ? (nutrientValue / target) * 100 : 100);
  const valueString = target
    ? `${nutrientValue} / ${target}`
    : String(nutrientValue);

  return {
    labelStr: `${valueString} ${nutrient.unit.symbol}`,
    percentage,
    target,
  };
}

const indentation: { [key: number]: string } = {
  1: "pl-2",
  2: "pl-6",
  3: "pl-8",
  4: "pl-12",
};

function Group({
  name,
  children,
}: {
  name: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <TableRow>
        <TableCell className="text-lg font-bold" colSpan={3}>
          {toTitleCase(name)}
        </TableCell>
      </TableRow>
      {children}
    </>
  );
}

function Nutrient({ nutrient, depth, value }: NutrientItemProps) {
  const { labelStr, percentage, target } = getValueLabel(nutrient, value);
  console.log(depth);
  return (
    <TableRow key={nutrient.id} className="text-sm">
      <TableCell>
        <p className={indentation[depth]}>{nutrient.name}</p>
      </TableCell>
      <TableCell>
        {value
          ? `${Math.round((value + Number.EPSILON) * 100) / 100} ${
              nutrient.unit.symbol
            }`
          : ""}
      </TableCell>
      <TableCell className="text-right">
        {target ? `${percentage}%` : ""}
      </TableCell>
    </TableRow>
  );
}

export function RecipeNutritionlabel({
  label,
  className,
  ...rest
}: NutritionLabelProps) {
  const [servingSize, setServingSize] = useState<ServingSize>(
    ServingSize.Serving
  );
  const [mode, setMode] = useState<NutritionDisplayMode>(
    NutritionDisplayMode.Basic
  );

  const values = useMemo(() => {
    return label?.nutrients.reduce((agg, nutrient) => {
      agg[nutrient.nutrient.id] =
        servingSize === ServingSize.Recipe
          ? nutrient.value
          : nutrient.perServing;
      return agg;
    }, {} as { [key: string]: number | undefined | null });
  }, [label, servingSize]);

  return (
    <div className={cn("max-w-lg", className)} {...rest}>
      <div className="flex justify-end">
        <div className="flex gap-2">
          <EnumSelect
            enum={NutritionDisplayMode}
            value={mode}
            onChange={setMode}
          />
          <EnumSelect
            enum={ServingSize}
            value={servingSize}
            onChange={setServingSize}
          />
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>Nutrient</TableCell>
            <TableCell>Value</TableCell>
            <TableCell className="text-right">Goal %</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          <NutritionList
            group={Group}
            mode={mode}
            nutrient={Nutrient}
            values={values}
          />
        </TableBody>
      </Table>
    </div>
  );
}
