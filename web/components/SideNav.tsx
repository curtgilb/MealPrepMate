"use client";

import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import Icon from "./Icon";
import dynamicIconImports from "lucide-react/dynamicIconImports";

interface SideNavProps {
  isCollapsed: boolean;
  links: NavLink[];
}

interface NavLink {
  title: string;
  label?: string;
  icon: keyof typeof dynamicIconImports;
  link: string;
}

function SideNav({ isCollapsed, links }: SideNavProps) {
  const pathName = usePathname();
  return (
    <div className="space-y-4 py-4 px-4 w-56 flex flex-col border-r h-full min-h-screen">
      {links.map((item, index) => {
        const activeLink = pathName === item.link ? "default" : "ghost";
        return (
          <Link
            key={index}
            href={item.link}
            className={cn(
              buttonVariants({ variant: activeLink, size: "sm" }),
              pathName === item.link &&
                "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
              "justify-start"
            )}
          >
            <Icon name={item.icon} className="mr-2 h-4 w-4" />
            {item.title}
          </Link>
        );
      })}
    </div>
  );
}

export { SideNav, type NavLink };
