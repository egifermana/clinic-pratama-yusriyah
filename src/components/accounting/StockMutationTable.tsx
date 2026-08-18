"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { StockMutationFormDialog } from "@/components/accounting/StockMutationFormDialog";
import { useClinicStore } from "@/lib/store";
import { formatCurrency } from "@/lib/currency";
import { formatDate } from "@/lib/date";
import type { StockMutationType } from "@/types/accounting/stock-mutation";

interface StockMutationTableProps {
  tipes: StockMutationType[];
  addLabel: string;
  emptyLabel: string;
  fixedTipe?: StockMutationType;
}

export function StockMutationTable({ tipes, addLabel, emptyLabel, fixedTipe }: StockMutationTableProps) {
  const stockMutations = useClinicStore((s) => s.stockMutations);
  const goods = useClinicStore((s) => s.goods);
  const [formOpen, setFormOpen] = useState(false);

  const goodName = (id: string) => goods.find((g) => g.id === id)?.nama ?? "—";
  const filtered = stockMutations
    .filter((m) => tipes.includes(m.tipe))
    .sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button onClick={() => setFormOpen(true)}>{addLabel}</Button>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No.</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Item</TableHead>
              {tipes.length > 1 && <TableHead>Direction</TableHead>}
              <TableHead>Qty</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={tipes.length > 1 ? 7 : 6} className="h-24 text-center text-muted-foreground">
                  {emptyLabel}
                </TableCell>
              </TableRow>
            )}
            {filtered.map((m) => (
              <TableRow key={m.id}>
                <TableCell className="font-mono text-xs text-muted-foreground">{m.nomor}</TableCell>
                <TableCell className="text-muted-foreground">{formatDate(m.tanggal)}</TableCell>
                <TableCell className="font-medium">{goodName(m.goodId)}</TableCell>
                {tipes.length > 1 && (
                  <TableCell>
                    <Badge variant={m.tipe === "masuk" ? "outline" : "secondary"}>
                      {m.tipe === "masuk" ? "Masuk" : "Keluar"}
                    </Badge>
                  </TableCell>
                )}
                <TableCell>{m.qty}</TableCell>
                <TableCell className="text-muted-foreground">{formatCurrency(m.qty * m.hargaSatuan)}</TableCell>
                <TableCell className="max-w-40 truncate text-muted-foreground">{m.catatan || "—"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <StockMutationFormDialog open={formOpen} onOpenChange={setFormOpen} fixedTipe={fixedTipe} />
    </div>
  );
}
