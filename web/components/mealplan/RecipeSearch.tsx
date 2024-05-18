"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecipeFilter as RecipeFilterInput } from "@/gql/graphql";
import { Search } from "lucide-react";
import { useState } from "react";
import RecipeFilter from "../recipe/RecipeFilter";
import { RecipeSearchResults } from "../recipe/RecipeResults";
import { InputWithIcon } from "../ui/InputWithIcon";

export function RecipeSearch() {
  const [filter, setFilter] = useState<RecipeFilterInput>();

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
          <RecipeSearchResults filters={filter} smallCards={true} />
        </TabsContent>
        <TabsContent value="filter">
          <RecipeFilter />
        </TabsContent>
      </Tabs>
    </div>
  );
}
