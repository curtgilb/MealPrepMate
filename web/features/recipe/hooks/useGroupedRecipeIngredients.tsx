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
  group: string;
  index: number;
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
    group: groupOrder[0] ?? DEFAULT_KEY,
    index: 0,
  });

  function advanceActive() {
    if (groupedIngredients) {
      const activeIndex = activeIngredient.index;
      // Increase within the same group
      if (activeIndex + 1 < groupedIngredients[activeIngredient.group].length) {
        setActiveIngredient({ ...activeIngredient, index: activeIndex + 1 });
      }
      // Advance to next group if it has items or loop to beginning
      else {
        const groupIdx = groupOrder.findIndex(
          (name) => name === activeIngredient.group
        );
        let newGroup = DEFAULT_KEY;
        const length = groupOrder.length;

        for (let i = 0; i < length; i++) {
          let index = (groupIdx + 1 + i) % length;
          if (groupedIngredients[groupOrder[index]].length > 0) {
            newGroup = groupOrder[index];
          }
        }
        setActiveIngredient({ group: newGroup, index: 0 });
      }
    }
  }

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
