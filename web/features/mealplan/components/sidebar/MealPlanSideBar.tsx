"use client";
import { ReactNode, useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MealPlanSettings } from "@/features/mealplan/components/sidebar/meal_plan/MealPlanSettings";

import { NutritionSidebar } from "@/features/mealplan/components/sidebar/nutrition/NutritionSidebar";
import { RecipeSideBar } from "@/features/mealplan/components/sidebar/recipes/RecipeSideBar";
import { PlannedRecipes } from "@/features/mealplan/components/sidebar/planned_recipes/PlannedRecipes";

const menu: {
  title: string;
  value: string;
  component: ReactNode | undefined;
}[] = [
  { title: "Recipe Search", value: "recipe", component: <RecipeSideBar /> },
  {
    title: "Planned Recipes",
    value: "meals",
    component: <PlannedRecipes />,
  },
  {
    title: "Ingredients",
    value: "ingredients",
    component: undefined,
  },
  { title: "Nutrition", value: "nutrition", component: <NutritionSidebar /> },
  { title: "Plan Setting", value: "plan", component: <MealPlanSettings /> },
];

function DisplayedMenu({ selected }: { selected: string }) {
  const Display = menu.find((item) => item.value === selected)?.component ?? (
    <p>No menu exists</p>
  );
  return Display;
}

export function MealPlanSideBar() {
  const [selectedMenu, setMenu] = useState<string>("recipe");

  return (
    <aside className="p-4 pb-8 border-l w-96 bg-card h-full flex flex-col ">
      <Select value={selectedMenu} onValueChange={setMenu}>
        <SelectTrigger className="mb-4">
          <SelectValue placeholder="test" />
        </SelectTrigger>
        <SelectContent>
          {menu.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <DisplayedMenu selected={selectedMenu} />
    </aside>
  );
}
