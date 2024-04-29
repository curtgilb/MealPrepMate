import MealPlanDay from "@/components/mealplan/MealPlanDay";
import { MealPlanSideBar } from "@/components/mealplan/MealPlanSideBar";
import RecipeFilter from "@/components/recipe/RecipeFilter";

export default function MealPlans() {
  return (
    <div>
      <div>
        <p className="text-xl font-bold p-4 border-b">Custom Meal plan</p>
      </div>
      <div className="flex">
        <div className="grid grid-cols-1 4xl:grid-cols-7 gap-8 w-full p-8">
          <MealPlanDay></MealPlanDay>
          <MealPlanDay></MealPlanDay>
          <MealPlanDay></MealPlanDay>
          <MealPlanDay></MealPlanDay>
          <MealPlanDay></MealPlanDay>
          <MealPlanDay></MealPlanDay>
          <MealPlanDay></MealPlanDay>
        </div>
        <div className="border-l w-96 min-h-svh">
          <MealPlanSideBar />
        </div>
      </div>
    </div>
  );
}
