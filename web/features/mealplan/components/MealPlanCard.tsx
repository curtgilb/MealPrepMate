import { Card } from "@/components/Card";
import { GetMealPlanQuery, GetMealPlansQuery } from "@/gql/graphql";

interface MealPlanCardProps {
  mealPlan: GetMealPlansQuery["mealPlans"]["edges"][number]["node"];
}

export function MealPlanCard({ mealPlan }: MealPlanCardProps) {
  const photos = mealPlan.planRecipes
    .map((recipe) =>
      recipe.originalRecipe.photos
        .filter((photo) => photo.isPrimary)
        .map((photo) => ({
          ...photo,
          altText: `Image of ${recipe.originalRecipe.name}`,
        }))
    )
    .flat();

  return (
    <Card
      href={`/mealplans/${mealPlan.id}`}
      images={photos}
      placeholderUrl=""
      imageGrid={true}
      vertical={true}
    ></Card>
  );
}
