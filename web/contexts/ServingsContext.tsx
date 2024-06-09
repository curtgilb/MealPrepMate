import { MealPlanServingsFieldFragment } from "@/gql/graphql";
import { createContext } from "react";

type ServingsContext =
  | readonly MealPlanServingsFieldFragment[]
  | undefined
  | null;

export const MealPlanServings = createContext<ServingsContext | undefined>(
  undefined
);
