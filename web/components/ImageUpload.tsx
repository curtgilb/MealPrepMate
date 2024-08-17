"use client";
import { uploadPhotoMutation } from "@/api/Photo";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Photo } from "@/gql/graphql";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "urql";
import { z } from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const formSchema = z.object({
  filePath: z.instanceof(File, { message: "Please upload a file" }),
});

interface ImageUploadFormProps {
  onUploadedPhoto: (photo: Photo) => void;
}

export function ImageUploadForm({ onUploadedPhoto }: ImageUploadFormProps) {
  const [result, upload] = useMutation(uploadPhotoMutation);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { filePath: undefined },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    upload({ file: values.filePath }).then((result) => {
      console.log("mutation response", result);
      const photo = result.data?.uploadPhoto;
      if (photo) {
        onUploadedPhoto(photo);
      }
    });
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="filePath"
            render={({ field }) => {
              const { value, ...rest } = field;
              return (
                <FormItem>
                  <FormLabel>File</FormLabel>
                  <FormControl>
                    <Input
                      {...rest}
                      type="file"
                      onChange={(e) => {
                        const newFile = e.target.files;
                        if (newFile && newFile[0]) {
                          form.setValue("filePath", newFile[0]);
                        }
                      }}
                    />
                  </FormControl>
                  <FormDescription>.jpg, .png, or .tif image</FormDescription>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
