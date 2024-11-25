"use client";
import "@/styles/globals.css";

import { Menu } from "lucide-react";
import { Inter, Merriweather } from "next/font/google";
import Image from "next/image";
import { useMemo, useState } from "react";

import { Navigation } from "@/components/SideNav";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import {
  MutationAddRecipeServingArgs,
  MutationAddRecipeToMealPlanArgs,
  MutationDeleteRecipeServingArgs,
  MutationSetRankedNutrientsArgs,
} from "@/gql/graphql";
import { cn } from "@/lib/utils";
import { animated, useSpring } from "@react-spring/web";
import { cacheExchange } from "@urql/exchange-graphcache";
import {
  createClient,
  fetchExchange,
  ssrExchange,
  UrqlProvider,
} from "@urql/next";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontSerif = Merriweather({
  weight: ["300", "400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-serif",
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
      url: process.env.NEXT_PUBLIC_CLIENT_API_URL ?? "",
      fetchOptions: { cache: "no-store" },
      exchanges: [
        cacheExchange({
          keys: {
            NutrientsQuery: (data) => null,
            IngredientsQuery: (data) => null,
            PolygonCoordinate: (data) => null,
            BoundingBox: (data) => null,
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

  const sideBarSprings = useSpring({ width: isCollapsed ? "4.5rem" : "15rem" });
  const mainSprings = useSpring({
    marginLeft: isCollapsed ? "4.5rem" : "15rem",
  });

  return (
    <html lang="en">
      <body
        className={cn(
          "bg-background font-sans antialiased",
          fontSans.variable,
          fontSerif.variable
        )}
      >
        <header className="fixed z-50 inset-x-0 top-0 px-3 py-2 flex items-center border-b bg-white">
          <Button
            className="mr-2"
            onClick={() => {
              setCollapsed(!isCollapsed);
            }}
            variant="ghost"
          >
            <Menu />
          </Button>
          <p className="font-serif font-bold text-xl">MealPrepMate</p>
        </header>
        <animated.aside
          style={{
            ...sideBarSprings,
          }}
          className="fixed z-30 top-[3.5rem] bottom-0 "
        >
          <Navigation isCollapsed={isCollapsed} />
        </animated.aside>
        <animated.main
          className="mt-[3.5rem] min-h-main-full"
          style={{ ...mainSprings }}
        >
          <UrqlProvider client={client} ssr={ssr}>
            {children}
          </UrqlProvider>
        </animated.main>
        <Toaster />
      </body>
    </html>
  );
}
