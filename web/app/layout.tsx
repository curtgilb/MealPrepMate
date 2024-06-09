"use client";
import { Navigation } from "@/components/SideNav";
import { Button } from "@/components/ui/button";

import { MutationAddRecipeToMealPlanArgs } from "@/gql/graphql";
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
          updates: {
            Mutation: {
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
        className={cn("bg-background font-sans antialiased", fontSans.variable)}
      >
        <header className="px-3 py-2 flex items-center border-b">
          <Button variant="ghost">
            <Menu />
          </Button>
          <p className="text-2xl font-bold ml-2">Meal Planner</p>
        </header>
        <main className="flex flex-row w-full relative bg-secondary">
          <Navigation isCollapsed={isCollapsed} />
          <section className="grow">
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
