import { Dispatch, SetStateAction } from "react";

import { ProgramticModalDrawer } from "@/components/ModalDrawerProgramatic";
import { AddServingForm } from "@/features/mealplan/components/servings/AddServingForm";
import { MealPlanServingsFieldFragment } from "@/gql/graphql";

interface MealPlanServingDialog {
  serving: MealPlanServingsFieldFragment | null | undefined;
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export function MealPlanServingDialog({
  serving,
  isOpen,
  setOpen,
}: MealPlanServingDialog) {
  return (
    <ProgramticModalDrawer
      title={serving ? "Edit serving" : "Add serving"}
      open={isOpen}
      setOpen={setOpen}
      content={<AddServingForm serving={serving} setOpen={setOpen} />}
    />
  );
}
