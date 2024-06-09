import { Minus, Plus } from "lucide-react";
import { InputWithIcon } from "./InputWithIcon";
import { Label } from "./label";
import { isNumeric } from "@/utils/utils";
import { Dispatch, SetStateAction } from "react";
import { cn } from "@/lib/utils";

interface NumberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  width?: 1 | 2 | 3 | 4 | 5;
  value: number;
  increment: number;
  defaultValue?: number;
  setValue: Dispatch<SetStateAction<number>>;
}
export function NumberInput({
  id,
  label,
  value,
  increment,
  width,
  defaultValue,
  className,
  setValue,
  ...props
}: NumberInputProps) {
  return (
    <div className="w-28">
      <Label htmlFor={id}>{label}</Label>
      <InputWithIcon
        {...props}
        id={id}
        startIcon={Minus}
        endIcon={Plus}
        value={value}
        onChange={(e) => {
          console.log(e.target.value);
          if (isNumeric(e.target.value)) {
            const num = +e.target.value;
            setValue(num);
          }
        }}
        className={cn("text-center", className)}
        onStartClick={() => {
          const newNum = value !== undefined ? value : defaultValue;
          if (newNum && newNum - increment > 0) {
            setValue(newNum - increment);
          }
        }}
        onEndClick={() => {
          const newNum = value ? value : defaultValue;
          if (newNum) {
            setValue(newNum + increment);
          }
        }}
        defaultValue={defaultValue}
      />
    </div>
  );
}
