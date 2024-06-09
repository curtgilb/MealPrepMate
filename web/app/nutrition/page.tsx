"use client";
import { Nutrition } from "@/components/nutrition/NutritionLabel";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

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
