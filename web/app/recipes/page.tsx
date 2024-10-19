"use client";
import SingleColumnCentered from "@/components/layouts/single-column-centered";
import { Button } from "@/components/ui/button";
import { InputWithIcon } from "@/components/ui/InputWithIcon";
import { RecipeSearchFilter } from "@/features/mealplan/components/RecipeSearch";
import { searchRecipes } from "@/features/recipe/api/Recipe";
import { ClickableRecipeCard } from "@/features/recipe/components/RecipeCard";
import { RecipeSearchResults } from "@/features/recipe/components/RecipeResults";
import { useQuery } from "@urql/next";
import { Filter, Import, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { RecipeFilter } from "@/features/recipe/components/RecipeFilter";
import { InfiniteScroll } from "@/components/PaginatedResults";

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

      {/* <RecipeSearchResults
        filters={{}}
        vertical={true}
        Component={ClickableRecipeCard}
      /> */}
      <InfiniteScroll
        query={}
        variables={{}}
        renderItem={(recipe) => {}}
        getConnection={(data) => {}}
      />
    </SingleColumnCentered>
  );
}
