"use client";
import SingleColumnCentered from "@/components/layouts/single-column-centered";
import { MealPlans as MealPlanList } from "@/components/pagination/MealPlans";
import { Button } from "@/components/ui/button";
import { createMealPlanMutation } from "@/features/mealplan/api/MealPlan";
import { useMutation } from "@urql/next";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function MealPlans() {
  const router = useRouter();
  // const [createResult, createMealPlan] = useMutation(createMealPlanMutation);
  const [redirecting, setRedirecting] = useState<boolean>(false);

  return (
    <SingleColumnCentered>
      <div className="flex justify-between mb-10 items-baseline">
        <h1 className="text-5xl font-black">Meal plans</h1>
        <Button
          disabled={redirecting}
          // onClick={() => {
          //   setRedirecting(true);
          //   createMealPlan({}).then((result) =>
          //     router.push(`/mealplans/${result.data?.createMealPlan.id}`)
          //   );
          // }}
        >
          <Plus className="mr-2 h-4 w-4" />
          New meal plan
        </Button>
      </div>
      <MealPlanList />
    </SingleColumnCentered>
  );
}
