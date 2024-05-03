import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FragmentType, graphql, useFragment } from "@/gql";
import { NutrientFieldsFragment } from "@/gql/graphql";
import { useNutrients, NutrientMap } from "@/hooks/use-nutrients";
import { isNumeric, toTitleCase } from "@/utils/utils";
import { useQuery } from "urql";
import { Input } from "../ui/input";
import { useState } from "react";

interface NutritionLabelProps {
  edit: boolean;
  advanced?: boolean;
  nutrientTarget?: boolean;
  values: { [key: string]: number };
  setValues: (nutrientId: string, value: number) => void;
}

export function Nutrition({
  edit,
  values,
  setValues,
  nutrientTarget = false,
  advanced = false,
}: NutritionLabelProps) {
  const [groupCategory, childLookup] = useNutrients(advanced);
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nutrient</TableHead>
          {nutrientTarget && <TableHead>Daily Recommended Intake</TableHead>}
          <TableHead className="text-right">
            {nutrientTarget ? "Custom Daily Target" : "Amount"}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Object.entries(groupCategory).map(([category, nutrients]) => {
          return (
            <>
              <TableRow key={category}>
                <TableCell colSpan={nutrientTarget ? 3 : 2}>
                  <p className="text-xl font-bold">{toTitleCase(category)}</p>
                </TableCell>
              </TableRow>
              {nutrients.map((nutrient) => {
                return (
                  <NutritionTableRow
                    key={nutrient.id}
                    nutrient={nutrient}
                    edit={edit}
                    nutrientTarget={nutrientTarget}
                    childNutrientsMap={childLookup}
                    values={values}
                    setValues={setValues}
                  ></NutritionTableRow>
                );
              })}
            </>
          );
        })}
      </TableBody>
    </Table>
  );
}

interface NutritionTableRowProps extends NutritionLabelProps {
  nutrient: NutrientFieldsFragment;
  childNutrientsMap: NutrientMap;
  depth?: number;
}

function NutritionTableRow({
  nutrient,
  childNutrientsMap,
  nutrientTarget,
  edit,
  values,
  setValues,
  depth = 1,
}: NutritionTableRowProps) {
  const padding = {
    1: "ps-4",
    2: "ps-8",
    3: "ps-12",
    4: "ps-14",
  } as { [key: number]: string };
  const [amount, setAmount] = useState<number>();
  const driDisplay = nutrient.dri?.value
    ? `${nutrient.dri.value} ${nutrient.unit.symbol}`
    : "";
  const childNutrients =
    nutrient.id in childNutrientsMap ? childNutrientsMap[nutrient.id] : [];

  const initialValue =
    (nutrientTarget ? nutrient.customTarget : values[nutrient.id]) ?? undefined;
  return (
    <>
      <TableRow
        onClick={(e) => {
          console.log(e);
        }}
      >
        <TableCell>
          <p className={padding[depth]}>{nutrient.name}</p>
        </TableCell>
        {nutrientTarget && <TableCell>{driDisplay}</TableCell>}
        <TableCell>
          <div className="flex justify-end">
            {edit ? (
              <div className="max-w-44 w-full flex items-baseline gap-2 justify-between">
                <Input
                  className="w-24 h-8"
                  defaultValue={initialValue}
                  type="number"
                  value={amount}
                  onChange={(e) => {
                    const newAmount = e.target.value;
                    if (isNumeric(newAmount)) {
                      const parsedAmount = parseFloat(newAmount);
                      setAmount(parsedAmount);
                      setValues(nutrient.id, parsedAmount);
                    }
                  }}
                ></Input>
                <p>{nutrient.unit.name}s</p>
              </div>
            ) : (
              <p>{`${initialValue} ${nutrient.unit.name}s`}</p>
            )}
          </div>
        </TableCell>
      </TableRow>
      {childNutrients.length > 0 &&
        childNutrients.map((nutrient) => {
          return (
            <NutritionTableRow
              key={nutrient.id}
              edit={edit}
              nutrient={nutrient}
              nutrientTarget={nutrientTarget}
              childNutrientsMap={childNutrientsMap}
              values={values}
              setValues={setValues}
              depth={depth + 1}
            />
          );
        })}
    </>
  );
}
