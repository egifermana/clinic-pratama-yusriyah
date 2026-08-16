import { useClinicStore } from "@/lib/store";
import type { Product } from "@/types/product";
import type { Supplier } from "@/types/supplier";
import type { PurchaseOrder } from "@/types/order";
import type { Transaction } from "@/types/transaction";
import type { DailyEntry } from "@/types/finance";

interface ClinicDataExport {
  version: 1;
  exportedAt: string;
  products: Product[];
  suppliers: Supplier[];
  orders: PurchaseOrder[];
  transactions: Transaction[];
  dailyEntries: DailyEntry[];
}

export function exportClinicData(): void {
  const state = useClinicStore.getState();
  const payload: ClinicDataExport = {
    version: 1,
    exportedAt: new Date().toISOString(),
    products: state.products,
    suppliers: state.suppliers,
    orders: state.orders,
    transactions: state.transactions,
    dailyEntries: state.dailyEntries,
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `klinik-pratama-yusriyah-backup-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

export async function importClinicData(file: File): Promise<void> {
  const text = await file.text();
  const data = JSON.parse(text) as Partial<ClinicDataExport>;

  if (!data || typeof data !== "object") {
    throw new Error("Invalid backup file");
  }

  useClinicStore.setState({
    products: Array.isArray(data.products) ? data.products : [],
    suppliers: Array.isArray(data.suppliers) ? data.suppliers : [],
    orders: Array.isArray(data.orders) ? data.orders : [],
    transactions: Array.isArray(data.transactions) ? data.transactions : [],
    dailyEntries: Array.isArray(data.dailyEntries) ? data.dailyEntries : [],
    seeded: true,
  });
}
