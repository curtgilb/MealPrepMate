import { Button } from "@/components/ui/button";
import { graphql } from "@/gql";
import { Check } from "lucide-react";
import { useMutation } from "@urql/next";



function VerifyReceipt() {
  
  return (
    <Button onClick={() => P{}}>
      Finalize <Check className="w-4 h-4" />
    </Button>
  );
}
