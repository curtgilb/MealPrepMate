import SingleColumnCentered from "@/components/layouts/single-column-centered";
import { InputWithIcon } from "@/components/ui/InputWithIcon";
import RecipeCard from "@/components/ui/recipe-card";
import { Search } from "lucide-react";

const recipes = [
  {
    id: 1,
    name: "Good Recipe",
    servings: 4,
    calories: 320,
  },
  {
    id: 2,
    name: "Chicken Gryo with tzaiki sauce",
    servings: 4,
    calories: 320,
  },
  {
    id: 3,
    name: "Good Recipe",
    servings: 4,
    calories: 320,
  },
  {
    id: 4,
    name: "Good Recipe",
    servings: 4,
    calories: 320,
  },
  {
    id: 5,
    name: "Good Recipe",
    servings: 4,
    calories: 320,
  },
  {
    id: 6,
    name: "Good Recipe",
    servings: 4,
    calories: 320,
  },
  {
    id: 7,
    name: "Good Recipe",
    servings: 4,
    calories: 320,
  },
  {
    id: 8,
    name: "Good Recipe",
    servings: 4,
    calories: 320,
  },
  {
    id: 9,
    name: "Good Recipe",
    servings: 4,
    calories: 320,
  },
  {
    id: 10,
    name: "Good Recipe",
    servings: 4,
    calories: 320,
  },
];

export default function RecipesPage() {
  return (
    <SingleColumnCentered>
      <h1 className="text-2xl font-semibold">Recipes</h1>
      <InputWithIcon className="mt-8 mb-12 w-80" startIcon={Search} />

      <div className="grid grid-cols-auto-fill-5 gap-8">
        {recipes.map((recipe) => {
          return (
            <RecipeCard
              key={recipe.id}
              name={recipe.name}
              servings={recipe.servings}
              calories={recipe.calories}
            />
          );
        })}
      </div>
    </SingleColumnCentered>
  );
}
