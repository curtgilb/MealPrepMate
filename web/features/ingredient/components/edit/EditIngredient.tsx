"use client";
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
import { Textarea } from "@/components/ui/textarea";
import { expirationRuleFragment } from "@/features/ingredient/api/ExpirationRule";
import { getFragmentData } from "@/gql";
import { IngredientFieldsFragment } from "@/gql/graphql";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Save, X, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

const ingredientSchema = z.object({
  name: z.string(),
  alternateNames: z
    .array(z.string().min(1, "String can't be empty"))
    .min(1, "At least one string is required")
    .optional()
    .nullish(),
  storageInstructions: z.string(),
  categoryId: z.string().cuid(),
  expirationRuleId: z.string().cuid().nullish().optional(),
});

type IngredientFormType = z.infer<typeof ingredientSchema>;

interface EditIngredientProps {
  ingredient?: IngredientFieldsFragment | null | undefined;
}

export function EditIngredient({ ingredient }: EditIngredientProps) {
  const router = useRouter();
  const addRef = useRef<HTMLInputElement>(null);
  const expirationRule = getFragmentData(
    expirationRuleFragment,
    ingredient?.expiration
  );
  const form = useForm<IngredientFormType>({
    resolver: zodResolver(ingredientSchema),
    defaultValues: {
      name: ingredient?.name ?? "",
      alternateNames: ingredient?.alternateNames ?? [""],
      storageInstructions: ingredient?.storageInstructions ?? "",
      categoryId: ingredient?.category?.id ?? "",
      expirationRuleId: expirationRule?.id,
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "alternateNames",
    control: form.control,
  });

  function onSubmit(values: IngredientFormType) {}
  return (
    <>
      <h2 className="text-4xl font-black mb-8">
        {ingredient ? `Edit ${ingredient.name}` : "Create new ingredient"}
      </h2>
      <Form {...form}>
        <form
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="max-w-72 w-full">
                <FormLabel>Ingredient Name</FormLabel>
                <FormControl>
                  <Input placeholder="Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="storageInstructions"
            render={({ field }) => (
              <FormItem className="max-w-xl w-full">
                <FormLabel>Storage Instructions</FormLabel>
                <FormControl>
                  <Textarea
                    className="min-h-[200px]"
                    placeholder="Name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="alternateNames"
            render={() => (
              <FormItem>
                <FormLabel>Alternate Names</FormLabel>
                <div className="bg-white rounded-md px-4 py-6 w-full max-w-96 border">
                  <div className="flex gap-4 items-center mb-6">
                    <Input
                      ref={addRef}
                      className="w-full max-w-64"
                      placeholder="Enter alternate name"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          if (addRef.current?.value) {
                            append(addRef.current.value);
                            addRef.current.value = "";
                          }
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        if (addRef.current?.value) {
                          append(addRef.current.value);
                          addRef.current.value = "";
                        }
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add
                    </Button>
                  </div>

                  <div className="grid gap-4">
                    {fields.map((field, index) => (
                      <FormField
                        key={field.id}
                        control={form.control}
                        name={`alternateNames.${index}`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="flex items-center space-x-2">
                                <Input
                                  {...field}
                                  placeholder={`Alternate name #${index + 1}`}
                                />
                                <Button
                                  type="button"
                                  variant="outline"
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
                    ))}
                  </div>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="expirationRuleId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expiration Rule</FormLabel>
                <FormControl>
                  <ExpirationRuleSelector />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-2 mt-8">
            <Button>
              <Save className="h-4 w-4 mr-2" /> Save
            </Button>
            <Button
              variant="outline"
              onClick={(e) => {
                e.preventDefault();
                router.back();
              }}
            >
              <XIcon className="h-4 w-4 mr-2" /> Cancel
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
