"use client";
import { IngredientSearchList } from "@/components/ingredient/IngredientSearchList";
import { ReceiptUpload } from "@/components/receipt/ReceiptUploadDialog";
import { Button } from "@/components/ui/button";
import { InputWithIcon } from "@/components/ui/InputWithIcon";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function IngredientsPage() {
  const [search, setSearch] = useState<string>();

  return (
    <div>
      <h1 className="text-4xl font-black">Ingredients</h1>
      <div className="flex items-center justify-between py-8">
        <InputWithIcon
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          className="w-80"
          startIcon={Search}
        />
        <div className="flex gap-2">
          <Link href="/ingredients/create">
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add ingredient
            </Button>
          </Link>

          <ReceiptUpload />
        </div>
      </div>
      <ScrollArea className="h-[900px] pr-4">
        <div className="grid grid-cols-autofit-horizontal gap-8">
          <IngredientSearchList searchTerm={search} />
        </div>
      </ScrollArea>
    </div>
  );
}
