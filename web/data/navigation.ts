import dynamicIconImports from "lucide-react/dynamicIconImports";

type NavigationLinks = {
  [key: string]: {
    name: string;
    icon: keyof typeof dynamicIconImports;
    link: string;
  }[];
};

const navigationLinks: NavigationLinks = {
  Nutrition: [
    {
      name: "Meal Plans",
      icon: "utensils-crossed",
      link: "/mealplans",
    },
    {
      name: "Recipes",
      icon: "library",
      link: "/recipes",
    },
    {
      name: "Calendar",
      icon: "calendar-days",
      link: "/calendar",
    },
    {
      name: "Ingredients",
      icon: "apple",
      link: "/ingredients",
    },
    {
      name: "Nutrition Targets",
      icon: "target",
      link: "/nutritiontargets",
    },
  ],
  Metrics: [
    {
      name: "Dashboard",
      icon: "layout-dashboard",
      link: "/dashboard",
    },
    {
      name: "Timeline",
      icon: "calendar-heart",
      link: "/timeline",
    },
    {
      name: "Measurements",
      icon: "ruler",
      link: "/measurements",
    },
  ],
};
export default navigationLinks;
