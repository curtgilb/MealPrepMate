"use client";
import { graphql } from "@/gql";
import AnimatedNumbers from "react-animated-numbers";
import MacroDistribution from "./MacroDistribution";
import NutrientBar from "./NutrientBar";

const courses = ["Breakfast", "Lunch", "Dinner", "Snacks"];

const servingFields = graphql(`
  fragment ServingFields on MealPlanServing {
    id
    day
    meal
    numberOfServings
    nutritionLabel(advanced: true) {
      calories
      caloriesPerServing
      nutrients {
        name
        perServing
        id
        value
      }
    }
  }
`);

interface MealPlanDay {
  dayNumber: number;
}

export default function MealPlanDay() {
  return (
    <div className="border rounded-sm p-6 ">
      <div className="flex items-baseline justify-between">
        <p className="text-2xl font-extrabold mb-4">Day 1</p>
        <p className="text-xl font-semibold mb-4">1,547 calories</p>
      </div>

      <div>
        {/* <div className="flex flex-col gap-4">
          <NutrientBar
            percentage={33}
            value={33}
            goal={100}
            unit="kcal"
            name="Calories"
            negativeOverage
          />
          <NutrientBar
            percentage={33}
            value={33}
            goal={100}
            unit="mg"
            name="Sodium"
            negativeOverage
          />
          <NutrientBar
            percentage={33}
            value={33}
            goal={100}
            unit="g"
            name="Saturated Fat"
            negativeOverage
          />
          <MacroDistribution
            protien={120}
            protienTarget={180}
            carbs={60}
            carbsTarget={80}
            fat={30}
            fatTarget={40}
          />
        </div> */}

        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 4xl:grid-cols-1">
          {courses.map((course) => {
            return (
              <div key={course}>
                <p className="text-lg font-bold mb-2">{course}</p>
                <div className="bg-secondary min-h-48 rounded"></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
