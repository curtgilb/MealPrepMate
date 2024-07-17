"use client";
import { FragmentType, graphql, useFragment } from "@/gql";
import { GetReceiptQuery, GetRecipeBaiscInfoQuery } from "@/gql/graphql";
import { ReceiptItem, ReceiptItemFragment } from "../edit/ReceiptItemEdit";
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard,
  MoreVertical,
  Truck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  GroceryStorePicker,
  Store,
} from "@/components/pickers/GroceryStorePicker";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";

interface ReceiptViewProps {
  receipt: GetReceiptQuery["receipt"];
}

const editReceiptMutation = graphql(
  `
    mutation editReceipt($receiptId: String!, $receipt: UpdateReceipt!) {
      updateReceipt(receipt: $receipt, receiptId: $receiptId) {
        id
        imagePath
        total
        merchantName
        matchingStore {
          id
          name
        }
        date
        items {
          ...ReceiptItem
        }
        scanned
      }
    }
  `
);

const receiptInputSchema = z.object({
  date: z.date().optional(),
  store: z.object({ id: z.string(), name: z.string() }),
});

export function ReceiptView({ receipt }: ReceiptViewProps) {
  const items = useFragment(ReceiptItemFragment, receipt.items);
  const form = useForm<z.infer<typeof receiptInputSchema>>({
    resolver: zodResolver(receiptInputSchema),
    defaultValues: {
      store: receipt.matchingStore ?? undefined,
      date: receipt.date ? new Date(receipt.date) : new Date(),
    },
  });

  function updateReceipt(values: z.infer<typeof receiptInputSchema>) {
    console.log(values);
  }

  return (
    <div>
      <h2 className="">Receipt Details</h2>
      {/* <Form {...form}>
        <form
          onSubmit={form.handleSubmit(updateReceipt)}
          className="flex gap-x-6"
        >
          <FormField
            control={form.control}
            name="store"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Grocery Store</FormLabel>
                <FormControl>
                  <GroceryStorePicker
                    select={(store) => {
                      field.onChange(store);
                    }}
                    deselect={() => {
                      field.onChange(undefined);
                    }}
                    selectedIds={field.value ? [field.value.id] : []}
                    multiselect={false}
                    placeholder={
                      field.value ? field.value.name : "Pick a store"
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <DatePicker
                    date={field.value ?? new Date()}
                    onChange={(newDate) => {
                      field.onChange(newDate);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form> */}

      {items?.map((item, index) => {
        return (
          <ReceiptItem
            key={item.id}
            itemNumber={index + 1}
            item={item}
          ></ReceiptItem>
        );
      })}
    </div>
  );
}
