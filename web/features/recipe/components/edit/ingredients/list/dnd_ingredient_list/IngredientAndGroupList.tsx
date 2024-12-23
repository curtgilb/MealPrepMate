import { IngredientGroup } from "@/features/recipe/components/edit/ingredients/list/dnd_ingredient_list/IngredientGroup";
import {
  IngredientsContext,
  useRecipeIngredientContext,
} from "@/features/recipe/hooks/useGroupedRecipeIngredients";
import { RecipeIngredientFieldsFragment } from "@/gql/graphql";
import { cn } from "@/lib/utils";
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState } from "react";

export function IngredientAndGroupList() {
  const {
    groupedIngredients,
    setGroupedIngredients,
    groupOrder,
    setGroupOrder,
  } = useRecipeIngredientContext();
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<"container" | "item" | null>(
    null
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const findContainer = (id: string): string | undefined => {
    // First check if the id is a container
    if (groupOrder.includes(id)) return id;

    // Then look for the item in each container
    return groupOrder.find((containerId) =>
      groupedIngredients[containerId].items.some((item) => item.id === id)
    );
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeType = active.data.current?.type || "item";
    setActiveId(active.id.toString());
    setActiveType(activeType);
    setIsDragging(activeType === "container");
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();

    // Skip if dragging container
    if (active.data.current?.type === "container") return;

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer === overContainer
    ) {
      return;
    }

    setGroupedIngredients((prev) => {
      const activeItems = prev[activeContainer].items;
      const activeIndex = activeItems.findIndex((item) => item.id === activeId);
      const activeItem = activeItems[activeIndex];

      return {
        ...prev,
        [activeContainer]: {
          ...prev[activeContainer],
          items: prev[activeContainer].items.filter(
            (item) => item.id !== activeId
          ),
        },
        [overContainer]: {
          ...prev[overContainer],
          items: [...prev[overContainer].items, activeItem],
        },
      };
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) {
      setActiveId(null);
      setActiveType(null);
      setIsDragging(false);
      return;
    }

    const activeId = active.id.toString();
    const overId = over.id.toString();

    if (active.data.current?.type === "container") {
      const oldIndex = groupOrder.indexOf(activeId);
      const newIndex = groupOrder.indexOf(overId);

      if (oldIndex !== newIndex) {
        setGroupOrder(arrayMove(groupOrder, oldIndex, newIndex));
      }
    } else {
      const activeContainer = findContainer(activeId);
      const overContainer = findContainer(overId);

      if (!activeContainer || !overContainer) return;

      const activeItems = groupedIngredients[activeContainer].items;
      const overItems = groupedIngredients[overContainer].items;

      const activeIndex = activeItems.findIndex((item) => item.id === activeId);
      const overIndex = overItems.findIndex((item) => item.id === overId);

      if (activeContainer === overContainer) {
        // Same container sorting
        if (activeIndex !== overIndex) {
          setGroupedIngredients((prev) => ({
            ...prev,
            [activeContainer]: {
              ...prev[activeContainer],
              items: arrayMove(
                prev[activeContainer].items,
                activeIndex,
                overIndex
              ),
            },
          }));
        }
      } else {
        // Moving between containers
        const newOverIndex = overIndex === -1 ? overItems.length : overIndex;
        const itemToMove = activeItems[activeIndex];

        setGroupedIngredients((prev) => ({
          ...prev,
          [activeContainer]: {
            ...prev[activeContainer],
            items: prev[activeContainer].items.filter(
              (item) => item.id !== activeId
            ),
          },
          [overContainer]: {
            ...prev[overContainer],
            items: [
              ...prev[overContainer].items.slice(0, newOverIndex),
              itemToMove,
              ...prev[overContainer].items.slice(newOverIndex),
            ],
          },
        }));
      }
    }

    setActiveId(null);
    setActiveType(null);
    setIsDragging(false);
  };

  const getActiveItem = (): RecipeIngredientFieldsFragment | undefined => {
    if (!activeId || activeType === "container") return undefined;
    const activeContainer = findContainer(activeId);
    if (!activeContainer) return undefined;
    return groupedIngredients[activeContainer].items.find(
      (item) => item.id === activeId
    );
  };

  return (
    <div
      className={cn("flex flex-col gap-4 p-4 rounded-md", {
        "bg-black/50": isDragging,
      })}
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={groupOrder}
          strategy={verticalListSortingStrategy}
        >
          {groupOrder.map((containerId) => (
            <IngredientGroup
              key={containerId}
              name={groupedIngredients[containerId].name}
              id={containerId}
              items={groupedIngredients[containerId].items}
            />
          ))}
        </SortableContext>

        {/* <DragOverlay>
          {activeId && activeType === "item" ? (
            <div className="p-4 bg-white rounded shadow cursor-grabbing">
              {getActiveItem()?.sentence}
            </div>
          ) : null}
          {activeId && activeType === "container" ? (
            <div className="w-64 p-4 bg-gray-100 rounded-lg opacity-80">
              <h2 className="mb-4 text-lg font-semibold">
                {groupedIngredients[activeId].name}
              </h2>
              {groupedIngredients[activeId].items.map((item) => (
                <div key={item.id} className="p-4 mb-2 bg-white rounded shadow">
                  {item?.sentence}
                </div>
              ))}
            </div>
          ) : null}
        </DragOverlay> */}
      </DndContext>
    </div>
  );
}
