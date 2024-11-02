"use client";
import { GenericCombobox } from "@/components/combobox/GenericCombox1";
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
import { editRecipeMutation } from "@/features/recipe/api/Recipe";
import { recipeIngredientFragment } from "@/features/recipe/api/RecipeIngredient";
import {
  EditRecipeProps,
  EditRecipeSubmit,
} from "@/features/recipe/components/edit/RecipeEditor";
import { useFullIngredientString } from "@/features/recipe/hooks/useFullIngredientString";
import { getFragmentData } from "@/gql";
import {
  GetCategoriesQuery,
  GetCoursesQuery,
  GetCuisinesQuery,
} from "@/gql/graphql";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@urql/next";
import { createContext, forwardRef, useImperativeHandle } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";

export const basicItem = z
  .object({
    id: z.string(),
    label: z.string(),
  })
  .passthrough();

const PhotoItem = z.object({
  id: z.string(),
  url: z.string(),
  isPrimary: z.boolean(),
});

const recipeInputValidation = z.object({
  title: z.string(),
  source: z.string().trim().optional(),
  prepTime: z.number(),
  cookTime: z.coerce.number().optional(),
  marinadeTime: z.coerce.number().optional(),
  directions: z.string().optional(),
  notes: z.string().optional(),
  leftoverFridgeLife: z.coerce.number().int().nonnegative().optional(),
  leftoverFreezerLife: z.coerce.number().int().nonnegative().optional(),
  ingredients: z.string().optional(),
  cuisine: z.array(basicItem),
  category: z.array(basicItem),
  course: z.array(basicItem),
  photos: z.array(PhotoItem),
});

type RecipeValidation = z.infer<typeof recipeInputValidation>;
export const FormContext = createContext<
  UseFormReturn<RecipeValidation> | undefined
>(undefined);

export const EditRecipeInfo = forwardRef<EditRecipeSubmit, EditRecipeProps>(
  function EditRecipe({ recipe }, ref) {
    const ingredientText = useFullIngredientString(
      getFragmentData(recipeIngredientFragment, recipe?.ingredients)
    );
    const form = useForm<RecipeValidation>({
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
        ingredients: ingredientText,
        cuisine: recipe?.cuisine ?? [],
        category: recipe?.category ?? [],
        course: recipe?.course ?? [],
        photos: recipe?.photos ?? [],
      },
    });

    const [result, editRecipe] = useMutation(editRecipeMutation);

    useImperativeHandle(ref, () => ({
      submit(postSubmit) {
        form.handleSubmit(
          (values: z.infer<typeof recipeInputValidation>) => {
            const { cuisine, category, course, photos, ...rest } = values;
            if (recipe?.id) {
              postSubmit();
              // editRecipe({
              //   id: recipe.id,
              //   recipe: {
              //     ...rest,
              //     cuisineIds: cuisine.map((item) => item.id),
              //     categoryIds: category.map((item) => item.id),
              //     courseIds: course.map((item) => item.id),
              //     photoIds: photos.map((item) => item.id),
              //   },
              // }).then(() => {
              //   postSubmit();
              // });
            }
          },
          (errors) => {}
        )();
      },
    }));

    return (
      <div>
        <FormContext.Provider value={form}>
          <Form {...form}>
            <form className="grid md:grid-cols-[24rem_1fr] gap-x-24 gap-y-4">
              <FormField
                control={form.control}
                name="photos"
                render={({ field }) => (
                  <FormItem className="max-w-96">
                    <FormLabel>Photos</FormLabel>
                    <FormControl>
                      <ImagePicker
                        value={field.value}
                        setValue={(images) => {
                          form.setValue("photos", images);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="max-w-prose space-y-4 justify-items-center">
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
                          <Input
                            className="max-w-24"
                            type="number"
                            {...field}
                          />
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
                          <Input
                            className="max-w-24"
                            type="number"
                            {...field}
                          />
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
                          <Input
                            className="max-w-24"
                            type="number"
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
                            item: NonNullable<
                              GetCoursesQuery["courses"]
                            >[number]
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
                            item: NonNullable<
                              GetCuisinesQuery["cuisines"]
                            >[number]
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
              </div>

              <FormField
                control={form?.control}
                name="ingredients"
                render={({ field }) => (
                  <FormItem className=" w-full ">
                    <FormLabel>Ingredients</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Ingredient list"
                        className="resize-none min-h-[30rem]"
                        {...field}
                        disabled={!recipe}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-12">
                <div className="max-w-prose space-y-4">
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
                            <Input
                              className="max-w-24"
                              type="number"
                              {...field}
                            />
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
                            <Input
                              className="max-w-24"
                              type="number"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </form>
          </Form>
        </FormContext.Provider>
      </div>
    );
  }
);
