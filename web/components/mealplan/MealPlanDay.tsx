import MacroDistribution from "./MacroDistribution";
import NutrientBar from "./NutrientBar";

export default function MealPlanDay() {
  return (
    <div>
      <p className="text-xl font-extrabold mb-2">Day 1</p>
      <div className="border rounded-sm p-6 flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <p className="text-xl font-bold">Nutrient Summary</p>
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
        </div>

        <div>
          <p className="text-xl font-bold">Meals</p>
          <div>
            <div>
              <p className="text-lg font-bold">Breakfast</p>
              <div className="bg-secondary min-h-24 "></div>
            </div>
            <div>
              <p className="text-lg font-bold">Lunch</p>
            </div>
            <div>
              <p className="text-lg font-bold">Dinner</p>
            </div>
            <div>
              <p className="text-lg font-bold">Snacks</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
