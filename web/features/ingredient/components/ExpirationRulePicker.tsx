import { GenericCombobox } from '@/components/combobox/GenericCombox1';
import {
    expirationRuleFragment, getExpirationRulesQuery
} from '@/features/ingredient/api/ExpirationRule';
import { getFragmentData } from '@/gql/fragment-masking';
import { ExpirationRuleFieldsFragment, GetExpirationRulesQuery } from '@/gql/graphql';

interface ExpirationRulePickerProps {
  selectedRule: ExpirationRuleFieldsFragment | null;
  onChange: (rule: ExpirationRuleFieldsFragment | null) => void;
}

export function ExpirationRulePicker({
  selectedRule,
  onChange,
}: ExpirationRulePickerProps) {
  const rule = selectedRule
    ? { ...selectedRule, label: selectedRule.name ?? "" }
    : null;

  return (
    <GenericCombobox
      query={getExpirationRulesQuery}
      variables={{}}
      renderItem={(
        item: GetExpirationRulesQuery["expirationRules"]["edges"][number]
      ) => {
        const rule = getFragmentData(expirationRuleFragment, item.node);
        return {
          ...rule,
          label: rule.name,
        };
      }}
      unwrapDataList={(list) => list?.expirationRules.edges ?? []}
      placeholder="Select expiration rule"
      autoFilter={false}
      multiSelect={false}
      selectedItems={rule ? [rule] : []}
      onChange={(items) => {
        onChange(items[0] ?? null);
      }}
    />
  );
}
