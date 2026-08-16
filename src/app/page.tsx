"use client";

import { Boxes, AlertTriangle, XCircle, Users, Wallet, Receipt, Truck } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { LowStockList } from "@/components/dashboard/LowStockList";
import { TopProductsList } from "@/components/dashboard/TopProductsList";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { useClinicStore } from "@/lib/store";
import { useLowStockProducts, useTodayTransactions } from "@/lib/store/hooks";
import { formatCurrency } from "@/lib/currency";
import { isToday } from "@/lib/date";

export default function Home() {
  const products = useClinicStore((s) => s.products);
  const orders = useClinicStore((s) => s.orders);
  const dailyEntries = useClinicStore((s) => s.dailyEntries);
  const lowStock = useLowStockProducts();
  const todayTransactions = useTodayTransactions();

  const habisCount = products.filter((p) => p.jumlahStok <= 0).length;
  const menipisCount = lowStock.length - habisCount;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const pendapatanHariIni = todayTransactions.reduce((sum, t) => sum + t.total, 0);
  const todayPatients = dailyEntries
    .filter((e) => isToday(e.tanggal))
    .reduce((sum, e) => sum + e.opVisits + e.nonOpVisits, 0);

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
        <KpiCard label="Total Products" value={String(products.length)} icon={Boxes} />
        <KpiCard label="Low Stock" value={String(menipisCount)} icon={AlertTriangle} tone="warning" />
        <KpiCard label="Out of Stock" value={String(habisCount)} icon={XCircle} tone="destructive" />
        <KpiCard label="Daily Patients" value={String(todayPatients)} icon={Users} />
        <KpiCard
          label="Today's Revenue"
          value={formatCurrency(pendapatanHariIni)}
          icon={Wallet}
        />
        <KpiCard label="Today's Transactions" value={String(todayTransactions.length)} icon={Receipt} />
        <KpiCard label="Pending Orders" value={String(pendingOrders)} icon={Truck} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue — Last 7 Days</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueChart />
          </CardContent>
        </Card>
        <LowStockList />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <TopProductsList />
        <RecentTransactions />
      </div>
    </div>
  );
}
