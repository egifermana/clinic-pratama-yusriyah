import type { StockStatus } from "@/types/product";

export function computeStockStatus(jumlahStok: number, stokMinimum: number): StockStatus {
  if (jumlahStok <= 0) return "habis";
  if (jumlahStok <= stokMinimum) return "menipis";
  return "aman";
}

export const STOCK_STATUS_LABEL: Record<StockStatus, string> = {
  aman: "In Stock",
  menipis: "Low Stock",
  habis: "Out of Stock",
};
