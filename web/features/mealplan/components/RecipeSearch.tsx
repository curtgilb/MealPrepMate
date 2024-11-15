"use client";
import { Search } from "lucide-react";
import { useState } from "react";

// import { IngredientItem } from "@/components/pickers/IngredientPicker";
import { NutrientItem } from "@/components/pickers/NutrientPicker";
import { InputWithIcon } from "@/components/ui/InputWithIcon";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MealPlanRecipeSearchCard } from "@/features/recipe/components/recipe_search/MealPlanRecipeSearchCard";
import { RecipeSearchResults } from "@/features/recipe/components/recipe_search/RecipeSearchResults";
import { RecipeFilter } from "@/features/recipe/components/RecipeFilter";
import { RecipeFilter as RecipeFilterInput } from "@/gql/graphql";

// import RecipeFilter from "@/features/recipe/components/RecipeFilter";
// import {
//   IngredientFilter as IngFilter,
//   NumericalComparison,
//   RecipeFilter as RecipeFilterInput,
// } from "@/gql/graphql";

// export type NutrientFilter = NutrientItem & {
//   comparison?: NumericalComparison;
// };

// export type IngredientFilter = IngredientItem & {
//   filter?: IngFilter;
// };

// export type RecipeSearchFilter = Omit<
//   RecipeFilterInput,
//   "ingredientFilter" | "nutrientFilters" | "searchString"
// > & {
//   nutrientFilters: NutrientFilter[];
//   ingredientFilters: IngredientFilter[];
// };

export function RecipeSearch() {
  const [filter, setFilter] = useState<RecipeFilterInput>({
    nutrientFilters: [],
    ingredientFilters: [],
  });

  return (
    <div>
      <Tabs defaultValue="recipe" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="recipe" className="w-full">
            Recipes
          </TabsTrigger>
          <TabsTrigger value="filter" className="w-full">
            Filter
          </TabsTrigger>
        </TabsList>
        <TabsContent value="recipe">
          <InputWithIcon className="mt-8 mb-8" startIcon={Search} />
          <ScrollArea className="h-[500px] pr-4">
            <RecipeSearchResults
              filter={{}}
              renderCard={(recipe) => (
                <MealPlanRecipeSearchCard recipe={recipe} />
              )}
            />
          </ScrollArea>
        </TabsContent>
        <TabsContent value="filter">
          <RecipeFilter filter={filter} setFilter={setFilter} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
