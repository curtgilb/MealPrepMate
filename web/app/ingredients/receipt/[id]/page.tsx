"use client";
import { ComboboxDemo } from "@/components/GrocerySearch";
import { ReceiptItem } from "@/components/receipt/edit/ReceiptItemEdit";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { graphql } from "@/gql";
import { useQuery } from "@urql/next";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { BreadcrumbPath } from "@/components/generics/Breadcrumb";
import { ReceiptView } from "@/components/receipt/view/ReceiptView";

const receiptQuery = graphql(/* GraphQL */ `
  query getReceipt($id: String!) {
    receipt(id: $id) {
      id
      imagePath
      total
      merchantName
      date
      items {
        ...ReceiptItem
      }
      scanned
    }
  }
`);

export default function Receipt() {
  const params = useParams<{ id: string }>();
  const [result, executeQuery] = useQuery({
    query: receiptQuery,
    variables: { id: params.id },
  });
  const { data, fetching, error } = result;

  // Poll the server until the receipt is scanned
  useEffect(() => {
    if (!fetching && !data?.receipt.scanned) {
      const id = setTimeout(
        () => executeQuery({ requestPolicy: "network-only" }),
        1000
      );
      return () => clearTimeout(id);
    }
  }, [data, fetching, executeQuery]);

  return (
    <>
      <BreadcrumbPath
        path={[
          { name: "Ingredients", link: "/ingredients" },
          { name: "Receipt upload", link: "/ingredients/receipt" },
        ]}
      />
      <h1 className="text-5xl font-black">Receipt Upload</h1>
      <div className="grid grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Receipt Image</CardTitle>
          </CardHeader>
          <CardContent>
            {data?.receipt && (
              <Image
                src={`http://localhost:9000/${data?.receipt.imagePath}`}
                title="Uploaded Receipt"
                alt="uploaded Receipt"
                width={400}
                height={800}
                style={{
                  width: "100%",
                  height: "auto",
                }}
              />
            )}
          </CardContent>
        </Card>

        <div>
          <ReceiptView />
        </div>
      </div>
    </>
  );
}
