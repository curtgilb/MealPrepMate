"use client";
import { BasicMultiSelect } from "@/components/BasicMultiSelect";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  EditRecipeProps,
  EditRecipeSubmit,
} from "@/features/recipe/components/edit/RecipeEditor";
import {
  GetCategoriesDocument,
  GetCoursesDocument,
  GetCuisinesDocument,
} from "@/gql/graphql";
import { zodResolver } from "@hookform/resolvers/zod";
import { forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const BasicItem = z.object({
  id: z.string(),
  name: z.string(),
});

const recipeInputValidation = z.object({
  title: z.string(),
  source: z.string().trim().optional(),
  prepTime: z.number(),
  cookTime: z.coerce.number().optional(),
  marinadeTime: z.coerce.number().optional(),
  directions: z.string().optional(),
  notes: z.string().optional(),
  leftoverFridgeLife: z.coerce.number().int().positive().optional(),
  leftoverFreezerLife: z.coerce.number().int().positive().optional(),
  ingredients: z.string().optional(),
  cuisine: z.array(BasicItem),
  category: z.array(BasicItem),
  course: z.array(BasicItem),
  photos: z.array(BasicItem),
});

export const EditRecipeInfo = forwardRef<EditRecipeSubmit, EditRecipeProps>(
  function EditIngredients({ recipe }, ref) {
    const form = useForm<z.infer<typeof recipeInputValidation>>({
      resolver: zodResolver(recipeInputValidation),
      defaultValues: {
        title: recipe?.name ?? "",
        source: recipe?.source ?? "",
        prepTime: recipe?.prepTime ?? undefined,
        cookTime: recipe?.cookTime ?? undefined,
        marinadeTime: recipe?.marinadeTime ?? undefined,
        directions: recipe?.directions ?? undefined,
        notes: recipe?.notes ?? undefined,
        leftoverFridgeLife: recipe?.leftoverFridgeLife ?? 0,
        leftoverFreezerLife: recipe?.leftoverFreezerLife ?? undefined,
        ingredients: undefined,
        cuisine: recipe?.cuisine ?? [],
        category: recipe?.category ?? [],
        course: recipe?.course ?? [],
        photos: recipe?.photos ?? [],
      },
    });

    useImperativeHandle(ref, () => ({
      submit(postSubmit) {
        form.handleSubmit(
          (values: z.infer<typeof recipeInputValidation>) => {
            console.log("Form is valid. Values:", values);
            postSubmit();
          },
          (errors) => {
            console.log("Form is invalid. Errors:", errors);
          }
        )();
      },
    }));

    return (
      <div className="">
        <Form {...form}>
          <form className="">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="max-w-96">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name of Recipe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="source"
              render={({ field }) => (
                <FormItem className="max-w-96">
                  <FormLabel>Source</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="ingredients"
                render={({ field }) => (
                  <FormItem className="row-span-2 flex flex-col gap-2">
                    <FormLabel>Ingredients</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Ingredient list"
                        className="resize-none grow"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="directions"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Directions</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us a little bit about yourself"
                        className="resize-none min-h-96"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us a little bit about yourself"
                        className="resize-none min-h-72"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="cuisine"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cuisine</FormLabel>
                  <FormControl>
                    <BasicMultiSelect
                      queryDocument={GetCuisinesDocument}
                      listKey={"cuisines"}
                      defaultValue={field.value}
                      onChange={(value) => {
                        form.setValue("cuisine", value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cuisine</FormLabel>
                  <FormControl>
                    <BasicMultiSelect
                      queryDocument={GetCategoriesDocument}
                      listKey={"categories"}
                      defaultValue={field.value}
                      onChange={(value) => {
                        form.setValue("category", value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="course"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Courses</FormLabel>
                  <FormControl>
                    <BasicMultiSelect
                      queryDocument={GetCoursesDocument}
                      listKey={"courses"}
                      defaultValue={field.value}
                      onChange={(value) => {
                        form.setValue("course", value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="prepTime"
              render={({ field }) => (
                <FormItem className="max-w-20">
                  <FormLabel>Prep Time</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="marinadeTime"
              render={({ field }) => (
                <FormItem className="max-w-20">
                  <FormLabel>Rest Time</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cookTime"
              render={({ field }) => (
                <FormItem className="max-w-20">
                  <FormLabel>Cook Time</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="leftoverFridgeLife"
              render={({ field }) => (
                <FormItem className="max-w-20">
                  <FormLabel>Fridge Life</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="leftoverFridgeLife"
              render={({ field }) => (
                <FormItem className="max-w-20">
                  <FormLabel>Freezer Life</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
    );
  }
);
