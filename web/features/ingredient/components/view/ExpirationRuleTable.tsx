import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { ExpirationRuleFieldsFragment } from '@/gql/graphql';

export function ExpirationRuleTable({
  edit,
  rule,
}: {
  edit: boolean;
  rule: ExpirationRuleFieldsFragment | null | undefined;
}) {
  return (
    <Table className="rounded-md overflow-hidden font-light">
      <TableBody>
        <TableRow className="bg-muted/50 hover:bg-muted/50">
          <TableCell className="py-2.5">Perishable</TableCell>
          <TableCell className="py-2.5">
            {rule?.perishable ? "Yes" : "No"}
          </TableCell>
        </TableRow>
        <TableRow className="hover:!bg-transparent">
          <TableCell className="py-2.5">Table Life</TableCell>
          <TableCell className="py-2.5">
            {!rule || Number.isNaN(rule?.tableLife)
              ? "-"
              : `${rule?.tableLife} days`}
          </TableCell>
        </TableRow>
        <TableRow className="bg-muted/50 hover:bg-muted/50">
          <TableCell className="py-2.5">Fridge Life</TableCell>
          <TableCell className="py-2.5">
            {!rule || Number.isNaN(rule?.fridgeLife)
              ? "-"
              : `${rule?.fridgeLife} days`}
          </TableCell>
        </TableRow>
        <TableRow className="hover:!bg-transparent odd:bg-muted/50">
          <TableCell className="py-2.5">Freezer Life</TableCell>
          <TableCell className="py-2.5">
            {!rule || Number.isNaN(rule?.freezerLife)
              ? "-"
              : `${rule?.freezerLife} days`}
          </TableCell>
        </TableRow>
        <TableRow className="bg-muted/50 hover:bg-muted/50">
          <TableCell className="py-2.5">Defrost Time</TableCell>
          <TableCell className="py-2.5">
            {!rule || Number.isNaN(rule?.defrostTime)
              ? "-"
              : `${rule?.defrostTime} hours`}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
