import { useMemo } from "react";
import { useClinicStore } from "@/lib/store";
import { computeStockStatus } from "@/lib/stock-status";
import { dayKey, isToday, last7Days } from "@/lib/date";
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

export function useDailyRevenueLast7Days() {
  const transactions = useClinicStore((s) => s.transactions);
  return useMemo(() => {
    const days = last7Days();
    const totals = new Map<string, number>();
    for (const t of transactions) {
      const key = dayKey(t.timestamp);
      totals.set(key, (totals.get(key) ?? 0) + t.total);
    }
    return days.map((d) => ({
      date: d,
      key: dayKey(d.toISOString()),
      total: totals.get(dayKey(d.toISOString())) ?? 0,
    }));
  }, [transactions]);
}

export function useDailyEntryTrendLast7Days() {
  const dailyEntries = useClinicStore((s) => s.dailyEntries);
  return useMemo(() => {
    const days = last7Days();
    const patientsByDay = new Map<string, number>();
    const revenueByDay = new Map<string, number>();
    for (const e of dailyEntries) {
      const key = dayKey(e.tanggal);
      patientsByDay.set(key, (patientsByDay.get(key) ?? 0) + e.opVisits + e.nonOpVisits);
      revenueByDay.set(key, (revenueByDay.get(key) ?? 0) + e.opRevenue + e.nonOpRevenue);
    }
    return days.map((d) => {
      const key = dayKey(d.toISOString());
      return {
        date: d,
        key,
        patients: patientsByDay.get(key) ?? 0,
        revenue: revenueByDay.get(key) ?? 0,
      };
    });
  }, [dailyEntries]);
}
