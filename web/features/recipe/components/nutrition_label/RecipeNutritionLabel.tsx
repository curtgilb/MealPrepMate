"use client";
import { EnumSelect } from "@/components/EnumSelect";
import {
  NutritionLabelIndentation,
  ServingSize,
} from "@/components/nutrition_label_abstracts/NutritionLabelTable";
import {
  NutrientItemProps,
  NutritionList,
} from "@/components/nutrition_label_abstracts/NutritionList";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { NutrientFieldsFragment, RecipeFieldsFragment } from "@/gql/graphql";
import { NutritionDisplayMode } from "@/hooks/use-nutrients";
import { cn } from "@/lib/utils";
import { toTitleCase } from "@/utils/utils";
import { HTMLAttributes, useMemo, useState } from "react";

type NutritionValues = RecipeFieldsFragment["aggregateLabel"];
type NutrientValue = NonNullable<NutritionValues>["nutrients"];

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

function Nutrient({ nutrient, depth, value }: NutrientItemProps) {
  const { labelStr, percentage, target } = getValueLabel(nutrient, value);

  return (
    <TableRow key={nutrient.id} className="text-sm">
      <TableCell>
        <p className={NutritionLabelIndentation[depth]}>{nutrient.name}</p>
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

function TableGroup({
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
    if (!label) return {};
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
            group={TableGroup}
            mode={mode}
            nutrient={Nutrient}
            values={values}
          />
        </TableBody>
      </Table>
    </div>
  );
}
