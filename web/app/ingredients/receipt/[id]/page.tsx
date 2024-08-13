"use client";
import { BreadcrumbPath } from "@/components/generics/Breadcrumb";

import { Card, CardContent } from "@/components/ui/card";
import { ReceiptView } from "@/features/receipt/components/view/ReceiptView";
import { receiptQuery } from "@/graphql/receipt/queries";
import { useQuery } from "@urql/next";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect } from "react";

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
      <h1 className="text-4xl font-black mb-6">Receipt Upload</h1>

      <Card className="py-8">
        <CardContent className="flex gap-x-14">
          {data?.receipt && (
            <div>
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
            </div>
          )}
          {data?.receipt && <ReceiptView receipt={data.receipt} />}
        </CardContent>
      </Card>
    </>
  );
}
