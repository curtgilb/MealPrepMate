import { Pencil, Save } from "lucide-react";
import { useState } from "react";
import { Input } from "../../../components/ui/input";
import { InputWithIcon } from "../../../components/ui/InputWithIcon";
import { graphql } from "@/gql";
import { useMutation } from "@urql/next";
import { cn } from "@/lib/utils";

const changeNameMutation = graphql(`
  mutation changeName($id: String!, $name: String!) {
    editMealPlan(mealPlan: { id: $id, name: $name }) {
      id
      name
    }
  }
`);

export function MealPlanName({
  name,
  mealPlanId,
}: {
  name: string;
  mealPlanId: string;
}) {
  const [edit, setEdit] = useState<boolean>(false);
  const [result, changeName] = useMutation(changeNameMutation);
  const [newName, setName] = useState<string>();
  const css = edit ? "text-xl font-bold" : " ";

  function handleNameSave() {
    setEdit(false);
    if (newName && newName !== name) {
      changeName({ name: newName, id: mealPlanId });
    }
  }

  return (
    <div className="flex w-min">
      <InputWithIcon
        value={newName}
        onChange={(e) => {
          setName(e.target.value);
        }}
        onClick={() => {
          setEdit(true);
        }}
        onBlur={() => {
          handleNameSave();
        }}
        // onKeyDown={(e) => {
        //   if (e.key === "Enter") {
        //     handleNameSave();
        //   }
        //   e.
        // }}
        className={cn(
          "text-xl font-bold w-fit",
          edit || "border-transparent bg-inherit "
        )}
        defaultValue={name}
        startIcon={edit ? Save : Pencil}
      />
    </div>
  );
}
