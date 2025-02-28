"use client";
import { forwardRef, useImperativeHandle } from "react";

import { GenericCombobox } from "@/components/combobox/GenericCombox1";
import { Hint } from "@/components/Hint";
import { ImagePicker } from "@/components/ImagePicker";
import { RichTextEditor } from "@/components/rich_text/RichTextEditor";
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
import { getCategoriesQuery } from "@/features/recipe/api/Category";
import { getCoursesQuery } from "@/features/recipe/api/Course";
import { getCuisinesQuery } from "@/features/recipe/api/Cuisine";
import {
  EditRecipeProps,
  EditRecipeSubmit,
} from "@/features/recipe/components/edit/RecipeEditor";
import { useRecipeInfoForm } from "@/features/recipe/hooks/useRecipeInfoForm";
import {
  GetCategoriesQuery,
  GetCoursesQuery,
  GetCuisinesQuery,
} from "@/gql/graphql";

export const BasicRecipeInfoFields = forwardRef<
  EditRecipeSubmit,
  EditRecipeProps
>(function BasicRecipeInfoFields({ recipe }, ref) {
  const { isFetching, handleSubmit, form } = useRecipeInfoForm(recipe);
  const isCreate = !recipe?.id;

  useImperativeHandle(ref, () => ({
    submit(postSubmit) {
      form.handleSubmit((values) => handleSubmit(values, postSubmit))();
    },
  }));

  return (
    <div>
      <Form {...form}>
        <form className="flex gap-x-24 gap-y-4">
          <div className="space-y-12">
            <FormField
              control={form.control}
              name="photos"
              render={({ field }) => (
                <FormItem className="max-w-96">
                  <FormLabel>Photos</FormLabel>
                  <FormControl>
                    <ImagePicker
                      images={field.value}
                      setImages={(images) => {
                        form.setValue("photos", images);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form?.control}
              name="ingredients"
              render={({ field }) => (
                <FormItem className=" w-full ">
                  <FormLabel className="flex items-center gap-x-2">
                    Ingredients
                    <Hint>
                      <p className="text-sm font-light">
                        Ingredients will be edited on the next page.
                      </p>
                    </Hint>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ingredient list"
                      className="resize-none min-h-[30rem]"
                      {...field}
                      disabled={!isCreate}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="max-w-prose space-y-6 justify-self-end">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
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
                <FormItem>
                  <FormLabel>Source</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between">
              <FormField
                control={form.control}
                name="prepTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prep Time (mins)</FormLabel>
                    <FormControl>
                      <Input className="max-w-24" type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="marinadeTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rest Time (mins)</FormLabel>
                    <FormControl>
                      <Input className="max-w-24" type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cookTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cook Time (mins)</FormLabel>
                    <FormControl>
                      <Input className="max-w-24" type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <GenericCombobox
                      query={getCategoriesQuery}
                      variables={{ search: "" }}
                      unwrapDataList={(query) => {
                        return query?.categories;
                      }}
                      renderItem={(
                        item: NonNullable<
                          GetCategoriesQuery["categories"]
                        >[number]
                      ) => {
                        return { id: item.id, label: item.name };
                      }}
                      selectedItems={field.value}
                      onChange={(newValue) => {
                        form.setValue("category", newValue);
                      }}
                      multiSelect={true}
                      autoFilter={true}
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
                  <FormLabel>Course</FormLabel>
                  <FormControl>
                    <GenericCombobox
                      query={getCoursesQuery}
                      variables={{ search: "" }}
                      unwrapDataList={(query) => {
                        return query?.courses;
                      }}
                      renderItem={(
                        item: NonNullable<GetCoursesQuery["courses"]>[number]
                      ) => {
                        return { id: item.id, label: item.name };
                      }}
                      selectedItems={field.value}
                      onChange={(newValue) => {
                        form.setValue("course", newValue);
                      }}
                      multiSelect={true}
                      autoFilter={true}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cuisine"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cuisine</FormLabel>
                  <FormControl>
                    <GenericCombobox
                      query={getCuisinesQuery}
                      variables={{ search: "" }}
                      unwrapDataList={(query) => {
                        return query?.cuisines;
                      }}
                      renderItem={(
                        item: NonNullable<GetCuisinesQuery["cuisines"]>[number]
                      ) => {
                        return { id: item.id, label: item.name };
                      }}
                      selectedItems={field.value}
                      onChange={(newValue) => {
                        form.setValue("cuisine", newValue);
                      }}
                      multiSelect={true}
                      autoFilter={true}
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
                <FormItem>
                  <FormLabel>Directions</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      value={field.value}
                      onChange={(v) => form.setValue("directions", v)}
                      editable
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
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      value={field.value}
                      onChange={(v) => form.setValue("notes", v)}
                      editable
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-x-6">
              <FormField
                control={form.control}
                name="leftoverFridgeLife"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fridge Life (days)</FormLabel>
                    <FormControl>
                      <Input className="max-w-24" type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="leftoverFreezerLife"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Freezer Life (days)</FormLabel>
                    <FormControl>
                      <Input className="max-w-24" type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
});
