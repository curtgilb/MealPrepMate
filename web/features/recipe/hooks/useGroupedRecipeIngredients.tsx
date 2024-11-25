import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from "react";

import { RecipeIngredientFieldsFragment } from "@/gql/graphql";

interface GroupedIngredients {
  [key: string]: RecipeIngredientFieldsFragment[];
}

const DEFAULT_GROUP_KEY = "Default";

type SelectedLocation = {
  group: string;
  index: number;
};

type IngredientsContextType = {
  groupedIngredients: GroupedIngredients;
  setGroupedIngredients: Dispatch<SetStateAction<GroupedIngredients>>;
  groupOrder: string[];
  setGroupOrder: Dispatch<SetStateAction<string[]>>;
  selected: string;
  setSelected: Dispatch<SetStateAction<string>>;
  selectedLocation: SelectedLocation;
  selectedIngredient: RecipeIngredientFieldsFragment | undefined;
  advanceSelected: () => void;
};

function useGroupedRecipeIngredients(
  ingredients: RecipeIngredientFieldsFragment[] | null | undefined
) {
  const [groupedIngredients, setGroupedIngredients] = useState<
    GroupedIngredients | undefined
  >(() =>
    ingredients?.reduce((acc, ingredient) => {
      const groupId = ingredient.group?.id ?? DEFAULT_GROUP_KEY;

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

  const [selected, setSelected] = useState<string | undefined>(() => {
    if (
      groupedIngredients &&
      groupedIngredients[DEFAULT_GROUP_KEY].length > 0
    ) {
      return groupedIngredients[DEFAULT_GROUP_KEY][0].id;
    }

    return undefined;
  });

  const selectedLocation = useMemo(() => {
    for (const [group, ingredients] of Object.entries(
      groupedIngredients || {}
    )) {
      for (const [index, ingredient] of ingredients.entries()) {
        if (selected === ingredient.id) {
          return { group, index };
        }
      }
    }
  }, [selected, groupedIngredients]);

  const selectedIngredient = useMemo(() => {
    if (!groupedIngredients || !selectedLocation) return undefined;
    return groupedIngredients[selectedLocation.group][selectedLocation.index];
  }, [groupedIngredients, selectedLocation]);

  function advanceSelected() {
    if (groupedIngredients && selectedLocation) {
      const activeIndex = selectedLocation.index;
      // Increase within the same group
      if (activeIndex + 1 < groupedIngredients[selectedLocation.group].length) {
        setSelected(
          groupedIngredients[selectedLocation.group][activeIndex + 1].id
        );
      }
      // Advance to next group if it has items or loop to beginning
      else {
        const groupIdx = groupOrder.findIndex(
          (name) => name === selectedLocation.group
        );
        let newGroup = DEFAULT_GROUP_KEY;
        const length = groupOrder.length;

        for (let i = 0; i < length; i++) {
          let index = (groupIdx + 1 + i) % length;
          if (groupedIngredients[groupOrder[index]].length > 0) {
            newGroup = groupOrder[index];
          }
        }
        setSelected(groupedIngredients[newGroup][0].id);
      }
    }
  }

  return {
    groupedIngredients,
    setGroupedIngredients,
    groupOrder,
    setGroupOrder,
    selected,
    setSelected,
    selectedLocation,
    selectedIngredient,
    advanceSelected,
  } as IngredientsContextType;
}

// context
const IngredientsContext = createContext<IngredientsContextType | undefined>(
  undefined
);

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
  DEFAULT_GROUP_KEY as DEFAULT_KEY,
};
