"use client";
import { useContext } from 'react';

import { ServingsContext } from '@/features/mealplan/contexts/ServingsContext';

export function useServingsContext() {
  const context = useContext(ServingsContext);

  if (context === null || context === undefined) {
    throw new Error("Did you forget to wrap your component?");
  }

  return context;
}
