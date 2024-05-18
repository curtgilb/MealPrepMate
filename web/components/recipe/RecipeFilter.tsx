"use client";
import CategoryFilter from "@/components/recipe/filters/CategoryFilter";
import CourseFilter from "@/components/recipe/filters/CourseFilter";
import CuisineFilter from "@/components/recipe/filters/CuisineFIlter";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { NumericalComparison } from "@/gql/graphql";
import { useState } from "react";
import NumericalFilter from "./NumericalFilter";
import { Button } from "../ui/button";
import { Filter, FilterX, X } from "lucide-react";

export default function RecipeFilter() {
  const [servings, setServings] = useState<NumericalComparison>();

  return (
    <div>
      <div className="flex gap-2 my-6">
        <Button>
          <Filter className="mr-2 h-4 w-4" />
          Apply
        </Button>
        <Button variant="outline">
          <FilterX className="mr-2 h-4 w-4" />
          Clear all
        </Button>
      </div>
      <Accordion type="single" collapsible>
        <AccordionItem value="recipe">
          <AccordionTrigger>Recipe</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-4">
              <NumericalFilter
                id="servings"
                name="Number of Servings"
                setState={setServings}
              />
              <NumericalFilter
                id="prepTime"
                name="Preparation Time"
                setState={setServings}
              />
              <NumericalFilter
                id="cookTime"
                name="Cooking Time"
                setState={setServings}
              />
              <NumericalFilter
                id="servings"
                name="Marinade Time"
                setState={setServings}
              />
              <NumericalFilter
                id="totalTime"
                name="Total Time"
                setState={setServings}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="courses">
          <AccordionTrigger>Servings</AccordionTrigger>
          <AccordionContent>
            <CourseFilter />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="cuisines">
          <AccordionTrigger>Cuisine</AccordionTrigger>
          <AccordionContent>
            <CuisineFilter />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="category">
          <AccordionTrigger>Category</AccordionTrigger>
          <AccordionContent>
            <CategoryFilter />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
