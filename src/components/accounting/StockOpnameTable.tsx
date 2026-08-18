"use client";

import { useState } from "react";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { StockOpnameFormDialog } from "@/components/accounting/StockOpnameFormDialog";
import { useClinicStore } from "@/lib/store";
import { formatDate } from "@/lib/date";
import { cn } from "@/lib/utils";
import type { StockOpname } from "@/types/accounting/stock-opname";

export function StockOpnameTable() {
  const stockOpnames = useClinicStore((s) => s.stockOpnames);
  const goods = useClinicStore((s) => s.goods);

  const [formOpen, setFormOpen] = useState(false);
  const [viewing, setViewing] = useState<StockOpname | null>(null);

  const goodName = (id: string) => goods.find((g) => g.id === id)?.nama ?? "—";
  const sorted = [...stockOpnames].sort(
    (a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button onClick={() => setFormOpen(true)}>New Stock Opname</Button>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No.</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead>Items Adjusted</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No stock opnames yet.
                </TableCell>
              </TableRow>
            )}
            {sorted.map((o) => {
              const changed = o.lines.filter((l) => l.stokFisik !== l.stokSistem);
              return (
                <TableRow key={o.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">{o.nomor}</TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(o.tanggal)}</TableCell>
                  <TableCell className="max-w-48 truncate">{o.catatan || "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{changed.length}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon-sm" onClick={() => setViewing(o)}>
                      <Eye className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <StockOpnameFormDialog open={formOpen} onOpenChange={setFormOpen} />

      <Dialog open={Boolean(viewing)} onOpenChange={(open) => !open && setViewing(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{viewing?.nomor}</DialogTitle>
            <DialogDescription>{viewing ? formatDate(viewing.tanggal) : ""}</DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-right">System</TableHead>
                  <TableHead className="text-right">Physical</TableHead>
                  <TableHead className="text-right">Delta</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {viewing?.lines
                  .filter((l) => l.stokFisik !== l.stokSistem)
                  .map((l) => {
                    const delta = l.stokFisik - l.stokSistem;
                    return (
                      <TableRow key={l.id}>
                        <TableCell className="truncate">{goodName(l.goodId)}</TableCell>
                        <TableCell className="text-right text-muted-foreground">{l.stokSistem}</TableCell>
                        <TableCell className="text-right">{l.stokFisik}</TableCell>
                        <TableCell
                          className={cn("text-right font-medium", delta < 0 && "text-destructive")}
                        >
                          {delta > 0 ? `+${delta}` : delta}
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
