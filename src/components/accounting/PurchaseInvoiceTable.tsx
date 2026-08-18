"use client";

import { useState } from "react";
import { MoreHorizontal, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { PurchaseInvoiceFormDialog } from "@/components/accounting/PurchaseInvoiceFormDialog";
import { SettlementFormDialog } from "@/components/accounting/SettlementFormDialog";
import { useClinicStore } from "@/lib/store";
import { formatCurrency } from "@/lib/currency";
import { formatDate } from "@/lib/date";
import { paymentStatus, type PaymentStatus } from "@/types/accounting/payment-status";
import type { PurchaseInvoice } from "@/types/accounting/purchase";

const STATUS_LABEL: Record<PaymentStatus, string> = {
  "belum-lunas": "Belum Lunas",
  sebagian: "Sebagian",
  lunas: "Lunas",
};

export function PurchaseInvoiceTable() {
  const purchaseInvoices = useClinicStore((s) => s.purchaseInvoices);
  const partners = useClinicStore((s) => s.partners);

  const [formOpen, setFormOpen] = useState(false);
  const [paying, setPaying] = useState<PurchaseInvoice | null>(null);

  const partnerName = (id: string) => partners.find((p) => p.id === id)?.nama ?? "—";
  const sorted = [...purchaseInvoices].sort(
    (a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button onClick={() => setFormOpen(true)}>New Purchase</Button>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No.</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No purchase invoices yet.
                </TableCell>
              </TableRow>
            )}
            {sorted.map((inv) => {
              const status = paymentStatus(inv.total, inv.dibayar);
              return (
                <TableRow key={inv.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">{inv.nomor}</TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(inv.tanggal)}</TableCell>
                  <TableCell className="font-medium">{partnerName(inv.partnerId)}</TableCell>
                  <TableCell>{formatCurrency(inv.total)}</TableCell>
                  <TableCell>
                    <Badge variant={status === "lunas" ? "outline" : "secondary"}>
                      {STATUS_LABEL[status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {status !== "lunas" ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
                          <MoreHorizontal className="size-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setPaying(inv)}>
                            <Wallet className="size-4" /> Record Payment
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <PurchaseInvoiceFormDialog open={formOpen} onOpenChange={setFormOpen} />

      <SettlementFormDialog
        open={Boolean(paying)}
        onOpenChange={(open) => !open && setPaying(null)}
        jenis="pembelian"
        target={paying ? { id: paying.id, nomor: paying.nomor, outstanding: paying.total - paying.dibayar } : null}
      />
    </div>
  );
}
