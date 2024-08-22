"use client";
import {
  NutrientItem,
  NutritionList,
} from "@/components/nutrition_label_abstracts/NutritionList";
import { GetRecipeQuery, NutrientFieldsFragment } from "@/gql/graphql";
import { HTMLAttributes, useMemo, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { toTitleCase } from "@/utils/utils";
import { EnumSelect } from "@/components/EnumSelect";
import { NutritionDisplayMode } from "@/hooks/use-nutrients";

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

function Group({
  name,
  children,
}: {
  name: string;
  children: React.ReactNode;
}) {
  return (
    <div className="w-96 bg-white border rounded-md px-5 py-2.5">
      <p className="text-xl font-semibold  my-6">{toTitleCase(name)}</p>
      <div className="space-y-6">{children}</div>
    </div>
  );
}

function Nutrient({
  nutrient,
  depth,
  value,
}: NutrientItem & { value: number | undefined | null }) {
  const { labelStr, percentage, target } = getValueLabel(nutrient, value);
  return (
    <div key={nutrient.id} className="text-sm">
      <div className="flex justify-between">
        <p className="font-semibold">{nutrient.name}</p>
        <p className="">{Math.round(percentage)}%</p>
      </div>
      <Progress className="h-2.5 mt-1.5 mb-1" value={percentage} />
      <p className="text-right text-xs">{labelStr}</p>
    </div>
  );
}

export function Nutritionlabel({
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
      agg[nutrient.nutrient.id] = nutrient;
      return agg;
    }, {} as { [key: string]: NutrientValue[number] });
  }, [label]);

  return (
    <div className={cn(className)} {...rest}>
      <div className="flex justify-between">
        <h2 className="text-xl font-bold">Nutrition</h2>
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
      <div className="flex gap-6 flex-wrap">
        <NutritionList
          mode={mode}
          Group={Group}
          nutrient={({ item: nutrient, depth }) => {
            const nutrientValue = values ? values[nutrient.id] : undefined;
            const finalValue =
              servingSize === ServingSize.Serving
                ? nutrientValue?.perServing
                : nutrientValue?.value;
            return (
              <Nutrient value={finalValue} nutrient={nutrient} depth={depth} />
            );
          }}
        />
      </div>
    </div>
  );
}
