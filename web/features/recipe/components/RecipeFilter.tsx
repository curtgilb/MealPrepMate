"use client";
import { CategoryFilter } from "@/components/recipe/filters/CategoryFilter";
import { CourseFilter } from "@/components/recipe/filters/CourseFilter";
import { CuisineFilter } from "@/components/recipe/filters/CuisineFIlter";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { NumericalComparison, Recipe } from "@/gql/graphql";
import { useState, Dispatch, SetStateAction, HTMLAttributes } from "react";
import NumericalFilter from "./NumericalFilter";
import { Button } from "../ui/button";
import { Filter, FilterX, X } from "lucide-react";
import { NutritionFilter } from "./filters/NutrientFilter";
import { TimeNumberInput } from "../ui/time-number-input";
import { RecipeSearchFilter } from "../mealplan/RecipeSearch";
import { IngredientFilter } from "./filters/IngredientFilter";

interface RecipeFilterProps extends HTMLAttributes<HTMLDivElement> {
  filter: RecipeSearchFilter;
  setFilter: Dispatch<SetStateAction<RecipeSearchFilter>>;
}

export interface FilterChildProp<K extends keyof RecipeSearchFilter> {
  filter: RecipeSearchFilter[K];
  updateFilter: (prop: K, value: RecipeSearchFilter[K]) => void;
}

export default function RecipeFilter({
  filter,
  setFilter,
  ...divAttributes
}: RecipeFilterProps) {
  function handleFilterUpdate<K extends keyof RecipeSearchFilter>(
    prop: K,
    value: RecipeSearchFilter[K]
  ) {
    setFilter({ ...filter, [prop]: value });
  }

  return (
    <div {...divAttributes}>
      <div className="flex gap-2 my-6">
        <Button onClick={() => {}}>
          <Filter className="mr-2 h-4 w-4" />
          Apply
        </Button>
        <Button variant="outline" onClick={() => {}}>
          <FilterX className="mr-2 h-4 w-4" />
          Clear all
        </Button>
      </div>

      <Accordion type="single" collapsible>
        <AccordionItem value="general">
          <AccordionTrigger>General</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-4">
              <NumericalFilter
                id="servings"
                name="Number of Servings"
                min={filter.numOfServings?.gte}
                max={filter.numOfServings?.lte}
                onChange={(update) => {
                  handleFilterUpdate("numOfServings", update);
                }}
              />
              <CategoryFilter />
              <CourseFilter />
              <CuisineFilter />
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="macros">
          <AccordionTrigger>Macros</AccordionTrigger>

          <AccordionContent>
            <NumericalFilter
              id="calorie"
              name="Calories per serving (g)"
              min={filter.macroFilter?.caloriePerServing?.gte}
              max={filter.macroFilter?.caloriePerServing?.lte}
              onChange={(update) => {
                handleFilterUpdate("macroFilter", {
                  ...filter.macroFilter,
                  caloriePerServing: update,
                });
              }}
            ></NumericalFilter>
            <NumericalFilter
              id="protein"
              name="Protein per serving (g)"
              min={filter.macroFilter?.caloriePerServing?.gte}
              max={filter.macroFilter?.caloriePerServing?.lte}
              onChange={(update) => {
                handleFilterUpdate("macroFilter", {
                  ...filter.macroFilter,
                  protienPerServing: update,
                });
              }}
            ></NumericalFilter>
            <NumericalFilter
              id="carbs"
              name="Carbohydrates per serving (g)"
              min={filter.macroFilter?.carbPerServing?.gte}
              max={filter.macroFilter?.carbPerServing?.lte}
              onChange={(update) => {
                handleFilterUpdate("macroFilter", {
                  ...filter.macroFilter,
                  carbPerServing: update,
                });
              }}
            ></NumericalFilter>
            <NumericalFilter
              id="fat"
              name="Fat per serving (g)"
              min={filter.macroFilter?.fatPerServing?.gte}
              max={filter.macroFilter?.fatPerServing?.lte}
              onChange={(update) => {
                handleFilterUpdate("macroFilter", {
                  ...filter.macroFilter,
                  fatPerServing: update,
                });
              }}
            ></NumericalFilter>
            <NumericalFilter
              id="alcohol"
              name="Alcohol per serving (g)"
              min={filter.macroFilter?.alcoholPerServing?.gte}
              max={filter.macroFilter?.alcoholPerServing?.lte}
              onChange={(update) => {
                handleFilterUpdate("macroFilter", {
                  ...filter.macroFilter,
                  alcoholPerServing: update,
                });
              }}
            ></NumericalFilter>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="nutrients">
          <AccordionTrigger>Nutrients</AccordionTrigger>

          <AccordionContent>
            <NutritionFilter
              filter={filter.nutrientFilters}
              updateFilter={handleFilterUpdate}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="ingredients">
          <AccordionTrigger>Ingredients</AccordionTrigger>

          <AccordionContent>
            <IngredientFilter
              filter={filter.ingredientFilters}
              updateFilter={handleFilterUpdate}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="time">
          <AccordionTrigger>Time</AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-4">
              <TimeNumberInput
                id="prepTime"
                label="Preparation time (max)"
                value={filter.prepTime?.lte ?? 0}
                onUpdate={(update) => {
                  handleFilterUpdate("prepTime", { lte: update });
                }}
              />
              <TimeNumberInput
                id="marinadeTime"
                label="Marinade time (max)"
                value={filter.marinadeTime?.lte ?? 0}
                onUpdate={(update) => {
                  handleFilterUpdate("marinadeTime", { lte: update });
                }}
              />
              <TimeNumberInput
                id="cookTime"
                label="Cook time (max)"
                value={filter.cookTime?.lte ?? 0}
                onUpdate={(update) => {
                  handleFilterUpdate("cookTime", { lte: update });
                }}
              />
              <TimeNumberInput
                id="totalTime"
                label="Total Time (max)"
                value={filter.totalPrepTime?.lte ?? 0}
                onUpdate={(update) => {
                  handleFilterUpdate("totalPrepTime", { lte: update });
                }}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
