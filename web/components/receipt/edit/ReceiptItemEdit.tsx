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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { FragmentType, graphql, useFragment } from "@/gql";
import { zodResolver } from "@hookform/resolvers/zod";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const ReceiptItemFragment = graphql(`
  fragment ReceiptItem on ReceiptLine {
    id
    totalPrice
    description
    quantity
    perUnitPrice
    unitQuantity
    foodType
    matchingUnit {
      id
      name
    }
    matchingIngredient {
      id
      name
    }
  }
`);

interface ReceiptItem {
  itemNumber: number;
  item: FragmentType<typeof ReceiptItemFragment>;
}

function toTitleCase(str: string | null | undefined) {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(" ")
    .map(function (word) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

const formSchema = z.object({
  username: z.string().min(2).max(50),
  totalPrice: z.number(),
  quantity: z.number(),
  matchingUnit: z.string().min(2).max(50),
  matchingIngredient: z.string().min(2).max(50),
});

export function ReceiptItem({ itemNumber, item }: ReceiptItem) {
  const lineItem = useFragment(ReceiptItemFragment, item);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      totalPrice: 3,
      quantity: 1,
      matchingUnit: "adsf",
      matchingIngredient: "adf",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-cols justify-between">
          <div>
            <CardTitle>{toTitleCase(lineItem.description)}</CardTitle>

            <CardDescription>Item {`#${itemNumber}`}</CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4"></MoreVertical>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Trash2 className="h-4 w-4 mr-2" />
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex flex-cols gap-4 flex-wrap">
              <FormField
                control={form.control}
                name="matchingIngredient"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Matching Ingredient</FormLabel>
                    <FormControl>
                      <Input placeholder="Pita Bread" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Qty</FormLabel>
                    <FormControl>
                      <Input className="w-20" type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="totalPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Price</FormLabel>
                    <FormControl>
                      <Input className="w-24" type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="totalPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Size</FormLabel>
                    <FormControl>
                      <Input className="w-24" type="number" {...field} />
                    </FormControl>
                    <FormDescription>Weight or volume</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="totalPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Size unit</FormLabel>
                    <FormControl>
                      <Input className="w-28" type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="totalPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Food Type</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </CardContent>
      {/* <CardFooter>
        <Button>Save and continue</Button>
      </CardFooter> */}
    </Card>
  );
}
