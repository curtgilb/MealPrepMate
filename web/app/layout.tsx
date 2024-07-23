"use client";
import { Navigation } from "@/components/SideNav";
import { Button } from "@/components/ui/button";

import {
  MutationAddRecipeServingArgs,
  MutationAddRecipeToMealPlanArgs,
  MutationDeleteRecipeServingArgs,
  MutationSetRankedNutrientsArgs,
} from "@/gql/graphql";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import { cacheExchange } from "@urql/exchange-graphcache";
import {
  UrqlProvider,
  createClient,
  fetchExchange,
  ssrExchange,
} from "@urql/next";
import { Menu } from "lucide-react";
import { Inter } from "next/font/google";
import { useMemo, useState } from "react";
import { Toaster } from "@/components/ui/sonner";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isCollapsed, setCollapsed] = useState<boolean>(true);
  const [client, ssr] = useMemo(() => {
    const ssr = ssrExchange({
      isClient: typeof window !== "undefined",
    });

    const client = createClient({
      url: "http://localhost:3025/graphql",
      fetchOptions: { cache: "no-store" },
      exchanges: [
        cacheExchange({
          keys: {
            NutrientsQuery: (data) => null,
            IngredientsQuery: (data) => null,
          },
          updates: {
            Mutation: {
              addRecipeServing(result, args, cache, info) {
                const typedArgs = (args as MutationAddRecipeServingArgs).serving
                  .mealPlanId;

                const servings = cache.resolve(
                  { __typename: "MealPlan", id: typedArgs },
                  "mealPlanServings"
                );

                if (Array.isArray(servings)) {
                  cache.link(
                    { __typename: "MealPlan", id: typedArgs },
                    "mealPlanServings",
                    [...servings, result.addRecipeServing]
                  );
                }
              },
              deleteRecipeServing(result, args, cache, info) {
                cache.invalidate({
                  __typename: "MealPlanServing",
                  id: (args as MutationDeleteRecipeServingArgs).id,
                });
              },
              addRecipeToMealPlan(result, args, cache, info) {
                const mealPlanId = (args as MutationAddRecipeToMealPlanArgs)
                  .recipe.mealPlanId;
                const mealPlan = cache.resolve(
                  { __typename: "MealPlan", id: mealPlanId },
                  "planRecipes"
                );
                if (Array.isArray(mealPlan)) {
                  cache.link(
                    { __typename: "MealPlan", id: mealPlanId },
                    "planRecipes",
                    [...mealPlan, result.addRecipeToMealPlan]
                  );
                }
              },
              setRankedNutrients(result, args, cache, info) {
                const rankedNutrients = cache.resolve(
                  "Query",
                  "getRankedNutrients"
                );

                if (
                  Array.isArray(rankedNutrients) &&
                  Array.isArray(result.setRankedNutrients)
                ) {
                  cache.link("Query", "getRankedNutrients", [
                    ...result.setRankedNutrients,
                  ]);
                }
              },
            },
          },
        }),
        ssr,
        fetchExchange,
      ],
      suspense: true,
    });

    return [client, ssr];
  }, []);

  return (
    <html lang="en">
      <body
        className={cn(
          "bg-background font-sans antialiased h-dvh overflow-y-hidden flex flex-col",
          fontSans.variable
        )}
      >
        <header className="px-3 py-2 flex items-center border-b">
          <Button variant="ghost">
            <Menu />
          </Button>
          <p className="text-2xl font-bold ml-2">Meal Planner</p>
        </header>
        <main className="flex flex-row w-full relative bg-secondary h-full flex-grow">
          <Navigation isCollapsed={isCollapsed} />
          <section className="grow min-w-0 overflow-hidden">
            <UrqlProvider client={client} ssr={ssr}>
              {children}
            </UrqlProvider>
          </section>
          <Toaster />
        </main>
      </body>
    </html>
  );
}
