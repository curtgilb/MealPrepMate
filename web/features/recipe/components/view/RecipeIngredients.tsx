import { HTMLAttributes, useMemo } from "react";

import { RecipeIngredientFieldsFragment } from "@/gql/graphql";
import { cn } from "@/lib/utils";

interface RecipeIngredientsProps extends HTMLAttributes<HTMLDivElement> {
  ingredients: RecipeIngredientFieldsFragment[] | null | undefined;
  scale: number;
}

type GroupedIngredient = {
  [key: string]: { groupId: string; lines: RecipeIngredientFieldsFragment[] };
};

function convertFractionToDecimal(fraction: string): number {
  // Handle mixed fractions (e.g., "1 1/2")
  const mixedParts = fraction.trim().split(" ");
  if (mixedParts.length === 2) {
    const whole = parseInt(mixedParts[0]);
    const fractionalPart = mixedParts[1].split("/");
    return whole + parseInt(fractionalPart[0]) / parseInt(fractionalPart[1]);
  }

  // Handle simple fractions (e.g., "1/2")
  const parts = fraction.split("/");
  if (parts.length === 2) {
    return parseInt(parts[0]) / parseInt(parts[1]);
  }

  // Handle decimal numbers
  return parseFloat(fraction);
}

function formatNumber(num: number): string {
  // For small amounts (less than 1/16), return decimal
  if (num < 0.0625) {
    return num.toFixed(2).replace(/\.?0+$/, "");
  }

  // For amounts that are close to common fractions, return the fraction
  const fractions: [number, string][] = [
    [0.25, "1/4"],
    [0.33, "1/3"],
    [0.5, "1/2"],
    [0.66, "2/3"],
    [0.75, "3/4"],
    [0.125, "1/8"],
    [0.375, "3/8"],
    [0.625, "5/8"],
    [0.875, "7/8"],
  ];

  // Handle whole numbers and mixed fractions
  const wholePart = Math.floor(num);
  const decimal = num - wholePart;

  // If it's a whole number, return it as is
  if (decimal === 0) {
    return wholePart.toString();
  }

  // Find the closest fraction for the decimal part
  let closest = fractions.reduce((prev, curr) => {
    return Math.abs(decimal - curr[0]) < Math.abs(decimal - prev[0])
      ? curr
      : prev;
  });

  // If the difference is small enough, use the fraction
  if (Math.abs(decimal - closest[0]) < 0.05) {
    return wholePart === 0 ? closest[1] : `${wholePart} ${closest[1]}`;
  }

  // Fall back to decimal if no close fraction is found
  return num.toFixed(2).replace(/\.?0+$/, "");
}

function RecipeLineFormatter({ text, scale }: { text: string; scale: number }) {
  // Match decimal numbers, fractions, and mixed fractions
  const match = text.match(/(\d*\s*\d+\/\d+|\d*\.?\d+)/);

  if (!match) return <>{text}</>;

  const originalAmount = match[0];
  const number = convertFractionToDecimal(originalAmount);
  const scaledNumber = formatNumber(number * scale);
  const parts = text.split(originalAmount);

  return (
    <>
      {parts[0]}
      <strong>{scaledNumber}</strong>
      {parts[1]}
    </>
  );
}

export default function RecipeIngredients({
  ingredients,
  scale = 1, // provide default value
  className,
  ...rest
}: RecipeIngredientsProps) {
  const groupedIngredients = useMemo(() => {
    return ingredients?.reduce((agg, ingredient) => {
      const id = ingredient.group?.id ?? "";
      const group = ingredient.group?.name ?? "";
      if (!(group in agg)) {
        agg[group] = { groupId: id, lines: [] };
      }
      agg[group].lines.push(ingredient);

      return agg;
    }, {} as GroupedIngredient);
  }, [ingredients]);

  return (
    <div className={cn("flex flex-col gap-8", className)} {...rest}>
      {groupedIngredients &&
        Object.entries(groupedIngredients).map(([groupName, group]) => {
          return (
            <div key={group.groupId}>
              <h3 className="font-semibold">{groupName}</h3>
              <ul className="flex flex-col gap-2">
                {group.lines.map((line) => {
                  return (
                    <p
                      key={line.id}
                      style={{ textIndent: "-0.5rem", paddingLeft: "0.5rem" }}
                      className="text-indent"
                    >
                      <RecipeLineFormatter text={line.sentence} scale={scale} />
                    </p>
                  );
                })}
              </ul>
            </div>
          );
        })}
    </div>
  );
}
