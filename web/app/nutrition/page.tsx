"use client";
import { FragmentType, graphql, useFragment } from "@/gql";

import { getClient } from "@/ssrGraphqlClient";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  GetNutrientsQuery,
  Nutrient,
  NutrientFieldsFragment,
  NutrientType,
} from "@/gql/graphql";
import { string } from "zod";
import { toTitleCase } from "@/utils/utils";
import { useQuery } from "urql";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { MacroPieChart } from "@/components/charts/MacroPieChart";
import { Nutrition } from "@/components/nutrition/NutritionLabel";

const nutritionFields = graphql(`
  fragment NutrientFields on Nutrient {
    id
    alternateNames
    customTarget
    dri {
      value
    }
    name
    parentNutrientId
    type
    unit {
      id
      name
      symbol
      abbreviations
    }
  }
`);

type NutrientMap = {
  [key: string]: NutrientFieldsFragment[];
};

const getNutrientsQuery = graphql(`
  query getNutrients($advanced: Boolean!) {
    nutrients(pagination: { take: 400, offset: 0 }, advanced: $advanced) {
      items {
        ...NutrientFields
      }
    }
  }
`);

export default function NutritionPage() {
  const [advanced, setAdvanced] = useState<boolean>(false);
  const [nutrients, setNutrients] = useState<{ [key: string]: number }>({});

  return (
    <div className="flex flex-col gap-8">
      <div>
        <div>
          <p>Macro Summary</p>
          <div>
            <p>1800 calories</p>
            <p>34 g carbohydrates</p>
            <p>65 g protien</p>
            <p>30 g fat</p>
          </div>
        </div>
        <div>
          {/* <MacroPieChart protien={30} fat={30} alcohol={0} carbohydrates={40} /> */}
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="airplane-mode"
          checked={advanced}
          onCheckedChange={setAdvanced}
        />
        <Label htmlFor="airplane-mode">Advanced View</Label>
      </div>
      <Nutrition
        advanced={advanced}
        nutrientTarget={true}
        edit={false}
        values={nutrients}
        setValues={(id: string, value: number) => {
          const newUpdate = {} as { [key: string]: number };
          newUpdate[id] = value;
          setNutrients({ ...nutrients, ...newUpdate });
        }}
      />
    </div>
  );
}
