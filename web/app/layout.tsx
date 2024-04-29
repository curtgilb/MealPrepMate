"use client";
import "@/styles/globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SideNav } from "@/components/SideNav";
import { navigationLinks } from "@/data/NavigationLinks";
import { useMemo } from "react";
import {
  UrqlProvider,
  ssrExchange,
  cacheExchange,
  fetchExchange,
  createClient,
} from "@urql/next";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [client, ssr] = useMemo(() => {
    const ssr = ssrExchange({
      isClient: typeof window !== "undefined",
    });
    const client = createClient({
      url: "http://localhost:3025/graphql",
      exchanges: [cacheExchange, ssr, fetchExchange],
      suspense: true,
    });

    return [client, ssr];
  }, []);

  return (
    <html lang="en">
      <body
        className={cn(
          "h-svh bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <header className="px-3 py-2 flex items-center border-b">
          <Button variant="ghost">
            <Menu />
          </Button>
          <p className="text-2xl font-bold ml-2">Meal Planner</p>
        </header>
        <div className="flex h-full">
          <SideNav links={navigationLinks} isCollapsed={false} />
          <main className="w-full h-full bg-muted/40">
            <UrqlProvider client={client} ssr={ssr}>
              {children}
            </UrqlProvider>
          </main>
        </div>
      </body>
    </html>
  );
}
