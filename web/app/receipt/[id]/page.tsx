"use client";
import { useEffect } from "react";

import SingleColumnCentered from "@/components/layouts/single-column-centered";
import {
  receiptItemFragment,
  receiptQuery,
} from "@/features/receipt/api/Receipt";
import { EditReceipt } from "@/features/receipt/components/edit/EditReceipt";
import { getFragmentData } from "@/gql";
import { getClient } from "@/ssrGraphqlClient";
import { useQuery } from "@urql/next";

export default function Receipt({ params }: { params: { id: string } }) {
  const [{ data, fetching, error }, executeQuery] = useQuery({
    query: receiptQuery,
    requestPolicy: "network-only",
    pause: true,
    variables: { id: decodeURIComponent(params.id) },
  });

  // Poll the server until the receipt is scanned
  useEffect(() => {
    if (!data?.receipt.scanned && !error) {
      const id = setTimeout(
        () => executeQuery({ requestPolicy: "network-only" }),
        2000
      );
      return () => clearTimeout(id);
    }
  }, [data, error, executeQuery]);

  if (!data?.receipt || !data?.receipt.scanned) {
    return <p>Scanning receipt...</p>;
  }

  return (
    <SingleColumnCentered>
      <h1 className="text-4xl font-serif font-black mb-6">Receipt Upload</h1>
      <EditReceipt receipt={data.receipt} />
    </SingleColumnCentered>
  );
}
