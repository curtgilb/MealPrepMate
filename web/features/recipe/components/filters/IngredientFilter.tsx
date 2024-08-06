import { FilterChildProp } from "../RecipeFilter";
import NumericalFilter from "@/components/recipe/NumericalFilter";
import { IngredientPicker } from "@/components/pickers/IngredientPicker";
import { UnitPicker } from "@/components/pickers/UnitPicker";

export function IngredientFilter({
  filter,
  updateFilter,
}: FilterChildProp<"ingredientFilters">) {
  return (
    <div>
      <IngredientPicker
        select={(item) => {
          updateFilter("ingredientFilters", [...filter, item]);
        }}
        create={false}
        deselect={(item) => {
          updateFilter(
            "ingredientFilters",
            filter.filter((selected) => selected.id !== item.id)
          );
        }}
        selectedIds={filter.map((ingredient) => ingredient.id)}
        placeholder="Select ingredients..."
        multiselect={true}
      />

      {filter.map((ingredient) => {
        return (
          <div key={ingredient.id}>
            <NumericalFilter
              id={ingredient.id}
              name={ingredient.name}
              min={ingredient.filter?.amount?.gte}
              max={ingredient.filter?.amount?.lte}
              onChange={(update) => {
                updateFilter(
                  "ingredientFilters",
                  filter.map((oldIngredient) => {
                    if (oldIngredient.id === ingredient.id) {
                      const oldFilter = oldIngredient.filter;
                      return {
                        ...oldIngredient,
                        filter: {
                          ingredientID: ingredient.id,
                          amount: update,
                          unitId: oldFilter?.unitId,
                        },
                      };
                    }
                    return oldIngredient;
                  })
                );
              }}
            />
            <UnitPicker
              selectedIds={[ingredient.filter?.unitId ?? ""]}
              create={false}
              placeholder="Unit"
              multiselect={false}
              select={(unit) => {
                updateFilter(
                  "ingredientFilters",
                  filter.map((old) => {
                    if (old.id === ingredient.id) {
                      return {
                        ...old,
                        filter: {
                          ingredientID: ingredient.id,
                          amount: old.filter?.amount,
                          unitId: unit.id,
                        },
                      };
                    }
                    return old;
                  })
                );
              }}
              deselect={(unit) => {
                updateFilter(
                  "ingredientFilters",
                  filter.map((old) => {
                    if (old.id === ingredient.id) {
                      return {
                        ...old,
                        filter: {
                          ingredientID: ingredient.id,
                          amount: old.filter?.amount,
                          unitId: unit.id,
                        },
                      };
                    }
                    return old;
                  })
                );
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
