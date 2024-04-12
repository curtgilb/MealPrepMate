import MacroDistribution from "./MacroDistribution";
import NutrientBar from "./NutrientBar";

const courses = ["Breakfast", "Lunch", "Dinner", "Snacks"];
export default function MealPlanDay() {
  return (
    <div className="border rounded-sm p-6 ">
      <p className="text-2xl font-extrabold mb-4">Day 1</p>
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
