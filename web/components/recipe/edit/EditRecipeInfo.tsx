import { Fieldset } from "@/components/ui/fieldset";
import { ImagePicker } from "@/components/ImagePicker";
import { Textarea } from "@/components/ui/textarea";
import { TimeNumberInput } from "@/components/ui/time-number-input";
import { InputWithLabel } from "@/components/ui/InputWithLabel";
import { CategoryPicker } from "@/components/pickers/CategoryPicker";
import { CuisinePicker } from "@/components/pickers/CuisinePicker";
import { CoursePicker } from "@/components/pickers/CoursePicker";
import { forwardRef, useImperativeHandle, useState } from "react";
import { GetRecipeQuery } from "@/gql/graphql";
import {
  EditRecipeProps,
  EditRecipeSubmit,
} from "@/app/recipes/[id]/edit/page";
import { useQuery } from "@urql/next";
import { getRecipeBaiscInfo } from "@/graphql/recipe/queries";

export const EditRecipeInfo = forwardRef<EditRecipeSubmit, EditRecipeProps>(
  function EditIngredients(props, ref) {
    const [result] = useQuery({
      query: getRecipeBaiscInfo,
      variables: { id: props.recipeId },
    });

    useImperativeHandle(ref, () => ({
      submit(postSubmit) {
        console.log("child method");
        postSubmit();
      },
    }));
    const recipe = result.data?.recipe;

    const [fridgeLife, setFridgeLife] = useState<string>();
    const [freezerLife, setFreezerLife] = useState<string>();
    const [source, setSource] = useState<string>();
    const [title, setTitle] = useState<string>();

    const [categoryIds, setCategories] = useState<string[]>([]);
    const [cuisineIds, setCuisines] = useState<string[]>([]);
    const [courseIds, setCourses] = useState<string[]>([]);
    const [prepTime, setPrepTime] = useState<number>(0);
    const [marinadeTime, setMarinadeTime] = useState<number>(0);
    const [cookTime, setCookTime] = useState<number>(0);
    const [totalTime, setTotalTime] = useState<number>(0);
    const placeholderTotalTime = prepTime + marinadeTime + cookTime;

    return (
      <div className="grid grid-cols-4 gap-8">
        <div className="col-span-1">
          <Fieldset name="Photos">
            <ImagePicker />
          </Fieldset>
          <Fieldset name="Ingredients">
            <Textarea className="min-h-72" />
          </Fieldset>
          <Fieldset name="Time">
            <TimeNumberInput
              id="prep_time"
              label="Prep Time"
              value={prepTime}
              onUpdate={setPrepTime}
            />

            <TimeNumberInput
              id="marinade_time"
              label="Marinade/Rest Time"
              value={marinadeTime}
              onUpdate={setMarinadeTime}
            />

            <TimeNumberInput
              id="cook_time"
              label="Cook Time"
              value={cookTime}
              onUpdate={setCookTime}
            />
            <TimeNumberInput
              id="total_time"
              label="Total Time"
              value={placeholderTotalTime}
              onUpdate={setTotalTime}
            />
          </Fieldset>
          <Fieldset name="Leftover">
            <InputWithLabel
              id="fridge_life"
              label="Fridge Life"
              placeholder="Days in fridge"
              type="number"
              value={fridgeLife}
              setValue={setFridgeLife}
              defaultValue={recipe?.leftoverFridgeLife ?? undefined}
            ></InputWithLabel>
            <InputWithLabel
              id="freezer_life"
              label="Freezer Life"
              placeholder="Days in freezer"
              type="number"
              value={freezerLife}
              setValue={setFreezerLife}
              defaultValue={recipe?.leftoverFreezerLife ?? undefined}
            ></InputWithLabel>
          </Fieldset>
        </div>
        <div className="grid col-span-3 gap-6">
          <Fieldset name="Basic Info">
            <InputWithLabel
              id="name"
              label="Name"
              placeholder="e.g., fried chicken"
              value={title}
              setValue={setTitle}
              defaultValue={recipe?.name}
            />
            <InputWithLabel
              id="source"
              label="Source"
              placeholder="e.g., website or book"
              value={source}
              setValue={setSource}
              defaultValue={recipe?.source ?? undefined}
            />
            <div className="grid grid-cols-3 gap-4">
              <CategoryPicker
                selectedItems={categoryIds}
                setSelectedItems={setCategories}
              />
              <CuisinePicker
                selectedItems={categoryIds}
                setSelectedItems={setCategories}
              />
              <CoursePicker
                selectedItems={categoryIds}
                setSelectedItems={setCategories}
              />
            </div>
          </Fieldset>
          <Fieldset name="Directions">
            <Textarea className="min-h-96" />
          </Fieldset>
          <Fieldset name="Notes">
            <Textarea className="min-h-72" />
          </Fieldset>
        </div>
      </div>
    );
  }
);
