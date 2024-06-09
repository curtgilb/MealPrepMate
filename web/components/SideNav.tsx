"use client";
import { usePathname } from "next/navigation";
import {
  Apple,
  CalendarDays,
  FolderInput,
  Home,
  HomeIcon,
  Library,
  LucideIcon,
  Package2,
  Settings,
  Target,
  UtensilsCrossed,
} from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import Icon from "./Icon";
import dynamicIconImports from "lucide-react/dynamicIconImports";

import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const navigationLinks = [
  {
    title: "Meal Plans",
    icon: <UtensilsCrossed className="h-4 w-4" />,
    link: "/mealplans",
  },
  {
    title: "Recipes",
    icon: <Library className="h-4 w-4" />,
    link: "/recipes",
  },
  {
    title: "Calendar",
    icon: <CalendarDays className="h-4 w-4" />,
    link: "/calendar",
  },
  {
    title: "Ingredients",
    icon: <Apple className="h-4 w-4" />,
    link: "/ingredients",
  },
  {
    title: "Nutrition Targets",
    icon: <Target className="h-4 w-4" />,
    link: "/nutrition",
  },
  {
    title: "Imports",
    icon: <FolderInput className="h-4 w-4" />,
    link: "/imports",
  },
];

interface SideNavProps {
  isCollapsed: boolean;
}

const containerVariants = {
  close: {
    width: "8rem",
    transition: {
      type: "spring",
      damping: 15,
      duration: 0.5,
    },
  },
  open: {
    width: "14rem",
    transition: {
      type: "spring",
      damping: 15,
      duration: 0.5,
    },
  },
};

function Navigation({ isCollapsed }: SideNavProps) {
  return (
    <aside>
      <nav className="flex flex-col z-10 h-full border-r bg-card p-4 gap-y-2">
        {navigationLinks.map((link) => {
          return <NavigationItem key={link.link} {...link}></NavigationItem>;
        })}
      </nav>
    </aside>
  );
}

export { Navigation, type NavLink };

interface NavLink {
  title: string;
  icon: JSX.Element;
  link: string;
}

function NavigationItem({ title, icon, link }: NavLink) {
  const pathName = usePathname();
  const activeLink = pathName.startsWith(link) ? "default" : "ghost";
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Button variant={activeLink} size="icon" asChild>
            <Link href={link}>{icon}</Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{title}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
