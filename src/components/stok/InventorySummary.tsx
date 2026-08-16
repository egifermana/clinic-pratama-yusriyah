"use client";

import { Boxes, Layers, Wallet, AlertTriangle, XCircle } from "lucide-react";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { useClinicStore } from "@/lib/store";
import { computeStockStatus } from "@/lib/stock-status";
import { formatCurrency } from "@/lib/currency";

export function InventorySummary() {
  const products = useClinicStore((s) => s.products);

  const totalProducts = products.length;
  const categories = new Set(products.map((p) => p.kategori)).size;
  const totalStockValue = products.reduce(
    (sum, p) => sum + p.jumlahStok * p.hargaCogsStrip,
    0
  );
  const lowStock = products.filter(
    (p) => computeStockStatus(p.jumlahStok, p.stokMinimum) === "menipis"
  ).length;
  const outOfStock = products.filter(
    (p) => computeStockStatus(p.jumlahStok, p.stokMinimum) === "habis"
  ).length;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      <KpiCard label="Total Products" value={String(totalProducts)} icon={Boxes} />
      <KpiCard label="Categories" value={String(categories)} icon={Layers} />
      <KpiCard label="Total Stock Value" value={formatCurrency(totalStockValue)} icon={Wallet} />
      <KpiCard label="Low Stock" value={String(lowStock)} icon={AlertTriangle} tone="warning" />
      <KpiCard label="Out of Stock" value={String(outOfStock)} icon={XCircle} tone="destructive" />
    </div>
  );
}
