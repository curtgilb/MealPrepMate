"use client";

import { useFragment } from "@/gql";
import { RecipeIngredientFragmentFragment } from "@/gql/graphql";
import { DndContext, DragEndEvent, DragOverEvent } from "@dnd-kit/core";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { Button } from "@/components/ui/button";
import { RecipeIngredientFragment } from "@/features/recipe/api/RecipeIngredient";
import {
  EditRecipeProps,
  EditRecipeSubmit,
} from "@/features/recipe/components/edit/RecipeEditor";
import { EditIngredientGroup } from "@/features/recipe/components/edit/ingredient_groups/EditIngredientGroup";
import {
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useState } from "react";

export const EditIngredientGroups = forwardRef<
  EditRecipeSubmit,
  EditRecipeProps
>(function EditIngredientGroups(props, ref) {
  const ingredients = useFragment(
    RecipeIngredientFragment,
    props.recipe?.ingredients
  );

  const groupNames = useRef<{ [key: string]: string }>({});

  const [groupedIngredients, setGroupedIngredients] = useState(
    ingredients?.reduce((acc, ingredient) => {
      const groupId = ingredient.group?.id ?? "primary";
      if (!Object.hasOwn(acc, groupId)) {
        acc[groupId] = [];
      }
      acc[groupId].push(ingredient);

      if (ingredient.group?.id) {
        groupNames.current[ingredient.group.id] = ingredient.group.name;
      }
      return acc;
    }, {} as { [key: string]: RecipeIngredientFragmentFragment[] })
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
      const { containerId: activeContainerId, index: activeIndex } =
        active.data.current?.sortable;
      const { containerId: overContainerId, index: overIndex } =
        over?.data.current?.sortable;

      if (active && over && activeContainerId !== overContainerId) {
        // Remove the old item and place it in the new one
        setGroupedIngredients((prev) => {
          if (!prev) return undefined;
          return {
            ...prev,
            [activeContainerId]: [
              ...prev[activeContainerId].filter(
                (item) => item.id !== active.id
              ),
            ],
            [overContainerId]: [
              ...prev[overContainerId].slice(0, overIndex),
              groupedIngredients[activeContainerId][activeIndex],
              ...prev[overContainerId].slice(
                overIndex,
                prev[overContainerId].length
              ),
            ],
          };
        });
      }
    }
  }

  // This will save it in the same container
  function handleDragEnd(event: DragEndEvent) {
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
      const items = groupedIngredients[activeContainerId];
      const newItems = arrayMove(items, activeIndex, overIndex);
      setGroupedIngredients(() => {
        const newList = { ...groupedIngredients };
        newList[activeContainerId] = newItems;
        return newList;
      });
    }
  }

  return (
    <div>
      <Button>Add New Group</Button>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-autofit-horizontal gap-6">
          {groupedIngredients &&
            Object.entries(groupedIngredients).map(
              ([groupId, ingredients], index) => {
                return (
                  <EditIngredientGroup
                    key={groupId}
                    groupId={groupId}
                    groupName={groupNames.current["groupId"]}
                    ingredients={ingredients}
                    index={index}
                  />
                );
              }
            )}
        </div>
      </DndContext>
    </div>
  );
});
