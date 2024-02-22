"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";
import { useMemo } from "react";
import {
  UrqlProvider,
  ssrExchange,
  cacheExchange,
  fetchExchange,
  createClient,
} from "@urql/next";
import { Inter as FontSans } from "next/font/google";
import { SideDrawer } from "@/components/SideDrawer";
import { NavBar } from "@/components/NavBar";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [client, ssr] = useMemo(() => {
    const ssr1 = ssrExchange();
    const client = createClient({
      url: "http://localhost:3025/graphql",
      exchanges: [cacheExchange, ssr1, fetchExchange],
      suspense: true,
    });

    return [client, ssr1];
  }, []);

  return (
    <UrqlProvider client={client} ssr={ssr}>
      <html lang="en">
        <body>
          <NavBar />
          <SideDrawer />
          {children}
        </body>
      </html>
    </UrqlProvider>
  );
}
