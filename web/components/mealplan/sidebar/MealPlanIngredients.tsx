import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AllIngredients } from "./ingredients/AllIngredients";
import { RecipeIngredients } from "./ingredients/RecipeIngredients";

export function MealPlanIngredients() {
  return (
    <Tabs
      className="flex flex-col flex-grow min-h-0 overflow-hidden"
      defaultValue="all"
    >
      <TabsList className="w-full mb-4">
        <TabsTrigger className="w-full" value="all">
          All Ingredients
        </TabsTrigger>
        <TabsTrigger className="w-full" value="recipe">
          By Recipe
        </TabsTrigger>
      </TabsList>
      <TabsContent className="flex-grow min-h-0 overflow-hidden" value="all">
        <AllIngredients mealPlanId="cltuw2iyg000008l53viu2w53" />
      </TabsContent>
      <TabsContent value="recipe">
        <RecipeIngredients />
      </TabsContent>
    </Tabs>
  );
}
