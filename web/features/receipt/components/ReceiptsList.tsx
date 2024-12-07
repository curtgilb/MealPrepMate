"use client";
import { DataTable } from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getReceiptsQuery } from "@/features/receipt/api/Receipt";
import { GetReceiptQuery, GetReceiptsQuery } from "@/gql/graphql";
import { ColumnDef } from "@tanstack/react-table";
import { useQuery } from "@urql/next";
import { Eye } from "lucide-react";
import Link from "next/link";

export const columns: ColumnDef<
  GetReceiptsQuery["receipts"]["edges"][number]["node"]
>[] = [
  {
    accessorKey: "verified",
    header: "Status",
    cell: ({ row }) => {
      const completed = row.original.verified;
      return (
        <Badge variant={completed ? "default" : "secondary"}>
          {completed ? "Complete" : "Review"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "dateUploaded",
    header: "Upload Date",
    cell: ({ row }) => {
      const date = row.original.dateUploaded;
      return new Date(date as string).toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
        year: "numeric",
      });
    },
  },
  {
    accessorKey: "date",
    header: "Receipt Date",
    cell: ({ row }) => {
      const date = row.original.date;
      return new Date(date as string).toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
        year: "numeric",
      });
    },
  },
  {
    accessorKey: "matchingStore",
    header: "Store",
    cell: ({ row }) => {
      return row.original.matchingStore?.name ?? "-";
    },
  },
  {
    accessorKey: "total",
    header: "Amount",
    cell: ({ row }) => {
      return row.original.total ? `$${row.original.total}` : "-";
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <Button variant="outline" className="h-8" asChild>
          <Link href={`/receipts/${row.original.id}`}>
            <Eye />
            View
          </Link>
        </Button>
      );
    },
  },
];

export function ReceiptsList() {
  const [result] = useQuery({ query: getReceiptsQuery });
  const data = result?.data?.receipts.edges.map((node) => node.node) ?? [];

  console.log(data);

  return (
    <>
      <DataTable columns={columns} data={data} />
    </>
  );
}
