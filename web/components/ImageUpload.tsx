"use client";
import { graphql } from "@/gql";
import { useMutation } from "urql";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Photo } from "@/gql/graphql";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const formSchema = z.object({
  filePath: z.string().url(),
});

const uploadPhoto = graphql(`
  mutation uploadPhoto($file: File!) {
    uploadPhoto(photo: $file, isPrimary: false) {
      id
      url
      isPrimary
    }
  }
`);

interface ImageUploadFormProps {
  onUploadedPhoto: (photo: Photo) => void;
}

export function ImageUploadForm({ onUploadedPhoto }: ImageUploadFormProps) {
  const [result, upload] = useMutation(uploadPhoto);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { filePath: "" },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    upload({ file: values.filePath }).then((result) => {
      const photo = result.data?.uploadPhoto;
      if (photo) {
        onUploadedPhoto(photo);
      }
    });
  }

  return (
    <div>
      {result.error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{result.error.message}</AlertDescription>
        </Alert>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="filePath"
            render={({ field }) => (
              <FormItem>
                <FormLabel>File</FormLabel>
                <FormControl>
                  <Input type="file" {...field} />
                </FormControl>
                <FormDescription>.jpg, .png, or .tif image</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
