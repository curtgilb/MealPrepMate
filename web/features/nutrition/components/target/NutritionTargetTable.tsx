import { useState } from "react";

import { TableCell, TableRow } from "@/components/ui/table";
import { NutritionTargetRow } from "@/features/nutrition/components/target/NutritionTargetRow";
import { NutrientWithChildren } from "@/hooks/use-nutrients";
import { toTitleCase } from "@/utils/utils";

interface NutrientTableSectionProps {
  category: string;
  nutrients: NutrientWithChildren[];
}

export function NutrientTableSection({
  category,
  nutrients,
}: NutrientTableSectionProps) {
  return (
    <>
      <TableRow className="hover:!bg-transparent">
        <TableCell
          className="bg-muted/25 py-2 font-serif font-medium"
          colSpan={7}
        >
          <p className="text-lg font-medium">{toTitleCase(category)}</p>
        </TableCell>
      </TableRow>
      {nutrients.map((nutrient) => {
        return (
          <NutritionTargetRow key={nutrient.id} nutrient={nutrient} depth={0} />
        );
      })}
    </>
  );
}
