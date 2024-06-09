"use client";
import { IngredientPicker } from "@/components/pickers/IngredientPicker";
import { UnitPicker } from "@/components/pickers/UnitPicker";
import { Button } from "@/components/ui/button";
import { InputWithLabel } from "@/components/ui/InputWithLabel";
import { MoreVertical } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const ingredients = [
  "2 large chicken breasts (about 1 \u00bd pounds)",
  "1 tablespoon arrowroot powder (or flour of choice)",
  "1 tablespoon lemon pepper seasoning",
  "\u00bd teaspoon kosher salt",
  "2 tablespoons extra virgin olive oil",
  "2 tablespoons unsalted butter",
  "2 garlic cloves (minced)",
  "3 tablespoons lemon juice (from 1 lemon)",
  "\u00bc cup low-sodium chicken broth",
  "1 teaspoon lemon zest",
  "optional: garnish with freshly chopped parsley and lemon slices",
];

export default function RecipeIngredients() {
  const [unit, setUnit] = useState<string>();
  const [ingredient, setIngredient] = useState<string>();
  const [groups, setGroups] = useState<string[]>([
    "Marinade",
    "Salad",
    "Garnish",
  ]);
  return (
    <div className="grid grid-cols-3">
      <IngredientGroups groupNames={groups} ingredients={[]} />
      <div className="grid gap-8 col-span-2">
        {ingredients.map((ing) => {
          return (
            <div className="border-t-2 p-4" key={ing}>
              <div className="flex justify-between">
                <p className="text-xl font-bold mb-4">{ing}</p>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Make ingredient group</DropdownMenuItem>
                    <DropdownMenuItem>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex gap-4">
                <InputWithLabel id="qty" label="Qty" type="number" />
                <UnitPicker value={unit} setValue={setUnit} />
                <IngredientPicker
                  ingredients={ingredient}
                  setIngredients={setIngredient}
                />
                <div className="grid gap-2">
                  <Label>Ingredient Group</Label>
                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="" />
                    </SelectTrigger>

                    <SelectContent>
                      {groups.map((group) => (
                        <SelectItem key={group} value={group}>
                          {group}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface IngredientGroupProps {
  groupNames: string[];
  ingredients: { name: string; groupName: string | undefined | null }[];
}

function IngredientGroups({ groupNames, ingredients }: IngredientGroupProps) {
  const noGroup = [];
  const groupedIngredients = ingredients.reduce((acc, value) => {
    if (!value.groupName) {
      noGroup.push(value.name);
      return acc;
    }
    if (!(value.groupName in acc)) {
      acc[value.groupName] = [];
    }
    acc[value.groupName].push(value.name);
    return acc;
  }, {} as { [key: string]: string[] });
  return (
    <div>
      {groupNames.map((group) => {
        return (
          <div key={group}>
            <p>{group}</p>
            <ol>
              {groupedIngredients[group]?.map((ingredient) => (
                <li key={ingredient}>{ingredient}</li>
              ))}
            </ol>
          </div>
        );
      })}
    </div>
  );
}

// Qty
// Unit
// Ingredient
// Group
