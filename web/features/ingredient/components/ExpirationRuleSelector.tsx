import { GenericCombobox } from "@/components/GenericCombobox";
import { Button } from "@/components/ui/button";
import { getExpirationRulesQuery } from "@/features/ingredient/api/ExpirationRule";
import { ExpirationRule } from "@/features/ingredient/components/ExpirationRule";
import { ExpirationRulePicker } from "@/features/ingredient/components/ExpirationRulePicker";
import {
  ExpirationRuleFieldsFragment,
  GetExpirationRulesQuery,
  GetExpirationRulesQueryVariables,
} from "@/gql/graphql";
import { PlusCircle } from "lucide-react";
import { useState } from "react";

interface ExpirationRuleSelectorProps {}

export function ExpirationRuleSelector() {
  const [rule, setRule] = useState<ExpirationRuleFieldsFragment>();
  return (
    <div className="w-96 bg-white rounded-md">
      <div className="flex justify-between px-3.5 pt-4">
        <GenericCombobox<
          ExpirationRuleFieldsFragment,
          GetExpirationRulesQuery,
          GetExpirationRulesQueryVariables,
          false,
          true
        >
          queryDocument={getExpirationRulesQuery}
          listKey="expirationRules"
          formatLabel={(rule) =>
            rule.variation ? `${rule.name} (${rule.variation})` : rule.name
          }
          placeholder="Select a rule..."
          createNewOption={(newValue) => {
            console.log(newValue);
          }}
          autoFilter
          multiSelect={false}
          onSelect={(rule) => {
            setRule(rule);
          }}
          value={rule}
        />
        <Button variant="outline" size="icon">
          <PlusCircle className="h-4 w-4" />
        </Button>
      </div>
      <ExpirationRule rule={rule} />
    </div>
  );
}
