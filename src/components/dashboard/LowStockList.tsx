"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/stok/StatusBadge";
import { useLowStockProducts } from "@/lib/store/hooks";

export function LowStockList() {
  const products = useLowStockProducts();

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Stock Needing Attention</CardTitle>
        <Link href="/inventory" className="text-xs text-muted-foreground hover:text-foreground">
          View all
        </Link>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {products.length === 0 ? (
          <p className="text-sm text-muted-foreground">All stock levels are healthy.</p>
        ) : (
          products.slice(0, 6).map((p) => (
            <div key={p.id} className="flex items-center justify-between gap-2 text-sm">
              <span className="min-w-0 flex-1 truncate">{p.nama}</span>
              <span className="text-xs text-muted-foreground">
                {p.jumlahStok} {p.satuan}
              </span>
              <StatusBadge jumlahStok={p.jumlahStok} stokMinimum={p.stokMinimum} />
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
