import { Prisma, RecordStatus } from "@prisma/client";

type Match = {
  recipeMatchId: string | undefined;
  labelMatchId: string | undefined;
  status: RecordStatus;
};

type RecipeKeeperRecipe = {
  recipeId: string;
  recipeShareId: string;
  recipeIsFavourite: string;
  recipeRating: string;
  name: string;
  recipeSource: string;
  recipeYield: string;
  prepTime: string;
  cookTime: string;
  recipeIngredients: string;
  recipeDirections: string;
  recipeNotes: string;
  nutritionServingSize: string;
  nutrients: { name: string; value: string }[];
  recipeCourse: string[];
  photos: string[];
  recipeCollection: string[];
  recipeCategory: string[];
  rawInput: string;
};

type CronometerNutrition = {
  day: Date;
  time: string;
  group: string;
  foodName: string;
  amount?: number;
  unit?: string;
  category: string;
  rawInput: string;
  nutrients: Nutrient[];
};

type MyFitnessPalNutrition = {
  date: Date;
  meal: string;
  note: string;
  nutrients: Nutrient[];
};

type Nutrient = {
  id: string;
  amount: number;
};

type ImportQuery = {
  include?: Prisma.ImportInclude | undefined;
  select?: Prisma.ImportSelect | undefined;
};

// type Ingredient = {
//   name: string;
//   storageInstructions: string;
//   alternativeNames?: string[];
//   perishable: boolean;
//   fridgeLife: number;
//   freezerLife: number;
//   defrostTime: number;
//   category: string;
// };

// type Nutrient = {
//   nutrient: string;
//   symbol: string;
//   unit: string;
//   notes: string;
//   alternateNames: string[];
//   type: string;
//   parentNutrient: string;
//   cronometer: string;
//   recipeKeeper: string;
//   myFitnessPal: string;
//   dri: string;
// };

// type NutritionLabel = {
//   name: string;
//   alcohol?: number;
//   amount?: string;
//   nutrients: NutritionFact[];
// };

// type NutritionFact = {
//   nutrient: string;
//   amount: number;
// };

// type DriLookup = { [key: string]: DailyRecommendedIntake[] };

// type DailyRecommendedIntake = {
//   gender: Gender;
//   ageMin: number;
//   ageMax: number;
//   specialCondition: SpecialCondition;
//   value: number;
// };

type Mappings = {
  nutrientName: { [key: string]: string };
};

type FileMetaData = {
  path: string;
  name: string;
  ext: string;
};

export {
  RecipeNlpResponse,
  RecipeKeeperRecipe,
  Mappings,
  FileMetaData,
  CronometerNutrition,
  MyFitnessPalNutrition,
  ImportQuery,
  Match,
  // Ingredient,
  // Nutrient,
  // NutritionFact,
  // NutritionLabel,
  // DailyRecommendedIntake,
  // DriLookup,
};
