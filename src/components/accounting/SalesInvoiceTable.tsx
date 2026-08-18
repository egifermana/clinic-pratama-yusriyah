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
import { SalesInvoiceFormDialog } from "@/components/accounting/SalesInvoiceFormDialog";
import { SettlementFormDialog } from "@/components/accounting/SettlementFormDialog";
import { useClinicStore } from "@/lib/store";
import { formatCurrency } from "@/lib/currency";
import { formatDate } from "@/lib/date";
import { paymentStatus, type PaymentStatus } from "@/types/accounting/payment-status";
import type { SalesInvoice } from "@/types/accounting/sale";

const STATUS_LABEL: Record<PaymentStatus, string> = {
  "belum-lunas": "Belum Lunas",
  sebagian: "Sebagian",
  lunas: "Lunas",
};

export function SalesInvoiceTable() {
  const salesInvoices = useClinicStore((s) => s.salesInvoices);
  const partners = useClinicStore((s) => s.partners);

  const [formOpen, setFormOpen] = useState(false);
  const [paying, setPaying] = useState<SalesInvoice | null>(null);

  const partnerName = (id: string) => partners.find((p) => p.id === id)?.nama ?? "—";
  const sorted = [...salesInvoices].sort(
    (a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button onClick={() => setFormOpen(true)}>New Sale</Button>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No.</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No sales invoices yet.
                </TableCell>
              </TableRow>
            )}
            {sorted.map((inv) => {
              const status = paymentStatus(inv.total, inv.diterima);
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

      <SalesInvoiceFormDialog open={formOpen} onOpenChange={setFormOpen} />

      <SettlementFormDialog
        open={Boolean(paying)}
        onOpenChange={(open) => !open && setPaying(null)}
        jenis="penjualan"
        target={paying ? { id: paying.id, nomor: paying.nomor, outstanding: paying.total - paying.diterima } : null}
      />
    </div>
  );
}
