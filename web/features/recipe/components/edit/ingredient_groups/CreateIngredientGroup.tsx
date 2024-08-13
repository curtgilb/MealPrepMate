import { Button } from "@/components/ui/button";
import { createRecipeIngredientGroupMutation } from "@/features/recipe/api/RecipeIngredientGroups";
import { CreateIngredientGroupMutation } from "@/gql/graphql";
import { useMutation } from "@urql/next";

interface CreateIngredientGroupProps {
  recipeId: string;
  onCreate: (
    result: CreateIngredientGroupMutation["createRecipeIngredientGroup"]
  ) => void;
}

export function CreateIngredientGroup({
  recipeId,
  onCreate,
}: CreateIngredientGroupProps) {
  const [result, createGroup] = useMutation(
    createRecipeIngredientGroupMutation
  );

  return (
    <Button
      onClick={() => {
        createGroup({ name: "New Group", recipeId: recipeId }).then(
          (result) => {
            if (result.data) {
              onCreate(result.data.createRecipeIngredientGroup);
            }
          }
        );
      }}
    >
      Add group
    </Button>
  );
}
