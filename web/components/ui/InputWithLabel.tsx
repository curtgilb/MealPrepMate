import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { isNumeric } from "@/utils/utils";

interface InputWithLabelProps {
  id: string;
  label: string;
  value: string | number | undefined;
  defaultValue?: string | number | undefined;
  placeholder?: string;
  message?: string;
  type?: string;
  setValue: (value: string) => void | ((value: number) => void);
}

export function InputWithLabel({
  id,
  label,
  placeholder,
  defaultValue,
  message,
  value,
  setValue,
  type = "text",
}: InputWithLabelProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      {message && <p className="text-xs text-muted-foreground">{message}</p>}
      <Input
        id={id}
        type={type}
        defaultValue={defaultValue}
        value={value}
        placeholder={placeholder}
        onChange={(e) => {
          if (type === "number") {
            if (isNumeric(e.target.value)) {
              setValue(e.target.value);
            }
          } else {
            setValue(e.target.value);
          }
        }}
      />
    </div>
  );
}
