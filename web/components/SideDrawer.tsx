import links from "@/data/navigation";
import { Icon } from "@/components/Icon";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { link } from "fs";

export function SideDrawer() {
  return (
    <div className="space-y-4 py-4 w-56">
      {Object.entries(links).map(([heading, subLinks]) => (
        <div key={heading} className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            {heading}
          </h2>
          <ul className="space-y-1">
            {subLinks.map((link) => (
              <li key={link.link}>
                <Link
                  className={`${buttonVariants({
                    variant: "ghost",
                  })} w-full flex justify-start`}
                  href={link.link}
                >
                  <Icon name={link.icon} className="mr-2 h-4 w-4" />
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
