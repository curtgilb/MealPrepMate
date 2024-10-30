import { RecipeIngredientFieldsFragment } from "@/gql/graphql";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

interface GroupedIngredients {
  [key: string]: RecipeIngredientFieldsFragment[];
}

const DEFAULT_KEY = "Default";

type ActiveIngredient = {
  group: string | undefined;
  id: string | undefined;
};

type IngredientsContextType = {
  groupedIngredients: GroupedIngredients;
  setGroupedIngredients: Dispatch<SetStateAction<GroupedIngredients>>;
  groupOrder: string[];
  setGroupOrder: Dispatch<SetStateAction<string[]>>;
  activeIngredient: ActiveIngredient;
  setActiveIngredient: Dispatch<SetStateAction<ActiveIngredient>>;
};

// context
const IngredientsContext = createContext<IngredientsContextType | undefined>(
  undefined
);

function useGroupedRecipeIngredients(
  ingredients: RecipeIngredientFieldsFragment[] | null | undefined
) {
  const [groupedIngredients, setGroupedIngredients] = useState<
    GroupedIngredients | undefined
  >(() =>
    ingredients?.reduce((acc, ingredient) => {
      const groupId = ingredient.group?.id ?? DEFAULT_KEY;

      if (!Object.hasOwn(acc, groupId)) {
        acc[groupId] = [];
      }
      acc[groupId].push(ingredient);

      return acc;
    }, {} as GroupedIngredients)
  );

  const [groupOrder, setGroupOrder] = useState<string[]>(() =>
    Object.keys(groupedIngredients || {})
  );

  const [activeIngredient, setActiveIngredient] = useState<ActiveIngredient>({
    group: groupOrder[0],
    id: groupedIngredients
      ? groupedIngredients[groupOrder[0]][0].id
      : undefined,
  });

  return {
    groupedIngredients,
    setGroupedIngredients,
    groupOrder,
    setGroupOrder,
    activeIngredient,
    setActiveIngredient,
  } as IngredientsContextType;
}

function useRecipeIngredientContext() {
  const context = useContext(IngredientsContext);
  if (context === undefined) {
    throw new Error(
      "useIngredients must be used within an IngredientsProvider"
    );
  }
  return context;
}

export {
  IngredientsContext,
  useGroupedRecipeIngredients,
  useRecipeIngredientContext,
  DEFAULT_KEY,
};
