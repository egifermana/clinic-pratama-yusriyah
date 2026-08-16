"use client";

import { useState } from "react";
import { Boxes, AlertTriangle, XCircle, Users, Wallet, Receipt, Truck } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { LowStockList } from "@/components/dashboard/LowStockList";
import { TopProductsList } from "@/components/dashboard/TopProductsList";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { ChartPeriodToggle } from "@/components/keuangan/ChartPeriodToggle";
import { DailyPatientsChart } from "@/components/keuangan/DailyPatientsChart";
import { DailyRevenueChart } from "@/components/keuangan/DailyRevenueChart";
import { useClinicStore } from "@/lib/store";
import { useLowStockProducts, useTodayTransactions } from "@/lib/store/hooks";
import { formatCurrency } from "@/lib/currency";
import { isToday, CHART_PERIOD_LABELS, type ChartPeriod } from "@/lib/date";

export default function Home() {
  const products = useClinicStore((s) => s.products);
  const orders = useClinicStore((s) => s.orders);
  const dailyEntries = useClinicStore((s) => s.dailyEntries);
  const lowStock = useLowStockProducts();
  const todayTransactions = useTodayTransactions();
  const [chartPeriod, setChartPeriod] = useState<ChartPeriod>("daily");

  const habisCount = products.filter((p) => p.jumlahStok <= 0).length;
  const menipisCount = lowStock.length - habisCount;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const pendapatanHariIni = todayTransactions.reduce((sum, t) => sum + t.total, 0);
  const todayPatients = dailyEntries
    .filter((e) => isToday(e.tanggal))
    .reduce((sum, e) => sum + e.opVisits + e.nonOpVisits, 0);

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
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

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium text-foreground">
          Patients &amp; Revenue — {CHART_PERIOD_LABELS[chartPeriod]}
        </p>
        <ChartPeriodToggle period={chartPeriod} onChange={setChartPeriod} />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Daily Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <DailyPatientsChart period={chartPeriod} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Daily Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <DailyRevenueChart period={chartPeriod} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <LowStockList />
        <TopProductsList />
        <RecentTransactions />
      </div>
    </div>
  );
}
