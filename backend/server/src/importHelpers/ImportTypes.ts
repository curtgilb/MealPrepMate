import { Gender, SpecialCondition } from "@prisma/client";

type Ingredient = {
  name: string;
  storageInstructions: string;
  alternativeNames?: string[];
  perishable: boolean;
  fridgeLife: number;
  freezerLife: number;
  defrostTime: number;
  category: string;
};

type Nutrient = {
  nutrient: string;
  symbol: string;
  unit: string;
  notes: string;
  alternateNames: string[];
  type: string;
  parentNutrient: string;
  cronometer: string;
  recipeKeeper: string;
  myFitnessPal: string;
  dri: string;
};

type NutritionLabel = {
  name: string;
  alcohol?: number;
  amount?: string;
  nutrients: NutritionFact[];
};

type NutritionFact = {
  nutrient: string;
  amount: number;
};

type DriLookup = { [key: string]: DailyRecommendedIntake[] };

type DailyRecommendedIntake = {
  gender: Gender;
  ageMin: number;
  ageMax: number;
  specialCondition: SpecialCondition;
  value: number;
};

type Mappings = { [key: string]: { [key: string]: string } };

export type {
  Ingredient,
  Nutrient,
  NutritionFact,
  Mappings,
  NutritionLabel,
  DailyRecommendedIntake,
  DriLookup,
};
