"use client";
import { graphql } from "@/gql";
import { useQuery } from "@urql/next";
import { Card } from "../generics/Card";
import Link from "next/link";

const getMealPlans = graphql(`
  query GetMealPlans {
    mealPlans {
      id
      name
      planRecipes {
        id
        originalRecipe {
          id
          name
          photos {
            id
            isPrimary
            url
          }
        }
      }
    }
  }
`);

export function MealPlans() {
  const [result] = useQuery({ query: getMealPlans });

  const { data, fetching, error } = result;

  return (
    <div className="grid  grid-cols-grid-52">
      {data?.mealPlans.map((mealPlan) => {
        const photos = mealPlan.planRecipes
          .map((recipe) => {
            return recipe.originalRecipe.photos
              .filter((photo) => photo.isPrimary)
              .map((photo) => {
                return {
                  url: photo.url,
                  altText: recipe.originalRecipe.name,
                };
              });
          })
          .flat();

        return (
          <Link key={mealPlan.id} href={`mealplans/${mealPlan.id}`}>
            <Card
              vertical={true}
              image={{ images: photos, grid: true, placeholder: "/pot.jpg" }}
            >
              <p>{mealPlan.name}</p>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
