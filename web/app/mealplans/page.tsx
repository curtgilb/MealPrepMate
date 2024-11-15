"use client";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { InfiniteScroll } from "@/components/infinite_scroll/InfiniteScroll";
import SingleColumnCentered from "@/components/layouts/single-column-centered";
import { MealPlans as MealPlanList } from "@/components/pagination/MealPlans";
import { Button } from "@/components/ui/button";
import {
  createMealPlanMutation,
  getMealPlansQuery,
} from "@/features/mealplan/api/MealPlan";
import { MealPlanCard } from "@/features/mealplan/components/MealPlanCard";
import { getFragmentData } from "@/gql/fragment-masking";
import { GetMealPlansQuery } from "@/gql/graphql";
import { useMutation } from "@urql/next";

export default function MealPlans() {
  const router = useRouter();
  const [createResult, createMealPlan] = useMutation(createMealPlanMutation);
  const [redirecting, setRedirecting] = useState<boolean>(false);

  return (
    <SingleColumnCentered>
      <div className="flex justify-between mb-10 items-baseline">
        <h1 className="text-4xl font-serif font-black">Meal plans</h1>
        <Button
          disabled={redirecting}
          onClick={() => {
            setRedirecting(true);
            createMealPlan({ input: { name: "New meal plan" } }).then(
              (result) =>
                router.push(`/mealplans/${result.data?.createMealPlan.id}`)
            );
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          New meal plan
        </Button>
      </div>
      <InfiniteScroll
        query={getMealPlansQuery}
        variables={{}}
        renderItem={(
          mealPlan: GetMealPlansQuery["mealPlans"]["edges"][number]["node"]
        ) => {
          return [
            <MealPlanCard key={mealPlan.id} mealPlan={mealPlan} />,
            mealPlan.id,
          ] as const;
        }}
        getConnection={(data) => {
          if (!data?.mealPlans) return undefined;
          return data.mealPlans;
        }}
      />
    </SingleColumnCentered>
  );
}
