import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  GetRecipeQuery,
  RecipeFieldsFragment,
  RecipeIngredientFieldsFragment,
} from "@/gql/graphql";

export const DEFAULT_GROUP_KEY = "Default";

type GroupedIngredients = Record<
  string,
  { name: string; items: RecipeIngredientFieldsFragment[] }
>;

interface SelectedLocation {
  group: string;
  index: number;
}

interface IngredientsContextType {
  groupedIngredients: GroupedIngredients;
  setGroupedIngredients: (
    value:
      | GroupedIngredients
      | ((prev: GroupedIngredients) => GroupedIngredients)
  ) => void;
  updateSelected: (update: RecipeIngredientFieldsFragment) => void;
  removeSelected: () => void;
  groupOrder: string[];
  setGroupOrder: Dispatch<SetStateAction<string[]>>;
  selected: string;
  setSelected: (id: string) => void;
  selectedLocation: SelectedLocation;
  removeGroup: (groupId: string) => void;
  selectedIngredient?: RecipeIngredientFieldsFragment;
  advanceSelected: () => void;
}

function useGroupedRecipeIngredients(
  ingredients: RecipeIngredientFieldsFragment[] | null | undefined,
  groups: RecipeFieldsFragment["ingredientGroups"] | null | undefined
): IngredientsContextType {
  // Initialize grouped ingredients with state setter
  const [groupedIngredients, setGroupedIngredients] =
    useState<GroupedIngredients>(() => {
      const groupIds =
        groups?.map((group) => [group.id, { name: group.name, items: [] }]) ??
        [];
      groupIds.push([DEFAULT_GROUP_KEY, { name: "Primary", items: [] }]);

      const groupedIngredients: GroupedIngredients =
        Object.fromEntries(groupIds);

      ingredients?.forEach((ingredient) => {
        const groupId = ingredient.group?.id ?? DEFAULT_GROUP_KEY;
        groupedIngredients[groupId].items.push(ingredient);
      });
      return groupedIngredients;
    });

  // Compute group order once during initialization
  const [groupOrder, setGroupOrder] = useState(() =>
    Object.keys(groupedIngredients)
  );

  // Initialize selected ID
  const [selected, setSelected] = useState(
    () => groupedIngredients[DEFAULT_GROUP_KEY].items?.[0]?.id
  );

  // Memoize selected location computation
  const selectedLocation = useMemo<SelectedLocation>(() => {
    for (const group of groupOrder) {
      const index = groupedIngredients[group].items.findIndex(
        (ingredient) => ingredient.id === selected
      );
      if (index !== -1) {
        return { group, index };
      }
    }
    return { group: DEFAULT_GROUP_KEY, index: 0 };
  }, [selected, groupedIngredients, groupOrder]);

  // Memoize selected ingredient lookup
  const selectedIngredient = useMemo(
    () =>
      groupedIngredients[selectedLocation.group].items?.[
        selectedLocation.index
      ],
    [groupedIngredients, selectedLocation]
  );

  // Update selected ingredient
  function updateSelected(update: RecipeIngredientFieldsFragment) {
    const { group } = selectedLocation;
    setGroupedIngredients((prev) => ({
      ...prev,
      [group]: {
        name: prev[group].name,
        items: prev[group].items.map((ingredient) =>
          ingredient.id === update.id ? update : ingredient
        ),
      },
    }));
  }

  function removeGroup(groupId: string) {
    // Don't allow removing the default group
    if (groupId === DEFAULT_GROUP_KEY) {
      return;
    }

    setGroupedIngredients((prev) => {
      const newGroups = { ...prev };

      // Move ingredients to default group
      newGroups[DEFAULT_GROUP_KEY] = {
        name: DEFAULT_GROUP_KEY,
        items: [...prev[DEFAULT_GROUP_KEY].items, ...prev[groupId].items],
      };

      // Remove the group
      delete newGroups[groupId];

      return newGroups;
    });

    // Update group order
    setGroupOrder((prev) => prev.filter((g) => g !== groupId));

    // Update selected item if it was in the removed group
    if (selectedLocation.group === groupId) {
      // Find the same ingredient in its new location in default group
      setSelected(
        selectedIngredient?.id ||
          groupedIngredients[DEFAULT_GROUP_KEY].items[0].id
      );
    }
  }

  function removeSelected() {
    const { group, index } = selectedLocation;

    // Find next selection before removing
    let nextId: string | undefined;
    const currentGroup = groupedIngredients[group];

    if (currentGroup.items.length > 1) {
      // Stay in same group if possible
      nextId =
        currentGroup.items[index + 1]?.id ?? currentGroup.items[index - 1].id;
    } else {
      // Find next non-empty group using same order and wrap-around
      const currentGroupIndex = groupOrder.indexOf(group);
      for (let i = 1; i <= groupOrder.length; i++) {
        const nextGroup =
          groupOrder[(currentGroupIndex + i) % groupOrder.length];
        if (
          groupedIngredients[nextGroup].items.length > 0 &&
          nextGroup !== group
        ) {
          nextId = groupedIngredients[nextGroup].items[0].id;
          break;
        }
      }
    }

    // Remove the item
    setGroupedIngredients((prev) => ({
      ...prev,
      [group]: {
        name: prev[group].name,
        items: prev[group].items.filter((_, idx) => idx !== index),
      },
    }));

    // Update selection if we found one
    if (nextId) {
      setSelected(nextId);
    }
  }

  // Advance selection
  const advanceSelected = useMemo(
    () => () => {
      const { group, index } = selectedLocation;
      const currentGroup = groupedIngredients[group];

      if (index + 1 < currentGroup.items.length) {
        // Move to next item in current group
        setSelected(currentGroup.items[index + 1].id);
      } else {
        // Find next non-empty group
        const currentGroupIndex = groupOrder.indexOf(group);
        for (let i = 1; i <= groupOrder.length; i++) {
          const nextGroup =
            groupOrder[(currentGroupIndex + i) % groupOrder.length];
          if (groupedIngredients[nextGroup].items.length > 0) {
            setSelected(groupedIngredients[nextGroup].items[0].id);
            break;
          }
        }
      }
    },
    [groupedIngredients, groupOrder, selectedLocation]
  );

  return {
    groupedIngredients,
    setGroupedIngredients,
    updateSelected,
    removeSelected,
    groupOrder,
    setGroupOrder,
    selected,
    setSelected,
    removeGroup,
    selectedLocation,
    selectedIngredient,
    advanceSelected,
  };
}

const IngredientsContext = createContext<IngredientsContextType | undefined>(
  undefined
);

function useRecipeIngredientContext() {
  const context = useContext(IngredientsContext);
  if (!context) {
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
