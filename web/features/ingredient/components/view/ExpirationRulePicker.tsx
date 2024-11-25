import { Edit } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

import { GenericCombobox } from "@/components/combobox/GenericCombox1";
import { ProgramticModalDrawer } from "@/components/ModalDrawerProgramatic";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  expirationRuleFragment,
  getExpirationRulesQuery,
} from "@/features/ingredient/api/ExpirationRule";
import { IngredientFormType } from "@/features/ingredient/components/edit/EditIngredient";
import {
  convertRuleToFormInput,
  EditExpirationRule,
} from "@/features/ingredient/components/view/EditExpirationRule";
import { ExpirationRuleTable } from "@/features/ingredient/components/view/ExpirationRuleTable";
import { getFragmentData } from "@/gql/fragment-masking";
import { GetExpirationRulesQuery } from "@/gql/graphql";

// WHen you are picking an existing expiration rule
export function ExpirationRule() {
  const [edit, setEdit] = useState(false);
  const [toCreate, setToCreate] = useState(false);

  const form = useFormContext<IngredientFormType>();
  const selectedRule = form.watch("expirationRule");

  return (
    <div className="max-w-prose w-full">
      <FormLabel>Expiration Rule</FormLabel>
      <div className="border rounded-md p-4 space-y-2">
        <div className="flex gap-2 justify-between">
          <FormField
            control={form.control}
            name="expirationRule"
            render={({ field }) => {
              return (
                <FormItem className="mb-4 max-w-60 w-full">
                  <FormControl>
                    <GenericCombobox
                      query={getExpirationRulesQuery}
                      variables={{}}
                      unwrapDataList={(query) => {
                        return query?.expirationRules.edges;
                      }}
                      renderItem={(
                        item: NonNullable<
                          GetExpirationRulesQuery["expirationRules"]["edges"]
                        >[number]
                      ) => {
                        const rule = getFragmentData(
                          expirationRuleFragment,
                          item.node
                        );
                        console.log("rule", convertRuleToFormInput(rule));
                        return convertRuleToFormInput(rule);
                      }}
                      selectedItems={field.value?.id ? [field.value] : []}
                      onChange={(newValue) => {
                        if (newValue.length > 0) {
                          field.onChange(newValue[0]);
                        } else {
                          field.onChange(undefined);
                        }
                      }}
                      multiSelect={false}
                      autoFilter={true}
                      placeholder="Select expiration rule"
                    />
                  </FormControl>
                </FormItem>
              );
            }}
          />
          <Button
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              setToCreate(true);
              setEdit(true);
            }}
          >
            <Edit className="w-4 h-4 mr-2" />
            Create new rule
          </Button>
        </div>

        <ExpirationRuleTable rule={form.watch("expirationRule")} />

        {selectedRule && (
          <Button
            variant="link"
            onClick={() => {
              setToCreate(false);
              setEdit(true);
            }}
          >
            <Edit className="h-4 w-4 mr-2" />
            {`Edit "${selectedRule.name}" rule`}
          </Button>
        )}
      </div>
      <ProgramticModalDrawer
        title={`${toCreate ? "Create" : "Edit"} expiration rule`}
        description="Expiration rules determine how long an ingredient can be stored in the fridge, freezer, etc."
        className="sm:max-w-[500px]"
        open={edit}
        setOpen={setEdit}
        content={
          <EditExpirationRule
            rule={selectedRule}
            create={toCreate}
            onClose={(newRule) => {
              if (newRule) {
                console.log("newRule", newRule);
                form.setValue("expirationRule", newRule);
              }
              setEdit(false);
            }}
          />
        }
      />
    </div>
  );
}
