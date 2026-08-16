import { InventorySummary } from "@/components/stok/InventorySummary";
import { ProductTable } from "@/components/stok/ProductTable";

export default function StokObatPage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <InventorySummary />
      <ProductTable />
    </div>
  );
}
