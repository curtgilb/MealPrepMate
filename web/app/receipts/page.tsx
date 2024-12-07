import SingleColumnCentered from "@/components/layouts/single-column-centered";
import { ReceiptsList } from "@/features/receipt/components/ReceiptsList";
import { ReceiptUpload } from "@/features/receipt/components/ReceiptUploadDialog";

export default function ReceiptPage() {
  return (
    <SingleColumnCentered>
      <div className="flex justify-between">
        <h1 className="font-serif text-4xl font-extrabold mb-8">Receipts</h1>
        <ReceiptUpload />
      </div>
      <ReceiptsList />
    </SingleColumnCentered>
  );
}
