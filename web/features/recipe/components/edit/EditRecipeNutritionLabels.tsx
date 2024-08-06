import {
  EditRecipeProps,
  EditRecipeSubmit,
} from "@/app/recipes/[id]/edit/page";
import { forwardRef, useImperativeHandle } from "react";

export const EditRecipeNutritionLabels = forwardRef<
  EditRecipeSubmit,
  EditRecipeProps
>(function EditLabels(props, ref) {
  useImperativeHandle(ref, () => ({
    async submit(postSubmit) {
      console.log("child method");
      postSubmit();
    },
  }));

  return (
    <div>
      <p>Edit Nutrition Labels</p>
    </div>
  );
});
