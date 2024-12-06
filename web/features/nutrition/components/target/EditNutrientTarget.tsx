"use client";
import { Dispatch, SetStateAction, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
    Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { setNutritionTarget } from '@/features/mealplan/api/NutrientTarget';
import { NutrientFieldsFragment, TargetPreference } from '@/gql/graphql';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@urql/next';

interface EditNutrientTargetProps {
  nutrient: NutrientFieldsFragment;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const targetValidationSchema = z.object({
  value: z.coerce.number().nonnegative(),
  threshold: z.coerce.number().min(0).max(100),
  preference: z.nativeEnum(TargetPreference),
});

type NutrientTargetFormType = z.infer<typeof targetValidationSchema>;

function toFormValues(nutrient: NutrientFieldsFragment) {
  return {
    value: nutrient.target?.nutrientTarget ?? 0,
    threshold: nutrient.target?.threshold ?? 0,
    preference: nutrient.target?.preference ?? TargetPreference.None,
  };
}

export function EditNutrientTarget({
  nutrient,
  setOpen,
}: EditNutrientTargetProps) {
  const [{ fetching }, updateTarget] = useMutation(setNutritionTarget);
  const form = useForm<NutrientTargetFormType>({
    resolver: zodResolver(targetValidationSchema),
    defaultValues: toFormValues(nutrient),
  });
  const target = form.watch("value");

  useEffect(() => {
    form.reset(toFormValues(nutrient));
  }, [nutrient, form]);

  async function onSubmit(values: NutrientTargetFormType) {
    await updateTarget({
      id: nutrient.id,
      target: values,
    }).then(() => {
      setOpen(false);
    });
  }
  const unit = nutrient.unit?.symbol;

  return (
    <div>
      <Form {...form}>
        <form
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="justify-around flex">
            <div>
              <p id="dri-value" className=" font-bold align-center text-center">
                {nutrient.dri?.value ? `${nutrient.dri?.value} ${unit}` : "N/A"}
              </p>
              <Label htmlFor="dri-value" className="text-center block">
                DRI
              </Label>
            </div>

            <div>
              <p id="upper-limit" className="text-lg font-bold text-center">
                {nutrient.dri?.upperLimit
                  ? `${nutrient.dri?.upperLimit} ${unit}`
                  : "N/A"}
              </p>
              <Label htmlFor="upper-limit" className="text-center block">
                Upper Limit
              </Label>
            </div>
          </div>

          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Custom Target ({unit})</FormLabel>
                <FormControl className="min-w-52">
                  <Input type="number" {...field} disabled={fetching} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="preference"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preference</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={fetching}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={"NONE"}>None</SelectItem>
                    <SelectItem value={"OVER"}>Goal (exceed)</SelectItem>
                    <SelectItem value={"UNDER"}>Limit (stay under)</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Would it be better to exceed or stay under the target?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="threshold"
            render={({ field }) => (
              <FormItem className="grow">
                <FormLabel>Target Margin</FormLabel>
                <FormControl className="min-w-52">
                  <Input type="number" {...field} disabled={fetching} />
                </FormControl>
                <FormDescription>
                  {field.value
                    ? `A ${field.value}% margin allows for ${Math.round(
                        field.value * 0.01 * target
                      )} ${unit} deviation from the target`
                    : "e.g., 10 allows for a 10% deviation from target"}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="mt-8" type="submit" disabled={fetching}>
            {fetching ? "Saving..." : "Save"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
