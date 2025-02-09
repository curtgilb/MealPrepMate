"use client";
import { Search } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { InputWithIcon } from "@/components/ui/InputWithIcon";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MealPlanRecipeSearchCard } from "@/features/recipe/components/recipe_search/MealPlanRecipeSearchCard";
import { RecipeSearchResults } from "@/features/recipe/components/recipe_search/RecipeSearchResults";
import { RecipeFilter } from "@/features/recipe/components/RecipeFilter";
import { RecipeFilter as RecipeFilterInput } from "@/gql/graphql";
import { useContainerHeight } from "@/hooks/useContainerHeight";

interface RecipeSearchProps {
  setRecipe: Dispatch<SetStateAction<string | null>>;
}

export function RecipeSearch({ setRecipe }: RecipeSearchProps) {
  const [filter, setFilter] = useState<RecipeFilterInput>({
    nutrientFilters: [],
    ingredientFilters: [],
  });

  return (
    <Tabs defaultValue="recipe" className="w-full h-full">
      <TabsList className="w-full">
        <TabsTrigger value="recipe" className="w-full">
          Recipes
        </TabsTrigger>
        <TabsTrigger value="filter" className="w-full">
          Filter
        </TabsTrigger>
      </TabsList>
      <TabsContent
        value="recipe"
        className="grid grid-rows-[auto_1fr]  data-[state=active]:h-[calc(100%-2rem)]"
      >
        <InputWithIcon className="mt-8 mb-8" startIcon={Search} />
        <div className="overflow-hidden">
          <ScrollArea className="h-[calc(100%-5rem)] pr-4">
            <RecipeSearchResults
              className="p-1"
              filter={{}}
              renderCard={(recipe) => (
                <MealPlanRecipeSearchCard
                  recipe={recipe}
                  onClick={(id) => {
                    setRecipe(id);
                  }}
                />
              )}
            />
            <ScrollBar />
          </ScrollArea>
        </div>
      </TabsContent>

      <TabsContent
        value="filter"
        className="grid grid-rows-[auto_1fr]  data-[state=active]:h-[calc(100%-2rem)]"
      >
        <RecipeFilter filter={filter} setFilter={setFilter} />
      </TabsContent>
    </Tabs>
  );
}
