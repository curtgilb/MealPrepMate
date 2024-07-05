"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { graphql } from "@/gql";
import { Plus } from "lucide-react";
import { useMutation } from "@urql/next";
import { useState } from "react";
import { MealPlans as MealPlanList } from "@/components/pagination/MealPlans";

const createMutation = graphql(`
  mutation createMealPlan {
    createMealPlan(name: "Untitled Meal Plan") {
      id
    }
  }
`);

export default function MealPlans() {
  const router = useRouter();
  const [createResult, createMealPlan] = useMutation(createMutation);
  const [redirecting, setRedirecting] = useState<boolean>(false);

  return (
    <div>
      <h1 className="text-5xl font-black">Meal plans</h1>
      <Button
        disabled={redirecting}
        onClick={() => {
          setRedirecting(true);
          createMealPlan({}).then((result) =>
            router.push(`/mealplans/${result.data?.createMealPlan.id}`)
          );
        }}
      >
        <Plus className="mr-2 h-4 w-4" />
        Create meal plan
      </Button>
      <MealPlanList />
    </div>
  );
}
