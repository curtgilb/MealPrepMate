import { MealPlan } from "@/contexts/MealPlanContext";
import { graphql, useFragment } from "@/gql";
import { useQuery } from "@urql/next";
import { useContext } from "react";
import { Button } from "../ui/button";
import { Pencil, Plus, PlusCircle } from "lucide-react";
import { MealRecipeFieldsFragment } from "@/gql/graphql";
import { mealRecipeFragment } from "@/app/mealplans/[id]/page";

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
