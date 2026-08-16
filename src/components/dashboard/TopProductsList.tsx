"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useTopProducts } from "@/lib/store/hooks";

export function TopProductsList() {
  const top = useTopProducts(5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Selling Products</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {top.length === 0 ? (
          <p className="text-sm text-muted-foreground">No transactions yet.</p>
        ) : (
          top.map((p, i) => (
            <div key={p.namaProduk} className="flex items-center justify-between gap-2 text-sm">
              <div className="flex min-w-0 items-center gap-2">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                  {i + 1}
                </span>
                <span className="truncate">{p.namaProduk}</span>
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">{p.qty} sold</span>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
