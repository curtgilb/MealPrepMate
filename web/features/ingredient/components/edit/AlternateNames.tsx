"use client";

import { Plus, X } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IngredientFormType } from "@/features/ingredient/components/edit/EditIngredient";
import { toTitleCase } from "@/utils/utils";

export function IngredientAlternateNames() {
  const [newName, setNewName] = useState("");
  const form = useFormContext<IngredientFormType>();
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "alternateNames" as keyof IngredientFormType,
  });

  function addName() {
    const trimmedName = toTitleCase(newName.trim());

    if (trimmedName) {
      append(trimmedName);
      setNewName("");
    }
  }

  return (
    <div>
      <Label className="mb-2 block" htmlFor="alternate-name">
        Alternate Names
      </Label>
      <div className="border rounded-md px-6 py-6 max-w-prose w-full">
        <div className=" w-full mb-8">
          <div className="flex gap-4 items-center">
            <Input
              id="alternate-name"
              placeholder="Enter alternate name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addName();
                }
              }}
            />

            <Button
              className="shrink-0"
              variant="outline"
              size="icon"
              disabled={!newName}
              onClick={() => {
                addName();
              }}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <ul className="grid gap-6">
          {fields.map((field, index) => (
            <li key={field.id}>
              <FormField
                control={form.control}
                name={`alternateNames.${index}`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-normal">
                      Name #{index + 1}
                    </FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-1">
                        <Input
                          {...field}
                          placeholder={`Alternate name #${index + 1}`}
                        />
                        <Button
                          className="shrink-0"
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
