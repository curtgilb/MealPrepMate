import { createContext } from 'react';

import { CalcNutritionFunc } from '@/features/mealplan/hooks/useMealPlanNutrition';
import { BasicPlanRecipeFieldsFragment } from '@/gql/graphql';

type Servings = {
  selectedDay: number;
  allRecipes: BasicPlanRecipeFieldsFragment[];
};

export const ServingsContext = createContext<Servings | undefined>(undefined);
