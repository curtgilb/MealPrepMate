import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";

interface SideNavProps {
  isCollapsed: boolean;
  links: NavLink[];
}

interface NavLink {
  title: string;
  label?: string;
  icon: LucideIcon;
  variant: "default" | "ghost";
  link: string;
}

function SideNav({ isCollapsed, links }: SideNavProps) {
  return (
    <div className="space-y-4 py-4 px-4 w-56 flex flex-col border-r h-full min-h-screen">
      {links.map((item, index) => (
        <Link
          key={index}
          href={item.link}
          className={cn(
            buttonVariants({ variant: item.variant, size: "sm" }),
            item.variant === "default" &&
              "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
            "justify-start"
          )}
        >
          <item.icon className="mr-2 h-4 w-4" />
          {item.title}
        </Link>
      ))}
    </div>
  );
}

export { SideNav, type NavLink };
