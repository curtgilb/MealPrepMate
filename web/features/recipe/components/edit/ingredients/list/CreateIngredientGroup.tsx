import { FolderPlus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { ModalDrawerWithTrigger } from "@/components/ModalDrawerWithTrigger";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { createRecipeIngredientGroupMutation } from "@/features/recipe/api/RecipeIngredientGroups";
import { useRecipeIngredientContext } from "@/features/recipe/hooks/useGroupedRecipeIngredients";
import { toTitleCase } from "@/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@urql/next";

interface CreateIngredientGroupProps {
  recipeId: string;
}

const nameSchema = z.object({
  name: z.preprocess(
    toTitleCase,
    z.string({
      message: "Name is required.",
    })
  ),
});

export function CreateIngredientGroup({
  recipeId,
}: CreateIngredientGroupProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState<boolean>(false);
  const form = useForm<z.infer<typeof nameSchema>>({
    resolver: zodResolver(nameSchema),
    defaultValues: {
      name: "",
    },
  });
  const {
    groupOrder,
    setGroupOrder,
    groupedIngredients,
    setGroupedIngredients,
  } = useRecipeIngredientContext();
  const [result, createGroup] = useMutation(
    createRecipeIngredientGroupMutation
  );

  async function handleSubmit(values: z.infer<typeof nameSchema>) {
    await createGroup({ recipeId: recipeId, name: values.name }).then(
      (result) => {
        if (result?.data) {
          const newGroup = result.data.createIngredientGroup;
          setGroupedIngredients({ ...groupedIngredients, [newGroup.name]: [] });
          setGroupOrder([...groupOrder, newGroup.name]);
        }

        if (result.error) {
          toast({
            title: "Uh oh...",
            description: "New ingredient group could not be created",
          });
        }
        setOpen(false);
      }
    );
  }

  return (
    <ModalDrawerWithTrigger
      title="Add ingredient group"
      open={open}
      setOpen={setOpen}
      trigger={
        <Button variant="outline" size="icon">
          <FolderPlus className="h-4 2-4" />
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    i.e., garnishes, marinade, etc.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={result.fetching}>
              Create group
            </Button>
          </form>
        </Form>
      }
    />
  );
}
