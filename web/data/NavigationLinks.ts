import {
  UtensilsCrossed,
  Library,
  CalendarDays,
  Apple,
  Target,
  FolderInput,
} from "lucide-react";
import { NavLink } from "@/components/SideNav";

export const navigationLinks: NavLink[] = [
  {
    title: "Meal Plans",
    icon: UtensilsCrossed,
    variant: "default",
    link: "/mealplans",
  },
  {
    title: "Recipes",
    icon: Library,
    link: "/recipes",
    variant: "ghost",
  },
  {
    title: "Calendar",
    icon: CalendarDays,
    link: "/calendar",
    variant: "ghost",
  },
  {
    title: "Ingredients",
    icon: Apple,
    link: "/ingredients",
    variant: "ghost",
  },
  {
    title: "Nutrition Targets",
    icon: Target,
    link: "/nutrition",
    variant: "ghost",
  },
  {
    title: "Imports",
    icon: FolderInput,
    link: "/imports",
    variant: "ghost",
  },
];
