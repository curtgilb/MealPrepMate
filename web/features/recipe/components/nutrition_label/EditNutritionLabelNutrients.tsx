import { EnumSelect } from "@/components/EnumSelect";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getPaddingClass } from "@/features/nutrition/components/target/NutritionTargetRow";
import { NutritionFormValues } from "@/features/recipe/hooks/useNutritionLabelForm";
import {
  NutrientWithChildren,
  NutritionDisplayMode,
  UseNutrientResult,
} from "@/hooks/use-nutrients";
import { cn } from "@/lib/utils";
import { toTitleCase } from "@/utils/utils";
import { Fragment, useRef, useState } from "react";
import {
  FieldArrayWithId,
  useFieldArray,
  UseFieldArrayReturn,
  useFormContext,
  UseFormReturn,
} from "react-hook-form";

interface EditNutritionLabelNutrientsProps {
  nutrientMap: UseNutrientResult["nutrientMap"];
}

export function EditNutritionLabelNutrients({
  nutrientMap,
}: EditNutritionLabelNutrientsProps) {
  const [mode, setMode] = useState<NutritionDisplayMode>(
    NutritionDisplayMode.Basic
  );
  const form = useFormContext<NutritionFormValues>();
  const { fields } = useFieldArray({
    control: form.control,
    name: "nutrients",
  });

  const groupedFields = fields
    .filter((field) => {
      const nutrientInfo = nutrientMap[field.nutrientId];
      return (
        (mode === NutritionDisplayMode.Basic &&
          nutrientInfo.advancedView === false) ||
        (mode === NutritionDisplayMode.Favorites &&
          nutrientInfo.important === true) ||
        mode == NutritionDisplayMode.All
      );
    })
    .reduce((group, field) => {
      const nutrientInfo = nutrientMap[field.nutrientId];
      if (!(nutrientInfo.type in group)) {
        group[nutrientInfo.type] = [];
      }
      group[nutrientInfo.type].push(field);
      return group;
    }, {} as { [key: string]: FieldArrayWithId<NutritionFormValues, "nutrients", "id">[] });

  return (
    <fieldset>
      <div className="flex justify-between">
        <legend className="text-lg font-serif">Nutrients</legend>
        <EnumSelect
          className="max-w-32"
          enum={NutritionDisplayMode}
          value={mode}
          onChange={setMode}
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableCell className="font-semibold font-serif">Nutrient</TableCell>
            <TableCell className="font-semibold font-serif text-right">
              Value
            </TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.keys(groupedFields).map((category) => {
            const categoryNutrients = groupedFields[category];
            return (
              <Fragment key={category}>
                <TableRow className="bg-muted/50" aria-colspan={2}>
                  <TableCell className="font-serif font-bold py-2" colSpan={2}>
                    {toTitleCase(category)}
                  </TableCell>
                </TableRow>
                {categoryNutrients.map((field) => {
                  const nutrientInfo = nutrientMap[field.nutrientId];
                  return (
                    <NutrientRow
                      key={field.id}
                      nutrient={nutrientInfo}
                      field={field}
                      control={form.control}
                    />
                  );
                })}
              </Fragment>
            );
          })}
        </TableBody>
      </Table>
    </fieldset>
  );
}

function NutrientRow({
  nutrient,
  field,
  control,
}: {
  nutrient: NutrientWithChildren;
  field: FieldArrayWithId<NutritionFormValues, "nutrients", "id">;
  control: UseFormReturn<NutritionFormValues>["control"];
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleClick() {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }

  return (
    <TableRow onClick={handleClick}>
      <TableCell className={cn("py-1", getPaddingClass(nutrient.depth))}>
        <Label className="font-normal" htmlFor={nutrient.id}>
          {nutrient.name}
        </Label>
      </TableCell>
      <TableCell className="flex justify-end py-1">
        <FormField
          control={control}
          name={`nutrients.${field.index}.value`}
          render={({ field }) => {
            return (
              <FormItem className="max-w-36">
                <FormControl>
                  <div className="flex items-center gap-2">
                    <Input
                      {...field}
                      ref={inputRef}
                      className="h-8"
                      type="number"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    />
                    <p className="min-w-8">{nutrient.unit.symbol}</p>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      </TableCell>
    </TableRow>
  );
}
