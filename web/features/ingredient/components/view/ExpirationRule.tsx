"use client";
import { useState } from 'react';

import { ModalDrawerWithTrigger } from '@/components/ModalDrawerWithTrigger';
import { Button } from '@/components/ui/button';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { ExpirationRulePicker } from '@/features/ingredient/components/ExpirationRulePicker';
import { ExpirationRuleTable } from '@/features/ingredient/components/view/ExpirationRuleTable';
import { ExpirationRuleFieldsFragment } from '@/gql/graphql';

interface ExpirationRuleProps {
  rule: ExpirationRuleFieldsFragment | null | undefined;
}

export function ExpirationRule({ rule }: ExpirationRuleProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-4">
      <ExpirationRuleDialog />
      <ExpirationRuleTable edit={false} rule={rule} />
    </div>
  );
}

function ExpirationRuleDialog() {
  const [createNew, setCreateNew] = useState(false);
  const [selectedRule, setSelectedRule] =
    useState<ExpirationRuleFieldsFragment | null>(null);

  return (
    <div>
      <ExpirationRulePicker
        selectedRule={selectedRule}
        onChange={setSelectedRule}
      />
    </div>
  );
}
