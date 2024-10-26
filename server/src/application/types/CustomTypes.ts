import { Prisma } from "@prisma/client";

export type AllOptionalPartiallyNullable<
  T,
  NullableKeys extends keyof T = never,
> = {
  [K in keyof T]: T[K] | undefined | (K extends NullableKeys ? null : never);
};

export type AllowUndefinedOrNull<T> = {
  [K in keyof T]: T[K] | undefined | null;
};

export type AllowUndefined<T> = {
  [K in keyof T]: T[K] | undefined;
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace PrismaJson {
    type ImageMapping = { [key: string]: string };
    type NutrientMapping = { [key: string]: NutrientValue };
    type MealPlanRecipesCopy = MealPlanRecipeWithServing[];
    type BoundingBoxes = BoundingBox[];
    type SummedNutrientMapJson = SummedNutrients;
    type AggregateLabelJson = AggregateNutritionLabel;
  }
}

type MaybePromise<T> = T | Promise<T>;

type PolygonCoordinate = {
  x: number;
  y: number;
};

type BoundingBox = PolygonCoordinate[];

type NutrientValue = { value: number; valuePerServing: number };

type MatchArgs = {
  recipeMatchId?: string | undefined;
  labelMatchId?: string | undefined;
  ingredientGroupId?: string | undefined;
  status?: RecordStatus;
};

type Match = {
  recipeMatchId?: string | undefined;
  labelMatchId?: string | undefined;
  ingredientGroupId?: string | undefined;
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

const recordWithImport = Prisma.validator<Prisma.ImportItemDefaultArgs>()({
  include: {
    import: true,
  },
});

type RecordWithImport = Prisma.ImportItemGetPayload<typeof recordWithImport>;

const recipeWithIngredients = Prisma.validator<Prisma.RecipeDefaultArgs>()({
  include: {
    ingredients: true,
  },
});

type RecipeWithIngredients = Prisma.RecipeGetPayload<
  typeof recipeWithIngredients
>;

const nutrientWithUnit = Prisma.validator<Prisma.NutrientDefaultArgs>()({
  include: {
    unit: true,
    dri: true,
  },
});

type NutrientWithUnit = Prisma.NutrientGetPayload<typeof nutrientWithUnit>;

export {
  RecordWithImport,
  RecipeWithIngredients,
  RecipeKeeperRecipe,
  Mappings,
  FileMetaData,
  CronometerNutrition,
  MyFitnessPalNutrition,
  ImportQuery,
  Match,
  NutrientWithUnit,
  NutrientValue,
  MatchArgs,
  BoundingBox,
  MaybePromise,
};
