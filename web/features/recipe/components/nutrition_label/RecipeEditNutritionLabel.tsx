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
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { NutritionContext } from "@/features/recipe/components/nutrition_label/EditNutritionLabelForm";
import { NutritionDisplayMode } from "@/hooks/use-nutrients";
import { cn } from "@/lib/utils";
import { toTitleCase } from "@/utils/utils";
import { HTMLAttributes, useContext, useMemo, useState } from "react";

interface RecipeEditNutritionLabelProps extends HTMLAttributes<HTMLDivElement> {
  nutrients: { [key: string]: number };
  servings: number;
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
        <TableCell className="text-lg font-bold" colSpan={2}>
          {toTitleCase(name)}
        </TableCell>
      </TableRow>
      {children}
    </>
  );
}

function Nutrient({ nutrient, depth, value }: NutrientItemProps) {
  const [inputValue, setInputValue] = useState<number>(value ?? 0);
  const updateNutrients = useContext(NutritionContext);

  return (
    <TableRow key={nutrient.id} className="text-sm">
      <TableCell>
        <p className={NutritionLabelIndentation[depth]}>{nutrient.name}</p>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-2 ">
          <Input
            className="h-8 max-w-28"
            value={inputValue}
            type="number"
            onChange={(e) => {
              updateNutrients(nutrient.id, parseFloat(e.target.value));
            }}
            onInput={(e) => {
              const inputElement = e.target as HTMLInputElement;
              console.log(inputElement.value);
              setInputValue(
                parseFloat(inputElement.value.replace(/[^0-9.]/g, ""))
              );
            }}
          />
          <p>{nutrient.unit.symbol}</p>
        </div>
      </TableCell>
    </TableRow>
  );
}

export function RecipeEditNutritionlabel({
  nutrients,
  className,
  servings,
  ...rest
}: RecipeEditNutritionLabelProps) {
  const [servingSize, setServingSize] = useState<ServingSize>(
    ServingSize.Serving
  );
  const [mode, setMode] = useState<NutritionDisplayMode>(
    NutritionDisplayMode.Basic
  );

  const values = useMemo(() => {
    if (servingSize === ServingSize.Serving) {
      return Object.fromEntries(
        Object.entries(nutrients).map(([key, value]) => [key, value / servings])
      );
    }
    return nutrients;
  }, [nutrients, servingSize, servings]);

  return (
    <div className={cn("max-w-lg", className)} {...rest}>
      <div className="flex">
        <div className="flex gap-2 justify-end">
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
