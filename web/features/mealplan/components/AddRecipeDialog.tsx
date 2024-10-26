"use client";
import { graphql } from "@/gql";
import { useMutation } from "@urql/next";
import { useContext, useState } from "react";
import { NumberInput } from "../ui/number-input";
import { Button } from "../ui/button";
import { RecipeSearchFieldsFragment } from "@/gql/graphql";
import { MealPlan } from "@/contexts/MealPlanContext";
import { addRecipeToMealPlanMutation } from "@/features/mealplan/api/MealPlanRecipe";

interface AddRecipeDialogProps {
  recipe: RecipeSearchFieldsFragment;
}

export function AddRecipeDialog({ recipe }: AddRecipeDialogProps) {
  const intialServings = recipe.aggregateLabel?.servings ?? 1;
  const [servings, setServings] = useState<number>(intialServings);
  const [scale, setScale] = useState<number>(1);
  const [result, addRecipe] = useMutation(addRecipeToMealPlanMutation);
  const mealPlan = useContext(MealPlan);
  const { fetching } = result;

  function calcServValue(amount: number | undefined | null) {
    const finalAmount = amount ? amount : 0;
    return Math.round((finalAmount * scale) / servings);
  }

  function addToMealPlan() {
    addRecipe({
      recipe: {
        recipeId: recipe.id,
        scaleFactor: scale,
        servings,
        mealPlanId: mealPlan?.id ?? "",
      },
    });
  }

  return (
    <div className="grid gap-y-8">
      <div className="flex gap-4">
        <NumberInput
          id="servings"
          label="Servings"
          value={servings}
          setValue={setServings}
          defaultValue={recipe.aggregateLabel?.servings ?? 1}
          increment={1}
        />
        <NumberInput
          id="servings"
          label="Scale"
          value={scale}
          setValue={setScale}
          increment={0.25}
        />
      </div>

      <p>Macro nutrients per serving</p>
      <ul className="grid grid-cols-4 gap-y-4">
        <li className="col-span-4">
          <MacroDisplay
            amount={calcServValue(recipe.aggregateLabel?.totalCalories)}
            name="calories"
            small={false}
          />
        </li>
        <li>
          <MacroDisplay
            amount={calcServValue(recipe.aggregateLabel?.protein)}
            unitSymbol="g"
            name="protien"
            small={true}
          />
        </li>
        <li>
          <MacroDisplay
            amount={calcServValue(recipe.aggregateLabel?.fat)}
            unitSymbol="g"
            name="fat"
            small={true}
          />
        </li>
        <li>
          <MacroDisplay
            amount={calcServValue(recipe.aggregateLabel?.carbs)}
            unitSymbol="g"
            name="carbs"
            small={true}
          />
        </li>
        <li>
          <MacroDisplay
            amount={calcServValue(recipe.aggregateLabel?.alcohol)}
            unitSymbol="g"
            name="alcohol"
            small={true}
          />
        </li>
      </ul>

      <Button
        onClick={() => {
          addToMealPlan();
        }}
        disabled={fetching}
      >
        Add to meal plan
      </Button>
    </div>
  );
}

function MacroDisplay({
  amount,
  name,
  unitSymbol,
  small,
}: {
  amount: number;
  name: string;
  unitSymbol?: string;
  small: boolean;
}) {
  const textSize = small ? "text-xl font-medium" : "text-3xl font-bold";
  return (
    <div className="text-center">
      <p>
        <span className={textSize}>{amount}</span>
        {unitSymbol && <span className="">({unitSymbol})</span>}
      </p>
      <p className="uppercase text-xs tracking-wider">{name}</p>
    </div>
  );
}
