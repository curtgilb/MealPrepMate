import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

export function DeleteIngredientGroup() {
  return (
    <Button variant="ghost" size="sm">
      <Trash className="h-4 w-4" />
    </Button>
  );
}
