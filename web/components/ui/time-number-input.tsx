import { Dispatch, SetStateAction } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { InputWithIcon } from "./InputWithIcon";
import { Minus, Plus } from "lucide-react";

interface TimeNumberInputProps {
  id: string;
  label: string;
  value: number;
  onUpdate: (update: number) => void;
}

export function TimeNumberInput({
  id,
  label,
  value,
  onUpdate: setValue,
}: TimeNumberInputProps) {
  const hours = Math.floor(value / 60);
  const mins = value % 60;
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex gap-4">
        <div>
          <p className="text-xs text-muted-foreground">Hours</p>
          <InputWithIcon
            className="text-center h-8"
            startIcon={Minus}
            endIcon={Plus}
            value={hours}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              if (Number.isInteger(value)) {
                const newMinutes = value * 60;
                const oldMinutes = 60 * hours;
                setValue(value - oldMinutes + newMinutes);
              }
            }}
            onStartClick={() => {
              setValue(value - 60);
            }}
            onEndClick={() => {
              setValue(value + 60);
            }}
          />
        </div>

        <div>
          <p className="text-xs text-muted-foreground">Minutes</p>
          <InputWithIcon
            className="text-center h-8"
            startIcon={Minus}
            endIcon={Plus}
            value={mins}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              if (Number.isInteger(value)) {
                setValue(value - mins + value);
              }
            }}
            onStartClick={() => {
              setValue(value - 15);
            }}
            onEndClick={() => {
              setValue(value + 15);
            }}
          />
        </div>
      </div>
    </div>
  );
}
