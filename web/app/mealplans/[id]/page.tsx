"use client";
import MealPlanDay from "@/components/mealplan/MealPlanDay";
import { MealPlanSideBar } from "@/components/mealplan/MealPlanSideBar";
import RecipeFilter from "@/components/recipe/RecipeFilter";
import { DayScroller } from "@/components/mealplan/DayPicker";
import { useState } from "react";

export default function MealPlan() {
  const [days, setDays] = useState<number>(1);

  return (
    <div className="flex">
      <div className="p-4 grow">
        <div className="flex justify-between mb-8">
          <p className="text-xl font-bold">Custom Meal plan</p>
          <DayScroller value={days} onChange={setDays} canScrollDays={true} />
        </div>

        <div className="grid grid-cols-1 4xl:grid-cols-7 gap-8 w-full">
          <MealPlanDay></MealPlanDay>
          <MealPlanDay></MealPlanDay>
          <MealPlanDay></MealPlanDay>
          <MealPlanDay></MealPlanDay>
          <MealPlanDay></MealPlanDay>
          <MealPlanDay></MealPlanDay>
          <MealPlanDay></MealPlanDay>
        </div>
      </div>

      <MealPlanSideBar />
    </div>
  );
}
