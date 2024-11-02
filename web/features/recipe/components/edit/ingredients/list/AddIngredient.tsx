import { ModalDrawer } from "@/components/ModalDrawer";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  createRecipeIngredientMutation,
  recipeIngredientFragment,
} from "@/features/recipe/api/RecipeIngredient";
import {
  DEFAULT_KEY,
  useRecipeIngredientContext,
} from "@/features/recipe/hooks/useGroupedRecipeIngredients";
import { getFragmentData } from "@/gql";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@urql/next";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface AddIngredientProps {
  recipeId: string;
}

const nameSchema = z.object({
  value: z.string().min(1, {
    message: "Value is required.",
  }),
});

export function AddIngredient({ recipeId }: AddIngredientProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState<boolean>(false);
  const form = useForm<z.infer<typeof nameSchema>>({
    resolver: zodResolver(nameSchema),
    defaultValues: {
      value: "",
    },
  });
  const {
    groupOrder,
    setGroupOrder,
    groupedIngredients,
    setGroupedIngredients,
  } = useRecipeIngredientContext();

  const [result, createIngredient] = useMutation(
    createRecipeIngredientMutation
  );

  async function handleSubmit(values: z.infer<typeof nameSchema>) {
    await createIngredient({
      recipeId: recipeId,
      ingredient: values.value,
    }).then((result) => {
      if (result?.data) {
        const newIngredients = getFragmentData(
          recipeIngredientFragment,
          result.data.addRecipeIngredientsFromTxt
        );
        const oldDefaultGroup = groupedIngredients[DEFAULT_KEY];

        setGroupedIngredients({
          ...groupedIngredients,
          [DEFAULT_KEY]: [...oldDefaultGroup, ...newIngredients],
        });
      }
      setOpen(false);

      if (!result.error) {
        toast({
          title: "Uh oh...",
          description: "Ingredient couldn't be added",
          variant: "destructive",
        });
      }
    });
  }

  return (
    <ModalDrawer
      title="Add ingredient"
      open={open}
      setOpen={setOpen}
      trigger={
        <Button variant="outline" size="icon">
          <Plus className="h-4 2-4" />
        </Button>
      }
      content={
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Ingredient</FormLabel>
                  <FormControl>
                    <Input placeholder="1 tsp sea salt" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={result.fetching}>
              Add ingredient
            </Button>
          </form>
        </Form>
      }
    />
  );
}
