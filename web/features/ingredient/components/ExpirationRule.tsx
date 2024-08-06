import { FragmentType, graphql, useFragment } from "@/gql";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../../../components/ui/button";
import { Link } from "lucide-react";

const expirationFragment = graphql(`
  fragment ExpirationRuleFields on ExpirationRule {
    id
    name
    variation
    perishable
    tableLife
    freezerLife
    fridgeLife
    defrostTime
  }
`);

export function ExpirationRule(props: {
  expirationRule?: FragmentType<typeof expirationFragment>;
}) {
  const rule = useFragment(expirationFragment, props.expirationRule);
  return (
    <div>
      <p>Fresh Fruit (this variant)</p>
      <Button variant="outline">
        <Link className="mr-2 h-4 w-4" />
        Change Rule
      </Button>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Location</TableHead>
            <TableHead>Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Perishable</TableCell>
            <TableCell>Yes</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Table Life</TableCell>
            <TableCell>6</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Fridge Life</TableCell>
            <TableCell>10</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Freezer Life</TableCell>
            <TableCell>30</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Defrost Time</TableCell>
            <TableCell>1</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
