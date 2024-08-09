import { Button } from "@/components/ui/button";
import { MealPlan } from "@/contexts/MealPlanContext";
import { useContext } from "react";

export function MealList() {
  const mealPlan = useContext(MealPlan);

  return (
    <div className="grid gap-y-4">
      {mealPlan?.recipes?.map((recipe) => {
        return (
          <div key={recipe.id}>
            <p className="font-bold">{recipe.originalRecipe.name}</p>
            <p>{`${recipe.servingsOnPlan}/${recipe.totalServings} servings planned`}</p>

            <Button variant="link">Edit</Button>
          </div>
        );
      })}
    </div>
  );
}

function RecipeMeal() {}
