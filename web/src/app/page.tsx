"use client";
import React, { useState } from "react";
import { gql, useMutation } from "urql";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Suspense } from "react";

const UPLOAD_FILE = gql`
  mutation UploadFile($file: File!) {
    import(file: $file)
  }
`;

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File>();
  const [result, uploadFile] = useMutation(UPLOAD_FILE);

  const { data, fetching, error } = result;
  const handleFileUpload = () => {
    console.log("Button click");
    uploadFile({ file: selectedFile });
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
      console.log(selectedFile);
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
