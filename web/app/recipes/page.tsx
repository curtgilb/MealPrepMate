"use client";
import { Filter, Import, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import SingleColumnCentered from "@/components/layouts/single-column-centered";
import { Button } from "@/components/ui/button";
import { InputWithIcon } from "@/components/ui/InputWithIcon";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { RecipeSearchFilter } from "@/features/mealplan/components/sidebar/recipes/RecipeSearch";
import { MainRecipeSearchCard } from "@/features/recipe/components/recipe_search/MainRecipeSearchCard";
import { RecipeSearchResults } from "@/features/recipe/components/recipe_search/RecipeSearchResults";
import { RecipeFilter } from "@/features/recipe/components/RecipeFilter";
import { SearchRecipesQuery } from "@/gql/graphql";

type RecipeSearchResults = NonNullable<SearchRecipesQuery["recipes"]>;
type RecipeSearchItem = NonNullable<
  SearchRecipesQuery["recipes"]
>["edges"][number]["node"];

export default function RecipesPage() {
  const [filter, setFilter] = useState<RecipeSearchFilter>({
    nutrientFilters: [],
    ingredientFilters: [],
  });

  return (
    <SingleColumnCentered className="flex flex-col gap-10">
      <h1 className="text-4xl font-serif font-black">Recipes</h1>
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <InputWithIcon className="w-96" startIcon={Search} />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>
                  <RecipeFilter filter={filter} setFilter={setFilter} />
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">
            <Plus className="mr-2 h-4 w-4" />
            Add Recipe
          </Button>
          <Link href="/recipes/create/web">
            <Button variant="secondary">
              <Import className="mr-2 h-4 w-4" />
              Import Recipe
            </Button>
          </Link>
        </div>
      </div>
      <RecipeSearchResults
        filter={{}}
        renderCard={(recipe) => <MainRecipeSearchCard recipe={recipe} />}
      />
    </SingleColumnCentered>
  );
}
