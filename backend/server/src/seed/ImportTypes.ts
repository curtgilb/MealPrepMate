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
  RecipeKeeperRecipe,
};

type RecipeKeeperRecipe = {
  recipeId?: string;
  recipeShareId?: string;
  recipeIsFavourite?: string;
  recipeRating?: string;
  name?: string;
  recipeCourse: string[];
  recipeSource?: string;
  recipeYield?: string;
  prepTime?: string;
  cookTime?: string;
  recipeIngredients?: string;
  recipeDirections?: string;
  recipeNotes?: string;
  recipeNutServingSize?: string;
  recipeNutCalories?: string;
  recipeNutTotalFat?: string;
  recipeNutSaturatedFat?: string;
  recipeNutSodium?: string;
  recipeNutTotalCarbohydrate?: string;
  recipeNutSugars?: string;
  recipeNutProtein?: string;
  recipeNutCholesterol?: string;
  recipeNutDietaryFiber?: string;
  photos: string[];
  recipeCollection: string[];
  recipeCategory: string[];
};
