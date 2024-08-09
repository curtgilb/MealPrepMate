import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ExpirationRuleFieldsFragment } from "@/gql/graphql";

interface ExpirationRuleProps {
  rule: ExpirationRuleFieldsFragment | null | undefined;
}

export function ExpirationRule({ rule }: ExpirationRuleProps) {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Location</TableHead>
            <TableHead>Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Perishable</TableCell>
            <TableCell>{rule?.perishable ? "Yes" : "No"}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Table Life</TableCell>
            <TableCell>
              {!rule || Number.isNaN(rule?.tableLife)
                ? "-"
                : `${rule?.tableLife} days`}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Fridge Life</TableCell>
            <TableCell>
              {!rule || Number.isNaN(rule?.fridgeLife)
                ? "-"
                : `${rule?.fridgeLife} days`}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Freezer Life</TableCell>
            <TableCell>
              {!rule || Number.isNaN(rule?.freezerLife)
                ? "-"
                : `${rule?.freezerLife} days`}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Defrost Time</TableCell>
            <TableCell>
              {!rule || Number.isNaN(rule?.defrostTime)
                ? "-"
                : `${rule?.defrostTime} hours`}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
