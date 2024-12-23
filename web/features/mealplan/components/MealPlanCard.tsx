import { Card } from "@/components/Card";
import { GetMealPlanQuery, GetMealPlansQuery } from "@/gql/graphql";

interface MealPlanCardProps {
  mealPlan: GetMealPlansQuery["mealPlans"]["edges"][number]["node"];
}

export function MealPlanCard({ mealPlan }: MealPlanCardProps) {
  const photos = mealPlan.planRecipes
    .map((recipe) =>
      recipe.originalRecipe.photos.map((photo) => ({
        ...photo,
        url: "http://localhost:9000/" + photo.url,
        altText: `Image of ${recipe.originalRecipe.name}`,
      }))
    )
    .flat();

  console.log("photos", photos);

  return (
    <Card
      href={`/mealplans/${mealPlan.id}`}
      images={photos}
      placeholderUrl="/placeholder_recipe.jpg"
      imageGrid={true}
      vertical={true}
    >
      <div className="flex flex-col justify-between min-h-16">
        <div>
          <p className="group-hover:underline">{mealPlan.name}</p>
        </div>
      </div>
    </Card>
  );
}
