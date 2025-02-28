"use client";

import { useState } from "react";

import { ProgramticModalDrawer } from "@/components/ModalDrawerProgramatic";
import { TableCell, TableRow } from "@/components/ui/table";
import { EditNutrientTarget } from "@/features/nutrition/components/target/EditNutrientTarget";
import {
  NutritionTargetContext,
  useNutritionTarget,
} from "@/features/nutrition/components/target/NutrientTargetContext";
import { NutrientWithChildren } from "@/hooks/use-nutrients";

interface NutritionTargetRowProp {
  depth: number;
  nutrient: NutrientWithChildren;
}

export const getPaddingClass = (depth: number) => {
  switch (depth) {
    case 0:
      return "";
    case 1:
      return "pl-8";
    case 2:
      return "pl-12";
    case 3:
      return "pl-16";

    default:
      return "pl-16";
  }
};

const formatPreference = (preference: string) => {
  switch (preference) {
    case "OVER":
      return "Goal";
    case "UNDER":
      return "Limit";
    default:
      return "-";
  }
};

export function NutritionTargetRow({
  nutrient,
  depth,
}: NutritionTargetRowProp) {
  const { setIsOpen, setEditingNutrient } = useNutritionTarget();
  const { threshold, nutrientTarget, preference } = nutrient?.target ?? {};
  const unit = nutrient.unit?.symbol;
  const margin = threshold
    ? Math.round(threshold * 0.01 * (nutrientTarget ?? 0))
    : null;

  return (
    <>
      <TableRow
        className={`hover:cursor-pointer [&>*]:py-2 }`}
        onClick={() => {
          setEditingNutrient(nutrient);
          setIsOpen(true);
        }}
      >
        <TableCell className={getPaddingClass(depth)}>
          {nutrient.name}
        </TableCell>
        <TableCell>
          {nutrient.dri?.value ? `${nutrient.dri?.value} ${unit}` : "-"}
        </TableCell>
        <TableCell>
          {nutrient.dri?.upperLimit
            ? `${nutrient.dri.upperLimit} ${unit}`
            : "-"}
        </TableCell>
        <TableCell>{preference ? formatPreference(preference) : "-"}</TableCell>
        <TableCell>
          {threshold ? `${threshold}% (${margin} ${unit}) ` : "-"}
        </TableCell>
        <TableCell>
          {nutrientTarget ? `${nutrientTarget} ${unit}` : "-"}
        </TableCell>
      </TableRow>
      {nutrient.children?.map((childNutrient) => (
        <NutritionTargetRow
          key={childNutrient.id}
          depth={depth + 1}
          nutrient={childNutrient}
        />
      ))}
    </>
  );
}
