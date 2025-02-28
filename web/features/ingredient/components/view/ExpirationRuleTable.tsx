"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  createExpirationRuleMutation,
  editExpirationRuleMutation,
} from "@/features/ingredient/api/ExpirationRule";
import { IngredientFormType } from "@/features/ingredient/components/edit/EditIngredient";
import { ExpirationRuleFieldsFragment } from "@/gql/graphql";
import { useMutation } from "@urql/next";

type RuleKey = keyof Pick<
  ExpirationRuleFieldsFragment & IngredientFormType["expirationRule"],
  "perishable" | "tableLife" | "fridgeLife" | "freezerLife" | "defrostTime"
>;

type RowConfig = {
  label: string;
  key: RuleKey;
  unit?: string;
  formatValue?: (value: any) => string;
};

export const expirationTableRows: RowConfig[] = [
  {
    label: "Perishable",
    key: "perishable",
    formatValue: (value: boolean) => (value ? "Yes" : "No"),
  },
  {
    label: "Table Life",
    key: "tableLife",
    unit: "days",
  },
  {
    label: "Fridge Life",
    key: "fridgeLife",
    unit: "days",
  },
  {
    label: "Freezer Life",
    key: "freezerLife",
    unit: "days",
  },
  {
    label: "Defrost Time",
    key: "defrostTime",
    unit: "hours",
  },
];

type ExpirationRuleForTable = Omit<ExpirationRuleFieldsFragment, "id">;

interface ExpirationRuleTableProps {
  rule: ExpirationRuleForTable | null | undefined;
  setRule?: (rule: ExpirationRuleForTable) => void;
}

export function ExpirationRuleTable({
  rule,
  setRule,
}: ExpirationRuleTableProps) {
  const formatValue = (row: RowConfig) => {
    const value = rule?.[row.key];
    if (row.formatValue) {
      return row.formatValue(value);
    }
    if (!rule || Number.isNaN(value)) {
      return "-";
    }
    return `${value} ${row.unit}`;
  };

  return (
    <Table className="rounded-md overflow-hidden font-light">
      <TableBody>
        {expirationTableRows.map((row, index) => (
          <TableRow
            key={row.key}
            className={`${
              index % 2 === 0
                ? "bg-muted/50 hover:bg-muted/50"
                : "hover:!bg-transparent"
            }`}
          >
            <TableCell className="py-2.5">{row.label}</TableCell>
            <TableCell className="py-2.5">{formatValue(row)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

// export function EditExpirationRule({
//   rule,
//   setRule,
// }: {
//   rule: ExpirationRuleFieldsFragment | null | undefined;
//   setRule?: (rule: ExpirationRuleFieldsFragment) => void;
// }) {
//   const form = useForm<ExpirationRuleFormType>({
//     defaultValues: {
//       name: rule?.name ?? "",
//       variation: rule?.variation ?? "",
//       perishable: rule?.perishable ?? false,
//       tableLife: rule?.tableLife ?? undefined,
//       fridgeLife: rule?.fridgeLife ?? undefined,
//       freezerLife: rule?.freezerLife ?? undefined,
//       defrostTime: rule?.defrostTime ?? undefined,
//     },
//   });

//   const [newRule, createRule] = useMutation(createExpirationRuleMutation);
//   const [editedRule, updateRule] = useMutation(editExpirationRuleMutation);

//   async function handleSubmit(values: ExpirationRuleFormType) {
//     if (rule) {
//       await updateRule({ id: rule.id, input: values });
//     } else {
//       await createRule({ input: values });
//     }
//   }

//   return (
//     <Form {...form}>
//       <form>
//         <FormField
//           control={form.control}
//           name="name"
//           render={({ field }) => (
//             <FormItem className="max-w-96">
//               <FormLabel>Name</FormLabel>
//               <FormControl>
//                 <Input {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="variation"
//           render={({ field }) => (
//             <FormItem className="max-w-96">
//               <FormLabel>Variation</FormLabel>
//               <FormControl>
//                 <Input {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <Table className="rounded-md overflow-hidden font-light">
//           <TableBody>
//             {expirationTableRows.map((row, index) => (
//               <TableRow
//                 key={row.key}
//                 className={`${
//                   index % 2 === 0
//                     ? "bg-muted/50 hover:bg-muted/50"
//                     : "hover:!bg-transparent"
//                 }`}
//               >
//                 <TableCell className="py-2.5">{row.label}</TableCell>
//                 <TableCell className="py-2.5">
//                   <FormField
//                     control={form.control}
//                     name="name"
//                     render={({ field }) => (
//                       <FormItem className="max-w-96">
//                         <FormLabel>Name</FormLabel>
//                         <FormControl>
//                           <Input {...field} />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </form>
//     </Form>
//   );
// }
