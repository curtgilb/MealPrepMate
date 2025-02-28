"use client";
import { useEffect } from "react";

import SingleColumnCentered from "@/components/layouts/single-column-centered";
import { receiptQuery } from "@/features/receipt/api/Receipt";
import { EditReceipt } from "@/features/receipt/components/edit/EditReceipt";
import { useQuery } from "@urql/next";

export default function Receipt({ params }: { params: { id: string } }) {
  const [{ data, fetching, error }, executeQuery] = useQuery({
    query: receiptQuery,

    variables: { id: decodeURIComponent(params.id) },
  });

  // Poll the server until the receipt is scanned
  // useEffect(() => {
  //   if (!data?.receipt.scanned && !error) {
  //     const id = setTimeout(
  //       () => executeQuery({ requestPolicy: "network-only" }),
  //       2000
  //     );
  //     return () => clearTimeout(id);
  //   }
  // }, [data, error, executeQuery]);

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
