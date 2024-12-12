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
    labelStr: `${valueString} ${nutrient?.unit?.symbol}`,
    percentage,
    target,
  };
}

function Nutrient({ nutrient, depth, value }: NutrientItemProps) {
  const { labelStr, percentage, target } = getValueLabel(nutrient, value);

  return (
    <TableRow key={nutrient.id} className="text-sm h-4">
      <TableCell className="py-2">
        <p className={NutritionLabelIndentation[depth]}>{nutrient.name}</p>
      </TableCell>
      <TableCell className="py-2">
        {value
          ? `${Math.round((value + Number.EPSILON) * 100) / 100} ${
              nutrient.unit?.symbol
            }`
          : ""}
      </TableCell>
      <TableCell className="text-right py-2">
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
      <TableRow className="bg-muted/50">
        <TableCell className="font-serif font-bold py-2" colSpan={3}>
          {toTitleCase(name)}
        </TableCell>
      </TableRow>
      {children}
    </>
  );
}

type NutritionLabelInput = {
  servings: number;
  nutrients: { [key: string]: number };
};

interface NutritionLabelProps extends HTMLAttributes<HTMLDivElement> {
  label: NutritionLabelInput;
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

  // Create map of nutrientID -> value
  const values = useMemo(() => {
    if (!label) return {};
    return Object.entries(label.nutrients).reduce(
      (agg, [nutrientId, value]) => {
        agg[nutrientId] =
          servingSize === ServingSize.Recipe
            ? value
            : value / (label.servings ?? 1);
        return agg;
      },
      {} as { [key: string]: number | undefined | null }
    );
  }, [label, servingSize]);

  return (
    <div className={cn("w-full", className)} {...rest}>
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
            <TableCell className="font-semibold font-serif">Nutrient</TableCell>
            <TableCell className="font-semibold font-serif">Value</TableCell>
            <TableCell className="text-right font-semibold font-serif">
              Goal %
            </TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          <NutritionList
            groupComponent={TableGroup}
            mode={mode}
            nutrientComponent={Nutrient}
            nutrientIdToValue={values}
          />
        </TableBody>
      </Table>
    </div>
  );
}
