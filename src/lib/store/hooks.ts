import { useMemo } from "react";
import { useClinicStore } from "@/lib/store";
import { computeStockStatus } from "@/lib/stock-status";
import { chartBuckets, isToday, isWithinDateRange, type ChartPeriod } from "@/lib/date";
import type { Product } from "@/types/product";

export function useHydrated(): boolean {
  return useClinicStore((s) => s.hasHydrated);
}

export function useLowStockProducts(): Product[] {
  const products = useClinicStore((s) => s.products);
  return useMemo(
    () => products.filter((p) => computeStockStatus(p.jumlahStok, p.stokMinimum) !== "aman"),
    [products]
  );
}

export function useTodayTransactions() {
  const transactions = useClinicStore((s) => s.transactions);
  return useMemo(() => transactions.filter((t) => isToday(t.timestamp)), [transactions]);
}

export function useTopProducts(limit = 5) {
  const transactions = useClinicStore((s) => s.transactions);
  return useMemo(() => {
    const totals = new Map<string, { namaProduk: string; qty: number }>();
    for (const t of transactions) {
      for (const item of t.items) {
        const existing = totals.get(item.productId);
        if (existing) {
          existing.qty += item.qty;
        } else {
          totals.set(item.productId, { namaProduk: item.namaProduk, qty: item.qty });
        }
      }
    }
    return [...totals.values()].sort((a, b) => b.qty - a.qty).slice(0, limit);
  }, [transactions, limit]);
}

export function useDailyEntryTrend(period: ChartPeriod) {
  const dailyEntries = useClinicStore((s) => s.dailyEntries);
  return useMemo(() => {
    const buckets = chartBuckets(period);
    return buckets.map((bucket) => {
      let patients = 0;
      let revenue = 0;
      for (const e of dailyEntries) {
        if (!isWithinDateRange(e.tanggal, bucket.start, bucket.end)) continue;
        patients += e.opVisits + e.nonOpVisits;
        revenue += e.opRevenue + e.nonOpRevenue;
      }
      return { label: bucket.label, patients, revenue };
    });
  }, [dailyEntries, period]);
}
