"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useClinicStore } from "@/lib/store";
import { formatCurrency } from "@/lib/currency";
import { formatDateTime } from "@/lib/date";

export function RecentTransactions() {
  const transactions = useClinicStore((s) => s.transactions);
  const recent = [...transactions]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {recent.length === 0 ? (
          <p className="text-sm text-muted-foreground">No transactions yet.</p>
        ) : (
          recent.map((t) => (
            <div key={t.id} className="flex items-center justify-between gap-2 text-sm">
              <div className="min-w-0">
                <p className="truncate">{t.items.map((i) => i.namaProduk).join(", ")}</p>
                <p className="text-xs text-muted-foreground">{formatDateTime(t.timestamp)}</p>
              </div>
              <span className="shrink-0 font-medium">{formatCurrency(t.total)}</span>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
