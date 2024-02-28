import "@/styles/globals.css";
import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SideNav } from "@/components/SideNav";
import { navigationLinks } from "@/data/NavigationLinks";
import { useState } from "react";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <html lang="en">
      <body
        className={cn(
          "h-full bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <header className="px-3 py-2 flex items-center border-b">
          <Button variant="ghost">
            <Menu />
          </Button>
          <p className="text-2xl font-bold ml-2">Meal Planner</p>
        </header>
        <div className="flex">
          <SideNav links={navigationLinks} isCollapsed={collapsed} />
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
