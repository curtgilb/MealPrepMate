import SingleColumnCentered from "@/components/layouts/single-column-centered";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CircleAlert, Terminal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <SingleColumnCentered className="h-full flex justify-center items-center">
      <div className=" max-w-prose">
        <Image
          src="/mealprepmate.svg"
          alt="Meal Prep Mate logo"
          height={200}
          width={200}
          priority
        ></Image>
        <Alert className="my-6">
          <CircleAlert className="h-4 w-4" />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>
            This is the public demo site of Meal Prep Mate, so any changes you
            make here will be seen by everyone.
          </AlertDescription>
        </Alert>
        <p className="mb-4">
          Meal Prep Mate is a meal planning app designed to reduce the headaches
          that come with planning and cooking meals at home. It aims to make
          home cooking easier and healthier by guiding you through every step,
          from menu planning to sending timely reminders about defrosting
          ingredients.
        </p>

        <p className="mb-4">
          To learn more about this project, check out{" "}
          <Link
            className="text-blue-500 hover:underline"
            href="https://www.curtgilbert.com/projects/meal-prep-mate"
            target="_blank"
          >
            the article
          </Link>{" "}
          I wrote about it.
        </p>
        <p className="mb-4">
          If you’re interested in the vision and app features, check out the the
          project’s{" "}
          <Link
            className="text-blue-500 hover:underline"
            href="https://github.com/curtgilb/MealPrepMate/wiki/MealPrepMate-Vision"
            target="_blank"
          >
            wiki page.
          </Link>
        </p>
      </div>
    </SingleColumnCentered>
  );
}
