"use client";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Import = {
  id: string;
  fileName: string;
  type: string;
  status: string;
  createdAt: string;
  recordsCount: number;
};

export const imports: Import[] = [
  {
    id: "skdjfhskdjhf",
    fileName: "RecipeKeeper.zip",
    type: "Recipe Keeper",
    status: "Imported",
    createdAt: "Monday",
    recordsCount: 300,
  },
  {
    id: "2354dffgdfg",
    fileName: "Cronometer.zip",
    type: "Cronometer",
    status: "Imported",
    createdAt: "Monday",
    recordsCount: 300,
  },
];

export const columns: ColumnDef<Import>[] = [
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "fileName",
    header: "File",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    accessorKey: "recordsCount",
    header: "Records",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const original = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              {/* <span className="sr-only">Open menu</span> */}
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
