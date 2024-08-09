import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useQuery } from "@urql/next";
import { getMacroNumbers } from "@/features/nutrition/api/NutrientTarget";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

const MacroValidation = z
  .object({
    calories: z.coerce.number(),
    carbs: z.coerce.number(),
    fat: z.coerce.number(),
    protein: z.coerce.number(),
    alcohol: z.coerce.number(),
  })
  .refine(
    (data) => {
      const macroTotal =
        data.protein * 4 + data.carbs * 4 + data.fat * 9 + data.alcohol * 7;
      const totalCalories = data.calories ?? macroTotal;
      return totalCalories >= data.protein * 4 + data.carbs * 4 + data.fat * 9;
    },
    {
      message:
        "The sum of macronutrients must be less than or equal to the total calories",
    }
  );

export function EditMacroTargets() {
  const [result] = useQuery({ query: getMacroNumbers });
  const { data } = result;
  const form = useForm<z.infer<typeof MacroValidation>>({
    resolver: zodResolver(MacroValidation),
    defaultValues: {
      calories: data?.macroTargets.calories ?? undefined,
      carbs: data?.macroTargets.carbs ?? undefined,
      fat: data?.macroTargets.fat ?? undefined,
      protein: data?.macroTargets.protein ?? undefined,
      alcohol: data?.macroTargets.alcohol ?? undefined,
    },
  });

  function onSubmit(values: z.infer<typeof MacroValidation>) {
    console.log(values);
  }
  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-3 max-w-24"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="calories"
          render={({ field }) => (
            <FormItem className="text-xs w-full space-y-1">
              <FormLabel className="mb-1">Calories</FormLabel>
              <FormControl>
                <Input
                  placeholder="(kcal)S"
                  className="text-sm h-8"
                  type="number"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="carbs"
          render={({ field }) => (
            <FormItem className="text-xs w-full space-y-1">
              <FormLabel>Carbs</FormLabel>
              <FormControl>
                <Input
                  className="text-sm h-8"
                  placeholder="(g)"
                  type="number"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="protein"
          render={({ field }) => (
            <FormItem className="text-xs w-full space-y-1">
              <FormLabel>Protein</FormLabel>
              <FormControl>
                <Input
                  className="text-sm h-8"
                  placeholder="(g)"
                  type="number"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fat"
          render={({ field }) => (
            <FormItem className="text-xs w-full space-y-1">
              <FormLabel>Fat</FormLabel>
              <FormControl>
                <div>
                  <Input
                    className="text-sm h-8"
                    placeholder="(g)"
                    type="number"
                    {...field}
                  />
                  <p>(g)</p>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="alcohol"
          render={({ field }) => (
            <FormItem className="text-xs w-full space-y-1">
              <FormLabel>Alcohol</FormLabel>
              <FormControl>
                <Input
                  className="text-sm h-8"
                  placeholder="(g)"
                  type="number"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button>
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
      </form>
    </Form>
  );
}
