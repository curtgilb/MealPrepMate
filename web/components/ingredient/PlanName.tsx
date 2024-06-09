import { Pencil, Save } from "lucide-react";
import { useState } from "react";
import { Input } from "../ui/input";
import { InputWithIcon } from "../ui/InputWithIcon";
import { graphql } from "@/gql";
import { useMutation } from "@urql/next";

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
  const css = edit
    ? "text-xl font-bold"
    : "text-xl font-bold border-transparent bg-inherit";

  function handleNameSave() {
    setEdit(false);
    if (newName && newName !== name) {
      changeName({ name: newName, id: mealPlanId });
    }
  }

  return (
    <div className="flex">
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
        className={css}
        defaultValue={name}
        startIcon={edit ? Save : Pencil}
      />
    </div>
  );
}
