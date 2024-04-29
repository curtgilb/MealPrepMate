"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RecipeFilter from "../recipe/RecipeFilter";
import { ReactNode, useState } from "react";

const menu: {
  title: string;
  value: string;
  component: ReactNode | undefined;
}[] = [
  { title: "Recipes", value: "recipe", component: <RecipeFilter /> },
  { title: "Meals", value: "meals", component: undefined },
  { title: "Ingredients", value: "ingredients", component: undefined },
  {
    title: "Recommendations",
    value: "recommendations",
    component: undefined,
  },
  { title: "Shopping Day", value: "shoppingDays", component: undefined },
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
    <div className="p-4">
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
