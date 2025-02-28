"use client";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";

import { ModalDrawerWithTrigger } from "../../../components/ModalDrawerWithTrigger";

export default function ImportFileUpload() {
  return (
    <ModalDrawerWithTrigger
      title="Upload file"
      description="Import a file from Cronometer or Recipe Keeper"
      trigger={
        <Button variant="secondary">
          <Plus className="mr-2 h-4 w-4" /> Import file
        </Button>
      }
      content={<UploadImportFileDialog />}
    />
  );
}

const formSchema = z.object({
  filePath: z.string().min(2).max(50),
  type: z.string(),
});

function UploadImportFileDialog() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { filePath: "", type: "Cronometer" },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {}

  return (
    <div>
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
                <FormDescription>
                  Make sure the files are zippped
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Import Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type of import" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="RECIPE_KEEPER">Recipe Keeper</SelectItem>
                    <SelectItem value="CRONOMETER">Cronometer</SelectItem>
                  </SelectContent>
                </Select>
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
