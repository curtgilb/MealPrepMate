import { MultiImageCard } from "@/components/MultiImageCard";
import { GetMealPlansQuery } from "@/gql/graphql";
import Link from "next/link";

interface MealPlanCardProps {
  mealPlan: GetMealPlansQuery["mealPlans"]["edges"][number]["node"];
}

export function MealPlanCard({ mealPlan }: MealPlanCardProps) {
  const photos = mealPlan.planRecipes
    .map((recipe) => {
      const primaryPhoto =
        recipe.originalRecipe.photos.find((photo) => photo.isPrimary) ??
        recipe.originalRecipe.photos[0];

      return {
        ...primaryPhoto,
        url: process.env.NEXT_PUBLIC_STORAGE_URL + primaryPhoto.url,
        altText: recipe.originalRecipe.name,
      };
    })
    .flat();

  return (
    <Link
      href={`/mealplans/${mealPlan.id}`}
      className="rounded-md overflow-hidden border group"
    >
      <MultiImageCard images={photos}>
        <div className="min-h-16 px-3 py-1.5 ">
          <p className="group-hover:underline">{mealPlan.name}</p>
        </div>
      </MultiImageCard>
    </Link>
  );
}
