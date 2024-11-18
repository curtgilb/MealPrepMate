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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { MetadataFilter } from "@/features/recipe/components/filters/MetadataFilter";
import NumericalFilter, {
  numericalFilterSchema,
} from "@/features/recipe/components/NumericalFilter";
import { RecipeFilter as RecipeFilterInput } from "@/gql/graphql";
import { zodResolver } from "@hookform/resolvers/zod";

interface RecipeFilterProps extends HTMLAttributes<HTMLDivElement> {
  setFilter: Dispatch<SetStateAction<RecipeFilterInput>>;
}

const ingredientFilterValidation = z.object({
  ingredientId: z.string(),
  amount: numericalFilterSchema,
});

const nutrientFilterValidation = z.object({
  nutrientId: z.string(),
  perServing: z.boolean(),
  target: numericalFilterSchema,
});

const macroFilterValidation = z.object({
  caloriePerServing: numericalFilterSchema,
  carbPerServing: numericalFilterSchema,
  fatPerServing: numericalFilterSchema,
  alcoholPerServing: numericalFilterSchema,
  proteinPerServing: numericalFilterSchema,
});

const filterValidation = z.object({
  categoryIds: z.string().array().nullish(),
  cookTime: z.number().nonnegative().nullish(),
  courseIds: z.string().array().nullish(),
  cuisineIds: z.string().array().nullish(),
  ingredientFilters: ingredientFilterValidation.array().nullish(),
  ingredientFreshDays: z.number().nonnegative().nullish(),
  isFavorite: z.boolean().nullish(),
  leftoverFreezerLife: numericalFilterSchema,
  leftoverFridgeLife: numericalFilterSchema,
  macroFilter: macroFilterValidation.nullish(),
  marinadeTime: numericalFilterSchema,
  numOfServings: numericalFilterSchema,
  nutrientFilters: nutrientFilterValidation.array().nullish(),
  prepTime: numericalFilterSchema,
  searchTerm: z.string().nullish(),
  totalPrepTime: numericalFilterSchema,
});

type FilterValidation = z.infer<typeof filterValidation>;

export function RecipeFilter({ setFilter, ...rest }: RecipeFilterProps) {
  const form = useForm<FilterValidation>({
    resolver: zodResolver(filterValidation),
    defaultValues: {
      categoryIds: [],
      cookTime: null,
      courseIds: [],
      cuisineIds: [],
      ingredientFilters: [],
      ingredientFreshDays: null,
      isFavorite: null,
      leftoverFreezerLife: { lte: undefined, gte: undefined },
      leftoverFridgeLife: { lte: undefined, gte: undefined },
      macroFilter: undefined,
      marinadeTime: { lte: undefined, gte: undefined },
      numOfServings: { lte: undefined, gte: undefined },
      nutrientFilters: [],
      prepTime: { lte: undefined, gte: undefined },
      searchTerm: null,
      totalPrepTime: { lte: undefined, gte: undefined },
    },
  });

  return (
    <Form {...form}>
      <form>
        <NumericalFilter
          form={form}
          id="numOfServings"
          label="Number of Servings"
        />
        <div className="grid grid-cols-2 gap-2 my-6">
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
                <MetadataFilter />
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="macros">
            <AccordionTrigger>Macros</AccordionTrigger>

            <AccordionContent>
              {/* <FormField
                control={form.control}
                name="numOfServings"
                render={({ field }) => (
                  <FormItem>
                    <NumericalFilter
                      id="protein"
                      name="Protein per serving (g)"
                      minMax={field.value}
                      onChange={(update) => {
                        // handleFilterUpdate("macroFilter", {
                        //   ...filter.macroFilter,
                        //   protienPerServing: update,
                        // });
                      }}
                    />
                  </FormItem>
                )}
              /> */}

              {/* <FormField
                control={form.control}
                name="numOfServings"
                render={({ field }) => (
                  <FormItem>

                  </FormItem>
                )}
              /> */}
              {/* 
              <NumericalFilter
                id="carbs"
                name="Carbohydrates per serving (g)"
                minMax={field.value}
                onChange={(update) => {
                  // handleFilterUpdate("macroFilter", {
                  //   ...filter.macroFilter,
                  //   carbPerServing: update,
                  // });
                }}
              ></NumericalFilter>
              <NumericalFilter
                id="fat"
                name="Fat per serving (g)"
                minMax={field.value}
                onChange={(update) => {
                  // handleFilterUpdate("macroFilter", {
                  //   ...filter.macroFilter,
                  //   fatPerServing: update,
                  // });
                }}
              ></NumericalFilter>
              <NumericalFilter
                id="alcohol"
                name="Alcohol per serving (g)"
                minMax={field.value}
                onChange={(update) => {
                  // handleFilterUpdate("macroFilter", {
                  //   ...filter.macroFilter,
                  //   alcoholPerServing: update,
                  // });
                }}
              ></NumericalFilter> */}
            </AccordionContent>
          </AccordionItem>
          {/* <AccordionItem value="nutrients">
            <AccordionTrigger>Nutrients</AccordionTrigger>

            <AccordionContent>
              <NutritionFilter
                filter={nutrientFilters}
                // updateFilter={handleFilterUpdate}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="ingredients">
            <AccordionTrigger>Ingredients</AccordionTrigger>

            <AccordionContent>
              <IngredientFilter
                filter={filter.ingredientFilters}
                // updateFilter={handleFilterUpdate}
              />
            </AccordionContent>
          </AccordionItem> */}

          <AccordionItem value="time">
            <AccordionTrigger>Time</AccordionTrigger>
            <AccordionContent>
              <div className="grid gap-4">
                {/* <TimeNumberInput
                  id="prepTime"
                  label="Preparation time (max)"
                  value={filter.prepTime?.lte ?? 0}
                  onUpdate={(update) => {
                    // handleFilterUpdate("prepTime", { lte: update });
                  }}
                />
                <TimeNumberInput
                  id="marinadeTime"
                  label="Marinade time (max)"
                  value={filter.marinadeTime?.lte ?? 0}
                  onUpdate={(update) => {
                    // handleFilterUpdate("marinadeTime", { lte: update });
                  }}
                />
                <TimeNumberInput
                  id="cookTime"
                  label="Cook time (max)"
                  value={filter.cookTime?.lte ?? 0}
                  onUpdate={(update) => {
                    // handleFilterUpdate("cookTime", { lte: update });
                  }}
                />
                <TimeNumberInput
                  id="totalTime"
                  label="Total Time (max)"
                  value={filter.totalPrepTime?.lte ?? 0}
                  onUpdate={(update) => {
                    // handleFilterUpdate("totalPrepTime", { lte: update });
                  }}
                /> */}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </form>
    </Form>
  );
}
