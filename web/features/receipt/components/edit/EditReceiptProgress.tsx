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
    <div>
      <Progress className="h-2" value={(verified / total) * 100} />
      <p className="text-xs font-light">{`Verified ${verified} of ${total}`}</p>
    </div>
  );
}
