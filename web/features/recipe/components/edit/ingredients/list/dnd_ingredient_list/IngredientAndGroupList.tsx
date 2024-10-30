import { IngredientGroup } from "@/features/recipe/components/edit/ingredients/list/dnd_ingredient_list/IngredientGroup";
import { IngredientsContext } from "@/features/recipe/hooks/useGroupedRecipeIngredients";
import { RecipeIngredientFieldsFragment } from "@/gql/graphql";
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
import { useContext, useState } from "react";

export function IngredientAndGroupList() {
  const context = useContext(IngredientsContext);
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
  if (context === undefined) {
    return null;
  }
  const {
    groupedIngredients,
    setGroupedIngredients,
    groupOrder,
    setGroupOrder,
    activeIngredient,
    setActiveIngredient,
  } = context;

  const findContainer = (id: string): string | undefined => {
    if (id in groupedIngredients) return id;

    for (const [key, items] of Object.entries(groupedIngredients)) {
      if (items.find((item) => item.id === id)) return key;
    }

    return undefined;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeType = active.data.current?.type || "item";
    setActiveId(active.id.toString());
    setActiveType(activeType);
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
      const activeItems = prev[activeContainer];
      const overItems = prev[overContainer];

      const activeIndex = activeItems.findIndex((item) => item.id === activeId);
      const overIndex = overItems.length;

      return {
        ...prev,
        [activeContainer]: [
          ...prev[activeContainer].filter((item) => item.id !== activeId),
        ],
        [overContainer]: [
          ...prev[overContainer].slice(0, overIndex),
          activeItems[activeIndex],
          ...prev[overContainer].slice(overIndex),
        ],
      };
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      setActiveType(null);
      return;
    }

    const activeId = active.id.toString();
    const overId = over.id.toString();

    // Handle container sorting
    if (active.data.current?.type === "container") {
      const oldIndex = groupOrder.indexOf(activeId);
      const newIndex = groupOrder.indexOf(overId);

      if (oldIndex !== newIndex) {
        setGroupOrder(arrayMove(groupOrder, oldIndex, newIndex));
      }
      setActiveId(null);
      setActiveType(null);
      return;
    }

    // Handle item sorting
    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    if (!activeContainer || !overContainer) {
      setActiveId(null);
      setActiveType(null);
      return;
    }

    if (activeId !== overId) {
      setGroupedIngredients((prev) => {
        const activeItems = prev[activeContainer];
        const overItems = prev[overContainer];

        const activeIndex = activeItems.findIndex(
          (item) => item.id === activeId
        );
        let overIndex = overItems.findIndex((item) => item.id === overId);

        if (overId === overContainer || overIndex === -1) {
          overIndex = overItems.length;
        }

        if (activeContainer === overContainer) {
          return {
            ...prev,
            [activeContainer]: arrayMove(activeItems, activeIndex, overIndex),
          };
        }

        return {
          ...prev,
          [activeContainer]: [
            ...prev[activeContainer].filter((item) => item.id !== activeId),
          ],
          [overContainer]: [
            ...prev[overContainer].slice(0, overIndex),
            activeItems[activeIndex],
            ...prev[overContainer].slice(overIndex),
          ],
        };
      });
    }

    setActiveId(null);
    setActiveType(null);
  };

  const getActiveItem = (): RecipeIngredientFieldsFragment | undefined => {
    if (!activeId || activeType === "container") return undefined;

    const activeContainer = findContainer(activeId);
    if (!activeContainer) return undefined;

    return groupedIngredients[activeContainer].find(
      (item) => item.id === activeId
    );
  };

  return (
    <div className="flex flex-col gap-4">
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
              id={containerId}
              items={groupedIngredients[containerId]}
            />
          ))}
        </SortableContext>

        <DragOverlay>
          {activeId && activeType === "item" ? (
            <div className="p-4 bg-white rounded shadow cursor-grabbing">
              {getActiveItem()?.sentence}
            </div>
          ) : null}
          {activeId && activeType === "container" ? (
            <div className="w-64 p-4 bg-gray-100 rounded-lg opacity-80">
              <h2 className="mb-4 text-lg font-semibold">
                Container {activeId}
              </h2>
              {groupedIngredients[activeId].map((item) => (
                <div key={item.id} className="p-4 mb-2 bg-white rounded shadow">
                  {item?.sentence}
                </div>
              ))}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
