"use client";
import { Dispatch, SetStateAction } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export type WeekNumber = number | "Average";

interface WeekSelectProps {
  maxWeek: number;
  week: WeekNumber;
  setWeek: Dispatch<SetStateAction<WeekNumber>>;
}

export function WeekSelect({ week, setWeek, maxWeek }: WeekSelectProps) {
  return (
    <Select
      onValueChange={(value) => {
        if (value === "Average") {
          setWeek(value);
        } else {
          setWeek(Number(value));
        }
      }}
      defaultValue={"Average"}
    >
      <SelectTrigger className="w-52">
        <SelectValue placeholder="Select a week" />
      </SelectTrigger>
      <SelectContent>
        {[...Array(maxWeek)].map((item, index) => {
          return (
            <SelectItem key={index} value={(index + 1).toString()}>
              {`Week ${index + 1}`}
            </SelectItem>
          );
        })}
        <SelectItem value="Average">Cumulative Average</SelectItem>
      </SelectContent>
    </Select>
  );
}
