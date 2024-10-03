"use client";
import { BasicMultiSelect } from "@/components/BasicMultiSelect";
import { ImagePicker } from "@/components/ImagePicker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
import {
  forwardRef,
  useContext,
  useImperativeHandle,
  useState,
  createContext,
} from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { useMutation } from "@urql/next";
import { z } from "zod";
import { editRecipeMutation } from "@/features/recipe/api/Recipe";
import { RichTextEditor } from "@/components/rich_text/RichTextEditor";
import { EditRecipeIngredientItem } from "@/features/recipe/components/edit/ingredients/EditRecipeIngredientItem";
import { EditIngredients } from "@/features/recipe/components/edit/info/ingredients/EditIngredients";

export const BasicItem = z.object({
  id: z.string(),
  name: z.string(),
});

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
  leftoverFridgeLife: z.coerce.number().int().positive().optional(),
  leftoverFreezerLife: z.coerce.number().int().positive().optional(),
  ingredients: z.string().optional(),
  cuisine: z.array(BasicItem),
  category: z.array(BasicItem),
  course: z.array(BasicItem),
  photos: z.array(PhotoItem),
});

type RecipeValidation = z.infer<typeof recipeInputValidation>;
export const FormContext = createContext<
  UseFormReturn<RecipeValidation> | undefined
>(undefined);

export const EditRecipeInfo = forwardRef<EditRecipeSubmit, EditRecipeProps>(
  function EditeRecipe({ recipe }, ref) {
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
        ingredients: undefined,
        cuisine: recipe?.cuisine ?? [],
        category: recipe?.category ?? [],
        course: recipe?.course ?? [],
        photos: recipe?.photos ?? [],
      },
    });

    const [result, editRecipe] = useMutation(editRecipeMutation);
    const [directions, setDirections] = useState<string>("Hello World");
    useImperativeHandle(ref, () => ({
      submit(postSubmit) {
        form.handleSubmit(
          (values: z.infer<typeof recipeInputValidation>) => {
            const { cuisine, category, course, photos, ...rest } = values;
            if (recipe?.id) {
              editRecipe({
                id: recipe.id,
                recipe: {
                  ...rest,
                  cuisineIds: cuisine.map((item) => item.id),
                  categoryIds: category.map((item) => item.id),
                  courseIds: course.map((item) => item.id),
                  photoIds: photos.map((item) => item.id),
                },
              }).then(() => {
                postSubmit();
              });
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
            <form>
              <div className="col-span-2 flex flex-col gap-4 max-w-96">
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

                <div className="flex justify-between">
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
                </div>

                {/* <FormField
                control={form.control}
                name="photos"
                render={({ field }) => (
                  <FormItem className="max-w-96">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <ImagePicker
                        value={field.value}
                        setValue={(images) => {
                          console.log("set value", images);
                          form.setValue("photos", images);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

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
                          value={field.value}
                          placeholder="Select cuisines"
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
                          value={field.value}
                          placeholder="Select categories"
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
                          value={field.value}
                          placeholder="Select courses"
                          onChange={(value) => {
                            form.setValue("course", value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-12">
                <EditIngredients ingredients={null} />
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
                      name="leftoverFreezerLife"
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
                  </div>

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
                </div>
              </div>
            </form>
          </Form>
        </FormContext.Provider>
      </div>
    );
  }
);

// <RichTextEditor
// value={directions}
// onChange={(v) => setDirections(v)}
// editable
// />
