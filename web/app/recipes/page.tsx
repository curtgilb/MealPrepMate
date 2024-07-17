"use client";
import SingleColumnCentered from "@/components/layouts/single-column-centered";
import { Button } from "@/components/ui/button";
import { InputWithIcon } from "@/components/ui/InputWithIcon";
import { searchRecipes } from "@/graphql/recipe/queries";
import { useQuery } from "@urql/next";

import { RecipeSearchFilter } from "@/components/mealplan/RecipeSearch";
import { RecipeSearchResults } from "@/components/recipe/RecipeResults";
import { Import, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ClickableRecipeCard } from "@/components/recipe/RecipeCard";

export default function RecipesPage() {
  const [filter, setFilter] = useState<RecipeSearchFilter>({
    nutrientFilters: [],
    ingredientFilters: [],
  });
  const [result] = useQuery({
    query: searchRecipes,
    variables: { filters: {}, pagination: { take: 50, offset: 0 } },
  });

  return (
    <SingleColumnCentered>
      <div className="flex justify-between">
        <h1 className="text-4xl font-black">Recipes</h1>
        <div className="flex gap-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Recipe
          </Button>
          <Link href="/recipes/create/web">
            <Button>
              <Import className="mr-2 h-4 w-4" />
              Import Recipe
            </Button>
          </Link>
        </div>
      </div>

      <InputWithIcon className="mt-8 mb-12 w-96" startIcon={Search} />

      <RecipeSearchResults
        filters={{}}
        vertical={true}
        Component={ClickableRecipeCard}
      />
    </SingleColumnCentered>
  );
}
