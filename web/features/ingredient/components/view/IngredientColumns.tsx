import { Button } from "@/components/ui/button";
import { GetAllIngredientsQuery } from "@/gql/graphql";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

export const ingredientColumns: ColumnDef<
  GetAllIngredientsQuery["allIngredients"][number]
>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Ingredient
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "category.name",
    id: "categoryName",
    header: "Category",
  },
  {
    accessorKey: "expiration.perishable",
    header: "Perishable",
  },
  {
    id: "maxFreshness",
    accessorFn: (row) => {
      return row.expiration?.longestLife ?? 0;
    },
    cell: ({ row }) => {
      const days = row.getValue("maxFreshness");

      if (typeof days === "number" && days > 0) {
        if (days >= 365) {
          return `${Math.floor(days / 365)} yrs`;
        } else if (days >= 30) {
          return `${Math.floor(days / 30)} mo`;
        } else {
          return `${days} days`;
        }
      }
      return "";
    },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Max Freshness
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
];
