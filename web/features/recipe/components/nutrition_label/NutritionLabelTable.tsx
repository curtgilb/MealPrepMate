import { EnumSelect } from "@/components/EnumSelect";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { NutritionDisplayMode } from "@/hooks/use-nutrients";
import { cn } from "@/lib/utils";
import { toTitleCase } from "@/utils/utils";
import { HTMLAttributes, ReactElement, ReactNode, useState } from "react";

export enum ServingSize {
  Serving = "One Serving",
  Recipe = "Whole Recipe",
}

export const NutritionLabelIndentation: { [key: number]: string } = {
  1: "pl-2",
  2: "pl-6",
  3: "pl-8",
  4: "pl-12",
};

export function TableGroup({
  name,
  children,
  colSpan,
}: {
  name: string;
  children: React.ReactNode;
  colSpan: number;
}) {
  return (
    <>
      <TableRow>
        <TableCell className="text-lg font-bold" colSpan={colSpan}>
          {toTitleCase(name)}
        </TableCell>
      </TableRow>
      {children}
    </>
  );
}
