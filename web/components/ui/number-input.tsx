import { Minus, Plus } from "lucide-react";
import { InputWithIcon } from "./InputWithIcon";
import { Label } from "./label";
import { isNumeric } from "@/utils/utils";
import { Dispatch, forwardRef, SetStateAction } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface NumberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  increment: number;
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  ({ className, value, onChange, ...props }, ref) => {
    const onlyAllowNumbers = (value: string): string => {
      return value.replace(/[^0-9]/g, ""); // Replace non-numeric characters with empty string
    };

    return (
      <Input
        ref={ref}
        type="number"
        {...props}
        className={cn("text-center", className)}
        onChange={(e) => {
          e.target.value = onlyAllowNumbers(e.target.value);
          if (onChange) {
            onChange(e);
          }
        }}
      />
    );
  }
);
