"use client";

import { Filter, FilterX } from "lucide-react";
import { Dispatch, HTMLAttributes, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { getCategoriesQuery } from "@/features/recipe/api/Category";
import { getCoursesQuery } from "@/features/recipe/api/Course";
import { getCuisinesQuery } from "@/features/recipe/api/Cuisine";
import {
  basicItemListSchema,
  CheckboxFilter,
} from "@/features/recipe/components/filters/CheckboxFilter";
import {
  IngredientFilter,
  ingredientFilterValidation,
} from "@/features/recipe/components/filters/IngredientFilter";
import {
  nutrientFilterValidation,
  NutritionFilter,
} from "@/features/recipe/components/filters/NutrientFilter";
import NumericalFilter, {
  numericalFilterSchema,
} from "@/features/recipe/components/NumericalFilter";
import {
  GetCategoriesQuery,
  GetCoursesQuery,
  GetCuisinesQuery,
  RecipeFilter as RecipeFilterInput,
} from "@/gql/graphql";
import { zodResolver } from "@hookform/resolvers/zod";

interface RecipeFilterProps extends HTMLAttributes<HTMLDivElement> {
  setFilter: Dispatch<SetStateAction<RecipeFilterInput>>;
}

const filterValidation = z.object({
  cookTime: numericalFilterSchema,
  categoryIds: basicItemListSchema,
  courseIds: basicItemListSchema,
  cuisineIds: basicItemListSchema,
  ingredientFilters: ingredientFilterValidation,
  ingredientFreshDays: numericalFilterSchema,
  isFavorite: z.boolean().nullish(),
  leftoverFreezerLife: numericalFilterSchema,
  leftoverFridgeLife: numericalFilterSchema,
  caloriePerServing: numericalFilterSchema,
  carbPerServing: numericalFilterSchema,
  fatPerServing: numericalFilterSchema,
  alcoholPerServing: numericalFilterSchema,
  proteinPerServing: numericalFilterSchema,
  marinadeTime: numericalFilterSchema,
  numOfServings: numericalFilterSchema,
  nutrientFilters: nutrientFilterValidation,
  prepTime: numericalFilterSchema,
  searchTerm: z.string().nullish(),
  totalPrepTime: numericalFilterSchema,
});

export type FilterValidationType = z.infer<typeof filterValidation>;

export function RecipeFilter({ setFilter, ...rest }: RecipeFilterProps) {
  const form = useForm<FilterValidationType>({
    resolver: zodResolver(filterValidation),
    defaultValues: {
      categoryIds: [],
      courseIds: [],
      cuisineIds: [],
      ingredientFilters: [],
      ingredientFreshDays: { lte: undefined, gte: undefined },
      isFavorite: null,
      leftoverFreezerLife: { lte: undefined, gte: undefined },
      leftoverFridgeLife: { lte: undefined, gte: undefined },
      caloriePerServing: { lte: undefined, gte: undefined },
      carbPerServing: { lte: undefined, gte: undefined },
      fatPerServing: { lte: undefined, gte: undefined },
      alcoholPerServing: { lte: undefined, gte: undefined },
      proteinPerServing: { lte: undefined, gte: undefined },
      numOfServings: { lte: undefined, gte: undefined },
      nutrientFilters: [],
      prepTime: { lte: undefined, gte: undefined },
      cookTime: { lte: undefined, gte: undefined },
      marinadeTime: { lte: undefined, gte: undefined },
      totalPrepTime: { lte: undefined, gte: undefined },
      searchTerm: null,
    },
  });

  function onApply(values: FilterValidationType) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onApply)}>
        <div className="grid grid-cols-2 gap-2 my-6">
          <Button type="submit">
            <Filter className="mr-2 h-4 w-4" />
            Apply
          </Button>
          <Button
            type="reset"
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              form.reset();
            }}
          >
            <FilterX className="mr-2 h-4 w-4" />
            Clear all
          </Button>
        </div>

        <Accordion type="single" collapsible>
          <AccordionItem value="general">
            <AccordionTrigger>General</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-8 px-2">
                {/* Categories */}
                <CheckboxFilter
                  query={getCategoriesQuery}
                  render={(item: GetCategoriesQuery["categories"][number]) => ({
                    id: item.id,
                    label: item.name,
                  })}
                  getList={(data) => data?.categories}
                  title="Categories"
                  name="categoryIds"
                />

                {/* Courses */}
                <CheckboxFilter
                  query={getCoursesQuery}
                  render={(item: GetCoursesQuery["courses"][number]) => ({
                    id: item.id,
                    label: item.name,
                  })}
                  getList={(data) => data?.courses}
                  title="Courses"
                  name="courseIds"
                />

                {/* Cuisines */}
                <CheckboxFilter
                  query={getCuisinesQuery}
                  render={(item: GetCuisinesQuery["cuisines"][number]) => ({
                    id: item.id,
                    label: item.name,
                  })}
                  getList={(data) => data?.cuisines}
                  title="Cuisines"
                  name="cuisineIds"
                />
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="macros">
            <AccordionTrigger>Macros</AccordionTrigger>

            <AccordionContent>
              <NumericalFilter<FilterValidationType>
                id="numOfServings"
                label="Number of Servings"
              />

              <NumericalFilter<FilterValidationType>
                id="caloriePerServing"
                label="Calories per serving"
              />
              <NumericalFilter<FilterValidationType>
                id="carbPerServing"
                label="Number of Servings"
              />
              <NumericalFilter<FilterValidationType>
                id="fatPerServing"
                label="Fat (g) per serving"
              />
              <NumericalFilter<FilterValidationType>
                id="proteinPerServing"
                label="Protein (g) per serving"
              />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="nutrients">
            <AccordionTrigger>Nutrients</AccordionTrigger>

            <AccordionContent>
              <NutritionFilter<FilterValidationType> id="nutrientFilters" />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="ingredients">
            <AccordionTrigger>Ingredients</AccordionTrigger>

            <AccordionContent>
              <IngredientFilter />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="time">
            <AccordionTrigger>Time</AccordionTrigger>
            <AccordionContent className="flex flex-col">
              <div className="grid gap-4">
                <NumericalFilter<FilterValidationType>
                  id="prepTime"
                  label="Prep time (mins)"
                />
                <NumericalFilter<FilterValidationType>
                  id="marinadeTime"
                  label="Marinade time (mins)"
                />
                <NumericalFilter<FilterValidationType>
                  id="cookTime"
                  label="Cook Time (mins)"
                />
                <NumericalFilter<FilterValidationType>
                  id="totalPrepTime"
                  label="Total Time (mins)"
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </form>
    </Form>
  );
}
