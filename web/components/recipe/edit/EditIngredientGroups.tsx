"use client";
import {
  EditRecipeProps,
  EditRecipeSubmit,
} from "@/app/recipes/[id]/edit/page";
import { useFragment } from "@/gql";
import { RecipeIngredientFragmentFragment } from "@/gql/graphql";
import {
  getRecipeIngredients,
  RecipeIngredientFragment,
} from "@/graphql/recipe/queries";
import { useQuery } from "@urql/next";
import { forwardRef, ReactNode, useImperativeHandle, useRef } from "react";
import {
  DndContext,
  DragOverEvent,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";

import React, { useState } from "react";
import {
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  useSortable,
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  rectSortingStrategy,
} from "@dnd-kit/sortable";

export const EditIngredientGroups = forwardRef<
  EditRecipeSubmit,
  EditRecipeProps
>(function EditIngredientGroups(props, ref) {
  const [result] = useQuery({
    query: getRecipeIngredients,
    variables: { id: props.recipeId },
  });

  const ingredients = useFragment(
    RecipeIngredientFragment,
    result.data?.recipe.ingredients
  );

  const groupNames = useRef<{ [key: string]: string }>({});
  const [groupedIngredients, setGroupedIngredients] = useState(
    ingredients?.reduce((acc, ingredient) => {
      const groupId = ingredient.group?.id ?? "";
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
      console.log("child method");
      postSubmit();
    },
  }));

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragOver={handleDragOver}
      onDragEnd={(e) => {
        console.log("end", e);
      }}
    >
      {groupedIngredients &&
        Object.entries(groupedIngredients).map(([groupId, ingredients]) => {
          return (
            <IngredientGroup
              key={groupId}
              groupId={groupId}
              groupName={groupNames.current["groupId"]}
              ingredients={ingredients}
            />
          );
        })}
    </DndContext>
  );

  // onDragOver
  // Former Position
  // active.data.current.sortable.containerId .index
  // active.id

  // new position
  // over.id
  // over.data.current.sortable.conatinerId .index

  function handleDragOver(event: DragOverEvent) {
    if (groupedIngredients) {
      const { containerId, index } = event.over?.data?.current?.sortable;
      const newList = groupedIngredients[containerId];
      if (containerId && (index !== undefined || index !== null) && newList) {
        newList.splice(index, 0);
        setGroupedIngredients(groupedIngredients);
      }
    }
  }

  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      // setItems((items) => {
      //   const oldIndex = items.indexOf(active.id);
      //   const newIndex = items.indexOf(over.id);

      //   return arrayMove(items, oldIndex, newIndex);
      // });
      console.log("move");
    }
  }
});

interface IngredientGroupProps {
  groupId: string;
  groupName: string;
  ingredients: RecipeIngredientFragmentFragment[];
}

function IngredientGroup({
  groupId,
  groupName,
  ingredients,
}: IngredientGroupProps) {
  return (
    <div className="bg-white rounded-md p-4">
      <p className="font-semibold">
        {groupName} {groupId}
      </p>
      <SortableContext
        id={groupId}
        items={ingredients}
        strategy={verticalListSortingStrategy}
      >
        <ol className="bg-muted p-4">
          {ingredients.map((ingredient) => (
            <IngredientLine
              key={ingredient.id}
              id={ingredient.id}
              sentence={ingredient.sentence}
            />
          ))}
        </ol>
      </SortableContext>
    </div>
  );
}

interface IngredientLineProps {
  id: string;
  sentence: string;
}

function IngredientLine({ sentence, id }: IngredientLineProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {sentence} {id}
    </li>
  );
}
