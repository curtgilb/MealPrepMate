import { Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { useMutation } from "urql";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  createExpirationRuleMutation,
  editExpirationRuleMutation,
  expirationRuleFragment,
} from "@/features/ingredient/api/ExpirationRule";
import { getFragmentData } from "@/gql";
import {
  CreateExpirationRuleMutation,
  ExpirationRuleFieldsFragment,
} from "@/gql/graphql";
import { zodResolver } from "@hookform/resolvers/zod";

export function convertRuleToFormInput(
  rule: ExpirationRuleFieldsFragment | null | undefined | ExpirationRuleFormType
): ExpirationRuleFormType {
  console.log("preconversion", rule);
  return {
    id: rule?.id ?? "Default",
    name: rule?.name ?? "",
    label: `${rule?.name} ${rule?.variation ? `(${rule?.variation})` : ""}`,
    variation: rule?.variation ?? "",
    perishable: rule?.perishable ?? false,
    tableLife: rule?.tableLife ?? undefined,
    fridgeLife: rule?.fridgeLife ?? undefined,
    freezerLife: rule?.freezerLife ?? undefined,
    defrostTime: rule?.defrostTime ?? undefined,
  };
}

export const expirationRuleSchema = z.object({
  id: z.string(),
  name: z.string(),
  label: z.string(),
  variation: z.string().optional(),
  perishable: z.boolean().nullable(),
  tableLife: z.coerce.number().nonnegative().optional(),
  fridgeLife: z.coerce.number().nonnegative().optional(),
  freezerLife: z.coerce.number().nonnegative().optional(),
  defrostTime: z.coerce.number().nonnegative().optional(),
});

type ExpirationRuleFormType = z.infer<typeof expirationRuleSchema>;

export function EditExpirationRule({
  rule,
  onClose,
  create,
}: {
  rule: ExpirationRuleFormType | null | undefined;
  create: boolean;
  onClose: (rule: ExpirationRuleFormType | null) => void;
}) {
  const draftRule = create ? null : rule;
  const [createdRule, createRule] = useMutation(createExpirationRuleMutation);
  const [updatedRule, updateRule] = useMutation(editExpirationRuleMutation);
  const { fetching: creatingRule } = createdRule;
  const { fetching: updatingRule } = updatedRule;
  const loading = creatingRule || updatingRule;

  const form = useForm<ExpirationRuleFormType>({
    resolver: zodResolver(expirationRuleSchema),
    defaultValues: convertRuleToFormInput(draftRule),
  });

  const onSubmit = async (values: ExpirationRuleFormType) => {
    try {
      console.log("submitted", values);
      const { id, label, ...input } = values;
      let fragment:
        | CreateExpirationRuleMutation["createExpirationRule"]
        | undefined;

      if (create) {
        const result = await createRule({ input: input });
        fragment = result?.data?.createExpirationRule;
      } else if (rule?.id) {
        const result = await updateRule({
          id: rule.id,
          input: input,
        });
        fragment = result?.data?.editExpirationRule;
      }
      const newRule = convertRuleToFormInput(
        getFragmentData(expirationRuleFragment, fragment)
      );
      onClose(newRule);
    } catch (error) {
      console.error("Error creating expiration rule:", error);
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-6">
        <div className="grid gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rule Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., Fresh Produce" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="variation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Variation</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., Leafy Greens" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="perishable"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 ">
                <FormControl>
                  <Checkbox
                    checked={field.value ?? false}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Perishable</FormLabel>
                </div>
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="tableLife"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Counter Life (days)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fridgeLife"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fridge Life (days)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="freezerLife"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Freezer Life (days)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="defrostTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Defrost Time (hours)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <Button
            className="w-full sm:w-auto"
            type="button"
            disabled={loading}
            onClick={(e) => {
              console.log("form state", form.formState.errors);
              form.handleSubmit(onSubmit)(e);
            }}
          >
            <Save className="h-4 w-4 mr-2" />
            {loading ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
