"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReactNode, useState } from "react";
import { MealList } from "./MealList";
import { RecipeSearch } from "./RecipeSearch";
import { MealPlanIngredients } from "./sidebar/MealPlanIngredients";

const menu: {
  title: string;
  value: string;
  component: ReactNode | undefined;
}[] = [
  { title: "Recipe Search", value: "recipe", component: <RecipeSearch /> },
  { title: "Meals", value: "meals", component: <MealList /> },
  {
    title: "Ingredients",
    value: "ingredients",
    component: <MealPlanIngredients />,
  },
  { title: "Nutrition", value: "nutrition", component: undefined },
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
    <div className="p-4 border-l w-96 bg-card h-full flex flex-col">
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
    </div>
  );
}
