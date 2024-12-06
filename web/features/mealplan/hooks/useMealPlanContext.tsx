"use client";
import { useContext } from 'react';

import { MealPlanContext } from '@/features/mealplan/contexts/MealPlanContext';

export function useMealPlanContext() {
  const context = useContext(MealPlanContext);

  if (context === null || context === undefined) {
    throw new Error(
      "useMealPlan must be used within a provider. Did you forget to wrap your component?"
    );
  }

  return context;
}
