"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  IngredientFilter as IngFilter,
  NumericalComparison,
  RecipeFilter as RecipeFilterInput,
} from "@/gql/graphql";
import { Search } from "lucide-react";
import { useState } from "react";
import RecipeFilter from "../recipe/RecipeFilter";
import { RecipeSearchResults } from "../recipe/RecipeResults";
import { InputWithIcon } from "../ui/InputWithIcon";
import { NutrientItem } from "../pickers/NutrientPicker";
import { IngredientItem } from "../pickers/IngredientPicker";

export type NutrientFilter = NutrientItem & {
  comparison?: NumericalComparison;
};

export type IngredientFilter = IngredientItem & {
  filter?: IngFilter;
};

export type RecipeSearchFilter = Omit<
  RecipeFilterInput,
  "ingredientFilter" | "nutrientFilters" | "searchString"
> & {
  nutrientFilters: NutrientFilter[];
  ingredientFilters: IngredientFilter[];
};

export function RecipeSearch() {
  const [filter, setFilter] = useState<RecipeSearchFilter>({
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
          <InputWithIcon className="mt-8 mb-12" startIcon={Search} />
          <RecipeSearchResults filters={{}} smallCards={true} />
        </TabsContent>
        <TabsContent value="filter">
          <RecipeFilter filter={filter} setFilter={setFilter} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
