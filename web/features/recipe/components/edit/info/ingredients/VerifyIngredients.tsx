import { ParseIngredientsQuery, RecipeFieldsFragment } from "@/gql/graphql";

interface VerifyIngredientsProps {
  ingredients:
    | NonNullable<RecipeFieldsFragment["ingredients"]>
    | NonNullable<ParseIngredientsQuery["tagIngredients"]>;
}

export function VerifyIngredients({ ingredients }: VerifyIngredientsProps) {
  return null;
}
