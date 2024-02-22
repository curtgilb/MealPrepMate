"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Suspense } from "react";
import { useMutation, gql } from "@urql/next";

const UPLOAD_FILE = gql`
  mutation importRecipeKeeper($file: File!) {
    import(file: $file, type: CRONOMETER) {
      id
      status
    }
  }
`;

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File>();
  const [result, uploadFile] = useMutation(UPLOAD_FILE);
  const { data, fetching, error } = result;

  const handleFileUpload = () => {
    console.log(`${selectedFile}`);
    uploadFile({ file: selectedFile });
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };
  return (
    <Suspense>
      <main>
        <Label htmlFor="picture">Picture</Label>
        <Input onChange={handleFileChange} id="picture" type="file" />
        <Button onClick={handleFileUpload}>Submit</Button>
      </main>
    </Suspense>
  );
}
