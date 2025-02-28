import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, onChange, onKeyDown, ...props }, ref) => {
    const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (type === "number") {
        // Allow empty string (for backspace/delete)
        if (e.target.value === "") {
          onChange?.(e);
          return;
        }

        // Test if the input is a valid number (including decimals)
        const isValidNumber = /^-?\d*\.?\d*$/.test(e.target.value);

        if (isValidNumber) {
          onChange?.(e);
        }
      } else {
        onChange?.(e);
      }
    };

    // Prevent invalid number characters
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (type === "number") {
        // Allow: backspace, delete, tab, escape, enter, decimal point, minus sign
        const allowedKeys = [
          "Backspace",
          "Delete",
          "Tab",
          "Escape",
          "Enter",
          ".",
          "-",
        ];

        // Allow numbers
        if (/^\d$/.test(e.key)) {
          onKeyDown?.(e);
          return;
        }

        // Block invalid characters for number input
        if (!allowedKeys.includes(e.key)) {
          e.preventDefault();
          return;
        }

        // Prevent multiple decimal points
        if (e.key === "." && e.currentTarget.value.includes(".")) {
          e.preventDefault();
          return;
        }

        // Prevent multiple minus signs or minus sign in middle of number
        if (
          e.key === "-" &&
          (e.currentTarget.value.includes("-") ||
            e.currentTarget.selectionStart !== 0)
        ) {
          e.preventDefault();
          return;
        }
      }

      onKeyDown?.(e);
    };

    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
        onChange={handleNumberInput}
        onKeyDown={handleKeyDown}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
