"use client";
import SingleColumnCentered from "@/components/layouts/single-column-centered";
import { Button } from "@/components/ui/button";
import { InputWithIcon } from "@/components/ui/InputWithIcon";
import { IngredientSearchResults } from "@/features/ingredient/components/IngredientSearchResults";

import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function IngredientsPage() {
  const [search, setSearch] = useState<string>();

  return (
    <SingleColumnCentered>
      <h1 className="text-4xl font-serif font-black">Ingredients</h1>
      <div className="flex items-center justify-between py-8">
        <InputWithIcon
          onChange={(e) => {
            setSearch(e.target.value);
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

      <IngredientSearchResults search={search} />
    </SingleColumnCentered>
  );
}
