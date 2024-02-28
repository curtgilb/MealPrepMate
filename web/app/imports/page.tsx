import { imports, columns } from "@/data/Import";
import { DataTable } from "@/components/DataTable";
export default function ImportsPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <DataTable columns={columns} data={imports} />
    </div>
  );
}
