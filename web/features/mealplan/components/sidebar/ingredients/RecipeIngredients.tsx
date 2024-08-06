import { MealPlan, MealPlanContext } from "@/contexts/MealPlanContext";
import { useContext, useMemo } from "react";

type RecipeIngredients = NonNullable<
  MealPlanContext["recipes"]
>[number]["originalRecipe"]["ingredients"][number];
type RecipeIngredientWithFactor = RecipeIngredients & { factor: number };

// type ByIngredient = Map<string, >

export function RecipeIngredients() {
  const mealPlan = useContext(MealPlan);
  const conslidatedIngredients = useMemo(() => {
    return mealPlan?.recipes?.reduce((all, recipe) => {
      for (const ingredient of recipe.originalRecipe.ingredients) {
        let matchingList = ingredient.baseIngredient
          ? all.get(ingredient.baseIngredient.id)
          : undefined;
        if (matchingList) {
          matchingList.push({ ...ingredient, factor: recipe.factor });
        } else {
          if (ingredient.baseIngredient) {
            all.set(ingredient.baseIngredient.id, [
              { ...ingredient, factor: recipe.factor },
            ]);
          }
        }
      }

      return all;
    }, new Map<string, RecipeIngredientWithFactor[]>());
  }, [mealPlan?.recipes]);

  return (
    <div>
      {conslidatedIngredients &&
        [...conslidatedIngredients.entries()].map(
          ([ingredientId, ingredientList]) => {
            const baseIngredient = ingredientList[0]?.baseIngredient;

            return (
              <div key={ingredientId} className="mt-6">
                <p className="font-semibold">
                  {baseIngredient?.name ?? "Other"}
                </p>
                <ul className="list-disc pl-4">
                  {ingredientList.map((ingredient) => {
                    return (
                      <li key={ingredient.id}>
                        <p>
                          {ingredient.sentence} x({ingredient.factor})
                        </p>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          }
        )}
    </div>
  );
}
