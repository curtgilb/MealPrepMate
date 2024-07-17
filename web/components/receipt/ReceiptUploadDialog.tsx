"use client";
import { Button } from "../ui/button";
import { Loader2, Plus } from "lucide-react";
import { ModalDrawer } from "../ModalDrawer";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Dispatch, SetStateAction, useState } from "react";
import { graphql } from "@/gql";
import { useMutation } from "urql";
import { useRouter } from "next/navigation";

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
        description="Upload your grocery store receipt to add prices to ingredients"
        open={open}
        setOpen={setOpen}
        trigger={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Upload Receipt
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
