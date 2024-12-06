import { createContext } from 'react';

import { CalcNutritionFunc } from '@/features/mealplan/hooks/useMealPlanNutrition';

export type MealPlan = {
  day: number | { minDay: number; maxDay: number };
  calculateNutrition: CalcNutritionFunc;
};

export const MealPlanContext = createContext<MealPlan | undefined>(undefined);
