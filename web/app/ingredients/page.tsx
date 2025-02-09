"use client";
import { DataTable } from "@/components/DataTable";
import SingleColumnCentered from "@/components/layouts/single-column-centered";
import { Button } from "@/components/ui/button";
import { InputWithIcon } from "@/components/ui/InputWithIcon";
import {
  getAllIngredientsQuery,
  getIngredientsQuery,
} from "@/features/ingredient/api/Ingredient";
import { IngredientsList } from "@/features/ingredient/components/IngredientsList";
import { ingredientColumns } from "@/features/ingredient/components/view/IngredientColumns";
import { useDebounce } from "@/hooks/use-debounce";
import { ColumnFilter } from "@tanstack/react-table";
import { useQuery } from "@urql/next";

import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function IngredientsPage() {
  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState<ColumnFilter[]>([]);

  const [results] = useQuery({
    query: getAllIngredientsQuery,
  });

  const onFilterChange = useDebounce((value: string) => {
    setFilter([
      {
        id: "name",
        value: value,
      },
    ]);
  }, 500);

  const ingredients = results.data?.allIngredients ?? [];

  return (
    <SingleColumnCentered>
      <h1 className="text-4xl font-serif font-black">Ingredients</h1>
      <div className="flex items-center justify-between py-8">
        <InputWithIcon
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            onFilterChange(e.target.value);
          }}
          className="w-80"
          startIcon={Search}
        />
        <div className="flex gap-2">
          <Link href="/ingredients/create">
            <Button variant="secondary">
              <Plus className="mr-2 h-4 w-4" />
              New ingredient
            </Button>
          </Link>
        </div>
      </div>

      <DataTable
        columns={ingredientColumns}
        data={ingredients}
        filters={filter}
      />
    </SingleColumnCentered>
  );
}
