import { Progress } from "@/components/ui/progress";
import { ReceiptItemFragment } from "@/gql/graphql";

interface EditReceiptProgressProps {
  items: ReceiptItemFragment[];
}

export function EditReceiptProgress({ items }: EditReceiptProgressProps) {
  const total = items.length;
  const verified = items.reduce((agg, item) => {
    if (item.verified) {
      return agg + 1;
    }
    return agg;
  }, 0);

  return (
    <div className="mb-4">
      <Progress className="h-3" value={(verified / total) * 100} />
      <p className="text-sm font-light">{`Verified ${verified} of ${total}`}</p>
    </div>
  );
}
