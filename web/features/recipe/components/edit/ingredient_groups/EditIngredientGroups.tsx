"use client";

import { Button } from "@/components/ui/button";
import { RecipeIngredientFragment } from "@/features/recipe/api/RecipeIngredient";
import { createRecipeIngredientGroupMutation } from "@/features/recipe/api/RecipeIngredientGroups";
import {
  EditRecipeProps,
  EditRecipeSubmit,
} from "@/features/recipe/components/edit/RecipeEditor";
import { EditIngredientGroup } from "@/features/recipe/components/edit/ingredient_groups/EditIngredientGroup";
import { getFragmentData } from "@/gql";
import {
  EditIngredientGroupMutation,
  RecipeIngredientFieldsFragment,
} from "@/gql/graphql";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useMutation } from "@urql/next";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";

export const DEFAULT_KEY = "$#Default#%";

export const EditIngredientGroups = forwardRef<
  EditRecipeSubmit,
  EditRecipeProps
>(function EditIngredientGroups(props, ref) {
  const ingredients = getFragmentData(
    RecipeIngredientFragment,
    props.recipe?.ingredients
  );

  const [result, addGroup] = useMutation(createRecipeIngredientGroupMutation);

  const groupNames = useRef<{ [key: string]: string }>({});

  const [groupedIngredients, setGroupedIngredients] = useState(
    ingredients?.reduce((acc, ingredient) => {
      const groupId = ingredient.group?.id ?? DEFAULT_KEY;
      if (!Object.hasOwn(acc, groupId)) {
        acc[groupId] = { name: ingredient.group?.name, ingredients: [] };
      }
      acc[groupId].ingredients.push(ingredient);

      if (ingredient.group?.id) {
        groupNames.current[ingredient.group.id] = ingredient.group.name;
      }
      return acc;
    }, {} as { [key: string]: { name: string | undefined | null; ingredients: RecipeIngredientFieldsFragment[] } })
  );

  useImperativeHandle(ref, () => ({
    submit(postSubmit) {
      postSubmit();
    },
  }));

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // onDragOver
  // Former Position
  // active.data.current.sortable.containerId .index
  // active.id

  // new position
  // over.id
  // over.data.current.sortable.conatinerId .index

  // active - the one being dragged
  // over - what is is hovering over

  // This will move it to a new container
  function handleDragOver(event: DragOverEvent) {
    if (groupedIngredients) {
      const { over, active } = event;
      console.log("active", active);
      console.log("over", over);
      console.log("groupedIngredients", groupedIngredients);

      // const { containerId: activeContainerId, index: activeIndex } =
      //   active.data.current?.sortable;
      // const { containerId: overContainerId, index: overIndex } =
      //   over?.data.current?.sortable;

      // console.log("active", activeContainerId);
      // console.log("over", overContainerId);

      // if (active && over && activeContainerId !== overContainerId) {
      //   // Remove the old item and place it in the new one

      //   setGroupedIngredients((prev) => {
      //     if (!prev) return undefined;
      //     return {
      //       ...prev,
      //       [activeContainerId]: {
      //         name: prev[activeContainerId].name,
      //         ingredients: [
      //           ...prev[activeContainerId].ingredients.filter(
      //             (item) => item.id !== active.id
      //           ),
      //         ],
      //       },
      //       [overContainerId]: {
      //         name: prev[overContainerId].name,
      //         ingredients: [
      //           ...prev[overContainerId].ingredients.slice(0, overIndex),
      //           groupedIngredients[activeContainerId].ingredients[activeIndex],
      //           ...prev[overContainerId].ingredients.slice(
      //             overIndex,
      //             prev[overContainerId].ingredients.length
      //           ),
      //         ],
      //       },
      //     };
      //   });
      // }
    }
  }

  // This will save it in the same container
  function handleDragEnd(event: DragEndEvent) {
    console.log("drag end");
    const { over, active } = event;
    const { containerId: activeContainerId, index: activeIndex } =
      active.data.current?.sortable;
    const { containerId: overContainerId, index: overIndex } =
      over?.data.current?.sortable;

    if (
      groupedIngredients &&
      activeContainerId === overContainerId &&
      activeIndex !== overIndex
    ) {
      const items = groupedIngredients[activeContainerId].ingredients;
      const newItems = arrayMove(items, activeIndex, overIndex);
      setGroupedIngredients(() => {
        const newList = { ...groupedIngredients };
        newList[activeContainerId].ingredients = newItems;
        return newList;
      });
    }
  }

  function handleGroupAdd() {
    if (props.recipe?.id) {
      addGroup({ name: "New Group", recipeId: props.recipe.id }).then(
        (result) => {
          if (result.data) {
            const { id, name } = result.data.createRecipeIngredientGroup;
            setGroupedIngredients((prev) => ({
              ...prev,
              [id]: { name, ingredients: [] },
            }));
          }
        }
      );
    }
  }

  function onItemEdit(ingredient: RecipeIngredientFieldsFragment) {
    console.log("Parent on edit");
    const groupId = ingredient.group?.id ?? DEFAULT_KEY;
    if (groupedIngredients) {
      setGroupedIngredients({
        ...groupedIngredients,
        [groupId]: {
          name: groupedIngredients[groupId].name,
          ingredients: groupedIngredients[groupId].ingredients.map(
            (oldIngredient) => {
              if (ingredient.id === oldIngredient.id) {
                return ingredient;
              }
              return oldIngredient;
            }
          ),
        },
      });
    }
  }
  function onItemDelete(groupId: string, id: string) {
    if (groupedIngredients) {
      setGroupedIngredients({
        ...groupedIngredients,
        [groupId]: {
          name: groupedIngredients[groupId].name,
          ingredients: groupedIngredients[groupId].ingredients.filter(
            (ingredient) => ingredient.id !== id
          ),
        },
      });
    }
  }

  function onGroupEdit(
    result: EditIngredientGroupMutation["editRecipeIngredientGroup"]
  ) {
    const groupId = result.id;
    if (groupedIngredients) {
      setGroupedIngredients({
        ...groupedIngredients,
        [groupId]: {
          name: result.name,
          ingredients: groupedIngredients[groupId].ingredients,
        },
      });
    }
  }

  function onGroupDelete(groupId: string) {
    if (groupedIngredients) {
      const { [groupId]: _, ...rest } = groupedIngredients;
      const orphanedIngredients = groupedIngredients[groupId].ingredients;
      const { name, ingredients } = groupedIngredients[DEFAULT_KEY];
      setGroupedIngredients({
        ...rest,
        [DEFAULT_KEY]: {
          name,
          ingredients: [...ingredients, ...orphanedIngredients],
        },
      });
    }
  }

  return (
    <div>
      <Button onClick={handleGroupAdd}>Add New Group</Button>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-autofit-horizontal gap-6">
          {groupedIngredients &&
            Object.entries(groupedIngredients).map(
              ([groupId, group], index) => {
                return (
                  <EditIngredientGroup
                    key={groupId}
                    groupId={groupId}
                    groupName={group.name}
                    ingredients={group.ingredients}
                    index={index}
                    onItemEdit={onItemEdit}
                    onItemDelete={onItemDelete}
                    onGroupEdit={onGroupEdit}
                    onGroupDelete={onGroupDelete}
                  />
                );
              }
            )}
        </div>
      </DndContext>
    </div>
  );
});
