import { createContext, Dispatch, SetStateAction, useContext } from "react";

import { NutrientWithChildren } from "@/hooks/use-nutrients";

interface NutritionTargetContextType {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setEditingNutrient: Dispatch<SetStateAction<NutrientWithChildren | null>>;
}

export const NutritionTargetContext = createContext<
  NutritionTargetContextType | undefined
>(undefined);

export function useNutritionTarget() {
  const context = useContext(NutritionTargetContext);
  if (!context) {
    throw new Error(
      "useNutritionTarget must be used within a NutritionTargetProvider"
    );
  }
  return context;
}
