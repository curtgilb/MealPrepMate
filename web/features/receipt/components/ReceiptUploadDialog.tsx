"use client";

import { Loader2, Plus } from "lucide-react";
import { ModalDrawer } from "@/components/ModalDrawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { graphql } from "@/gql";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { useMutation } from "urql";

const uploadReceipt = graphql(`
  mutation uploadReceipt($file: File!) {
    uploadReceipt(file: $file) {
      id
    }
  }
`);

export function ReceiptUpload() {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <>
      <ModalDrawer
        title="Upload receipt"
        description="Upload a photo of your grocery store receipt to add prices to ingredients"
        open={open}
        setOpen={setOpen}
        trigger={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Upload receipt
          </Button>
        }
        content={<ReceiptUploadDialog open={open} setOpen={setOpen} />}
      />
    </>
  );
}

interface ReceiptUploadDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

function ReceiptUploadDialog({ open, setOpen }: ReceiptUploadDialogProps) {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File>();
  const [result, uploadFile] = useMutation(uploadReceipt);

  const handleFileUpload = () => {
    uploadFile({ file: selectedFile }).then((uploadResult) => {
      router.push(
        `/ingredients/receipt/${uploadResult.data?.uploadReceipt.id}`
      );
    });
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  return (
    <>
      <Input onChange={handleFileChange} id="receipt" type="file" />
      <Button disabled={result.fetching} onClick={handleFileUpload}>
        {result.fetching ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </>
        ) : (
          "Submit"
        )}
      </Button>
    </>
  );
}
