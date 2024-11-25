"use client";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type BMRFormula = "mifflin" | "harris" | "katch";

interface TDEECalculatorProps {
  className?: string;
}

const activityLevels = [
  { value: 1.2, label: "Sedentary (little or no exercise)" },
  { value: 1.375, label: "Lightly active (light exercise 1-3 days/week)" },
  { value: 1.55, label: "Moderately active (moderate exercise 3-5 days/week)" },
  { value: 1.725, label: "Very active (hard exercise 6-7 days/week)" },
  { value: 1.9, label: "Extra active (very hard exercise & physical job)" },
];

export function TDEECalculator({ className }: TDEECalculatorProps) {
  const [formula, setFormula] = useState<BMRFormula>("mifflin");
  const [weight, setWeight] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [bodyFat, setBodyFat] = useState<string>("");
  const [activityLevel, setActivityLevel] = useState<number>(1.2);
  const [bmr, setBmr] = useState<number | null>(null);
  const [tdee, setTdee] = useState<number | null>(null);

  const calculateBMR = () => {
    const weightKg = Number(weight);
    const heightCm = Number(height);
    const ageYears = Number(age);
    const bodyFatPercentage = Number(bodyFat);

    let calculatedBMR = 0;

    switch (formula) {
      case "mifflin":
        calculatedBMR =
          10 * weightKg +
          6.25 * heightCm -
          5 * ageYears +
          (gender === "male" ? 5 : -161);
        break;
      case "harris":
        if (gender === "male") {
          calculatedBMR =
            66.47 + 13.75 * weightKg + 5.003 * heightCm - 6.755 * ageYears;
        } else {
          calculatedBMR =
            655.1 + 9.563 * weightKg + 1.85 * heightCm - 4.676 * ageYears;
        }
        break;
      case "katch":
        const leanMass = weightKg * (1 - bodyFatPercentage / 100);
        calculatedBMR = 370 + 21.6 * leanMass;
        break;
    }

    setBmr(Math.round(calculatedBMR));
    setTdee(Math.round(calculatedBMR * activityLevel));
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>TDEE Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Formula</Label>
          <Select
            value={formula}
            onValueChange={(value) => setFormula(value as BMRFormula)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select formula" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mifflin">Mifflin-St Jeor</SelectItem>
              <SelectItem value="harris">Harris-Benedict</SelectItem>
              <SelectItem value="katch">Katch-McArdle</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {formula !== "katch" && (
          <>
            <div className="space-y-2">
              <Label>Gender</Label>
              <Select
                value={gender}
                onValueChange={(value) => setGender(value as "male" | "female")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Age (years)</Label>
              <Input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Enter age"
              />
            </div>
          </>
        )}

        <div className="space-y-2">
          <Label>Weight (kg)</Label>
          <Input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Enter weight in kg"
          />
        </div>

        {formula !== "katch" && (
          <div className="space-y-2">
            <Label>Height (cm)</Label>
            <Input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="Enter height in cm"
            />
          </div>
        )}

        {formula === "katch" && (
          <div className="space-y-2">
            <Label>Body Fat %</Label>
            <Input
              type="number"
              value={bodyFat}
              onChange={(e) => setBodyFat(e.target.value)}
              placeholder="Enter body fat percentage"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label>Activity Level</Label>
          <Select
            value={activityLevel.toString()}
            onValueChange={(value) => setActivityLevel(Number(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select activity level" />
            </SelectTrigger>
            <SelectContent>
              {activityLevels.map((level) => (
                <SelectItem key={level.value} value={level.value.toString()}>
                  {level.label} ({level.value})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button className="w-full" onClick={calculateBMR}>
          Calculate TDEE
        </Button>

        {bmr !== null && tdee !== null && (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">BMR:</span>
                  <span>{bmr} calories/day</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">TDEE:</span>
                  <span>{tdee} calories/day</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
